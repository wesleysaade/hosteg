import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, BookOpen } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface Props {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const slug = params.category

  // Try category first
  const { data: cat } = await supabase
    .from('doc_categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (cat) {
    return {
      title: `${cat.name} — Docs Hosteg`,
      description: cat.description ?? undefined,
    }
  }

  // Try article
  const { data: art } = await supabase
    .from('doc_articles')
    .select('title, excerpt, seo_title, seo_description, seo_keywords')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!art) return { title: 'Não encontrado' }

  const metaTitle       = art.seo_title       || `${art.title} — Docs Hosteg`
  const metaDescription = art.seo_description || art.excerpt || undefined

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: art.seo_keywords || undefined,
    openGraph: {
      title:       metaTitle,
      description: metaDescription,
      type:        'article',
      url:         `https://hosteg.com.br/docs/${slug}`,
    },
    alternates: {
      canonical: `https://hosteg.com.br/docs/${slug}`,
    },
  }
}

export default async function DocsSlugPage({ params }: Props) {
  const supabase = createClient()
  const slug = params.category

  // ── 1. Check if it's a category ────────────────────────────────────────────
  const { data: cat } = await supabase
    .from('doc_categories')
    .select('id, name, slug, icon, color, description, parent_id')
    .eq('slug', slug)
    .single()

  if (cat) {
    return <CategoryPage cat={cat} />
  }

  // ── 2. Check if it's an article ────────────────────────────────────────────
  const { data: art } = await supabase
    .from('doc_articles')
    .select('id, title, content, excerpt, views, updated_at, doc_categories(name, slug)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!art) notFound()

  // Track visit (fire-and-forget)
  supabase.from('doc_articles').update({ views: (art.views ?? 0) + 1 }).eq('id', art.id).then(() => {})
  supabase.from('doc_views').insert({ article_id: art.id }).then(() => {})

  return <ArticlePage art={art} />
}

// ── Category view ─────────────────────────────────────────────────────────────
async function CategoryPage({ cat }: { cat: any }) {
  const supabase = createClient()

  // If this is a root category, also fetch subcategories + their articles
  const isRoot = !cat.parent_id

  const [
    { data: directArticles },
    { data: subcategories },
  ] = await Promise.all([
    supabase
      .from('doc_articles')
      .select('id, title, slug, excerpt, views, updated_at')
      .eq('category_id', cat.id)
      .eq('published', true)
      .order('position'),
    isRoot
      ? supabase
          .from('doc_categories')
          .select(`id, name, slug, icon, color, description,
            doc_articles(id, title, slug, excerpt, views, updated_at, position, published)`)
          .eq('parent_id', cat.id)
          .order('position')
      : Promise.resolve({ data: [] }),
  ])

  const articles    = directArticles ?? []
  const subs        = (subcategories ?? []) as any[]

  // Collect all article IDs for 24h view tracking
  const subArticles = subs.flatMap((s: any) =>
    (s.doc_articles ?? []).filter((a: any) => a.published)
  )
  const allIds  = [...articles, ...subArticles].map((a: any) => a.id)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const views24hMap: Record<string, number> = {}

  if (allIds.length > 0) {
    const { data: recentViews } = await supabase
      .from('doc_views')
      .select('article_id')
      .in('article_id', allIds)
      .gte('viewed_at', oneDayAgo)

    for (const row of recentViews ?? []) {
      views24hMap[row.article_id] = (views24hMap[row.article_id] ?? 0) + 1
    }
  }

  const totalCount = articles.length + subArticles.length

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] opacity-10"
            style={{ background: `radial-gradient(ellipse, ${cat.color}, transparent 70%)` }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/docs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6">
            <ArrowLeft size={14} weight="bold" /> Voltar para Docs
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${cat.color}20` }}
            >
              <BookOpen size={22} weight="fill" style={{ color: cat.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">{cat.name}</h1>
              {cat.description && <p className="text-zinc-500 text-sm mt-0.5">{cat.description}</p>}
            </div>
          </div>
          <p className="text-zinc-400 text-sm">{totalCount} artigos nesta categoria</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Subcategories — only for root categories that have them */}
          {subs.length > 0 && (
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {subs.map((sub: any) => {
                  const pubArticles = (sub.doc_articles ?? []).filter((a: any) => a.published)
                  return (
                    <Link
                      key={sub.id}
                      href={`/docs/${sub.slug}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:shadow-sm transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${sub.color}18` }}
                      >
                        <BookOpen size={16} weight="fill" style={{ color: sub.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 group-hover:text-[#0EA5E9] transition-colors">
                          {sub.name}
                        </p>
                        {sub.description && (
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{sub.description}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-0.5">{pubArticles.length} artigos</p>
                      </div>
                      <ArrowRight size={14} className="text-zinc-300 group-hover:text-[#0EA5E9] flex-shrink-0 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Direct articles in this category */}
          {articles.length === 0 && subs.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
              <p>Nenhum artigo publicado ainda nesta categoria.</p>
            </div>
          ) : articles.length > 0 && (
            <>
              {subs.length > 0 && (
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  Artigos gerais
                </h2>
              )}
              <div className="divide-y divide-zinc-100">
                {articles.map((art: any) => (
                  <ArticleRow key={art.id} art={art} views24h={views24hMap[art.id] ?? 0} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ArticleRow({ art, views24h }: { art: any; views24h: number }) {
  return (
    <Link
      href={`/docs/${art.slug}`}
      className="flex items-start justify-between py-5 group hover:bg-zinc-50 -mx-4 px-4 rounded-xl transition-colors"
    >
      <div className="flex-1 min-w-0 pr-6">
        <h2 className="text-base font-semibold text-zinc-900 group-hover:text-[#0EA5E9] transition-colors mb-1">
          {art.title}
        </h2>
        {art.excerpt && (
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{art.excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {(art.views ?? 0) > 0 && (
            <span className="text-xs text-zinc-400">
              {(art.views as number).toLocaleString('pt-BR')} visualizações
            </span>
          )}
          {views24h > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {views24h} nas últimas 24h
            </span>
          )}
          {art.updated_at && (
            <span className="text-xs text-zinc-300">
              Atualizado em {new Date(art.updated_at).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
      <ArrowRight size={16} className="text-zinc-300 group-hover:text-[#0EA5E9] flex-shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

// ── Article view ──────────────────────────────────────────────────────────────
function ArticlePage({ art }: { art: any }) {
  const cat = art.doc_categories as any

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <article className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
            <Link href="/docs" className="hover:text-zinc-600 transition-colors">Docs</Link>
            {cat && (
              <>
                <span>/</span>
                <Link href={`/docs/${cat.slug}`} className="hover:text-zinc-600 transition-colors">{cat.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-zinc-600 truncate max-w-xs">{art.title}</span>
          </div>

          {/* Header */}
          <header className="mb-10 pb-8 border-b border-zinc-100">
            <Link
              href={cat ? `/docs/${cat.slug}` : '/docs'}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-4"
            >
              <ArrowLeft size={13} weight="bold" />
              {cat?.name ?? 'Docs'}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight mb-3">
              {art.title}
            </h1>
            {art.excerpt && (
              <p className="text-zinc-500 text-lg leading-relaxed">{art.excerpt}</p>
            )}
            {art.updated_at && (
              <p className="text-xs text-zinc-400 mt-4">
                Última atualização: {new Date(art.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-zinc max-w-none prose-headings:font-black prose-a:text-[#0EA5E9] prose-a:no-underline hover:prose-a:underline prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-zinc-800 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 [&_pre_code]:bg-transparent [&_pre_code]:text-zinc-100 [&_pre_code]:p-0"
            dangerouslySetInnerHTML={{ __html: art.content ?? '' }}
          />

          {/* Bottom nav */}
          <div className="mt-16 pt-8 border-t border-zinc-100 flex items-center justify-between">
            <Link
              href={cat ? `/docs/${cat.slug}` : '/docs'}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <ArrowLeft size={14} weight="bold" />
              Voltar para {cat?.name ?? 'Docs'}
            </Link>
            <a
              href="https://painelcliente.com.br/supporttickets.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
            >
              Precisa de ajuda? Abrir ticket →
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}

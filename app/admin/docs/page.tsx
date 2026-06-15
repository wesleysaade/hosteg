import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  Plus, BookOpen, PencilSimple, ArrowRight,
  Eye, ArrowLeft, ChartBar,
} from '@phosphor-icons/react/dist/ssr'
import AdminDocsSearch from '@/components/admin/AdminDocsSearch'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { cat?: string; q?: string }
}

export default async function AdminDocsPage({ searchParams }: Props) {
  const supabase    = createClient()
  const activeCatId = searchParams.cat ?? null
  const q           = searchParams.q?.trim() ?? ''

  const { data: categories } = await supabase
    .from('doc_categories')
    .select(`
      id, name, slug, color, position,
      doc_articles(id, published)
    `)
    .order('position')

  const activeCategory = activeCatId
    ? (categories ?? []).find((c: any) => c.id === activeCatId)
    : null

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Base de Conhecimento</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie categorias e artigos</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search — needs Suspense because useSearchParams() */}
          <Suspense fallback={<div className="w-52 h-9 rounded-xl bg-zinc-800 animate-pulse" />}>
            <AdminDocsSearch />
          </Suspense>
          <Link
            href="/admin/docs/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Categorias
          </Link>
          <Link
            href={activeCatId ? `/admin/docs/articles/new?category=${activeCatId}` : '/admin/docs/articles/new'}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
          >
            <Plus size={15} weight="bold" />
            Novo artigo
          </Link>
        </div>
      </div>

      {/* Search results */}
      {q ? (
        <SearchResults q={q} />
      ) : (
        <>
          {/* Category cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {(categories ?? []).map((cat: any) => {
              const articles  = cat.doc_articles ?? []
              const published = articles.filter((a: any) => a.published).length
              const isActive  = cat.id === activeCatId

              return (
                <Link
                  key={cat.id}
                  href={isActive ? '/admin/docs' : `/admin/docs?cat=${cat.id}`}
                  className={`rounded-2xl border p-4 transition-all group flex items-center justify-between ${
                    isActive
                      ? 'border-[#0EA5E9]/50 bg-[#0EA5E9]/10'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}20` }}
                    >
                      <BookOpen size={14} weight="fill" style={{ color: cat.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#0EA5E9]' : 'text-white'}`}>
                        {cat.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {published} pub · {articles.length} total
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 ml-2 transition-colors ${isActive ? 'text-[#0EA5E9] rotate-90' : 'text-zinc-600 group-hover:text-zinc-400'}`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Article list — filtered by category or all */}
          {activeCatId && activeCategory ? (
            <CategoryArticles catId={activeCatId} catName={(activeCategory as any).name} />
          ) : (
            <AllArticlesList />
          )}
        </>
      )}
    </div>
  )
}

// ── Search results ─────────────────────────────────────────────────────────────
async function SearchResults({ q }: { q: string }) {
  const supabase = createClient()

  const { data: articles } = await supabase
    .from('doc_articles')
    .select('id, title, slug, published, views, updated_at, doc_categories(id, name)')
    .ilike('title', `%${q}%`)
    .order('updated_at', { ascending: false })
    .limit(50)

  const allIds  = (articles ?? []).map((a: any) => a.id)
  const dayAgo  = new Date(Date.now() - 86400000).toISOString()
  const views24hMap: Record<string, number> = {}

  if (allIds.length > 0) {
    const { data: rv } = await supabase
      .from('doc_views')
      .select('article_id')
      .in('article_id', allIds)
      .gte('viewed_at', dayAgo)
    for (const r of rv ?? []) views24hMap[r.article_id] = (views24hMap[r.article_id] ?? 0) + 1
  }

  return (
    <div>
      <h2 className="text-base font-bold text-white mb-4">
        {articles?.length
          ? <>{articles.length} resultado{articles.length !== 1 ? 's' : ''} para "<span className="text-[#0EA5E9]">{q}</span>"</>
          : <>Nenhum resultado para "<span className="text-zinc-400">{q}</span>"</>
        }
      </h2>
      {articles?.length ? (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {articles.map((art: any) => (
              <div key={art.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${art.published ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{art.title}</p>
                    <p className="text-xs text-zinc-500 truncate">
                      {(art.doc_categories as any)?.name} · {new Date(art.updated_at).toLocaleDateString('pt-BR')}
                      {(art.views ?? 0) > 0 && ` · ${(art.views as number).toLocaleString('pt-BR')} views`}
                      {(views24hMap[art.id] ?? 0) > 0 && (
                        <span className="ml-1 text-emerald-500"> +{views24hMap[art.id]} 24h</span>
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/docs/articles/${art.id}`}
                  className="flex-shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <PencilSimple size={12} /> Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ── Articles filtered by category ─────────────────────────────────────────────
async function CategoryArticles({ catId, catName }: { catId: string; catName: string }) {
  const supabase = createClient()

  const { data: articles } = await supabase
    .from('doc_articles')
    .select('id, title, slug, published, views, updated_at, position')
    .eq('category_id', catId)
    .order('position')

  const allIds  = (articles ?? []).map((a: any) => a.id)
  const dayAgo  = new Date(Date.now() - 86400000).toISOString()
  const views24hMap: Record<string, number> = {}

  if (allIds.length > 0) {
    const { data: rv } = await supabase
      .from('doc_views')
      .select('article_id')
      .in('article_id', allIds)
      .gte('viewed_at', dayAgo)
    for (const r of rv ?? []) views24hMap[r.article_id] = (views24hMap[r.article_id] ?? 0) + 1
  }

  const totalViews = (articles ?? []).reduce((s: number, a: any) => s + (a.views ?? 0), 0)
  const views24h   = Object.values(views24hMap).reduce((s, v) => s + v, 0)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white">{catName}</h2>
          <span className="text-xs text-zinc-500">{articles?.length ?? 0} artigos</span>
          {totalViews > 0 && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Eye size={11} /> {totalViews.toLocaleString('pt-BR')} total
            </span>
          )}
          {views24h > 0 && (
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
              <ChartBar size={11} /> +{views24h} 24h
            </span>
          )}
        </div>
        <Link
          href="/admin/docs"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={12} /> Ver todas as categorias
        </Link>
      </div>

      {!articles?.length ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center text-zinc-500 text-sm">
          Nenhum artigo nesta categoria ainda.
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {articles.map((art: any) => (
              <div key={art.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${art.published ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{art.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-zinc-500">
                        /{art.slug}
                      </span>
                      {(art.views ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <Eye size={10} /> {(art.views as number).toLocaleString('pt-BR')}
                        </span>
                      )}
                      {(views24hMap[art.id] ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          +{views24hMap[art.id]} 24h
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${art.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {art.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/docs/articles/${art.id}`}
                  className="flex-shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <PencilSimple size={12} /> Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── All articles (default view) ───────────────────────────────────────────────
async function AllArticlesList() {
  const supabase = createClient()
  const { data: articles } = await supabase
    .from('doc_articles')
    .select('id, title, slug, published, views, updated_at, doc_categories(id, name)')
    .order('updated_at', { ascending: false })
    .limit(50)

  const allIds  = (articles ?? []).map((a: any) => a.id)
  const dayAgo  = new Date(Date.now() - 86400000).toISOString()
  const views24hMap: Record<string, number> = {}

  if (allIds.length > 0) {
    const { data: rv } = await supabase
      .from('doc_views')
      .select('article_id')
      .in('article_id', allIds)
      .gte('viewed_at', dayAgo)
    for (const r of rv ?? []) views24hMap[r.article_id] = (views24hMap[r.article_id] ?? 0) + 1
  }

  return (
    <div>
      <h2 className="text-base font-bold text-white mb-4">Todos os artigos</h2>

      {!articles?.length ? (
        <p className="text-zinc-500 text-sm">Nenhum artigo criado ainda.</p>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {articles.map((art: any) => (
              <div key={art.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${art.published ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{art.title}</p>
                    <p className="text-xs text-zinc-500 truncate">
                      {(art.doc_categories as any)?.name} · {new Date(art.updated_at).toLocaleDateString('pt-BR')}
                      {(art.views ?? 0) > 0 && ` · ${(art.views as number).toLocaleString('pt-BR')} views`}
                      {(views24hMap[art.id] ?? 0) > 0 && (
                        <span className="ml-1 text-emerald-500"> +{views24hMap[art.id]} 24h</span>
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/docs/articles/${art.id}`}
                  className="flex-shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <PencilSimple size={12} /> Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

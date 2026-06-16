import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  BookOpen, ArrowRight,
  HardDrives, Globe, Envelope, Lock, Lightning,
  HardDrive, Terminal, Stack, Browser,
} from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'
import DocsSearch from '@/components/docs/DocsSearch'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Docs — Base de Conhecimento',
  description: 'Tutoriais, guias e documentação técnica da Hosteg.',
}

// Mapeamento de nome de ícone (string do DB) → componente Phosphor
const iconMap: Record<string, React.ElementType> = {
  Server:   HardDrives,   // fallback para ícone "Server" salvo no banco
  HardDrives,
  Globe,
  Envelope,
  Lock,
  Lightning,
  HardDrive,
  Terminal,
  Layers:   Stack,        // fallback para "Layers" do seed
  Stack,
  Browser,
}

export default async function DocsPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('doc_categories')
    .select(`
      id, name, slug, icon, color, description, position, parent_id,
      doc_articles(id, title, slug, position)
    `)
    .order('position')

  const { data: popularArticles } = await supabase
    .from('doc_articles')
    .select('id, title, slug, views, doc_categories(name, slug)')
    .eq('published', true)
    .order('views', { ascending: false })
    .limit(6)

  const { data: allArticlesRaw } = await supabase
    .from('doc_articles')
    .select('id, title, slug, doc_categories(name, slug)')
    .eq('published', true)
    .order('title')

  const allArticles = (allArticlesRaw ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category_name: a.doc_categories?.name ?? '',
    category_slug: a.doc_categories?.slug ?? '',
  }))

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <BookOpen size={11} weight="fill" /> Base de Conhecimento
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4">Docs & Tutoriais</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto mb-8">
            Tutoriais, guias e documentação técnica para resolver tudo.
          </p>
          <DocsSearch articles={allArticles} />
        </div>
      </section>

      {/* Artigos populares */}
      {popularArticles && popularArticles.length > 0 && (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-zinc-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                <h2 className="text-sm font-semibold text-zinc-700">Artigos mais acessados</h2>
              </div>
              <div className="divide-y divide-zinc-100">
                {popularArticles.map((art: any) => (
                  <Link
                    key={art.id}
                    href={`/docs/${art.slug}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-500">
                        {art.doc_categories?.name}
                      </span>
                      <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                        {art.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{art.views?.toLocaleString('pt-BR')} visualizações</span>
                      <ArrowRight size={13} className="text-zinc-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categorias */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const all = categories ?? []
            const roots = all.filter((c: any) => !c.parent_id)
            const childMap: Record<string, typeof all> = {}
            for (const c of all.filter((c: any) => c.parent_id)) {
              if (!childMap[c.parent_id]) childMap[c.parent_id] = []
              childMap[c.parent_id].push(c)
            }

            return (
              <div className="space-y-10">
                {roots.map((cat: any) => {
                  const Icon = iconMap[cat.icon] ?? HardDrives
                  const directArticles = cat.doc_articles ?? []
                  const subs = childMap[cat.id] ?? []

                  // Total article count (direct + all subcategory articles)
                  const totalArticles = directArticles.length + subs.reduce(
                    (sum: number, s: any) => sum + (s.doc_articles ?? []).length, 0
                  )

                  // Preview: first 3 direct articles if no subs, otherwise skip
                  const preview = subs.length === 0
                    ? [...directArticles].sort((a: any, b: any) => a.position - b.position).slice(0, 3)
                    : []

                  return (
                    <div key={cat.id}>
                      {/* Root category header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${cat.color}18` }}
                        >
                          <Icon size={15} weight="fill" style={{ color: cat.color }} />
                        </div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-base font-bold text-zinc-900">{cat.name}</h2>
                          {cat.description && (
                            <span className="text-sm text-zinc-400 hidden sm:block">{cat.description}</span>
                          )}
                          <span className="text-xs text-zinc-400">{totalArticles} artigos</span>
                        </div>
                        <Link
                          href={`/docs/${cat.slug}`}
                          className="ml-auto text-xs text-zinc-400 hover:text-[#0EA5E9] transition-colors flex items-center gap-1"
                        >
                          Ver todos <ArrowRight size={11} />
                        </Link>
                      </div>

                      {/* If root has subcategories, show sub-cards */}
                      {subs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {subs.map((sub: any) => {
                            const SubIcon = iconMap[sub.icon] ?? HardDrives
                            const subArticles = sub.doc_articles ?? []
                            const subPreview = [...subArticles]
                              .sort((a: any, b: any) => a.position - b.position)
                              .slice(0, 3)
                            return (
                              <Link
                                key={sub.id}
                                href={`/docs/${sub.slug}`}
                                className="rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100 transition-all p-5 group block"
                              >
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                                  style={{ background: `${sub.color}18` }}
                                >
                                  <SubIcon size={16} weight="fill" style={{ color: sub.color }} />
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-sm font-semibold text-zinc-900">{sub.name}</h3>
                                  <span className="text-xs text-zinc-400">{subArticles.length}</span>
                                </div>
                                {sub.description && (
                                  <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{sub.description}</p>
                                )}
                                <ul className="space-y-1 mb-3">
                                  {subPreview.map((a: any) => (
                                    <li key={a.id} className="text-xs text-zinc-500 group-hover:text-zinc-700 transition-colors truncate">
                                      → {a.title}
                                    </li>
                                  ))}
                                </ul>
                                <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors flex items-center gap-1">
                                  Ver todos <ArrowRight size={11} />
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      ) : (
                        /* Root with no subcategories — original card layout */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Link
                            href={`/docs/${cat.slug}`}
                            className="rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100 transition-all p-6 group block"
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                              style={{ background: `${cat.color}18` }}
                            >
                              <Icon size={18} weight="fill" style={{ color: cat.color }} />
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold text-zinc-900">{cat.name}</h3>
                              <span className="text-xs text-zinc-400">{directArticles.length} artigos</span>
                            </div>
                            <ul className="space-y-1.5 mb-4">
                              {preview.map((a: any) => (
                                <li key={a.id} className="text-xs text-zinc-500 group-hover:text-zinc-600 transition-colors truncate">
                                  → {a.title}
                                </li>
                              ))}
                            </ul>
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors flex items-center gap-1">
                              Ver todos <ArrowRight size={11} />
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* CTA ticket */}
      <section className="py-12 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Não encontrou o que procurava?</h2>
          <p className="text-zinc-500 mb-6 text-sm">
            Nossa equipe técnica está disponível 24/7 para ajudar com qualquer dúvida.
          </p>
          <a
            href="https://painelcliente.com.br/supporttickets.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20"
          >
            Abrir ticket de suporte <ArrowRight size={14} weight="bold" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

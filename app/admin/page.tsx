import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, CurrencyDollar, Article, Tag, PencilSimple } from '@phosphor-icons/react/dist/ssr'
import { PAGES_CONFIG } from '@/lib/config/pages-config'

export default async function AdminDashboard() {
  const supabase = createClient()

  const totalPages = PAGES_CONFIG.reduce((acc, c) => acc + c.pages.length, 0)

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: categories },
    { count: plans },
    { count: editedPages },
  ] = await Promise.all([
    supabase.from('doc_articles').select('*', { count: 'exact', head: true }),
    supabase.from('doc_articles').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('doc_categories').select('*', { count: 'exact', head: true }),
    supabase.from('plans').select('*', { count: 'exact', head: true }),
    supabase.from('page_sections').select('page_slug', { count: 'exact', head: false }),
  ])

  const stats = [
    { label: 'Páginas editadas',   value: editedPages ?? 0,         sub: `de ${totalPages} páginas`,   icon: PencilSimple,    href: '/admin/content', color: '#8B5CF6' },
    { label: 'Artigos publicados', value: publishedArticles ?? 0,   sub: `${totalArticles ?? 0} total`, icon: Article,        href: '/admin/docs',    color: '#0EA5E9' },
    { label: 'Planos ativos',      value: plans ?? 0,               sub: 'em todos os produtos',        icon: CurrencyDollar, href: '/admin/plans',   color: '#F59E0B' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral do conteúdo do site</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}15` }}
                >
                  <Icon size={18} weight="fill" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-zinc-300">{s.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.sub}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/content"
          className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
            <PencilSimple size={18} weight="fill" className="text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Editar conteúdo</p>
            <p className="text-xs text-zinc-500">Textos, hero, features das páginas</p>
          </div>
        </Link>
        <Link
          href="/admin/docs/articles/new"
          className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
            <BookOpen size={18} weight="fill" className="text-[#0EA5E9]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Novo artigo</p>
            <p className="text-xs text-zinc-500">Criar artigo na base de conhecimento</p>
          </div>
        </Link>
        <Link
          href="/admin/plans"
          className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
            <CurrencyDollar size={18} weight="fill" className="text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Gerenciar planos</p>
            <p className="text-xs text-zinc-500">Editar preços, specs e features</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

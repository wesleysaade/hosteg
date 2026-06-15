import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PAGES_CONFIG, SECTION_LABELS } from '@/lib/config/pages-config'
import {
  House, HardDrives, Cloud, Storefront, Buildings, Info, ArrowRight, Globe,
} from '@phosphor-icons/react/dist/ssr'

const CATEGORY_ICONS: Record<string, any> = {
  'Página Inicial': House,
  'Hospedagem':     HardDrives,
  'Cloud':          Cloud,
  'Revenda':        Storefront,
  'Corporativo':    Buildings,
  'Institucional':  Info,
}

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const supabase = createClient()
  const { data: sections } = await supabase
    .from('page_sections')
    .select('page_slug, updated_at')

  const editedPages = new Set(sections?.map((s: any) => s.page_slug) ?? [])

  const totalPages    = PAGES_CONFIG.reduce((acc, c) => acc + c.pages.length, 0)
  const editedCount   = PAGES_CONFIG.flatMap(c => c.pages).filter(p => editedPages.has(p.slug)).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Conteúdo</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {editedCount} de {totalPages} páginas com conteúdo personalizado
        </p>
      </div>

      <div className="space-y-8">
        {PAGES_CONFIG.map(({ category, pages }) => {
          const Icon = CATEGORY_ICONS[category] ?? Globe
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className="text-zinc-500" />
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{category}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pages.map(page => {
                  const hasContent = editedPages.has(page.slug)
                  return (
                    <Link
                      key={page.slug}
                      href={`/admin/content/${page.slug}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{page.name}</p>
                          {hasContent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {page.sections.map(s => SECTION_LABELS[s]).join(' · ')}
                        </p>
                      </div>
                      <ArrowRight size={13} className="text-zinc-600 group-hover:text-white transition-colors flex-shrink-0 ml-3" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

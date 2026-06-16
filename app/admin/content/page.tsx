import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PAGES_CONFIG, SECTION_LABELS } from '@/lib/config/pages-config'
import { ClonePageButton } from './ClonePageButton'
import {
  House, HardDrives, Cloud, Storefront, Buildings, Info, ExternalLink, Pencil, Globe,
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

  const totalPages  = PAGES_CONFIG.reduce((acc, c) => acc + c.pages.length, 0)
  const editedCount = PAGES_CONFIG.flatMap(c => c.pages).filter(p => editedPages.has(p.slug)).length

  // Lista plana de todas as páginas para o clone modal
  const allPages = PAGES_CONFIG.flatMap(c => c.pages.map(p => ({ slug: p.slug, name: p.name })))

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
              <div className="grid grid-cols-1 gap-3">
                {pages.map(page => {
                  const hasContent = editedPages.has(page.slug)
                  return (
                    <div
                      key={page.slug}
                      className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all"
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{page.name}</p>
                          {hasContent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" title="Conteúdo personalizado" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-zinc-600 font-mono">{page.path}</span>
                          <span className="text-[11px] text-zinc-600">·</span>
                          <span className="text-[11px] text-zinc-500 truncate">
                            {page.sections.map(s => SECTION_LABELS[s]).join(' · ')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Ver no site */}
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors text-[11px] font-semibold"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink size={11} />
                          Ver
                        </a>

                        {/* Clonar */}
                        <ClonePageButton fromPage={{ slug: page.slug, name: page.name }} allPages={allPages} />

                        {/* Editar */}
                        <Link
                          href={`/admin/content/${page.slug}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 transition-colors text-[11px] font-semibold"
                        >
                          <Pencil size={11} />
                          Editar
                        </Link>
                      </div>
                    </div>
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

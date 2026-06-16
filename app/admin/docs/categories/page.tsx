import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, PencilSimple, ArrowBendDownRight } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function DocCategoriesPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('doc_categories')
    .select('id, name, slug, icon, color, description, position, parent_id, doc_articles(id)')
    .order('position')

  const all = categories ?? []
  const roots    = all.filter((c: any) => !c.parent_id)
  const children = all.filter((c: any) =>  c.parent_id)

  const childrenByParent: Record<string, typeof all> = {}
  for (const c of children) {
    if (!childrenByParent[c.parent_id]) childrenByParent[c.parent_id] = []
    childrenByParent[c.parent_id].push(c)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Categorias de Docs</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie categorias e subcategorias da base de conhecimento</p>
        </div>
        <Link
          href="/admin/docs/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Nova categoria
        </Link>
      </div>

      {!all.length ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-zinc-500 text-sm">Nenhuma categoria criada ainda.</p>
          <Link href="/admin/docs/categories/new" className="mt-3 inline-flex items-center gap-1.5 text-[#0EA5E9] text-sm font-semibold">
            <Plus size={14} weight="bold" /> Criar primeira categoria
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {roots.map((cat: any) => {
              const subs = childrenByParent[cat.id] ?? []
              return (
                <div key={cat.id}>
                  {/* Root category row */}
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cat.color}20` }}
                      >
                        <span className="text-xs font-black" style={{ color: cat.color }}>
                          {cat.icon?.slice(0, 2) ?? '??'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{cat.name}</p>
                        <p className="text-xs text-zinc-500">
                          /{cat.slug} · {(cat.doc_articles ?? []).length} artigos diretos · pos {cat.position}
                          {subs.length > 0 && (
                            <span className="ml-2 text-zinc-400 font-medium">
                              · {subs.length} subcategoria{subs.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/docs/categories/${cat.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <PencilSimple size={12} />
                      Editar
                    </Link>
                  </div>

                  {/* Subcategory rows */}
                  {subs.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between pl-14 pr-5 py-3 bg-zinc-900/60 border-t border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <ArrowBendDownRight size={13} className="text-zinc-600 flex-shrink-0 -ml-3" />
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${sub.color}20` }}
                        >
                          <span className="text-[10px] font-black" style={{ color: sub.color }}>
                            {sub.icon?.slice(0, 2) ?? '??'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{sub.name}</p>
                          <p className="text-xs text-zinc-500">
                            /{sub.slug} · {(sub.doc_articles ?? []).length} artigos · pos {sub.position}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/admin/docs/categories/${sub.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <PencilSimple size={12} />
                        Editar
                      </Link>
                    </div>
                  ))}

                  {/* Quick add subcategory */}
                  <div className="pl-14 pr-5 py-2 bg-zinc-900/40 border-t border-zinc-800/40">
                    <Link
                      href={`/admin/docs/categories/new?parent=${cat.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-[#0EA5E9] transition-colors"
                    >
                      <Plus size={11} weight="bold" />
                      Adicionar subcategoria
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

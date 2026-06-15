import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, PencilSimple } from '@phosphor-icons/react/dist/ssr'

export default async function DocCategoriesPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('doc_categories')
    .select('id, name, slug, icon, color, description, position, doc_articles(id)')
    .order('position')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Categorias de Docs</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie as categorias da base de conhecimento</p>
        </div>
        <Link
          href="/admin/docs/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Nova categoria
        </Link>
      </div>

      {!categories?.length ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-zinc-500 text-sm">Nenhuma categoria criada ainda.</p>
          <Link href="/admin/docs/categories/new" className="mt-3 inline-flex items-center gap-1.5 text-[#0EA5E9] text-sm font-semibold">
            <Plus size={14} weight="bold" /> Criar primeira categoria
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {categories.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
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
                      /{cat.slug} · {(cat.doc_articles ?? []).length} artigos · pos {cat.position}
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

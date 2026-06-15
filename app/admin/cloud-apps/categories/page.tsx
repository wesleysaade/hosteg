import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, PencilSimple } from '@phosphor-icons/react/dist/ssr'

export default async function CloudAppCategoriesPage() {
  const supabase = createClient()

  const { data: categories, error } = await supabase
    .from('cloud_app_categories')
    .select('id, name, position')
    .order('position')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Categorias de Cloud APPs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Gerencie os grupos que organizam os apps no site
          </p>
        </div>
        <Link
          href="/admin/cloud-apps/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={15} weight="bold" />
          Nova categoria
        </Link>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-sm">
          Tabela <code>cloud_app_categories</code> ainda não existe. Execute o SQL <code>supabase-seed-cloud-app-categories.sql</code> primeiro.
        </div>
      )}

      {!error && !categories?.length ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-zinc-500 text-sm">Nenhuma categoria criada ainda.</p>
          <Link href="/admin/cloud-apps/categories/new" className="mt-3 inline-flex items-center gap-1.5 text-[#0EA5E9] text-sm font-semibold">
            <Plus size={14} weight="bold" /> Criar primeira categoria
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {(categories ?? []).map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-zinc-500">posição {cat.position}</p>
                </div>
                <Link
                  href={`/admin/cloud-apps/categories/${cat.id}`}
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

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, CurrencyDollar } from '@phosphor-icons/react/dist/ssr'

export default async function AdminPlansPage() {
  const supabase = createClient()

  const { data: products } = await supabase
    .from('product_pages')
    .select(`
      id, name, slug,
      plans(id)
    `)
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Planos</h1>
        <p className="text-zinc-500 text-sm mt-1">Selecione um produto para editar os planos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(products ?? []).map((product: any) => (
          <Link
            key={product.id}
            href={`/admin/plans/${product.slug}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                <CurrencyDollar size={16} weight="fill" className="text-[#0EA5E9]" />
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-white">{product.name}</p>
            <p className="text-xs text-zinc-500 mt-1">{product.plans?.length ?? 0} planos · /{product.slug}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

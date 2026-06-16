'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Server Actions ────────────────────────────────────────────────────────────

async function addCategory(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const name        = formData.get('name') as string
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!name?.trim()) return
  await supabase.from('status_categories').insert({ name: name.trim(), order_index })
  revalidatePath('/admin/status/categories')
  revalidatePath('/status')
}

async function updateCategory(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const id          = formData.get('id') as string
  const name        = formData.get('name') as string
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!id || !name?.trim()) return
  await supabase.from('status_categories').update({ name: name.trim(), order_index }).eq('id', id)
  revalidatePath('/admin/status/categories')
  revalidatePath('/status')
}

async function deleteCategory(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('status_categories').delete().eq('id', id)
  revalidatePath('/admin/status/categories')
  revalidatePath('/status')
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminCategoriesPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('status_categories')
    .select('id, name, order_index, status_services(id)')
    .order('order_index')

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Categorias</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Agrupe os serviços da Status Page por categoria
        </p>
      </div>

      {/* Existing categories */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-8">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Categorias existentes
          </span>
        </div>

        {(categories ?? []).length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-600 bg-zinc-950">
            Nenhuma categoria cadastrada ainda.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {(categories ?? []).map((cat: any) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors"
              >
                {/* Edit form */}
                <form action={updateCategory} className="flex items-center gap-3 flex-1 min-w-0">
                  <input type="hidden" name="id" value={cat.id} />

                  {/* Order */}
                  <input
                    name="order_index"
                    type="number"
                    defaultValue={cat.order_index}
                    className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-[#0EA5E9] shrink-0"
                    title="Ordem de exibição"
                  />

                  {/* Name */}
                  <input
                    name="name"
                    defaultValue={cat.name}
                    required
                    className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
                  />

                  {/* Services count */}
                  <span className="text-xs text-zinc-600 shrink-0">
                    {(cat.status_services ?? []).length} serviço(s)
                  </span>

                  {/* Save */}
                  <button
                    type="submit"
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors"
                  >
                    Salvar
                  </button>
                </form>

                {/* Delete — separate form so it doesn't inherit the edit inputs */}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button
                    type="submit"
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    onClick={(e) => {
                      const count = (cat.status_services ?? []).length
                      const msg = count > 0
                        ? `Excluir "${cat.name}" e seus ${count} serviço(s) vinculados?`
                        : `Excluir "${cat.name}"?`
                      if (!confirm(msg)) e.preventDefault()
                    }}
                  >
                    Excluir
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add category form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Tag size={14} className="text-[#0EA5E9]" />
          </div>
          <h2 className="text-base font-black text-white">Nova Categoria</h2>
        </div>

        <form action={addCategory} className="flex items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ordem</label>
            <input
              name="order_index"
              type="number"
              defaultValue={(categories ?? []).length + 1}
              className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Nome *</label>
            <input
              name="name"
              required
              placeholder="ex: Infraestrutura"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors shrink-0"
          >
            Criar Categoria
          </button>
        </form>
      </div>
    </div>
  )
}

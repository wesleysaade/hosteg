import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FileText, Plus } from 'lucide-react'
import { ConfirmDeleteButton } from '@/app/admin/_components/ConfirmDeleteButton'

export const dynamic = 'force-dynamic'

// ── Server Actions ────────────────────────────────────────────────────────────

async function addContract(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const product_slug = formData.get('product_slug') as string
  const product_name = formData.get('product_name') as string
  const title        = (formData.get('title') as string) || 'Contrato de Prestação de Serviços'
  const content      = (formData.get('content') as string) || ''
  if (!product_slug || !product_name) return
  await supabase.from('contracts').insert({
    product_slug, product_name, title, content,
    updated_at: new Date().toISOString(),
  })
  revalidatePath('/admin/contracts')
  redirect('/admin/contracts?saved=1')
}

async function updateContract(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const id          = formData.get('id') as string
  const product_name = formData.get('product_name') as string
  const title        = formData.get('title') as string
  const content      = formData.get('content') as string
  if (!id) return
  await supabase.from('contracts').update({
    product_name, title, content,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/contracts')
  redirect('/admin/contracts?saved=1')
}

async function deleteContract(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('contracts').delete().eq('id', id)
  revalidatePath('/admin/contracts')
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminContractsPage() {
  const supabase = createClient()
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('product_name')

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Contratos & Termos</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Contratos de prestação de serviços por produto
        </p>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-8">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Contratos ({(contracts ?? []).length})
          </span>
        </div>

        {(contracts ?? []).length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-600 bg-zinc-950">Nenhum contrato cadastrado.</div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {(contracts ?? []).map((contract: any) => (
              <div key={contract.id} className="px-5 py-5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors">
                {/* Slug + product name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[#0EA5E9]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{contract.product_name}</p>
                    <p className="text-[10px] text-zinc-500">slug: {contract.product_slug}</p>
                  </div>
                </div>

                <form action={updateContract} className="space-y-3">
                  <input type="hidden" name="id" value={contract.id} />

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">Nome do Produto</label>
                    <input
                      name="product_name"
                      defaultValue={contract.product_name}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">Título do Contrato</label>
                    <input
                      name="title"
                      defaultValue={contract.title}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                      Conteúdo do Contrato{' '}
                      <span className="text-zinc-600 font-normal">(texto simples ou Markdown)</span>
                    </label>
                    <textarea
                      name="content"
                      defaultValue={contract.content}
                      rows={12}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono leading-relaxed resize-y focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-600">
                      Atualizado em: {contract.updated_at ? new Date(contract.updated_at).toLocaleString('pt-BR') : '—'}
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </form>

                <form action={deleteContract} className="mt-3">
                  <input type="hidden" name="id" value={contract.id} />
                  <ConfirmDeleteButton
                    message={`Excluir contrato de "${contract.product_name}"?`}
                    className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Excluir contrato
                  </ConfirmDeleteButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new contract */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Plus size={14} className="text-[#0EA5E9]" />
          </div>
          <h2 className="text-base font-black text-white">Novo Contrato</h2>
        </div>

        <form action={addContract} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Slug do produto <span className="text-zinc-600 font-normal">(único, sem espaços)</span>
              </label>
              <input
                name="product_slug"
                required
                placeholder="cloud-vps"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Nome do produto</label>
              <input
                name="product_name"
                required
                placeholder="Cloud VPS"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Título do Contrato</label>
            <input
              name="title"
              defaultValue="Contrato de Prestação de Serviços"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Conteúdo</label>
            <textarea
              name="content"
              rows={8}
              placeholder="Cole o texto do contrato aqui..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 font-mono resize-y focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
            >
              Criar Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

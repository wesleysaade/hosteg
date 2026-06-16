import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Navigation, Plus } from 'lucide-react'
import { ConfirmDeleteButton } from '@/app/admin/_components/ConfirmDeleteButton'

export const dynamic = 'force-dynamic'

// ── Server Actions ────────────────────────────────────────────────────────────

async function addMenuItem(formData: FormData) {
  'use server'
  const supabase = createClient()
  const menu_group  = formData.get('menu_group') as string
  const category    = (formData.get('category') as string) || null
  const label       = formData.get('label') as string
  const description = (formData.get('description') as string) || ''
  const href        = formData.get('href') as string
  const icon_name   = (formData.get('icon_name') as string) || 'Globe'
  const badge       = (formData.get('badge') as string) || ''
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!label || !href || !menu_group) return
  await supabase.from('nav_menu_items').insert({
    menu_group, category: category || null, label, description,
    href, icon_name, badge, order_index,
  })
  revalidatePath('/admin/menu')
  redirect('/admin/menu?saved=1')
}

async function updateMenuItem(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const id          = formData.get('id') as string
  const label       = formData.get('label') as string
  const description = (formData.get('description') as string) || ''
  const href        = formData.get('href') as string
  const icon_name   = (formData.get('icon_name') as string) || 'Globe'
  const badge       = (formData.get('badge') as string) || ''
  const category    = (formData.get('category') as string) || null
  const order_index = parseInt(formData.get('order_index') as string) || 0
  const is_enabled  = formData.get('is_enabled') === 'true'
  if (!id) return
  await supabase.from('nav_menu_items').update({
    label, description, href, icon_name, badge,
    category: category || null, order_index, is_enabled,
  }).eq('id', id)
  revalidatePath('/admin/menu')
  redirect('/admin/menu?saved=1')
}

async function deleteMenuItem(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('nav_menu_items').delete().eq('id', id)
  revalidatePath('/admin/menu')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const groupLabels: Record<string, string> = {
  main:          'Links Diretos (nav central)',
  produtos:      'Mega Menu — Produtos',
  'cloud-apps':  'Mega Menu — Cloud APPs',
  institucional: 'Dropdown — Institucional',
  cta:           'Botões CTA (lado direito)',
}

const groupOrder = ['main', 'produtos', 'cloud-apps', 'institucional', 'cta']

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminMenuPage() {
  const supabase = createClient()

  const { data: items } = await supabase
    .from('nav_menu_items')
    .select('*')
    .order('order_index')

  const grouped: Record<string, any[]> = {}
  for (const item of items ?? []) {
    if (!grouped[item.menu_group]) grouped[item.menu_group] = []
    grouped[item.menu_group].push(item)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Editor de Menu</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Gerencie os itens de navegação exibidos no cabeçalho do site
        </p>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {groupOrder.map((group) => {
          const rows = grouped[group] ?? []
          return (
            <div key={group} className="rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Group header */}
              <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation size={13} className="text-[#0EA5E9]" />
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-wider">
                    {groupLabels[group] ?? group}
                  </span>
                  <span className="text-xs text-zinc-600">({rows.length} itens)</span>
                </div>
              </div>

              {/* Items */}
              {rows.length === 0 ? (
                <div className="px-5 py-4 text-sm text-zinc-600 bg-zinc-950">
                  Nenhum item neste grupo.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {rows.map((item: any) => (
                    <div
                      key={item.id}
                      className={`px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors ${!item.is_enabled ? 'opacity-50' : ''}`}
                    >
                      <form action={updateMenuItem} className="flex items-start gap-3 flex-wrap">
                        <input type="hidden" name="id" value={item.id} />

                        {/* Order */}
                        <div className="w-14">
                          <label className="block text-[10px] text-zinc-500 mb-1">Ordem</label>
                          <input
                            name="order_index"
                            type="number"
                            defaultValue={item.order_index}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Label */}
                        <div className="w-36">
                          <label className="block text-[10px] text-zinc-500 mb-1">Label *</label>
                          <input
                            name="label"
                            defaultValue={item.label}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Href */}
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-[10px] text-zinc-500 mb-1">URL *</label>
                          <input
                            name="href"
                            defaultValue={item.href}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Description */}
                        <div className="flex-1 min-w-[160px]">
                          <label className="block text-[10px] text-zinc-500 mb-1">Descrição</label>
                          <input
                            name="description"
                            defaultValue={item.description}
                            placeholder="(opcional)"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Category (only for mega menus) */}
                        {(group === 'produtos' || group === 'cloud-apps') && (
                          <div className="w-40">
                            <label className="block text-[10px] text-zinc-500 mb-1">Categoria</label>
                            <input
                              name="category"
                              defaultValue={item.category ?? ''}
                              placeholder="ex: Hospedagem"
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                            />
                          </div>
                        )}

                        {/* Icon */}
                        <div className="w-28">
                          <label className="block text-[10px] text-zinc-500 mb-1">Ícone (Phosphor)</label>
                          <input
                            name="icon_name"
                            defaultValue={item.icon_name}
                            placeholder="Globe"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Badge */}
                        <div className="w-20">
                          <label className="block text-[10px] text-zinc-500 mb-1">Badge</label>
                          <input
                            name="badge"
                            defaultValue={item.badge}
                            placeholder="Novo"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                          />
                        </div>

                        {/* Enabled toggle */}
                        <div className="w-24">
                          <label className="block text-[10px] text-zinc-500 mb-1">Visível</label>
                          <select
                            name="is_enabled"
                            defaultValue={item.is_enabled ? 'true' : 'false'}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                          >
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </select>
                        </div>

                        {/* Save */}
                        <div className="flex items-end gap-2 mt-auto">
                          <button
                            type="submit"
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors whitespace-nowrap"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>

                      {/* Delete (separate form) */}
                      <form action={deleteMenuItem} className="mt-2">
                        <input type="hidden" name="id" value={item.id} />
                        <ConfirmDeleteButton
                          message={`Excluir "${item.label}"?`}
                          className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          Excluir item
                        </ConfirmDeleteButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new item */}
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Plus size={14} className="text-[#0EA5E9]" />
          </div>
          <h2 className="text-base font-black text-white">Novo Item de Menu</h2>
        </div>

        <form action={addMenuItem} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Group */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Grupo *</label>
            <select
              name="menu_group"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
            >
              {groupOrder.map((g) => (
                <option key={g} value={g}>{groupLabels[g]}</option>
              ))}
            </select>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Label *</label>
            <input
              name="label"
              required
              placeholder="ex: Cloud VPS"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Href */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">URL *</label>
            <input
              name="href"
              required
              placeholder="/cloud-vps"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Descrição</label>
            <input
              name="description"
              placeholder="Subtítulo no mega menu"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Categoria</label>
            <input
              name="category"
              placeholder="Para mega menus"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ícone Phosphor</label>
            <input
              name="icon_name"
              placeholder="Globe, Lightning, Cpu..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Badge</label>
            <input
              name="badge"
              placeholder="Novo, Popular, Hot..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ordem</label>
            <input
              name="order_index"
              type="number"
              defaultValue={0}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
            >
              Adicionar Item
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        Ícones: use nomes exatos do{' '}
        <a
          href="https://phosphoricons.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0EA5E9] hover:underline"
        >
          phosphoricons.com
        </a>{' '}
        (ex: Globe, HardDrives, Lightning, Stack, Cpu, Database, Shield…)
      </p>
    </div>
  )
}

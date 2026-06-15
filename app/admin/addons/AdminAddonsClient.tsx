'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Pencil, Trash, Check, X, FloppyDisk, CircleNotch,
  ToggleLeft, ToggleRight,
} from '@phosphor-icons/react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Addon {
  id:           string
  product_slug: string
  plan_name:    string
  category:     string
  addon_key:    string
  label:        string
  description:  string | null
  price:        number
  price_type:   string
  max_qty:      number
  unit:         string
  enabled:      boolean
  sort_order:   number
}

const CATEGORIES = ['disk','ip','ipv6','bandwidth','license','app','meta'] as const
const CATEGORY_LABELS: Record<string, string> = {
  disk: 'Disco', ip: 'IP IPv4', ipv6: 'IPv6', bandwidth: 'Bandwidth',
  license: 'Licença', app: 'App', meta: 'Meta',
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const EMPTY_ADDON = (productSlug: string): Partial<Addon> => ({
  product_slug: productSlug,
  plan_name:    '__all__',
  category:     'disk',
  addon_key:    '',
  label:        '',
  description:  '',
  price:        0,
  price_type:   'monthly',
  max_qty:      1,
  unit:         'unid',
  enabled:      true,
  sort_order:   0,
})

// ── Row Editor ────────────────────────────────────────────────────────────────
function AddonRow({
  addon, onSave, onDelete, onToggle,
}: {
  addon: Addon
  onSave:   (updated: Addon) => Promise<void>
  onDelete: (id: string)     => Promise<void>
  onToggle: (id: string, enabled: boolean) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState<Addon>(addon)
  const [saving,  setSaving]  = useState(false)

  async function handleSave() {
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
    setEditing(false)
  }

  const inp = 'px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0EA5E9]/60 bg-white'

  if (editing) return (
    <tr className="bg-[#0EA5E9]/3 border-t border-zinc-200">
      <td className="px-3 py-2">
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className={`${inp} w-full`}>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <input value={form.addon_key} onChange={e => setForm(f => ({ ...f, addon_key: e.target.value }))}
          className={`${inp} w-full`} placeholder="chave_unica" />
      </td>
      <td className="px-3 py-2">
        <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          className={`${inp} w-full`} placeholder="Nome visível" />
      </td>
      <td className="px-3 py-2">
        <input value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className={`${inp} w-full`} placeholder="Descrição opcional" />
      </td>
      <td className="px-3 py-2">
        <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
          className={`${inp} w-24`} />
      </td>
      <td className="px-3 py-2">
        <select value={form.price_type} onChange={e => setForm(f => ({ ...f, price_type: e.target.value }))}
          className={`${inp}`}>
          <option value="monthly">Mensal</option>
          <option value="setup">Setup</option>
        </select>
      </td>
      <td className="px-3 py-2">
        <input type="number" value={form.max_qty} onChange={e => setForm(f => ({ ...f, max_qty: parseInt(e.target.value) || 1 }))}
          className={`${inp} w-16`} />
      </td>
      <td className="px-3 py-2">
        <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
          className={`${inp} w-16`} placeholder="unid" />
      </td>
      <td className="px-3 py-2">
        <input value={form.plan_name} onChange={e => setForm(f => ({ ...f, plan_name: e.target.value }))}
          className={`${inp} w-28`} placeholder="__all__" />
      </td>
      <td className="px-3 py-2">
        <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
          className={`${inp} w-14`} />
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button onClick={handleSave} disabled={saving}
            className="p-1.5 rounded-lg bg-[#0EA5E9] text-white hover:bg-[#0284C7] disabled:opacity-50 transition-colors">
            {saving ? <CircleNotch size={13} className="animate-spin" /> : <FloppyDisk size={13} weight="fill" />}
          </button>
          <button onClick={() => setEditing(false)}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 transition-colors">
            <X size={13} weight="bold" />
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <tr className="border-t border-zinc-100 hover:bg-zinc-50 transition-colors">
      <td className="px-3 py-2.5">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          addon.category === 'disk'      ? 'bg-amber-100 text-amber-700'
          : addon.category === 'license' ? 'bg-purple-100 text-purple-700'
          : addon.category === 'app'     ? 'bg-emerald-100 text-emerald-700'
          : addon.category === 'ip' || addon.category === 'ipv6' ? 'bg-blue-100 text-blue-700'
          : addon.category === 'bandwidth' ? 'bg-indigo-100 text-indigo-700'
          : 'bg-zinc-100 text-zinc-600'
        }`}>
          {CATEGORY_LABELS[addon.category] ?? addon.category}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs font-mono text-zinc-500">{addon.addon_key}</td>
      <td className="px-3 py-2.5 text-sm font-semibold text-zinc-900">{addon.label}</td>
      <td className="px-3 py-2.5 text-xs text-zinc-400 max-w-[180px] truncate">{addon.description}</td>
      <td className="px-3 py-2.5 text-sm font-bold text-zinc-900">R$ {fmtBRL(addon.price)}</td>
      <td className="px-3 py-2.5 text-xs text-zinc-500">{addon.price_type === 'monthly' ? 'Mensal' : 'Setup'}</td>
      <td className="px-3 py-2.5 text-sm text-zinc-700">{addon.max_qty}</td>
      <td className="px-3 py-2.5 text-xs text-zinc-500">{addon.unit}</td>
      <td className="px-3 py-2.5 text-xs text-zinc-500 font-mono">
        {addon.plan_name === '__all__' ? <span className="text-zinc-300">todos</span> : addon.plan_name}
      </td>
      <td className="px-3 py-2.5 text-xs text-zinc-400">{addon.sort_order}</td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button onClick={() => onToggle(addon.id, !addon.enabled)} title={addon.enabled ? 'Desativar' : 'Ativar'}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            {addon.enabled
              ? <ToggleRight size={16} weight="fill" className="text-emerald-500" />
              : <ToggleLeft  size={16} weight="fill" className="text-zinc-300"    />
            }
          </button>
          <button onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg hover:bg-[#0EA5E9]/10 text-zinc-500 hover:text-[#0EA5E9] transition-colors">
            <Pencil size={13} weight="bold" />
          </button>
          <button onClick={() => { if (confirm('Excluir este addon?')) onDelete(addon.id) }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors">
            <Trash size={13} weight="bold" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── New Addon Row ─────────────────────────────────────────────────────────────
function NewAddonRow({
  productSlug, onSave, onCancel,
}: {
  productSlug: string
  onSave: (addon: Partial<Addon>) => Promise<void>
  onCancel: () => void
}) {
  const [form,   setForm]   = useState<Partial<Addon>>(EMPTY_ADDON(productSlug))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!form.addon_key || !form.label) return
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  const inp = 'px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0EA5E9]/60 bg-white'

  return (
    <tr className="bg-emerald-50/60 border-t border-emerald-200">
      <td className="px-3 py-2">
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className={`${inp} w-full`}>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <input value={form.addon_key} onChange={e => setForm(f => ({ ...f, addon_key: e.target.value }))}
          className={`${inp} w-full`} placeholder="chave_unica *" />
      </td>
      <td className="px-3 py-2">
        <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          className={`${inp} w-full`} placeholder="Label visível *" />
      </td>
      <td className="px-3 py-2">
        <input value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className={`${inp} w-full`} placeholder="Descrição" />
      </td>
      <td className="px-3 py-2">
        <input type="number" step="0.01" value={form.price ?? 0}
          onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
          className={`${inp} w-24`} />
      </td>
      <td className="px-3 py-2">
        <select value={form.price_type} onChange={e => setForm(f => ({ ...f, price_type: e.target.value }))}
          className={inp}>
          <option value="monthly">Mensal</option>
          <option value="setup">Setup</option>
        </select>
      </td>
      <td className="px-3 py-2">
        <input type="number" value={form.max_qty ?? 1}
          onChange={e => setForm(f => ({ ...f, max_qty: parseInt(e.target.value) || 1 }))}
          className={`${inp} w-16`} />
      </td>
      <td className="px-3 py-2">
        <input value={form.unit ?? ''} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
          className={`${inp} w-16`} placeholder="unid" />
      </td>
      <td className="px-3 py-2">
        <input value={form.plan_name ?? '__all__'} onChange={e => setForm(f => ({ ...f, plan_name: e.target.value }))}
          className={`${inp} w-28`} placeholder="__all__" />
      </td>
      <td className="px-3 py-2">
        <input type="number" value={form.sort_order ?? 0}
          onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
          className={`${inp} w-14`} />
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button onClick={handleSave} disabled={saving || !form.addon_key || !form.label}
            className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {saving ? <CircleNotch size={13} className="animate-spin" /> : <Check size={13} weight="bold" />}
          </button>
          <button onClick={onCancel}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 transition-colors">
            <X size={13} weight="bold" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminAddonsClient({
  products, currentProduct, initialAddons,
}: {
  products:       { slug: string; label: string }[]
  currentProduct: string
  initialAddons:  Addon[]
}) {
  const router       = useRouter()
  const supabase     = createClient()
  const [addons,    setAddons]    = useState<Addon[]>(initialAddons)
  const [adding,    setAdding]    = useState(false)
  const [toast,     setToast]     = useState('')
  const [_, startTransition]     = useTransition()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleSave(updated: Addon) {
    const { error } = await supabase
      .from('product_addons')
      .update({
        category: updated.category, addon_key: updated.addon_key, label: updated.label,
        description: updated.description, price: updated.price, price_type: updated.price_type,
        max_qty: updated.max_qty, unit: updated.unit, plan_name: updated.plan_name,
        sort_order: updated.sort_order,
      })
      .eq('id', updated.id)
    if (error) { showToast('Erro: ' + error.message); return }
    setAddons(prev => prev.map(a => a.id === updated.id ? updated : a))
    showToast('Salvo!')
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('product_addons').delete().eq('id', id)
    if (error) { showToast('Erro: ' + error.message); return }
    setAddons(prev => prev.filter(a => a.id !== id))
    showToast('Excluído.')
  }

  async function handleToggle(id: string, enabled: boolean) {
    const { error } = await supabase.from('product_addons').update({ enabled }).eq('id', id)
    if (error) { showToast('Erro: ' + error.message); return }
    setAddons(prev => prev.map(a => a.id === id ? { ...a, enabled } : a))
  }

  async function handleCreate(form: Partial<Addon>) {
    const { data, error } = await supabase
      .from('product_addons')
      .insert({ ...form, product_slug: currentProduct })
      .select()
      .single()
    if (error) { showToast('Erro: ' + error.message); return }
    setAddons(prev => [...prev, data as Addon])
    setAdding(false)
    showToast('Addon criado!')
  }

  // Group addons by category for display
  const grouped = addons.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = []
    acc[a.category].push(a)
    return acc
  }, {} as Record<string, Addon[]>)

  const TABLE_COLS = [
    'Categoria','Chave','Label','Descrição','Preço','Tipo','Qtd Máx','Unid','Plano','Ordem','Ações'
  ]

  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      <div className="px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Adicionais de Produto</h1>
            <p className="text-zinc-400 text-sm mt-1">Configure os add-ons disponíveis por produto e plano</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
          >
            <Plus size={15} weight="bold" /> Novo Addon
          </button>
        </div>

        {/* Product selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {products.map(p => (
            <button
              key={p.slug}
              onClick={() => {
                startTransition(() => router.push(`/admin/addons?product=${p.slug}`))
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                currentProduct === p.slug
                  ? 'bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(CATEGORY_LABELS).map(([cat, lbl]) => {
            const count = (grouped[cat] ?? []).length
            if (!count) return null
            return (
              <div key={cat} className="bg-zinc-800 rounded-xl px-4 py-3 border border-zinc-700">
                <p className="text-xs text-zinc-400 mb-1">{lbl}</p>
                <p className="text-xl font-black text-white">{count}</p>
              </div>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  {TABLE_COLS.map(c => (
                    <th key={c} className="text-left px-3 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adding && (
                  <NewAddonRow
                    productSlug={currentProduct}
                    onSave={handleCreate}
                    onCancel={() => setAdding(false)}
                  />
                )}
                {addons.length === 0 && !adding && (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-zinc-500 text-sm">
                      Nenhum addon cadastrado para este produto.{' '}
                      <button onClick={() => setAdding(true)} className="text-[#0EA5E9] font-bold hover:underline">
                        Adicionar o primeiro
                      </button>
                    </td>
                  </tr>
                )}
                {addons.map(addon => (
                  <AddonRow
                    key={addon.id}
                    addon={addon}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-zinc-600 mt-4">
          <strong className="text-zinc-500">plan_name = __all__</strong> → aplica a todos os planos do produto.
          Para override por plano específico, use o nome exato do plano (ex: <code className="text-zinc-400">VPS-2</code>).
          O registro com nome de plano específico tem precedência sobre <code className="text-zinc-400">__all__</code>.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 bg-zinc-800 text-white text-sm font-semibold rounded-xl shadow-2xl border border-zinc-700 z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

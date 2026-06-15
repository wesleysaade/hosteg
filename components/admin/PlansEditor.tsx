'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Plus, Trash, FloppyDisk, Star, ArrowUp, ArrowDown, Eye,
} from '@phosphor-icons/react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Spec    { id?: string; label: string; value: string; tip: string; position: number }
interface Feature { id?: string; text: string;  tip: string;  position: number }
interface Plan {
  id?:                string
  name:               string
  monthly_price:      number
  price_trimestral:   number | null
  price_semestral:    number | null
  price_anual:        number | null
  price_bianual:      number | null
  price_36months:     number | null
  setup_mensal:       number | null
  setup_anual:        number | null
  setup_bianual:      number | null
  setup_36months:     number | null
  description:        string
  cta_href:           string | null
  popular:            boolean
  position:           number
  plan_specs:         Spec[]
  plan_features:      Feature[]
}
interface Product { id: string; name: string; slug: string; cta_href: string; cta_label: string; available_periods?: string[] }

// ── Helpers ───────────────────────────────────────────────────────────────────
function newPlan(pos: number): Plan {
  return {
    name: 'Novo Plano', monthly_price: 0,
    price_trimestral: null, price_semestral: null, price_anual: null, price_bianual: null,
    price_36months: null,
    setup_mensal: null, setup_anual: null, setup_bianual: null, setup_36months: null,
    description: '', cta_href: null, popular: false, position: pos, plan_specs: [], plan_features: [],
  }
}
function newSpec(pos: number): Spec    { return { label: '', value: '', tip: '', position: pos } }
function newFeat(pos: number): Feature { return { text: '', tip: '', position: pos } }

const ALL_PERIODS = [
  { value: 'mensal',      label: 'Mensal',      months: 1,  priceKey: null                   },
  { value: 'trimestral',  label: 'Trimestral',  months: 3,  priceKey: 'price_trimestral'     },
  { value: 'semestral',   label: 'Semestral',   months: 6,  priceKey: 'price_semestral'      },
  { value: 'anual',       label: 'Anual',       months: 12, priceKey: 'price_anual'          },
  { value: 'bianual',     label: 'Bianual',     months: 24, priceKey: 'price_bianual'        },
] as const

// ── Main component ─────────────────────────────────────────────────────────────
export default function PlansEditor({ product, initialPlans, showFeatures = true }: { product: Product; initialPlans: Plan[]; showFeatures?: boolean }) {
  const isBareMetal = product.slug === 'bare-metal'
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [plans,   setPlans]   = useState<Plan[]>(initialPlans)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')
  const [openIdx, setOpenIdx] = useState<number | null>(initialPlans.length > 0 ? 0 : null)
  const [periods, setPeriods] = useState<string[]>(
    product.available_periods?.length ? product.available_periods
    : ['mensal', 'trimestral', 'semestral', 'anual', 'bianual']
  )

  function togglePeriod(val: string) {
    setPeriods(prev =>
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    )
  }

  // ── Persist all plans ────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true); setError('')
    const supabase = createClient()

    try {
      // Save available_periods to product_pages
      await supabase
        .from('product_pages')
        .update({ available_periods: periods })
        .eq('id', product.id)

      for (let i = 0; i < plans.length; i++) {
        const p = { ...plans[i], position: i }
        const planPayload = {
          product_page_id:  product.id,
          name:             p.name,
          monthly_price:    p.monthly_price,
          price_trimestral: p.price_trimestral || null,
          price_semestral:  p.price_semestral  || null,
          price_anual:      p.price_anual      || null,
          price_bianual:    p.price_bianual    || null,
          price_36months:   p.price_36months   || null,
          setup_mensal:     p.setup_mensal   != null ? p.setup_mensal   : null,
          setup_anual:      p.setup_anual    != null ? p.setup_anual    : null,
          setup_bianual:    p.setup_bianual  != null ? p.setup_bianual  : null,
          setup_36months:   p.setup_36months != null ? p.setup_36months : null,
          description:      p.description,
          cta_href:         p.cta_href?.trim() || null,
          popular:          p.popular,
          position:         p.position,
        }

        let planId = p.id
        if (planId) {
          await supabase.from('plans').update(planPayload).eq('id', planId)
        } else {
          const { data } = await supabase.from('plans').insert(planPayload).select('id').single()
          planId = data?.id
          // Update local state with new id
          setPlans(prev => prev.map((pl, idx) => idx === i ? { ...pl, id: planId } : pl))
        }
        if (!planId) continue

        // Specs: delete all and re-insert (simplest approach)
        await supabase.from('plan_specs').delete().eq('plan_id', planId)
        if (p.plan_specs.length) {
          await supabase.from('plan_specs').insert(
            p.plan_specs.map((s, si) => ({
              plan_id: planId, label: s.label, value: s.value, tip: s.tip, position: si,
            }))
          )
        }

        // Features: delete all and re-insert
        await supabase.from('plan_features').delete().eq('plan_id', planId)
        if (p.plan_features.length) {
          await supabase.from('plan_features').insert(
            p.plan_features.map((f, fi) => ({
              plan_id: planId, text: f.text, tip: f.tip, position: fi,
            }))
          )
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      startTransition(() => router.refresh())
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeletePlan(idx: number) {
    const plan = plans[idx]
    if (!confirm(`Deletar plano "${plan.name}"?`)) return
    if (plan.id) {
      const supabase = createClient()
      await supabase.from('plans').delete().eq('id', plan.id)
    }
    setPlans(prev => prev.filter((_, i) => i !== idx))
    setOpenIdx(null)
  }

  function updatePlan(idx: number, patch: Partial<Plan>) {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p))
  }
  function movePlan(idx: number, dir: -1 | 1) {
    const next = idx + dir
    if (next < 0 || next >= plans.length) return
    setPlans(prev => {
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
    setOpenIdx(next)
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/plans" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{product.name}</h1>
            <p className="text-xs text-zinc-500">/{product.slug} · {plans.length} planos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all"
          >
            <Eye size={13} /> Ver no site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 transition-colors"
          >
            <FloppyDisk size={13} weight="fill" />
            {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar tudo'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Billing periods */}
      <div className="mb-6 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Períodos de cobrança disponíveis</h3>
        <div className="flex flex-wrap gap-3">
          {ALL_PERIODS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => togglePeriod(value)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                  periods.includes(value)
                    ? 'bg-[#0EA5E9] border-[#0EA5E9]'
                    : 'border-zinc-600 bg-zinc-800 group-hover:border-zinc-400'
                }`}
              >
                {periods.includes(value) && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                onClick={() => togglePeriod(value)}
                className={`text-sm transition-colors cursor-pointer ${periods.includes(value) ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
        {periods.length === 0 && (
          <p className="text-xs text-red-400 mt-2">Selecione pelo menos um período.</p>
        )}
      </div>

      {/* Plans list */}
      <div className="space-y-3 mb-4">
        {plans.map((plan, idx) => (
          <PlanCard
            key={idx}
            plan={plan}
            idx={idx}
            total={plans.length}
            open={openIdx === idx}
            activePeriods={periods}
            isBareMetal={isBareMetal}
            showFeatures={showFeatures}
            onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            onChange={patch => updatePlan(idx, patch)}
            onMove={dir => movePlan(idx, dir)}
            onDelete={() => handleDeletePlan(idx)}
          />
        ))}
      </div>

      <button
        onClick={() => { setPlans(p => [...p, newPlan(p.length)]); setOpenIdx(plans.length) }}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-semibold transition-all"
      >
        <Plus size={14} weight="bold" /> Adicionar plano
      </button>
    </div>
  )
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({
  plan, idx, total, open, activePeriods, isBareMetal, showFeatures, onToggle, onChange, onMove, onDelete,
}: {
  plan: Plan; idx: number; total: number; open: boolean
  activePeriods: readonly string[]
  isBareMetal: boolean
  showFeatures: boolean
  onToggle: () => void
  onChange: (patch: Partial<Plan>) => void
  onMove: (dir: -1 | 1) => void
  onDelete: () => void
}) {
  function updateSpec(si: number, patch: Partial<Spec>) {
    const specs = plan.plan_specs.map((s, i) => i === si ? { ...s, ...patch } : s)
    onChange({ plan_specs: specs })
  }
  function updateFeat(fi: number, patch: Partial<Feature>) {
    const features = plan.plan_features.map((f, i) => i === fi ? { ...f, ...patch } : f)
    onChange({ plan_features: features })
  }

  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-[#0EA5E9]/30 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'}`}>
      {/* Header row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {plan.popular && <Star size={13} weight="fill" className="text-[#0EA5E9]" />}
          <span className="text-sm font-semibold text-white">{plan.name || 'Sem nome'}</span>
          <span className="text-xs text-zinc-500">R$ {plan.monthly_price}/mês</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={e => { e.stopPropagation(); onMove(-1) }} disabled={idx === 0}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors">
            <ArrowUp size={12} />
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); onMove(1) }} disabled={idx === total - 1}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 disabled:opacity-30 transition-colors">
            <ArrowDown size={12} />
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash size={12} />
          </button>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-zinc-800 pt-5">
          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Nome do plano</label>
              <input
                value={plan.name}
                onChange={e => onChange({ name: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Preço mensal (R$)</label>
              <input
                type="number"
                step="0.01"
                value={plan.monthly_price}
                onChange={e => onChange({ monthly_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Descrição curta</label>
              <input
                value={plan.description}
                onChange={e => onChange({ description: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Link para contratar
                <span className="ml-2 text-zinc-600 font-normal">(sobrepõe o link padrão do produto)</span>
              </label>
              <input
                type="url"
                value={plan.cta_href ?? ''}
                onChange={e => onChange({ cta_href: e.target.value || null })}
                placeholder="https://painelcliente.com.br/cart.php?..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Bare-Metal: contratos com setup */}
          {isBareMetal ? (
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Contratos — taxa mensal + setup
              </h4>
              <div className="rounded-xl border border-zinc-700 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 gap-0 bg-zinc-800 border-b border-zinc-700 px-3 py-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contrato</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Taxa mensal (R$)</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Setup (R$)</span>
                </div>
                {/* Mensal */}
                <div className="grid grid-cols-3 gap-3 px-3 py-3 border-b border-zinc-800 items-center">
                  <span className="text-xs text-zinc-300 font-semibold">Mensal</span>
                  <input type="number" step="0.01" value={plan.monthly_price || ''}
                    onChange={e => onChange({ monthly_price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input type="number" step="0.01" value={plan.setup_mensal ?? ''}
                    onChange={e => onChange({ setup_mensal: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="vazio = sob consulta"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600" />
                </div>
                {/* 12 meses */}
                <div className="grid grid-cols-3 gap-3 px-3 py-3 border-b border-zinc-800 items-center">
                  <span className="text-xs text-zinc-300 font-semibold">12 Meses</span>
                  <input type="number" step="0.01" value={plan.price_anual ?? ''}
                    onChange={e => onChange({ price_anual: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input type="number" step="0.01" value={plan.setup_anual ?? ''}
                    onChange={e => onChange({ setup_anual: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="vazio = sob consulta"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600" />
                </div>
                {/* 24 meses */}
                <div className="grid grid-cols-3 gap-3 px-3 py-3 border-b border-zinc-800 items-center">
                  <span className="text-xs text-zinc-300 font-semibold">24 Meses</span>
                  <input type="number" step="0.01" value={plan.price_bianual ?? ''}
                    onChange={e => onChange({ price_bianual: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input type="number" step="0.01" value={plan.setup_bianual ?? ''}
                    onChange={e => onChange({ setup_bianual: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="vazio = sob consulta"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600" />
                </div>
                {/* 36 meses */}
                <div className="grid grid-cols-3 gap-3 px-3 py-3 items-center">
                  <span className="text-xs text-zinc-300 font-semibold">36 Meses</span>
                  <input type="number" step="0.01" value={plan.price_36months ?? ''}
                    onChange={e => onChange({ price_36months: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input type="number" step="0.01" value={plan.setup_36months ?? ''}
                    onChange={e => onChange({ setup_36months: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="0 = Grátis"
                    className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 mt-1.5">
                Pagamentos mensais em todos os contratos. Setup cobrado na ativação. 0 no setup = "Grátis".
              </p>
            </div>
          ) : (
            /* Preços por período (produtos normais) */
            ALL_PERIODS.filter(p => p.priceKey && activePeriods.includes(p.value)).length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Preços por período (valor total cobrado)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERIODS.filter(p => p.priceKey && activePeriods.includes(p.value)).map(p => {
                    const key = p.priceKey as keyof Plan
                    const val = plan[key] as number | null
                    const monthlyEq = val ? (val / p.months).toFixed(2) : null
                    const discount  = val && plan.monthly_price
                      ? Math.max(0, Math.round((1 - val / p.months / plan.monthly_price) * 100))
                      : null
                    return (
                      <div key={p.value}>
                        <label className="block text-[10px] font-medium text-zinc-500 mb-1">
                          {p.label} — total {p.months}×
                          {monthlyEq && (
                            <span className="ml-1 text-zinc-400">
                              = R${monthlyEq}/mês
                              {discount != null && discount > 0 && (
                                <span className="ml-1 text-emerald-500 font-bold">-{discount}%</span>
                              )}
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder={`R$ ${plan.monthly_price ? (plan.monthly_price * p.months).toFixed(2) : '0.00'}`}
                          value={val ?? ''}
                          onChange={e => onChange({ [key]: parseFloat(e.target.value) || null } as Partial<Plan>)}
                          className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
                        />
                      </div>
                    )
                  })}
                </div>
                <p className="text-[10px] text-zinc-600 mt-1.5">
                  Deixe em branco para não mostrar desconto no período. O % é calculado automaticamente.
                </p>
              </div>
            )
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={plan.popular}
              onChange={e => onChange({ popular: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-zinc-300">Marcar como "Mais Popular"</span>
          </label>

          {/* Specs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Specs (grade 2×2)</h4>
              <button
                type="button"
                onClick={() => onChange({ plan_specs: [...plan.plan_specs, newSpec(plan.plan_specs.length)] })}
                className="text-xs text-[#0EA5E9] hover:text-[#0284C7] flex items-center gap-1"
              >
                <Plus size={11} weight="bold" /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {plan.plan_specs.map((s, si) => (
                <div key={si} className="grid grid-cols-12 gap-2 items-center">
                  <input value={s.label} onChange={e => updateSpec(si, { label: e.target.value })}
                    placeholder="Label (ex: Storage)"
                    className="col-span-3 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input value={s.value} onChange={e => updateSpec(si, { value: e.target.value })}
                    placeholder="Valor (ex: 10 GB SSD)"
                    className="col-span-4 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <input value={s.tip} onChange={e => updateSpec(si, { tip: e.target.value })}
                    placeholder="Tooltip (opcional)"
                    className="col-span-4 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                  <button type="button"
                    onClick={() => onChange({ plan_specs: plan.plan_specs.filter((_, i) => i !== si) })}
                    className="col-span-1 flex justify-center text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {showFeatures && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recursos (checklist)</h4>
                <button
                  type="button"
                  onClick={() => onChange({ plan_features: [...plan.plan_features, newFeat(plan.plan_features.length)] })}
                  className="text-xs text-[#0EA5E9] hover:text-[#0284C7] flex items-center gap-1"
                >
                  <Plus size={11} weight="bold" /> Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {plan.plan_features.map((f, fi) => (
                  <div key={fi} className="grid grid-cols-12 gap-2 items-center">
                    <input value={f.text} onChange={e => updateFeat(fi, { text: e.target.value })}
                      placeholder="Recurso (ex: SSL grátis)"
                      className="col-span-5 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                    <input value={f.tip} onChange={e => updateFeat(fi, { tip: e.target.value })}
                      placeholder="Tooltip (opcional)"
                      className="col-span-6 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
                    <button type="button"
                      onClick={() => onChange({ plan_features: plan.plan_features.filter((_, i) => i !== fi) })}
                      className="col-span-1 flex justify-center text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

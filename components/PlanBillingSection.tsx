'use client'

import { useState } from 'react'
import Tip from './Tip'
import PlanFeatureList, { type PlanFeature } from './PlanFeatureList'

// ── Period definitions ────────────────────────────────────────────────────────
export type PeriodKey = 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'bianual' | 'trienal'

export interface PeriodConfig {
  id: PeriodKey
  label: string
  months: number
}

export const DEFAULT_PERIODS: PeriodConfig[] = [
  { id: 'mensal',     label: 'Mensal',     months: 1  },
  { id: 'trimestral', label: 'Trimestral', months: 3  },
  { id: 'semestral',  label: 'Semestral',  months: 6  },
  { id: 'anual',      label: 'Anual',      months: 12 },
  { id: 'bianual',    label: 'Bianual',    months: 24 },
  { id: 'trienal',    label: 'Trienal',    months: 36 },
]

// ── Data types ────────────────────────────────────────────────────────────────
export interface PlanSpec {
  label: string
  value: string
  tip?: string
}

export interface BillingPlan {
  name: string
  desc: string
  monthlyPrice: number
  popular?: boolean
  ctaHref?: string
  /** Taxa mensal para contrato de 36 meses (bare-metal) */
  price36months?: number
  /** Setup fees por modalidade de contrato (bare-metal) */
  setupFees?: {
    mensal?: number
    anual?: number
    bianual?: number
    meses36?: number
  }
  specs: PlanSpec[]
  features: PlanFeature[]
  /** Preço TOTAL para o período (ex: anual = valor cobrado por 12 meses) */
  periodPrices?: Partial<Record<PeriodKey, number>>
}

/** Calcula desconto % de um período para um plano específico */
function calcDiscount(monthlyPrice: number, periodTotal: number, months: number): number {
  if (!monthlyPrice || months === 1) return 0
  const monthlyEq = periodTotal / months
  return Math.max(0, Math.round((1 - monthlyEq / monthlyPrice) * 100))
}

// ── Helper ────────────────────────────────────────────────────────────────────
function fmtBRL(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  plans: BillingPlan[]
  availablePeriods?: PeriodKey[]
  ctaHref?: string
  ctaLabel?: string
  hideFeatures?: boolean
  productSlug?: string   // if provided, "Contratar" links to /checkout
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PlanBillingSection({
  plans,
  availablePeriods = ['mensal', 'trimestral', 'semestral', 'anual', 'bianual', 'trienal'],
  ctaHref = 'https://painelcliente.com.br',
  ctaLabel = 'Contratar',
  hideFeatures = false,
  productSlug,
}: Props) {
  const periods = DEFAULT_PERIODS.filter(p => availablePeriods.includes(p.id))
  // Default to cheapest available period
  const [selectedId, setSelectedId] = useState<PeriodKey>(periods[periods.length - 1].id)
  const period = periods.find(p => p.id === selectedId)!

  const cols =
    plans.length >= 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
    : plans.length === 3 ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  // Desconto representativo por período (usa o primeiro plano com preço cadastrado)
  const periodDiscounts: Partial<Record<PeriodKey, number>> = {}
  for (const p of periods) {
    const repPlan  = plans.find(pl => pl.periodPrices?.[p.id] != null)
    const repPrice = repPlan?.periodPrices?.[p.id]
    if (repPrice != null && repPlan) {
      const pct = calcDiscount(repPlan.monthlyPrice, repPrice, p.months)
      periodDiscounts[p.id] = pct
    }
  }
  // Calcula economia para o período selecionado (usando média dos planos)
  const selectedPeriodCfg = periods.find(p => p.id === selectedId)!
  const savingsLines = plans.map(plan => {
    const pp = plan.periodPrices?.[selectedId]
    if (!pp || selectedPeriodCfg.months === 1) return null
    const normalTotal = plan.monthlyPrice * selectedPeriodCfg.months
    const save = parseFloat((normalTotal - pp).toFixed(2))
    const pct  = calcDiscount(plan.monthlyPrice, pp, selectedPeriodCfg.months)
    return { total: pp, save, pct }
  }).filter(Boolean) as { total: number; save: number; pct: number }[]

  // Representante do callout = primeiro plano popular ou o primeiro com desconto
  const calloutData = savingsLines.find((_, i) => plans[i]?.popular) ?? savingsLines[0] ?? null

  return (
    <div>
      {/* ── Period selector tabs ──────────────────────────────────────────── */}
      {periods.length > 1 && (
        <div className="flex flex-col items-center mb-10 gap-4">
          <div className="inline-flex bg-zinc-100/80 rounded-full p-1 gap-0.5 flex-wrap justify-center">
            {periods.map(p => {
              const active = p.id === selectedId
              const pct = periodDiscounts[p.id] ?? 0
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span className="flex flex-col items-center leading-none gap-0.5">
                    <span>{p.label}</span>
                    {pct > 0 && (
                      <span className={`text-[11px] font-bold leading-none ${
                        active ? 'text-emerald-600' : 'text-emerald-500'
                      }`}>
                        -{pct}%
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Savings callout ─────────────────────────────────────────── */}
          {calloutData && selectedId !== 'mensal' && (
            <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-5 py-2.5 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-zinc-600">
                Pague{' '}
                <span className="font-bold text-zinc-900 tnum">
                  R$ {fmtBRL(calloutData.total)}
                </span>{' '}
                no {selectedPeriodCfg.label.toLowerCase()} e{' '}
                <span className="font-bold text-emerald-600">
                  ganhe {calloutData.pct}% de desconto
                </span>
                {calloutData.save > 0 && (
                  <span className="text-zinc-400 ml-1 text-xs font-normal tnum">
                    (economize R$ {fmtBRL(calloutData.save)})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Plan cards ───────────────────────────────────────────────────── */}
      <div className={`grid ${cols} gap-5`}>
        {plans.map(plan => {
          const isMonthly    = period.months === 1
          const periodPrice  = plan.periodPrices?.[period.id]
          // Se tem preço cadastrado, usa; senão exibe só o mensal sem desconto
          const total        = periodPrice ?? (plan.monthlyPrice * period.months)
          const monthlyEq    = parseFloat((total / period.months).toFixed(2))
          const discountPct  = periodPrice != null
            ? calcDiscount(plan.monthlyPrice, periodPrice, period.months)
            : 0

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl border flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'border-[#0EA5E9]/40 bg-white ring-1 ring-[#0EA5E9]/30 shadow-2xl shadow-[#0EA5E9]/15 lg:-translate-y-2'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent" />
              )}

              {/* Badge row — always present for alignment */}
              <div className="h-9 flex items-center justify-end px-5 pt-1">
                {plan.popular && (
                  <span className="px-3 py-1 bg-[#0EA5E9] text-white text-xs font-bold rounded-full shadow-lg shadow-[#0EA5E9]/30">
                    Mais Popular
                  </span>
                )}
                {!plan.popular && discountPct > 0 && (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full shadow shadow-emerald-200">
                    -{discountPct}% off
                  </span>
                )}
              </div>

              {/* Name + pricing */}
              <div className="px-7 pb-0 mb-4">
                <p className="font-display text-lg font-bold text-zinc-900 mb-3">
                  {plan.name}
                </p>

                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-zinc-400">R$</span>
                  <span className="font-display text-5xl font-bold text-zinc-900 tracking-[-0.04em] tnum">{fmtBRL(monthlyEq)}</span>
                  <span className="text-zinc-400 text-sm font-medium">/mês</span>
                </div>

                {!isMonthly && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 tnum">
                    {period.months}x de R$ {fmtBRL(monthlyEq)} · Total R$ {fmtBRL(total)}
                    {discountPct > 0 && (
                      <span className="text-emerald-500 font-bold"> · -{discountPct}%</span>
                    )}
                  </p>
                )}

                <p className="text-sm text-zinc-500 leading-relaxed mt-2">{plan.desc}</p>
              </div>

              {/* Specs grid */}
              {plan.specs.length > 0 && (
                <div className="px-7 grid grid-cols-2 gap-2 mb-5">
                  {plan.specs.map(s => (
                    <div key={s.label} className={`rounded-xl p-3 text-center border ${
                      plan.popular
                        ? 'bg-[#0EA5E9]/[0.07] border-[#0EA5E9]/20'
                        : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <div className="font-display text-sm font-bold text-zinc-900 tnum">{s.value}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center justify-center gap-0.5">
                        {s.label}
                        {s.tip && <Tip text={s.tip} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!hideFeatures && plan.features.length > 0 && (
                <div className="px-7">
                  <div className="h-px bg-zinc-200 mb-5" />
                  <PlanFeatureList features={plan.features} threshold={5} popular={plan.popular} />
                </div>
              )}

              <div className={`px-7 pb-7 ${hideFeatures ? 'mt-4' : 'mt-auto pt-6'}`}>
                {(() => {
                  const href = productSlug
                    ? `/contato?assunto=${encodeURIComponent(plan.name)}`
                    : (plan.ctaHref ?? ctaHref)
                  const external = !productSlug
                  return (
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className={`block text-center text-sm font-bold py-3.5 rounded-xl transition-all ${
                        plan.popular
                          ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/30'
                          : 'bg-zinc-900 hover:bg-[#0EA5E9] text-white'
                      }`}
                    >
                      {ctaLabel}
                    </a>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

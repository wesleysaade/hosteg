'use client'

import { useState } from 'react'
import { Info } from '@phosphor-icons/react'
import type { BillingPlan } from './PlanBillingSection'
import Tip from './Tip'

// ── Contratos disponíveis ─────────────────────────────────────────────────────
type ContractKey = 'mensal' | 'anual' | 'bianual' | 'meses36'

interface Contract {
  key:       ContractKey
  label:     string
  sublabel:  string
  months:    number
  priceKey:  keyof BillingPlan | null
  setupKey:  keyof NonNullable<BillingPlan['setupFees']>
}

const CONTRACTS: Contract[] = [
  { key: 'mensal',  label: 'Mensal',   sublabel: 'Sem fidelidade',   months: 1,  priceKey: null,           setupKey: 'mensal'  },
  { key: 'anual',   label: '12 Meses', sublabel: 'Mais econômico',   months: 12, priceKey: 'periodPrices', setupKey: 'anual'   },
  { key: 'bianual', label: '24 Meses', sublabel: 'Melhor custo',     months: 24, priceKey: 'periodPrices', setupKey: 'bianual' },
  { key: 'meses36', label: '36 Meses', sublabel: 'Setup Grátis',     months: 36, priceKey: 'price36months',setupKey: 'meses36' },
]

function fmtBRL(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getMonthlyRate(plan: BillingPlan, contract: Contract): number | null {
  if (contract.key === 'mensal')  return plan.monthlyPrice
  if (contract.key === 'meses36') return plan.price36months ?? null
  // anual / bianual: armazenamos a taxa mensal diretamente em periodPrices
  return plan.periodPrices?.[contract.key === 'anual' ? 'anual' : 'bianual'] ?? null
}

function getSetupFee(plan: BillingPlan, contract: Contract): number | null {
  return plan.setupFees?.[contract.setupKey] ?? null
}

function calcDiscount(monthlyRate: number, referenceMonthly: number): number {
  if (!referenceMonthly || monthlyRate >= referenceMonthly) return 0
  return Math.round((1 - monthlyRate / referenceMonthly) * 100)
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BareMetalPricingSection({
  plans,
  ctaHref = 'https://painelcliente.com.br',
  ctaLabel = 'Solicitar servidor',
  productSlug,
}: {
  plans: BillingPlan[]
  ctaHref?: string
  ctaLabel?: string
  productSlug?: string
}) {
  const [selected, setSelected] = useState<ContractKey>('meses36')

  // Só mostra contratos que tenham preço em pelo menos 1 plano
  const visibleContracts = CONTRACTS.filter(c => {
    if (c.key === 'mensal') return true
    return plans.some(p => getMonthlyRate(p, c) != null)
  })

  const activeContract = visibleContracts.find(c => c.key === selected) ?? visibleContracts[0]

  const cols =
    plans.length >= 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    : plans.length === 3 ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  return (
    <div>
      {/* ── Seletor de contrato ──────────────────────────────────────────── */}
      {visibleContracts.length > 1 && (
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-zinc-100 border border-zinc-200 rounded-2xl p-1.5 gap-1 flex-wrap justify-center">
            {visibleContracts.map(c => {
              const active = c.key === selected
              // Desconto representativo usando o primeiro plano disponível
              const repPlan = plans.find(p => getMonthlyRate(p, c) != null)
              const rate    = repPlan ? getMonthlyRate(repPlan, c) : null
              const pct     = rate != null && repPlan
                ? calcDiscount(rate, repPlan.monthlyPrice)
                : 0

              return (
                <button
                  key={c.key}
                  onClick={() => setSelected(c.key)}
                  className={`relative flex flex-col items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-zinc-900 shadow border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[10px] font-medium ${active ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {c.sublabel}
                  </span>
                  {pct > 0 && (
                    <span className={`absolute -top-2.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      active ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      -{pct}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Aviso sobre pagamentos mensais ───────────────────────────────── */}
      {activeContract.key !== 'mensal' && (
        <div className="flex items-center justify-center gap-2 mb-8 text-xs text-zinc-500">
          <Info size={13} className="text-[#0EA5E9]" />
          Contrato de {activeContract.label.toLowerCase()} com pagamentos mensais — sem cobrança adiantada.
        </div>
      )}

      {/* ── Cards de plano ───────────────────────────────────────────────── */}
      <div className={`grid ${cols} gap-5`}>
        {plans.map(plan => {
          const rate     = getMonthlyRate(plan, activeContract)
          const setup    = getSetupFee(plan, activeContract)
          const discount = rate != null ? calcDiscount(rate, plan.monthlyPrice) : 0
          const displayRate = rate ?? plan.monthlyPrice

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 border flex flex-col transition-all duration-200 ${
                plan.popular
                  ? 'border-[#0EA5E9]/50 bg-gradient-to-b from-[#0EA5E9]/8 to-[#0EA5E9]/3 shadow-xl shadow-[#0EA5E9]/15'
                  : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100'
              }`}
            >
              {plan.popular && (
                <>
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent" />
                  <div className="absolute -top-3.5 right-5 px-3 py-1 bg-[#0EA5E9] text-white text-xs font-bold rounded-full shadow-lg shadow-[#0EA5E9]/40">
                    Recomendado
                  </div>
                </>
              )}

              {/* Nome + preço */}
              <div className="mb-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{plan.name}</p>

                {discount > 0 && (
                  <div className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black">
                    {discount}% desconto vs mensal
                  </div>
                )}

                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-sm text-zinc-400">R$</span>
                  <span className="text-4xl font-black text-zinc-900">{fmtBRL(displayRate)}</span>
                  <span className="text-zinc-400 text-sm">/mês</span>
                </div>

                {/* Setup fee */}
                <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  setup === 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : setup == null
                    ? 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {setup === 0
                    ? '✓ Setup Grátis'
                    : setup == null
                    ? 'Setup sob consulta'
                    : `Setup: R$ ${fmtBRL(setup)}`}
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed mt-2">{plan.desc}</p>
              </div>

              {/* Specs grid */}
              {plan.specs.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {plan.specs.map(s => (
                    <div key={s.label} className={`rounded-lg p-2.5 text-center border ${
                      plan.popular
                        ? 'bg-[#0EA5E9]/10 border-[#0EA5E9]/20'
                        : 'bg-white border-zinc-200'
                    }`}>
                      <div className="text-xs font-bold text-zinc-900">{s.value}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center justify-center gap-0.5">
                        {s.label}
                        {s.tip && <Tip text={s.tip} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                    className={`block text-center text-sm font-bold py-3 rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/30'
                        : 'bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200'
                    }`}
                  >
                    {ctaLabel}
                  </a>
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

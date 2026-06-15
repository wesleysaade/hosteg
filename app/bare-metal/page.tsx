import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Cpu, HardDrives, Globe, ArrowRight, Shield,
  Network, Lightning, CheckCircle,
} from '@phosphor-icons/react/dist/ssr'
import BareMetalPricingSection from '@/components/BareMetalPricingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import type { BillingPlan } from '@/components/PlanBillingSection'
import { fetchPageSection } from '@/lib/utils/content'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Bare-Metal — Servidores Dedicados — Hosteg',
  description: 'Servidores dedicados com Intel Xeon E5 e Gold. 100% dos recursos são seus. Ideal para grandes cargas de trabalho.',
}

const diferenciais = [
  { icon: Cpu,        title: 'Sem compartilhamento', desc: '100% dos recursos são seus. CPU, RAM e disco dedicados exclusivamente à sua aplicação.' },
  { icon: Shield,     title: 'Anti-DDoS avançado',   desc: 'Proteção robusta contra ataques volumétricos inclusa em todos os servidores dedicados.' },
  { icon: Network,    title: 'Rede 10 Gbps',          desc: 'Uplink dedicado de 10 Gbps com baixa latência e alta disponibilidade de banda.' },
  { icon: HardDrives, title: 'RAID configurável',     desc: 'RAID 0, 1, 5 ou 10 conforme sua necessidade de performance e redundância.' },
  { icon: Globe,      title: 'IPs adicionais',        desc: 'Blocos de IP adicionais disponíveis mediante solicitação e justificativa técnica.' },
  { icon: Lightning,  title: 'Implantação rápida',    desc: 'Servidores disponibilizados em até 24h úteis após confirmação do pedido.' },
]

function spec(plan: BillingPlan, label: string): string {
  return plan.specs?.find(s => s.label.toLowerCase() === label.toLowerCase())?.value ?? '—'
}

// Hardcoded fallback features for bare-metal (used when DB has nothing)
const defaultBareMetalFeatures = [
  { text: 'Anti-DDoS avançado',       tip: 'Proteção robusta contra ataques volumétricos inclusa em todos os servidores.' },
  { text: 'RAID configurável',         tip: 'RAID 0, 1, 5 ou 10 conforme sua necessidade de performance e redundância.' },
  { text: 'Rede 10 Gbps dedicada',     tip: 'Uplink dedicado de 10 Gbps com múltiplos provedores de trânsito.' },
  { text: 'IPs adicionais disponíveis',tip: 'Blocos de IP adicionais disponíveis mediante solicitação e justificativa técnica.' },
  { text: 'KVM / IPMI remoto',         tip: 'Acesso remoto de baixo nível via KVM/IPMI para reinstalação e manutenção fora de banda.' },
  { text: 'Suporte 24/7 em português', tip: 'Suporte técnico humano disponível 24h por dia, 7 dias por semana, em português.' },
  { text: 'SLA 99.9% garantido',       tip: 'Uptime garantido em contrato — menos de 8.7h de inatividade por ano.' },
  { text: 'Implantação em até 24h',    tip: 'Servidores disponibilizados em até 24h úteis após confirmação do pedido.' },
]

export default async function BareMetalPage() {
  const [{ plans }, sharedFeaturesSection, hero] = await Promise.all([
    fetchBillingPlans('bare-metal'),
    fetchPageSection('bare-metal', 'shared_features'),
    getHero('bare-metal', {
      badge:    'Servidores Dedicados',
      title:    'Bare-Metal',
      subtitle: 'Máximo poder computacional com Intel Xeon E5 e Gold.',
      desc:     '100% dos recursos são seus. Sem vizinhos. Sem compartilhamento.',
    }),
  ])

  const featureItems: { text: string; tip?: string }[] =
    sharedFeaturesSection?.items?.length ? sharedFeaturesSection.items : defaultBareMetalFeatures

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
            <Cpu size={12} weight="fill" /> {hero.badge}
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-3">
            {hero.subtitle}
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            {hero.desc}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[['Intel Xeon','CPU'],['DDR4 ECC','Memória'],['NVMe Gen4','Storage'],['99.9%','SLA']].map(([v,l]) => (
              <div key={l} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200">
                <span className="font-black text-[#0EA5E9]">{v}</span>
                <span className="text-zinc-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BareMetalPricingSection plans={plans} productSlug="bare-metal" ctaLabel="Contratar" />
        </div>
      </section>

      {/* Tabela comparativa — driven by DB specs */}
      {plans.length > 0 && (
        <section className="py-16 border-t border-zinc-200 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Comparativo completo</h2>
              <p className="text-zinc-500">Todos os servidores lado a lado</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-white">
                    <th className="text-left px-5 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Plano</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">CPU</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Cores</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">RAM</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Storage</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Rede</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">IP</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Preço/mês</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {plans.map((plan) => (
                    <tr key={plan.name} className={`hover:bg-zinc-50 transition-colors ${plan.popular ? 'bg-[#0EA5E9]/5' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 whitespace-nowrap">{plan.name}</span>
                          {plan.popular && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/25 uppercase tracking-wide whitespace-nowrap">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center px-4 py-4 text-zinc-700 text-xs">{spec(plan, 'CPU')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold whitespace-nowrap">{spec(plan, 'Cores')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold whitespace-nowrap">{spec(plan, 'RAM')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 text-xs">{spec(plan, 'Storage')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold">{spec(plan, 'Rede')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700">{spec(plan, 'IP')}</td>
                      <td className="text-center px-4 py-4 font-black text-zinc-900 whitespace-nowrap">
                        R$ {plan.monthlyPrice.toLocaleString('pt-BR')}
                      </td>
                      <td className="text-center px-4 py-4">
                        <a href={`/checkout?produto=bare-metal&plano=${encodeURIComponent(plan.name)}&periodo=mensal`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-lg transition-colors whitespace-nowrap ${
                            plan.popular
                              ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-sm shadow-[#0EA5E9]/30'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                          }`}
                        >
                          Contratar <ArrowRight size={11} weight="bold" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Incluso em todos os planos — features comuns */}
      {featureItems.length > 0 && (
        <section className="py-16 border-t border-zinc-200 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">
                <CheckCircle size={14} weight="fill" /> Incluso em todos os planos
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Sem cobranças ocultas</h2>
              <p className="text-zinc-500 text-sm">Independente do servidor ou contrato escolhido.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {featureItems.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 p-4 rounded-xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 transition-colors">
                  <CheckCircle size={16} weight="fill" className="text-[#0EA5E9] flex-shrink-0" />
                  <span className="text-sm text-zinc-700 font-semibold">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Diferenciais */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Por que escolher Bare-Metal?</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Quando a performance não pode ser comprometida.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diferenciais.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparativo Bare-Metal vs VPS */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-2">Bare-Metal vs VPS</h2>
            <p className="text-zinc-500 text-sm">Saiba qual é o melhor para sua necessidade</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-white">
                  <th className="text-left px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Característica</th>
                  <th className="text-center px-6 py-4 text-xs font-black text-[#0EA5E9] uppercase tracking-wider">Bare-Metal</th>
                  <th className="text-center px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Cloud VPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ['Recursos dedicados',          '✓ 100%',            '✓ Garantido'],
                  ['Compartilhamento de hardware', '✗ Nenhum',          '~ Hypervisor'],
                  ['Custo',                        'R$ 799+/mês',       'R$ 39+/mês'],
                  ['Escalabilidade',               '~ Upgrade manual',  '✓ Instantânea'],
                  ['Isolamento',                   '✓ Total',           '✓ KVM'],
                  ['Melhor para',                  'Grande carga / IA', 'Maioria dos projetos'],
                ].map(([feat, bm, vps]) => (
                  <tr key={feat} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-700 font-medium">{feat}</td>
                    <td className="px-6 py-4 text-center text-[#0EA5E9] font-bold">{bm}</td>
                    <td className="px-6 py-4 text-center text-zinc-500">{vps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Pronto para performance máxima?</h2>
          <p className="text-zinc-500 mb-8">
            Entre em contato e nossa equipe vai montar a configuração ideal para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Contratar Bare-Metal <ArrowRight size={15} weight="bold" />
            </a>
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

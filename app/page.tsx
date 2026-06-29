import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  ArrowRight,
  Check,
  Zap,
  Shield,
  Clock,
  Server,
  Globe,
  HardDrive,
  Wifi,
  Star,
  Database,
  Monitor,
  Package,
  Share2,
  ChevronRight,
} from 'lucide-react'
import { fetchBillingPlans } from '@/lib/utils/plans'
import type { BillingPlan } from '@/components/PlanBillingSection'

export const dynamic = 'force-dynamic'

/* Lê o valor de uma spec do plano pelo label (case-insensitive) */
function spec(plan: BillingPlan, label: string): string {
  return plan.specs?.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value ?? '—'
}

/* ── Dados estáticos ─────────────────────────────────────────────────────── */

const trustMetrics = [
  { value: '+5.000',  label: 'Clientes ativos' },
  { value: '99.9%',  label: 'Uptime garantido' },
  { value: '24/7',   label: 'Suporte humano' },
  { value: '10 Gbps',label: 'Uplink de rede' },
]

const products = [
  {
    icon: Server,
    label: 'Cloud VPS NVMe',
    desc: 'VPS com NVMe Gen4, IPv4 dedicado e anti-DDoS incluso.',
    badge: 'Mais vendido',
    badgeColor: '#0EA5E9',
    from: 'R$ 39',
    href: '/cloud-vps',
    highlight: true,
  },
  {
    icon: Zap,
    label: 'Bare-Metal',
    desc: 'Servidores Xeon dedicados. Hardware 100% seu, sem compartilhamento.',
    badge: 'Alta performance',
    badgeColor: '#8B5CF6',
    from: 'R$ 599',
    href: '/bare-metal',
    highlight: false,
  },
  {
    icon: Globe,
    label: 'Hospedagem PRO',
    desc: 'cPanel + LiteSpeed + Redis. Ideal para sites e lojas WordPress.',
    badge: 'Popular',
    badgeColor: '#10B981',
    from: 'R$ 19',
    href: '/hospedagem-pro',
    highlight: false,
  },
  {
    icon: HardDrive,
    label: 'WordPress Hosting',
    desc: 'Ambiente gerenciado, otimizado 100% para WordPress.',
    badge: '',
    badgeColor: '',
    from: 'R$ 14',
    href: '/wordpress',
    highlight: false,
  },
  {
    icon: Database,
    label: 'Database Cloud',
    desc: 'MySQL, PostgreSQL, MongoDB e SQL Server gerenciados na nuvem.',
    badge: '',
    badgeColor: '',
    from: 'R$ 29',
    href: '/database-cloud',
    highlight: false,
  },
  {
    icon: Share2,
    label: 'Revenda cPanel',
    desc: 'White-label completo para agências e revendedores.',
    badge: 'Novo',
    badgeColor: '#F59E0B',
    from: 'R$ 49',
    href: '/revenda-cpanel',
    highlight: false,
  },
  {
    icon: Monitor,
    label: 'Terminal Server',
    desc: 'Desktop Windows acessível direto no navegador, 24h.',
    badge: '',
    badgeColor: '',
    from: 'R$ 89',
    href: '/terminal-server',
    highlight: false,
  },
  {
    icon: Package,
    label: 'BackupPRO',
    desc: 'Backup automático gerenciado com tecnologia Acronis.',
    badge: '',
    badgeColor: '',
    from: 'R$ 19',
    href: '/backup-pro',
    highlight: false,
  },
]

const features = [
  {
    icon: Zap,
    title: 'NVMe — até 7.000 MB/s',
    desc: 'Storage de alta performance com até 7 GB/s de leitura sequencial. Aplicações e bancos de dados respondem em milissegundos.',
  },
  {
    icon: Shield,
    title: 'Anti-DDoS em todos os planos',
    desc: 'Mitigação automática de ataques volumétricos nas camadas 3, 4 e 7. Sem custo extra, incluso de série.',
  },
  {
    icon: Wifi,
    title: 'Rede 10 Gbps redundante',
    desc: 'Múltiplos uplinks de 10 Gbps com peering direto na IX.br. Latência sub-milissegundo para São Paulo.',
  },
  {
    icon: Clock,
    title: 'SLA 99.9% garantido em contrato',
    desc: 'Disponibilidade garantida com infraestrutura redundante em dois datacenters. Compensação automática em downtime.',
  },
  {
    icon: Globe,
    title: 'SP, Toronto ou Washington — escolha a região',
    desc: 'Ascenty SP4 em São Paulo, Toronto no Canadá e Washington nos EUA. Latência otimizada para seu público onde ele estiver.',
  },
  {
    icon: Star,
    title: 'Suporte humano 24/7 em PT-BR',
    desc: 'Time técnico brasileiro. Nenhum bot, nenhuma fila de e-mail. Atendimento real a qualquer hora.',
  },
]

const testimonials = [
  {
    name: 'Rafael Mendes',
    role: 'CTO · Agência Digital',
    text: 'Migramos 40 clientes para a Hosteg e o ganho de performance foi imediato. NVMe faz toda a diferença nos scores do Core Web Vitals.',
    stars: 5,
  },
  {
    name: 'Camila Ferreira',
    role: 'Fundadora · SaaS B2B',
    text: 'Anti-DDoS incluso salvou minha aplicação em dois ataques na mesma semana. Nem percebi — o time me avisou depois.',
    stars: 5,
  },
  {
    name: 'Lucas Oliveira',
    role: 'DevOps · E-commerce',
    text: 'O suporte responde em menos de 5 minutos, sempre em português e com conhecimento técnico de verdade. Isso não tem preço.',
    stars: 5,
  },
]

/* ── Componente ─────────────────────────────────────────────────────────── */

export default async function HomePage() {
  // Planos reais do Cloud VPS (mesma fonte da página /cloud-vps)
  const { plans: vpsPlans } = await fetchBillingPlans('cloud-vps')

  // 4 planos em destaque, garantindo incluir o marcado como "popular"
  let featuredVps = vpsPlans.slice(0, 4)
  if (vpsPlans.length > 4 && !featuredVps.some((p) => p.popular)) {
    const popular = vpsPlans.find((p) => p.popular)
    if (popular) featuredVps = [...vpsPlans.slice(0, 3), popular]
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO — fundo escuro com glow azul
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#020817] pt-32 pb-28">
        {/* Glow radial */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Grid sutil */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge animado */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#38BDF8] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            NVMe · Anti-DDoS · Suporte 24/7
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black leading-[1.0] tracking-tight text-white mb-6">
            Infraestrutura cloud<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #38BDF8 0%, #0EA5E9 50%, #6366F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              para quem leva a sério.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            VPS NVMe, Bare-Metal Xeon e hospedagem gerenciada com suporte técnico brasileiro 24/7.
            Ative em&nbsp;<strong className="text-white">menos de 60 segundos</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-base transition-all shadow-2xl shadow-[#0EA5E9]/30"
            >
              Ver Planos CloudVPS <ArrowRight size={17} />
            </Link>
            <Link
              href="/bare-metal"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold rounded-xl text-base border border-white/[0.15] hover:border-white/25 transition-all"
            >
              Bare-Metal dedicado <Server size={15} />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              '✓ Sem fidelidade',
              '✓ Ativação em 60s',
              '✓ Anti-DDoS incluso',
              '✓ Suporte em PT-BR',
            ].map((t) => (
              <span key={t} className="text-sm text-zinc-500 font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST METRICS
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {trustMetrics.map((m, i) => (
              <div
                key={m.label}
                className={`py-10 text-center ${i < trustMetrics.length - 1 ? 'border-r border-zinc-100' : ''}`}
              >
                <div className="text-4xl font-black text-zinc-900 mb-1.5">{m.value}</div>
                <div className="text-sm text-zinc-400 font-medium">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRODUTOS — grid de 4 colunas
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">Soluções completas</p>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight mb-4">
              Do site pessoal ao data center
            </h2>
            <p className="text-zinc-500 text-lg max-w-lg mx-auto">
              Hospedagem compartilhada, VPS, bare-metal ou cloud apps — tudo numa só empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const Icon = p.icon
              return (
                <Link
                  key={p.label}
                  href={p.href}
                  className={`group relative flex flex-col p-5 rounded-2xl border transition-all duration-200 ${
                    p.highlight
                      ? 'border-[#0EA5E9]/40 bg-gradient-to-br from-[#0EA5E9]/[0.05] to-transparent shadow-lg shadow-[#0EA5E9]/[0.08] hover:shadow-[#0EA5E9]/[0.15]'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100'
                  }`}
                >
                  {p.badge && (
                    <span
                      className="absolute top-4 right-4 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide text-white"
                      style={{ background: p.badgeColor }}
                    >
                      {p.badge}
                    </span>
                  )}

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{
                      background: p.highlight ? 'rgba(14,165,233,0.12)' : '#F4F4F5',
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: p.highlight ? '#0EA5E9' : '#71717A' }}
                    />
                  </div>

                  <h3 className="text-sm font-black text-zinc-900 mb-1.5 leading-snug">{p.label}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed flex-1 mb-4">{p.desc}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-medium block">a partir de</span>
                      <span className="text-lg font-black text-zinc-900">{p.from}<span className="text-xs font-semibold text-zinc-400">/mês</span></span>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-0.5"
                      style={{ background: p.highlight ? '#0EA5E9' : '#F4F4F5' }}
                    >
                      <ChevronRight size={13} style={{ color: p.highlight ? '#fff' : '#71717A' }} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VPS PLANS — destaque
      ══════════════════════════════════════════════════════════════ */}
      {featuredVps.length > 0 && (
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#0EA5E9]/25 bg-[#0EA5E9]/8 text-[#0EA5E9] text-[11px] font-black uppercase tracking-widest">
              <HardDrive size={13} /> Cloud VPS NVMe
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">Escolha seu VPS</h2>
            <p className="mt-4 text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">
              NVMe Gen4, IPv4/IPv6 dedicados e anti-DDoS incluso. Ative em menos de 60 segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {featuredVps.map((plan) => (
              <div
                key={plan.name}
                className={`group relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#020817] text-white shadow-2xl shadow-[#0EA5E9]/20 ring-1 ring-[#0EA5E9]/40 lg:-translate-y-3'
                    : 'bg-white border border-zinc-200 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-zinc-900/5 hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
                      style={{ background: 'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(14,165,233,0.18) 0%, transparent 70%)' }}
                    />
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#0EA5E9] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-[#0EA5E9]/40">
                      Mais Popular
                    </div>
                  </>
                )}

                <div className="relative">
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${plan.popular ? 'text-[#38BDF8]' : 'text-[#0EA5E9]'}`}>
                    VPS
                  </p>
                  <p className={`text-xl font-black mb-5 ${plan.popular ? 'text-white' : 'text-zinc-900'}`}>
                    {plan.name}
                  </p>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-[13px] font-semibold ${plan.popular ? 'text-zinc-400' : 'text-zinc-400'}`}>R$</span>
                      <span className={`text-5xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-zinc-900'}`}>
                        {plan.monthlyPrice.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-sm text-zinc-400 font-medium">/mês</span>
                    </div>
                  </div>

                  <ul className={`space-y-0 mb-7 rounded-2xl overflow-hidden ${plan.popular ? 'bg-white/[0.04]' : 'bg-zinc-50'}`}>
                    {[
                      { label: 'RAM',     val: spec(plan, 'RAM') },
                      { label: 'vCPU',    val: spec(plan, 'vCPU') },
                      { label: 'NVMe',    val: spec(plan, 'NVMe') },
                      { label: 'Tráfego', val: spec(plan, 'Tráfego') },
                    ].map((s, i) => (
                      <li
                        key={s.label}
                        className={`flex items-center justify-between px-4 py-3 ${i > 0 ? (plan.popular ? 'border-t border-white/[0.06]' : 'border-t border-zinc-100') : ''}`}
                      >
                        <span className="text-xs font-semibold text-zinc-400">{s.label}</span>
                        <span className={`text-sm font-black ${plan.popular ? 'text-white' : 'text-zinc-900'}`}>{s.val}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/cloud-vps"
                    className={`flex items-center justify-center gap-1.5 text-sm font-bold py-3.5 rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/30'
                        : 'bg-zinc-900 hover:bg-[#0EA5E9] text-white'
                    }`}
                  >
                    Contratar <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            {/* Incluso em todos */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {['IPv4 + IPv6 dedicados', 'Anti-DDoS incluso', 'Deploy < 60s', 'SLA 99.9%', 'Suporte 24/7'].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                  <Check size={12} className="text-[#0EA5E9]" /> {f}
                </span>
              ))}
            </div>
            <Link
              href="/cloud-vps"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
            >
              Ver todos os {vpsPlans.length} planos <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FEATURES — 2 colunas
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-4">Por que a Hosteg?</p>
              <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight mb-6">
                Cada detalhe foi<br />projetado para<br />
                <span className="text-zinc-400 font-black not-italic">você não se preocupar.</span>
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-8">
                Infraestrutura enterprise acessível para startups, agências e e-commerces.
                NVMe, anti-DDoS e suporte real sem custo extra.
              </p>
              <Link
                href="/datacenter"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
              >
                Ver nossa infraestrutura <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-sm transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/[0.08] flex items-center justify-center mb-3">
                      <Icon size={16} className="text-[#0EA5E9]" />
                    </div>
                    <h3 className="text-sm font-black text-zinc-900 mb-1.5 leading-snug">{f.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DATACENTERS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">Infraestrutura</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3">Três datacenters, zero compromisso</h2>
            <p className="text-zinc-500 max-w-md mx-auto">Escolha a região mais próxima do seu público no momento do pedido.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                flag: '🇧🇷',
                city: 'São Paulo — Ascenty SP4',
                tier: 'Tier III',
                latency: '~20 ms BR',
                color: '#10B981',
                specs: ['Conectividade IX.br', 'Anti-DDoS camadas 3/4/7', 'NVMe até 7.000 MB/s', 'Redundância N+1'],
                desc: 'Datacenter Tier III certificado no coração de São Paulo. Peering direto com os maiores provedores do Brasil.',
              },
              {
                flag: '🇨🇦',
                city: 'Toronto — Canadá',
                tier: 'Tier III',
                latency: '~130 ms BR',
                color: '#0EA5E9',
                specs: ['Conectividade Cogent/GTT', 'Anti-DDoS incluso', 'NVMe até 7.000 MB/s', 'Redundância N+1'],
                desc: 'Localização estratégica na América do Norte para aplicações globais e audiências internacionais.',
              },
              {
                flag: '🇺🇸',
                city: 'Washington — EUA',
                tier: 'Tier III',
                latency: '~110 ms BR',
                color: '#8B5CF6',
                specs: ['Conectividade premium EUA', 'Anti-DDoS incluso', 'NVMe até 7.000 MB/s', 'Redundância N+1'],
                desc: 'Cobertura na costa leste dos EUA com excelente conectividade para o mercado americano e transatlântico.',
              },
            ].map((dc) => (
              <div key={dc.city} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                <div className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="text-4xl block mb-3">{dc.flag}</span>
                      <h3 className="text-lg font-black text-zinc-900">{dc.city}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5 font-medium">{dc.tier} · Certificado</p>
                    </div>
                    <span
                      className="text-xs font-black px-3 py-1.5 rounded-full border"
                      style={{ color: dc.color, borderColor: dc.color + '40', background: dc.color + '12' }}
                    >
                      Latência {dc.latency}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-5">{dc.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dc.specs.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                        <Check size={11} className="text-[#0EA5E9] flex-shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 px-7 py-4 bg-zinc-50">
                  <Link href="/datacenter" className="text-xs font-bold text-[#0EA5E9] hover:text-[#0284C7] flex items-center gap-1 transition-colors">
                    Ver certificações e specs completos <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DEPOIMENTOS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">Quem usa, recomenda</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="p-7 rounded-2xl border border-zinc-200 bg-white hover:shadow-md hover:border-zinc-300 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="text-sm font-black text-zinc-900">{t.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL — escuro
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden py-20 px-8 sm:px-16 text-center"
            style={{ background: 'linear-gradient(135deg, #020817 0%, #0c1929 100%)' }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,165,233,0.2) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#38BDF8] text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
                Ativo agora · +5.000 servidores em produção
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Comece em 60 segundos.
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-lg mx-auto">
                Sem contrato de fidelidade. Sem taxa de setup. Cancele quando quiser.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/cloud-vps"
                  className="inline-flex items-center gap-2.5 px-9 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl text-base transition-all shadow-2xl shadow-[#0EA5E9]/30"
                >
                  Escolher meu plano <ArrowRight size={17} />
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2.5 px-9 py-4 bg-white/[0.06] hover:bg-white/[0.10] text-white font-semibold rounded-xl text-base border border-white/[0.12] hover:border-white/20 transition-all"
                >
                  Falar com especialista
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Server,
  Globe,
  Cpu,
  HardDrive,
  Network,
  CheckCircle2,
  Star,
} from 'lucide-react'

const vpsHighlights = [
  {
    name: 'VPS Starter',
    ram: '2 GB',
    cpu: '2 vCPU',
    storage: '40 GB NVMe',
    bandwidth: '2 TB',
    price: 'R$ 39',
    period: '/mês',
    popular: false,
  },
  {
    name: 'VPS Basic',
    ram: '4 GB',
    cpu: '2 vCPU',
    storage: '80 GB NVMe',
    bandwidth: '4 TB',
    price: 'R$ 69',
    period: '/mês',
    popular: false,
  },
  {
    name: 'VPS Standard',
    ram: '8 GB',
    cpu: '4 vCPU',
    storage: '160 GB NVMe',
    bandwidth: '6 TB',
    price: 'R$ 119',
    period: '/mês',
    popular: true,
  },
  {
    name: 'VPS Advanced',
    ram: '16 GB',
    cpu: '6 vCPU',
    storage: '320 GB NVMe',
    bandwidth: '8 TB',
    price: 'R$ 219',
    period: '/mês',
    popular: false,
  },
]

const diferenciais = [
  {
    icon: Zap,
    title: 'NVMe de alta velocidade',
    desc: 'Discos NVMe Gen4 com até 7.000 MB/s de leitura. Zero gargalo de I/O.',
  },
  {
    icon: Shield,
    title: 'Anti-DDoS incluso',
    desc: 'Proteção automática contra ataques DDoS em todos os planos, sem custo adicional.',
  },
  {
    icon: Clock,
    title: 'Uptime 99.9% garantido',
    desc: 'SLA de 99.9% com infraestrutura redundante nos dois datacenters.',
  },
  {
    icon: Server,
    title: 'Suporte 24/7',
    desc: 'Time técnico brasileiro disponível a qualquer hora.',
  },
  {
    icon: Network,
    title: 'Rede 10 Gbps',
    desc: 'Uplink de 10 Gbps com baixa latência para o Brasil e América Latina.',
  },
  {
    icon: Globe,
    title: 'Dois datacenters',
    desc: 'São Paulo (Ascenty SP4) e Canadá — escolha a região ideal.',
  },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Suporte' },
  { value: '10 Gbps', label: 'Rede' },
  { value: '< 1ms', label: 'Latência SP' },
]

export default async function HomePage() {
  const hero = await getHero('home', {
    badge:    'NVMe · Anti-DDoS · Suporte 24/7',
    title:    'Cloud VPS que você confia.',
    subtitle: 'Vem ser feliz na Hosteg!',
    desc:     'Infraestrutura cloud de alta performance com NVMe, anti-DDoS e suporte técnico brasileiro 24/7. Do VPS ao Bare-Metal, temos o servidor ideal para você.',
  })
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9 0%, transparent 70%)' }}
          />
          <div className="grid-pattern absolute inset-0 opacity-100" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/25 bg-[#0EA5E9]/6 text-[#0284C7] text-xs font-semibold">
            <Star size={11} fill="currentColor" />
            {hero.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-zinc-900">
            {hero.title}
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-500 font-medium mb-3">
            {hero.subtitle}
          </p>

          <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl text-base transition-all duration-150 shadow-md shadow-[#0EA5E9]/25"
            >
              Ver planos VPS <ArrowRight size={16} />
            </Link>
            <Link
              href="/bare-metal"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold rounded-xl text-base border border-zinc-200 hover:border-zinc-300 transition-all duration-150"
            >
              Bare-Metal <Server size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VPS PLANS HIGHLIGHT ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#0284C7] text-sm font-semibold uppercase tracking-widest mb-3">
              Cloud VPS NVMe
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 mb-4">
              Performance sem compromisso
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Planos com NVMe Gen4, IPv4/IPv6 dedicado e painel de controle completo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {vpsHighlights.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border transition-all duration-200 group ${
                  plan.popular
                    ? 'border-[#0EA5E9] bg-white shadow-lg shadow-[#0EA5E9]/10 ring-1 ring-[#0EA5E9]/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0EA5E9] text-white text-xs font-bold rounded-full">
                    Mais Popular
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-zinc-400 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-zinc-900">{plan.price}</span>
                    <span className="text-zinc-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {[
                    { icon: HardDrive, text: plan.ram + ' RAM' },
                    { icon: Cpu, text: plan.cpu },
                    { icon: Zap, text: plan.storage },
                    { icon: Network, text: plan.bandwidth + ' tráfego' },
                  ].map((spec) => {
                    const Icon = spec.icon
                    return (
                      <li key={spec.text} className="flex items-center gap-2.5 text-sm text-zinc-600">
                        <Icon size={13} className="text-zinc-400 flex-shrink-0" />
                        {spec.text}
                      </li>
                    )
                  })}
                </ul>
                <Link
                  href="/cloud-vps"
                  className={`block text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-150 ${
                    plan.popular
                      ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  Contratar
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Ver todos os 10 planos VPS <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BARE METAL CALLOUT ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 overflow-hidden relative">
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-500">
                  <Cpu size={11} /> Bare-Metal Dedicado
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4 leading-tight">
                  Máximo poder de processamento
                </h2>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  Servidores dedicados com processadores Intel Xeon E5 e Gold. Sem compartilhamento
                  de recursos — 100% do hardware é seu.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Dual Xeon E5-2680', 'Dual Xeon Gold 6140', 'DDR4 ECC', 'RAID NVMe', '10 Gbps'].map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 bg-white text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/bare-metal"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Ver configurações <ArrowRight size={15} />
                </Link>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {[
                  { label: 'Processadores', value: '2× Xeon' },
                  { label: 'RAM', value: 'até 512 GB' },
                  { label: 'Armazenamento', value: 'NVMe + SSD' },
                  { label: 'Rede', value: '10 Gbps' },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
                    <div className="text-base font-bold text-zinc-900">{spec.value}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{spec.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─── */}
      <section className="py-24 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#0284C7] text-sm font-semibold uppercase tracking-widest mb-3">
              Por que a Hosteg?
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 mb-4">
              Infraestrutura que faz diferença
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Cada detalhe foi pensado para garantir a melhor experiência.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diferenciais.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/8 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── DATACENTER HIGHLIGHT ─── */}
      <section className="py-16 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                flag: '🇧🇷',
                city: 'São Paulo',
                dc: 'Ascenty SP4',
                latency: '< 1ms para SP',
                tags: ['Anti-DDoS', 'Redundante', 'NVMe'],
                desc: 'Datacenter Tier III certificado em São Paulo, com conectividade premium à IX.br.',
              },
              {
                flag: '🇨🇦',
                city: 'Canadá',
                dc: 'Montreal',
                latency: '< 5ms para NA',
                tags: ['Anti-DDoS', 'Redundante', '10 Gbps'],
                desc: 'Localização estratégica na América do Norte para aplicações globais.',
              },
            ].map((loc) => (
              <div
                key={loc.city}
                className="p-8 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-3xl mb-2 block">{loc.flag}</span>
                    <h3 className="text-xl font-bold text-zinc-900">{loc.city}</h3>
                    <p className="text-sm text-zinc-400">{loc.dc}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
                    {loc.latency}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{loc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {loc.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-zinc-900 p-12 sm:p-16 overflow-hidden relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center top, rgba(14,165,233,0.15) 0%, transparent 60%)' }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle2 size={14} className="text-[#0EA5E9]" />
                <CheckCircle2 size={14} className="text-[#0EA5E9]" />
                <CheckCircle2 size={14} className="text-[#0EA5E9]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Pronto para começar?
              </h2>
              <p className="text-xl text-zinc-300 mb-3">
                Vem ser feliz na Hosteg!
              </p>
              <p className="text-zinc-400 mb-10 max-w-lg mx-auto">
                Ative seu servidor em minutos. Sem contrato de fidelidade. Cancele quando quiser.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/cloud-vps"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-base transition-all shadow-xl shadow-[#0EA5E9]/25"
                >
                  Começar agora <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl text-base border border-white/15 transition-all"
                >
                  Falar com suporte
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

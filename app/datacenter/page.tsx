import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Network, Zap, Globe, Lock, Server, Building2, CheckCircle2 } from 'lucide-react'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Datacenter — Infraestrutura',
  description: 'Infraestrutura de alto nível em São Paulo, Toronto e Washington. Anti-DDoS, NVMe até 7.000 MB/s, rede 10 Gbps e Tier III certificado.',
}

const locations = [
  {
    flag: '🇧🇷',
    country: 'Brasil',
    city: 'São Paulo',
    facility: 'Ascenty SP4',
    tier: 'Tier III',
    latency: '~20ms BR',
    uptime: '99.995%',
    power: 'Redundante 2N',
    cooling: 'CRAH N+1',
    network: '10 Gbps uplink',
    certifications: ['Tier III', 'ISO 27001', 'PCI-DSS'],
    specs: [
      'Conectividade direta ao IX.br',
      'Múltiplos provedores de uplink',
      'Energia com 2 feeds independentes',
      'Refrigeração de precisão',
      'Acesso físico com biometria',
      'Câmeras 24/7',
    ],
    desc: 'O Ascenty SP4 é um dos datacenters mais modernos do Brasil, certificado Tier III, localizado em Hortolandia/SP com conexão premium à Internet brasileira.',
  },
  {
    flag: '🇨🇦',
    country: 'Canadá',
    city: 'Toronto',
    facility: 'Toronto DC',
    tier: 'Tier III',
    latency: '~130ms BR',
    uptime: '99.99%',
    power: 'Redundante N+1',
    cooling: 'Precision cooling',
    network: '10 Gbps uplink',
    certifications: ['Tier III', 'ISO 27001'],
    specs: [
      'Conectividade ao backbone Norte-Americano',
      'Baixa latência para EUA e Europa',
      'Energia limpa e renovável',
      'Refrigeração de alta precisão',
      'Acesso físico com biometria',
      'Monitoramento 24/7',
    ],
    desc: 'Toronto oferece excelente conectividade com EUA e Europa, localização estratégica na América do Norte para aplicações globais com baixa latência transatlântica.',
  },
  {
    flag: '🇺🇸',
    country: 'Estados Unidos',
    city: 'Washington',
    facility: 'Washington DC',
    tier: 'Tier III',
    latency: '~110ms BR',
    uptime: '99.99%',
    power: 'Redundante N+1',
    cooling: 'Precision cooling',
    network: '10 Gbps uplink',
    certifications: ['Tier III', 'ISO 27001'],
    specs: [
      'Conectividade premium na costa leste dos EUA',
      'Proximidade com grandes data hubs americanos',
      'Múltiplos provedores de trânsito',
      'Redundância de fibra N+1',
      'Acesso físico com biometria',
      'Monitoramento 24/7',
    ],
    desc: 'Washington oferece cobertura premium na costa leste dos EUA com excelente conectividade para o mercado americano e para rotas transatlânticas.',
  },
]

const technologies = [
  {
    icon: Shield,
    title: 'Anti-DDoS Avançado',
    desc: 'Mitigação automática de ataques volumétricos com até 1 Tbps de capacidade de absorção. Proteção em camadas 3, 4 e 7.',
  },
  {
    icon: Zap,
    title: 'NVMe — até 7.000 MB/s',
    desc: 'Storage NVMe de alta performance com velocidades de até 7.000 MB/s de leitura sequencial. Latência abaixo de 0.1ms.',
  },
  {
    icon: Network,
    title: 'Rede 10 Gbps',
    desc: 'Uplink de 10 Gbps por servidor com múltiplos provedores de trânsito para máxima disponibilidade e baixa latência.',
  },
  {
    icon: Lock,
    title: 'Segurança física',
    desc: 'Acesso com biometria, cartão RFID, câmeras em todos os corredores e equipe de segurança 24/7.',
  },
  {
    icon: Globe,
    title: 'IPv4 + IPv6',
    desc: 'Stack dual IPv4/IPv6 com BGP dedicado. Endereços IP de blocos próprios com roteamento otimizado.',
  },
  {
    icon: Server,
    title: 'Hardware premium',
    desc: 'Servidores Dell e Supermicro com processadores Intel Xeon de última geração e memória ECC registrada.',
  },
]

export default async function DatacenterPage() {
  const hero = await getHero('datacenter', {
    badge:    'Infraestrutura',
    title:    'Datacenter',
    subtitle: 'Infraestrutura de nível enterprise no Brasil, Canadá e EUA.',
    desc:     'Tier III certificado, anti-DDoS, NVMe até 7.000 MB/s e rede 10 Gbps.',
  })
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <Building2 size={11} /> Infraestrutura
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4">{hero.title}</h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-3">
            {hero.subtitle}
          </p>
          <p className="text-zinc-500 max-w-lg mx-auto">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* Locations */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.city}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden"
              >
                <div className="p-8 border-b border-zinc-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-4xl mb-3 block">{loc.flag}</span>
                      <h2 className="text-2xl font-black text-zinc-900">{loc.city}</h2>
                      <p className="text-zinc-500 text-sm">{loc.facility} • {loc.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-bold mb-2">
                        {loc.tier}
                      </span>
                      <div className="text-xs text-zinc-500">{loc.latency}</div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-5">{loc.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Uptime SLA', loc.uptime],
                      ['Rede', loc.network],
                      ['Energia', loc.power],
                      ['Latência', loc.latency],
                    ].map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl bg-zinc-50 border border-white/[0.05] text-center">
                        <div className="text-sm font-bold text-zinc-900">{v}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Características</p>
                  <ul className="space-y-2">
                    {loc.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2.5 text-sm text-zinc-700">
                        <CheckCircle2 size={13} className="text-[#0EA5E9] flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {loc.certifications.map((cert) => (
                      <span key={cert} className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tecnologias que usamos</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Cada camada da infraestrutura foi escolhida para garantir performance e confiabilidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.title}
                  className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{tech.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{tech.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

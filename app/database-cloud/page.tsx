import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Database, ShieldCheck, Lightning, HardDrives, ArrowsClockwise, CheckCircle, ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Database Cloud — MySQL, PostgreSQL, MongoDB, SQL Server',
  description: 'Banco de dados gerenciado na nuvem: MySQL, PostgreSQL, MongoDB e SQL Server. Alta disponibilidade, backups automáticos e escalabilidade.',
}

const databases = [
  {
    name: 'MySQL',
    version: '8.x',
    color: '#4479A1',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    logo: 'https://cdn.simpleicons.org/mysql/4479A1',
    desc: 'O banco de dados open-source mais popular do mundo. Ideal para aplicações web, WordPress, e-commerce e sistemas legados.',
    plans: [
      { name: 'MySQL Starter',    fallbackPrice: 49,  ram: '1 GB',  cpu: '1 vCPU', storage: '20 GB SSD',   connections: '100',        backups: 'Diário' },
      { name: 'MySQL Business',   fallbackPrice: 99,  ram: '2 GB',  cpu: '2 vCPU', storage: '50 GB NVMe',  connections: '300',        backups: 'Diário' },
      { name: 'MySQL Pro',        fallbackPrice: 189, ram: '4 GB',  cpu: '4 vCPU', storage: '100 GB NVMe', connections: '1.000',      backups: 'Diário + Semanal' },
      { name: 'MySQL Enterprise', fallbackPrice: 349, ram: '8 GB',  cpu: '8 vCPU', storage: '250 GB NVMe', connections: 'Ilimitadas', backups: 'Horário' },
    ],
  },
  {
    name: 'PostgreSQL',
    version: '16.x',
    color: '#336791',
    bg: '#EEF4FF',
    border: '#BFD4F7',
    logo: 'https://cdn.simpleicons.org/postgresql/336791',
    desc: 'O banco relacional mais avançado do open-source. ACID compliant, suporte a JSON, extensões e performance superior para dados complexos.',
    plans: [
      { name: 'PG Starter',    fallbackPrice: 59,  ram: '1 GB',  cpu: '1 vCPU', storage: '20 GB SSD',   connections: '100',        backups: 'Diário' },
      { name: 'PG Business',   fallbackPrice: 119, ram: '2 GB',  cpu: '2 vCPU', storage: '50 GB NVMe',  connections: '300',        backups: 'Diário' },
      { name: 'PG Pro',        fallbackPrice: 219, ram: '4 GB',  cpu: '4 vCPU', storage: '100 GB NVMe', connections: '1.000',      backups: 'Diário + Semanal' },
      { name: 'PG Enterprise', fallbackPrice: 399, ram: '8 GB',  cpu: '8 vCPU', storage: '250 GB NVMe', connections: 'Ilimitadas', backups: 'Horário' },
    ],
  },
  {
    name: 'MongoDB',
    version: '7.x',
    color: '#47A248',
    bg: '#F0FFF4',
    border: '#9AE6B4',
    logo: 'https://cdn.simpleicons.org/mongodb/47A248',
    desc: 'O banco NoSQL líder de mercado. Perfeito para dados não estruturados, APIs REST, aplicações mobile e análises em tempo real.',
    plans: [
      { name: 'Mongo Starter',    fallbackPrice: 59,  ram: '1 GB',  cpu: '1 vCPU', storage: '20 GB SSD',   connections: '100',        backups: 'Diário' },
      { name: 'Mongo Business',   fallbackPrice: 119, ram: '2 GB',  cpu: '2 vCPU', storage: '50 GB NVMe',  connections: '300',        backups: 'Diário' },
      { name: 'Mongo Pro',        fallbackPrice: 219, ram: '4 GB',  cpu: '4 vCPU', storage: '100 GB NVMe', connections: '1.000',      backups: 'Diário + Semanal' },
      { name: 'Mongo Enterprise', fallbackPrice: 399, ram: '8 GB',  cpu: '8 vCPU', storage: '250 GB NVMe', connections: 'Ilimitadas', backups: 'Horário' },
    ],
  },
  {
    name: 'SQL Server',
    version: '2022',
    color: '#CC2222',
    bg: '#FFF5F5',
    border: '#FED7D7',
    logo: 'https://cdn.simpleicons.org/microsoftsqlserver/CC2222',
    desc: 'O banco corporativo da Microsoft. Para empresas que precisam de suporte Windows, integração com .NET e sistemas legados Microsoft.',
    plans: [
      { name: 'SQL Starter',    fallbackPrice: 149, ram: '2 GB',  cpu: '2 vCPU', storage: '50 GB SSD',   connections: '50',         backups: 'Diário' },
      { name: 'SQL Business',   fallbackPrice: 279, ram: '4 GB',  cpu: '4 vCPU', storage: '100 GB NVMe', connections: '200',        backups: 'Diário' },
      { name: 'SQL Pro',        fallbackPrice: 499, ram: '8 GB',  cpu: '6 vCPU', storage: '250 GB NVMe', connections: '500',        backups: 'Diário + Semanal' },
      { name: 'SQL Enterprise', fallbackPrice: 899, ram: '16 GB', cpu: '8 vCPU', storage: '500 GB NVMe', connections: 'Ilimitadas', backups: 'Horário' },
    ],
  },
]

const features = [
  { icon: ShieldCheck,     title: 'Backups automáticos',    desc: 'Backups diários inclusos em todos os planos, com retenção de 7 dias. Planos Pro e Enterprise têm backups mais frequentes.' },
  { icon: Lightning,       title: 'Alta performance NVMe',  desc: 'Planos Business em diante usam NVMe Enterprise com IOPS extremamente alto para consultas e escritas rápidas.' },
  { icon: HardDrives,      title: 'Acesso remoto seguro',   desc: 'Conecte seu app ao banco via endereço IP dedicado com autenticação SSL/TLS. Porta configurada e firewall incluso.' },
  { icon: ArrowsClockwise, title: 'Escalabilidade fácil',   desc: 'Faça upgrade de plano sem migração manual de dados. Nosso time cuida de tudo com tempo mínimo de downtime.' },
  { icon: Database,        title: 'Monitoramento 24/7',     desc: 'Monitoramos disk I/O, conexões ativas, queries lentas e performance em tempo real com alertas proativos.' },
  { icon: CheckCircle,     title: 'SLA 99,9% garantido',    desc: 'Disponibilidade garantida em contrato com créditos automáticos em caso de violação do SLA.' },
]

export default async function DatabaseCloudPage() {
  const [{ plans }, hero] = await Promise.all([
    fetchBillingPlans('database-cloud'),
    getHero('database-cloud', {
      badge:    'Corporativo',
      title:    'Database Cloud',
      subtitle: 'MySQL, PostgreSQL, MongoDB e SQL Server gerenciados na nuvem.',
      desc:     'Backups automáticos, alta disponibilidade e suporte 24/7 para seus bancos de dados.',
    }),
  ])

  // Build price map from DB plans: { "MySQL Starter": 49, ... }
  const priceMap: Record<string, number> = {}
  for (const p of plans) {
    if (p.monthlyPrice) priceMap[p.name] = p.monthlyPrice
  }

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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
            <Database size={12} weight="fill" /> Corporativo
          </div>

          {/* DB logos row */}
          <div className="flex items-center justify-center gap-5 mb-6">
            {databases.map((db) => (
              <div key={db.name} className="flex flex-col items-center gap-1.5">
                <img
                  src={db.logo}
                  alt={db.name}
                  width={36}
                  height={36}
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
                />
                <span className="text-[10px] font-semibold text-zinc-500">{db.name}</span>
              </div>
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            {hero.subtitle}
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* Per-database plan tables */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {databases.map((db) => (
            <div key={db.name} className="rounded-2xl border overflow-hidden" style={{ borderColor: db.border }}>
              {/* DB header */}
              <div className="flex items-center gap-4 px-6 py-5" style={{ background: db.bg }}>
                <img src={db.logo} alt={db.name} width={40} height={40}
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))' }} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-zinc-900">{db.name}</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ background: db.color }}>
                      v{db.version}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5 max-w-xl">{db.desc}</p>
                </div>
              </div>

              {/* Plans table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="text-left px-6 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Plano</th>
                      <th className="text-center px-4 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">RAM</th>
                      <th className="text-center px-4 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">CPU</th>
                      <th className="text-center px-4 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Storage</th>
                      <th className="text-center px-4 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Conexões</th>
                      <th className="text-center px-4 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Backups</th>
                      <th className="text-right px-6 py-3 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Preço/mês</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {db.plans.map((plan, i) => {
                      const price = priceMap[plan.name] ?? plan.fallbackPrice
                      const isLast = db.name === 'MySQL' && plan.name.includes('Enterprise')
                      return (
                        <tr key={plan.name} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-zinc-900">{plan.name}</span>
                            {i === db.plans.length - 1 && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Enterprise</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center text-zinc-700 font-medium">{plan.ram}</td>
                          <td className="px-4 py-4 text-center text-zinc-700">{plan.cpu}</td>
                          <td className="px-4 py-4 text-center text-zinc-700">{plan.storage}</td>
                          <td className="px-4 py-4 text-center text-zinc-700">{plan.connections}</td>
                          <td className="px-4 py-4 text-center text-zinc-500 text-xs">{plan.backups}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-xs text-zinc-400">R$</span>
                              <span className="text-lg font-black text-zinc-900">{price}</span>
                              <span className="text-xs text-zinc-400">/mês</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* DB footer CTA */}
              <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Todos os planos incluem SSL/TLS, IP dedicado, monitoramento e suporte 24/7</span>
                <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                  style={{ background: db.color }}>
                  Contratar {db.name} <ArrowRight size={12} weight="bold" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Todos os bancos incluem</h2>
            <p className="text-zinc-500">Infraestrutura gerenciada para você focar no que importa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Precisa de mais poder?</h2>
          <p className="text-zinc-500 mb-8">Para cargas críticas, recomendamos um VPS dedicado com banco de dados isolado.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cloud-vps"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Ver Cloud VPS <ArrowRight size={15} weight="bold" />
            </Link>
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Falar com especialista
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle2, AlertCircle, Clock, Activity, Server, Globe, Shield, Database, Wifi, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Status — Disponibilidade dos Serviços',
  description: 'Acompanhe em tempo real a disponibilidade e o desempenho dos serviços Hosteg.',
}

const services = [
  {
    category: 'Infraestrutura',
    items: [
      { name: 'Cloud VPS — São Paulo',       icon: Server,   status: 'operational', latency: '20ms'  },
      { name: 'Cloud VPS — Toronto',         icon: Server,   status: 'operational', latency: '130ms' },
      { name: 'Cloud VPS — Washington',      icon: Server,   status: 'operational', latency: '110ms' },
      { name: 'Bare-Metal Dedicado',         icon: Zap,      status: 'operational', latency: '—'     },
    ],
  },
  {
    category: 'Hospedagem',
    items: [
      { name: 'Hospedagem Web / cPanel',     icon: Globe,    status: 'operational', latency: '—' },
      { name: 'Hospedagem PRO / LiteSpeed',  icon: Globe,    status: 'operational', latency: '—' },
      { name: 'WordPress Hosting',           icon: Globe,    status: 'operational', latency: '—' },
      { name: 'Hospedagem ASP.NET / Plesk',  icon: Globe,    status: 'operational', latency: '—' },
    ],
  },
  {
    category: 'Rede & Segurança',
    items: [
      { name: 'Rede 10 Gbps — SP',           icon: Wifi,     status: 'operational', latency: '—' },
      { name: 'Anti-DDoS Layer 3/4/7',       icon: Shield,   status: 'operational', latency: '—' },
      { name: 'DNS Autoritativo',             icon: Globe,    status: 'operational', latency: '—' },
    ],
  },
  {
    category: 'Plataforma & APIs',
    items: [
      { name: 'Painel do Cliente',            icon: Activity, status: 'operational', latency: '—' },
      { name: 'API de Provisionamento',       icon: Database, status: 'operational', latency: '—' },
      { name: 'BackupPRO / Acronis',          icon: Database, status: 'operational', latency: '—' },
    ],
  },
]

const history = [
  { date: '16 Jun 2026', event: 'Sem incidentes', type: 'ok' },
  { date: '15 Jun 2026', event: 'Sem incidentes', type: 'ok' },
  { date: '14 Jun 2026', event: 'Sem incidentes', type: 'ok' },
  { date: '13 Jun 2026', event: 'Sem incidentes', type: 'ok' },
  { date: '12 Jun 2026', event: 'Sem incidentes', type: 'ok' },
  { date: '11 Jun 2026', event: 'Manutenção planejada: atualização de rede em SP — concluída às 03:40', type: 'maintenance' },
  { date: '10 Jun 2026', event: 'Sem incidentes', type: 'ok' },
]

const statusConfig = {
  operational:  { label: 'Operacional',  color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  degraded:     { label: 'Degradado',    color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
  outage:       { label: 'Indisponível', color: '#EF4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'     },
  maintenance:  { label: 'Manutenção',   color: '#6366F1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700'  },
}

export default function StatusPage() {
  const allOperational = services.every(s => s.items.every(i => i.status === 'operational'))

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #10B981, transparent 70%)' }}
          />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <Activity size={11} /> Status dos Serviços
          </div>

          {allOperational ? (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-900">Todos os sistemas operacionais</h1>
              </div>
              <p className="text-zinc-500 text-lg max-w-lg mx-auto">
                Nenhum incidente ativo. Todos os serviços funcionando normalmente.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-900">Incidente em andamento</h1>
              </div>
              <p className="text-zinc-500 text-lg max-w-lg mx-auto">
                Estamos trabalhando para restaurar o serviço. Atualizações em tempo real abaixo.
              </p>
            </>
          )}

          {/* Uptime pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { label: 'Uptime 30 dias', value: '99.98%', color: 'emerald' },
              { label: 'Uptime 90 dias', value: '99.96%', color: 'emerald' },
              { label: 'Incidentes ativos', value: '0', color: 'emerald' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-sm text-zinc-500 font-medium">{m.label}</span>
                <span className="text-sm font-black text-zinc-900">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {services.map((group) => (
            <div key={group.category} className="rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                <h2 className="text-sm font-black text-zinc-700 uppercase tracking-wider">{group.category}</h2>
              </div>
              <div className="divide-y divide-zinc-100">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const cfg = statusConfig[item.status as keyof typeof statusConfig]
                  return (
                    <div key={item.name} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={15} className="text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">{item.name}</p>
                          {item.latency !== '—' && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              <Clock size={10} className="inline mr-1" />
                              Latência média BR: {item.latency}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                        {cfg.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incident history */}
      <section className="py-16 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-8">Histórico de incidentes</h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.date} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {h.type === 'ok' ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : h.type === 'maintenance' ? (
                    <AlertCircle size={16} className="text-indigo-500" />
                  ) : (
                    <AlertCircle size={16} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-0.5">{h.date}</p>
                  <p className="text-sm text-zinc-700">{h.event}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Para suporte urgente, entre em contato com nosso time técnico 24/7 pelo{' '}
            <a href="/contato" className="text-[#0EA5E9] hover:underline font-semibold">painel de suporte</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

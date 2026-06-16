import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  CheckCircle2, AlertCircle, Clock, Activity,
  Server, Globe, Shield, Database, Wifi, Zap, Monitor,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Status — Disponibilidade dos Serviços',
  description: 'Acompanhe em tempo real a disponibilidade e o desempenho dos serviços Hosteg.',
}

// ── ícones por nome armazenado no banco ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  server:   Server,
  zap:      Zap,
  globe:    Globe,
  shield:   Shield,
  database: Database,
  wifi:     Wifi,
  activity: Activity,
  monitor:  Monitor,
}

// ── configuração visual de status ────────────────────────────────────────────
const statusConfig = {
  operational: { label: 'Operacional',  color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  degraded:    { label: 'Degradado',    color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
  outage:      { label: 'Indisponível', color: '#EF4444', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'     },
  maintenance: { label: 'Manutenção',   color: '#6366F1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700'  },
}

// ── helpers de data ───────────────────────────────────────────────────────────
/** Retorna os últimos N dias como strings YYYY-MM-DD (hoje primeiro) */
function getLastNDays(n: number): string[] {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    return d.toISOString().split('T')[0]
  })
}

/** Formata YYYY-MM-DD → "16 jun 2026" */
function fmtDate(dateStr: string): string {
  // Adiciona T12:00:00 para evitar problemas de fuso horário
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── componente principal ──────────────────────────────────────────────────────
export default async function StatusPage() {
  const supabase = createClient()

  // Categorias + serviços aninhados
  const { data: categories } = await supabase
    .from('status_categories')
    .select('*, status_services(*)')
    .order('order_index')

  // Janelas de datas
  const days7  = getLastNDays(7)
  const days30 = getLastNDays(30)
  const days90 = getLastNDays(90)

  // Incidentes dos últimos 7 dias (para o histórico)
  const { data: recentIncidents } = await supabase
    .from('status_incidents')
    .select('*')
    .gte('incident_date', days7[days7.length - 1])
    .order('incident_date', { ascending: false })

  // Contagem de incidentes reais (tipo 'incident') para uptime
  const { count: count30 } = await supabase
    .from('status_incidents')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'incident')
    .gte('incident_date', days30[days30.length - 1])

  const { count: count90 } = await supabase
    .from('status_incidents')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'incident')
    .gte('incident_date', days90[days90.length - 1])

  // Uptime override (manual) do admin
  const { data: uptimeRows } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['status_uptime_30d', 'status_uptime_90d'])
  const uptimeMap = Object.fromEntries((uptimeRows ?? []).map((r: any) => [r.key, r.value]))

  // Usa override se definido, senão calcula automaticamente
  const uptime30 = uptimeMap['status_uptime_30d']?.trim() || (Math.max(99.99 - (count30 ?? 0) * 0.1, 99.0).toFixed(2) + '%')
  const uptime90 = uptimeMap['status_uptime_90d']?.trim() || (Math.max(99.99 - (count90 ?? 0) * 0.1, 99.0).toFixed(2) + '%')

  // Número de incidentes ativos hoje
  const today = days7[0]
  const activeCount = (recentIncidents ?? []).filter(
    (i) => i.type === 'incident' && i.incident_date === today
  ).length

  // Status global
  const allOperational =
    (categories ?? []).every((cat) =>
      ((cat.status_services ?? []) as Array<{ status: string }>).every(
        (s) => s.status === 'operational'
      )
    )

  // Mapa de incidentes por data (para o histórico)
  const incidentsByDate: Record<string, typeof recentIncidents> = {}
  for (const d of days7) incidentsByDate[d] = []
  for (const inc of recentIncidents ?? []) {
    const key = inc.incident_date as string
    if (incidentsByDate[key]) incidentsByDate[key]!.push(inc)
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
            style={{ background: `radial-gradient(ellipse, ${allOperational ? '#10B981' : '#F59E0B'}, transparent 70%)` }}
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
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-900">
                  Todos os sistemas operacionais
                </h1>
              </div>
              <p className="text-zinc-500 text-lg max-w-lg mx-auto">
                Nenhum incidente ativo. Todos os serviços funcionando normalmente.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-900">
                  Incidente em andamento
                </h1>
              </div>
              <p className="text-zinc-500 text-lg max-w-lg mx-auto">
                Estamos trabalhando para restaurar o serviço. Atualizações em tempo real abaixo.
              </p>
            </>
          )}

          {/* Pills de uptime */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { label: 'Uptime 30 dias', value: uptime30 },
              { label: 'Uptime 90 dias', value: uptime90 },
              { label: 'Incidentes ativos', value: String(activeCount) },
            ].map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50"
              >
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-sm text-zinc-500 font-medium">{m.label}</span>
                <span className="text-sm font-black text-zinc-900">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serviços ─────────────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {(categories ?? []).map((cat) => {
            const services = ([...(cat.status_services ?? [])] as Array<{
              id: string; name: string; icon_name: string; status: string; latency_br: string; order_index: number
            }>).sort((a, b) => a.order_index - b.order_index)

            return (
              <div key={cat.id} className="rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                  <h2 className="text-sm font-black text-zinc-700 uppercase tracking-wider">
                    {cat.name}
                  </h2>
                </div>
                <div className="divide-y divide-zinc-100">
                  {services.map((svc) => {
                    const Icon = iconMap[svc.icon_name] ?? Server
                    const cfg  = statusConfig[svc.status as keyof typeof statusConfig] ?? statusConfig.operational
                    return (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <Icon size={15} className="text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-800">{svc.name}</p>
                            {svc.latency_br && svc.latency_br !== '—' && (
                              <p className="text-xs text-zinc-400 mt-0.5">
                                <Clock size={10} className="inline mr-1" />
                                Latência média BR: {svc.latency_br}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                          {cfg.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Histórico de incidentes ───────────────────────────────────────── */}
      <section className="py-16 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-8">Histórico de incidentes</h2>
          <div className="space-y-3">
            {days7.map((dateStr) => {
              const dayIncidents = incidentsByDate[dateStr] ?? []
              // Se não há registros no banco para esse dia, exibe "Sem incidentes"
              const hasOk = dayIncidents.some((i) => i.type === 'ok')
              const hasMaintenance = dayIncidents.some((i) => i.type === 'maintenance')
              const hasIncident = dayIncidents.some((i) => i.type === 'incident')

              // Texto a exibir
              const eventLines: { text: string; type: string }[] =
                dayIncidents.length === 0
                  ? [{ text: 'Sem incidentes', type: 'ok' }]
                  : dayIncidents
                      .filter((i) => i.type !== 'ok')
                      .map((i) => ({ text: i.title, type: i.type }))
                      .concat(
                        // se só tem 'ok', mostra isso
                        dayIncidents.every((i) => i.type === 'ok')
                          ? [{ text: 'Sem incidentes', type: 'ok' }]
                          : []
                      )

              const displayType = hasIncident ? 'incident' : hasMaintenance ? 'maintenance' : 'ok'
              const displayText =
                dayIncidents.length === 0 || dayIncidents.every((i) => i.type === 'ok')
                  ? 'Sem incidentes'
                  : dayIncidents
                      .filter((i) => i.type !== 'ok')
                      .map((i) => i.title)
                      .join(' · ')

              return (
                <div
                  key={dateStr}
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {displayType === 'ok' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : displayType === 'maintenance' ? (
                      <AlertCircle size={16} className="text-indigo-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-0.5">
                      {fmtDate(dateStr)}
                    </p>
                    <p className="text-sm text-zinc-700">{displayText}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Para suporte urgente, entre em contato com nosso time técnico 24/7 pelo{' '}
            <a href="/contato" className="text-[#0EA5E9] hover:underline font-semibold">
              painel de suporte
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Server, ExternalLink, TrendingUp } from 'lucide-react'
import { ConfirmDeleteButton } from '@/app/admin/_components/ConfirmDeleteButton'

export const dynamic = 'force-dynamic'

// ── Server Actions ────────────────────────────────────────────────────────────

async function saveUptimeSettings(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const uptime_30d  = (formData.get('uptime_30d') as string).trim()
  const uptime_90d  = (formData.get('uptime_90d') as string).trim()
  const now         = new Date().toISOString()
  await supabase.from('site_settings').upsert([
    { key: 'status_uptime_30d', value: uptime_30d, section: 'status', label: 'Uptime 30 dias', updated_at: now },
    { key: 'status_uptime_90d', value: uptime_90d, section: 'status', label: 'Uptime 90 dias', updated_at: now },
  ], { onConflict: 'key' })
  revalidatePath('/admin/status/services')
  revalidatePath('/status')
  redirect('/admin/status/services?saved=1')
}

async function updateServiceStatus(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id     = formData.get('id') as string
  const status = formData.get('status') as string
  await supabase
    .from('status_services')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/status/services')
  revalidatePath('/status')
  redirect('/admin/status/services?saved=1')
}

async function addService(formData: FormData) {
  'use server'
  const supabase    = createClient()
  const name        = formData.get('name') as string
  const category_id = formData.get('category_id') as string
  const icon_name   = formData.get('icon_name') as string
  const latency_br  = (formData.get('latency_br') as string) || '—'
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!name || !category_id) return
  await supabase.from('status_services').insert({ name, category_id, icon_name, latency_br, order_index })
  revalidatePath('/admin/status/services')
  revalidatePath('/status')
  redirect('/admin/status/services?saved=1')
}

async function deleteService(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('status_services').delete().eq('id', id)
  revalidatePath('/admin/status/services')
  revalidatePath('/status')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusOptions = [
  { value: 'operational', label: 'Operacional',  dot: 'bg-emerald-500' },
  { value: 'degraded',    label: 'Degradado',    dot: 'bg-amber-500'   },
  { value: 'outage',      label: 'Indisponível', dot: 'bg-red-500'     },
  { value: 'maintenance', label: 'Manutenção',   dot: 'bg-indigo-500'  },
]

const statusBadge: Record<string, string> = {
  operational: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  degraded:    'bg-amber-500/10   text-amber-400   border-amber-500/20',
  outage:      'bg-red-500/10     text-red-400     border-red-500/20',
  maintenance: 'bg-indigo-500/10  text-indigo-400  border-indigo-500/20',
}

const statusLabel: Record<string, string> = {
  operational: 'Operacional',
  degraded:    'Degradado',
  outage:      'Indisponível',
  maintenance: 'Manutenção',
}

const iconOptions = [
  'server','globe','shield','database','wifi','zap','monitor','activity',
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminServicesPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('status_categories')
    .select('id, name, order_index, status_services(id, name, icon_name, status, latency_br, order_index)')
    .order('order_index')

  // Uptime settings (manual override)
  const { data: uptimeRows } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['status_uptime_30d', 'status_uptime_90d'])
  const uptimeMap = Object.fromEntries((uptimeRows ?? []).map((r: any) => [r.key, r.value]))
  const uptime30val = uptimeMap['status_uptime_30d'] ?? ''
  const uptime90val = uptimeMap['status_uptime_90d'] ?? ''

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Serviços</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Gerencie o status de cada serviço exibido na Status Page
          </p>
        </div>
        <a
          href="/status"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm font-medium"
        >
          <ExternalLink size={13} />
          Ver página pública
        </a>
      </div>

      {/* Service list grouped by category */}
      <div className="space-y-6 mb-10">
        {(categories ?? []).map((cat: any) => {
          const services = [...(cat.status_services ?? [])].sort(
            (a: any, b: any) => a.order_index - b.order_index
          )
          return (
            <div key={cat.id} className="rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Category header */}
              <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                  {cat.name}
                </span>
                <span className="text-xs text-zinc-600">({services.length})</span>
              </div>

              {/* Services */}
              {services.length === 0 ? (
                <div className="px-5 py-4 text-sm text-zinc-600">Nenhum serviço nesta categoria.</div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {services.map((svc: any) => (
                    <div
                      key={svc.id}
                      className="flex items-center gap-4 px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900/60 transition-colors"
                    >
                      {/* Name + latency */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{svc.name}</p>
                        {svc.latency_br && svc.latency_br !== '—' && (
                          <p className="text-xs text-zinc-500 mt-0.5">Latência BR: {svc.latency_br}</p>
                        )}
                      </div>

                      {/* Current badge */}
                      <span
                        className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge[svc.status] ?? statusBadge.operational}`}
                      >
                        {statusLabel[svc.status] ?? svc.status}
                      </span>

                      {/* Change status form */}
                      <form action={updateServiceStatus} className="flex items-center gap-2 shrink-0">
                        <input type="hidden" name="id" value={svc.id} />
                        <select
                          name="status"
                          defaultValue={svc.status}
                          className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
                        >
                          {statusOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors"
                        >
                          Salvar
                        </button>
                      </form>

                      {/* Delete */}
                      <form action={deleteService}>
                        <input type="hidden" name="id" value={svc.id} />
                        <ConfirmDeleteButton
                          message={`Excluir "${svc.name}"?`}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        >
                          Excluir
                        </ConfirmDeleteButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Uptime settings */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Uptime Exibido</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">Valores exibidos na Status Page. Deixe vazio para calcular automaticamente com base nos incidentes.</p>
          </div>
        </div>
        <form action={saveUptimeSettings} className="flex items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Uptime 30 dias</label>
            <input
              name="uptime_30d"
              defaultValue={uptime30val}
              placeholder="ex: 99.99%  (auto se vazio)"
              className="w-52 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Uptime 90 dias</label>
            <input
              name="uptime_90d"
              defaultValue={uptime90val}
              placeholder="ex: 99.97%  (auto se vazio)"
              className="w-52 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors shrink-0"
          >
            Salvar Uptime
          </button>
        </form>
      </div>

      {/* Add service form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Server size={14} className="text-[#0EA5E9]" />
          </div>
          <h2 className="text-base font-black text-white">Adicionar Serviço</h2>
        </div>

        <form action={addService} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Nome *</label>
            <input
              name="name"
              required
              placeholder="ex: Cloud VPS — São Paulo"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Categoria *</label>
            <select
              name="category_id"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
            >
              <option value="">Selecione...</option>
              {(categories ?? []).map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ícone</label>
            <select
              name="icon_name"
              defaultValue="server"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
            >
              {iconOptions.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
          </div>

          {/* Latency */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Latência BR</label>
            <input
              name="latency_br"
              placeholder="ex: 20ms  (deixe vazio para —)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ordem</label>
            <input
              name="order_index"
              type="number"
              defaultValue={0}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
            >
              Adicionar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

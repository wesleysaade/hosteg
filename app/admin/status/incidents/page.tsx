import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { AlertTriangle, CheckCircle, Wrench } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Server Actions ────────────────────────────────────────────────────────────

async function addIncident(formData: FormData) {
  'use server'
  const supabase      = createClient()
  const title         = formData.get('title') as string
  const description   = (formData.get('description') as string) || ''
  const type          = formData.get('type') as string
  const incident_date = formData.get('incident_date') as string
  if (!title?.trim() || !type || !incident_date) return
  await supabase.from('status_incidents').insert({
    title: title.trim(),
    description: description.trim(),
    type,
    incident_date,
  })
  revalidatePath('/admin/status/incidents')
  revalidatePath('/status')
}

async function updateIncident(formData: FormData) {
  'use server'
  const supabase      = createClient()
  const id            = formData.get('id') as string
  const title         = formData.get('title') as string
  const description   = (formData.get('description') as string) || ''
  const type          = formData.get('type') as string
  const incident_date = formData.get('incident_date') as string
  if (!id || !title?.trim()) return
  await supabase.from('status_incidents').update({
    title: title.trim(),
    description: description.trim(),
    type,
    incident_date,
  }).eq('id', id)
  revalidatePath('/admin/status/incidents')
  revalidatePath('/status')
}

async function deleteIncident(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('status_incidents').delete().eq('id', id)
  revalidatePath('/admin/status/incidents')
  revalidatePath('/status')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const typeConfig = {
  ok:          { label: 'Sem incidentes', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  maintenance: { label: 'Manutenção',     badge: 'bg-indigo-500/10  text-indigo-400  border-indigo-500/20'  },
  incident:    { label: 'Incidente',      badge: 'bg-red-500/10     text-red-400     border-red-500/20'     },
}

/** Formata YYYY-MM-DD para exibição */
function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

/** Data de hoje em YYYY-MM-DD (server-side, UTC) */
function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminIncidentsPage() {
  const supabase = createClient()

  const { data: incidents } = await supabase
    .from('status_incidents')
    .select('*')
    .order('incident_date', { ascending: false })
    .order('created_at',    { ascending: false })
    .limit(60)

  const today = todayISO()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Incidentes</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Cadastre e atualize incidentes exibidos no histórico da Status Page
        </p>
      </div>

      {/* Add incident form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <AlertTriangle size={14} className="text-[#0EA5E9]" />
          </div>
          <h2 className="text-base font-black text-white">Novo Registro</h2>
        </div>

        <form action={addIncident} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Data *</label>
            <input
              name="incident_date"
              type="date"
              defaultValue={today}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Tipo *</label>
            <select
              name="type"
              defaultValue="ok"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
            >
              <option value="ok">Sem incidentes</option>
              <option value="maintenance">Manutenção planejada</option>
              <option value="incident">Incidente</option>
            </select>
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Título *</label>
            <input
              name="title"
              required
              placeholder="ex: Manutenção planejada: atualização de rede em SP — concluída às 03:40"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Description (optional) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Descrição <span className="font-normal text-zinc-600">(opcional)</span>
            </label>
            <input
              name="description"
              placeholder="Detalhes adicionais sobre o evento..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>

      {/* Incidents list */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Histórico ({(incidents ?? []).length} registros)
          </span>
        </div>

        {(incidents ?? []).length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-600 bg-zinc-950">
            Nenhum registro cadastrado ainda.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {(incidents ?? []).map((inc: any) => {
              const cfg = typeConfig[inc.type as keyof typeof typeConfig] ?? typeConfig.ok
              return (
                <div
                  key={inc.id}
                  className="flex items-start gap-4 px-5 py-4 bg-zinc-950 hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {inc.type === 'ok' ? (
                      <CheckCircle size={15} className="text-emerald-500" />
                    ) : inc.type === 'maintenance' ? (
                      <Wrench size={15} className="text-indigo-400" />
                    ) : (
                      <AlertTriangle size={15} className="text-red-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                        {fmtDate(inc.incident_date)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200 leading-snug">{inc.title}</p>
                    {inc.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{inc.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2">
                    {/* Inline edit form */}
                    <form action={updateIncident} className="flex items-center gap-2">
                      <input type="hidden" name="id"            value={inc.id} />
                      <input type="hidden" name="title"         value={inc.title} />
                      <input type="hidden" name="description"   value={inc.description ?? ''} />
                      <input type="hidden" name="incident_date" value={inc.incident_date} />
                      <select
                        name="type"
                        defaultValue={inc.type}
                        className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0EA5E9] cursor-pointer"
                      >
                        <option value="ok">Sem incidentes</option>
                        <option value="maintenance">Manutenção</option>
                        <option value="incident">Incidente</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors font-semibold"
                      >
                        Tipo
                      </button>
                    </form>

                    {/* Delete */}
                    <form action={deleteIncident}>
                      <input type="hidden" name="id" value={inc.id} />
                      <button
                        type="submit"
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        onClick={(e) => {
                          if (!confirm('Excluir este registro?')) e.preventDefault()
                        }}
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

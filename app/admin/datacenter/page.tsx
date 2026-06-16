import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { MapPin, Cpu, Plus, ExternalLink } from 'lucide-react'
import { ConfirmDeleteButton } from '@/app/admin/_components/ConfirmDeleteButton'

export const dynamic = 'force-dynamic'

// ── Server Actions: Locations ─────────────────────────────────────────────────

async function addLocation(formData: FormData) {
  'use server'
  const supabase = createClient()
  const name           = formData.get('name') as string
  const city           = formData.get('city') as string
  const country        = formData.get('country') as string
  const flag_emoji     = (formData.get('flag_emoji') as string) || '🌐'
  const tier           = (formData.get('tier') as string) || 'Tier III'
  const uptime         = (formData.get('uptime') as string) || '99.99%'
  const latency_br     = (formData.get('latency_br') as string) || ''
  const power          = (formData.get('power') as string) || ''
  const cooling        = (formData.get('cooling') as string) || ''
  const certifications = (formData.get('certifications') as string || '')
    .split(',').map((s: string) => s.trim()).filter(Boolean)
  const order_index    = parseInt(formData.get('order_index') as string) || 0
  if (!name || !city || !country) return
  await supabase.from('datacenter_locations').insert({
    name, city, country, flag_emoji, tier, uptime, latency_br, power, cooling,
    certifications, specs: [], order_index,
  })
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
  redirect('/admin/datacenter?saved=1')
}

async function updateLocation(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id             = formData.get('id') as string
  const name           = formData.get('name') as string
  const city           = formData.get('city') as string
  const country        = formData.get('country') as string
  const flag_emoji     = (formData.get('flag_emoji') as string) || '🌐'
  const tier           = (formData.get('tier') as string) || 'Tier III'
  const uptime         = (formData.get('uptime') as string) || '99.99%'
  const latency_br     = (formData.get('latency_br') as string) || ''
  const power          = (formData.get('power') as string) || ''
  const cooling        = (formData.get('cooling') as string) || ''
  const certifications = (formData.get('certifications') as string || '')
    .split(',').map((s: string) => s.trim()).filter(Boolean)
  const is_active      = formData.get('is_active') === 'true'
  const order_index    = parseInt(formData.get('order_index') as string) || 0
  if (!id) return
  await supabase.from('datacenter_locations').update({
    name, city, country, flag_emoji, tier, uptime, latency_br, power, cooling,
    certifications, is_active, order_index,
  }).eq('id', id)
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
  redirect('/admin/datacenter?saved=1')
}

async function deleteLocation(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('datacenter_locations').delete().eq('id', id)
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
}

// ── Server Actions: Technologies ──────────────────────────────────────────────

async function addTechnology(formData: FormData) {
  'use server'
  const supabase = createClient()
  const title       = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const icon_name   = (formData.get('icon_name') as string) || 'Shield'
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!title) return
  await supabase.from('datacenter_technologies').insert({ title, description, icon_name, order_index })
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
  redirect('/admin/datacenter?saved=1')
}

async function updateTechnology(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id          = formData.get('id') as string
  const title       = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const icon_name   = (formData.get('icon_name') as string) || 'Shield'
  const is_active   = formData.get('is_active') === 'true'
  const order_index = parseInt(formData.get('order_index') as string) || 0
  if (!id) return
  await supabase.from('datacenter_technologies').update({ title, description, icon_name, is_active, order_index }).eq('id', id)
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
  redirect('/admin/datacenter?saved=1')
}

async function deleteTechnology(formData: FormData) {
  'use server'
  const supabase = createClient()
  const id = formData.get('id') as string
  await supabase.from('datacenter_technologies').delete().eq('id', id)
  revalidatePath('/admin/datacenter')
  revalidatePath('/datacenter')
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDatacenterPage() {
  const supabase = createClient()

  const [{ data: locations }, { data: technologies }] = await Promise.all([
    supabase.from('datacenter_locations').select('*').order('order_index'),
    supabase.from('datacenter_technologies').select('*').order('order_index'),
  ])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Datacenter</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Localizações e tecnologias exibidas na página Datacenter
          </p>
        </div>
        <a
          href="/datacenter"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm font-medium"
        >
          <ExternalLink size={13} />
          Ver página
        </a>
      </div>

      {/* ── LOCATIONS ── */}
      <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
        <MapPin size={16} className="text-[#0EA5E9]" /> Localizações
      </h2>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-6">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Datacenters ({(locations ?? []).length})
          </span>
        </div>

        {(locations ?? []).length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-600 bg-zinc-950">Nenhuma localização.</div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {(locations ?? []).map((loc: any) => (
              <div key={loc.id} className={`px-5 py-4 bg-zinc-950 hover:bg-zinc-900/40 transition-colors ${!loc.is_active ? 'opacity-50' : ''}`}>
                <form action={updateLocation} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <input type="hidden" name="id" value={loc.id} />

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Flag + Nome</label>
                    <div className="flex gap-1.5">
                      <input name="flag_emoji" defaultValue={loc.flag_emoji}
                        className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[#0EA5E9]" />
                      <input name="name" defaultValue={loc.name} required
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Cidade / País</label>
                    <div className="flex gap-1.5">
                      <input name="city" defaultValue={loc.city} required
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                      <input name="country" defaultValue={loc.country} required
                        className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Tier / Uptime</label>
                    <div className="flex gap-1.5">
                      <input name="tier" defaultValue={loc.tier}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                      <input name="uptime" defaultValue={loc.uptime}
                        className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Latência BR</label>
                    <input name="latency_br" defaultValue={loc.latency_br}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Energia</label>
                    <input name="power" defaultValue={loc.power}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Cooling</label>
                    <input name="cooling" defaultValue={loc.cooling}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]" />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1">Certificações (vírgula)</label>
                    <input name="certifications" defaultValue={(loc.certifications ?? []).join(', ')}
                      placeholder="ISO 27001, SOC 2"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]" />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-500 mb-1">Ordem / Ativo</label>
                      <div className="flex gap-1.5">
                        <input name="order_index" type="number" defaultValue={loc.order_index}
                          className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[#0EA5E9]" />
                        <select name="is_active" defaultValue={loc.is_active ? 'true' : 'false'}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]">
                          <option value="true">Ativo</option>
                          <option value="false">Oculto</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors whitespace-nowrap">
                      Salvar
                    </button>
                  </div>
                </form>

                <form action={deleteLocation} className="mt-2">
                  <input type="hidden" name="id" value={loc.id} />
                  <ConfirmDeleteButton
                    message={`Excluir "${loc.name}"?`}
                    className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Excluir localização
                  </ConfirmDeleteButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add location */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Plus size={13} className="text-[#0EA5E9]" />
          </div>
          <h3 className="text-sm font-black text-white">Nova Localização</h3>
        </div>
        <form action={addLocation} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: 'flag_emoji',      label: 'Flag',          placeholder: '🇧🇷' },
            { name: 'name',            label: 'Nome *',         placeholder: 'Ascenty SP4' },
            { name: 'city',            label: 'Cidade *',       placeholder: 'São Paulo' },
            { name: 'country',         label: 'País *',         placeholder: 'Brasil' },
            { name: 'tier',            label: 'Tier',           placeholder: 'Tier III' },
            { name: 'uptime',          label: 'Uptime',         placeholder: '99.99%' },
            { name: 'latency_br',      label: 'Latência BR',    placeholder: '~20 ms' },
            { name: 'power',           label: 'Energia',        placeholder: 'N+1 (800 kW)' },
            { name: 'cooling',         label: 'Cooling',        placeholder: 'Precision Cooling' },
            { name: 'certifications',  label: 'Certs (vírgula)',placeholder: 'ISO 27001, SOC 2' },
            { name: 'order_index',     label: 'Ordem',          placeholder: '0' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-[10px] font-semibold text-zinc-400 mb-1">{f.label}</label>
              <input
                name={f.name}
                placeholder={f.placeholder}
                type={f.name === 'order_index' ? 'number' : 'text'}
                defaultValue={f.name === 'order_index' ? '0' : undefined}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-end">
            <button type="submit"
              className="px-5 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors">
              Adicionar Localização
            </button>
          </div>
        </form>
      </div>

      {/* ── TECHNOLOGIES ── */}
      <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
        <Cpu size={16} className="text-[#0EA5E9]" /> Tecnologias / Diferenciais
      </h2>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-6">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            Cards de tecnologia ({(technologies ?? []).length})
          </span>
        </div>

        {(technologies ?? []).length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-600 bg-zinc-950">Nenhuma tecnologia.</div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {(technologies ?? []).map((tech: any) => (
              <div key={tech.id} className={`px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors ${!tech.is_active ? 'opacity-50' : ''}`}>
                <form action={updateTechnology} className="flex items-center gap-3 flex-wrap">
                  <input type="hidden" name="id" value={tech.id} />

                  <input name="order_index" type="number" defaultValue={tech.order_index}
                    className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[#0EA5E9]"
                    title="Ordem" />

                  <input name="icon_name" defaultValue={tech.icon_name} placeholder="Shield"
                    className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                    title="Nome do ícone Phosphor" />

                  <input name="title" defaultValue={tech.title} required
                    className="w-40 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                    placeholder="Título" />

                  <input name="description" defaultValue={tech.description}
                    className="flex-1 min-w-[160px] bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                    placeholder="Descrição" />

                  <select name="is_active" defaultValue={tech.is_active ? 'true' : 'false'}
                    className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#0EA5E9]">
                    <option value="true">Ativo</option>
                    <option value="false">Oculto</option>
                  </select>

                  <button type="submit"
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors">
                    Salvar
                  </button>
                </form>

                <form action={deleteTechnology} className="mt-1.5">
                  <input type="hidden" name="id" value={tech.id} />
                  <ConfirmDeleteButton
                    message={`Excluir "${tech.title}"?`}
                    className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    Excluir
                  </ConfirmDeleteButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add technology */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
            <Plus size={13} className="text-[#0EA5E9]" />
          </div>
          <h3 className="text-sm font-black text-white">Nova Tecnologia</h3>
        </div>
        <form action={addTechnology} className="flex items-end gap-3 flex-wrap">
          <div className="w-16">
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Ordem</label>
            <input name="order_index" type="number" defaultValue={0}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <div className="w-28">
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Ícone Phosphor</label>
            <input name="icon_name" placeholder="Shield"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <div className="w-40">
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Título *</label>
            <input name="title" required placeholder="Anti-DDoS"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Descrição</label>
            <input name="description" placeholder="Proteção automática contra ataques..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <button type="submit"
            className="px-5 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors shrink-0">
            Adicionar
          </button>
        </form>
      </div>
    </div>
  )
}

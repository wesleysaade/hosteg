import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Server Action ─────────────────────────────────────────────────────────────

async function saveSetting(formData: FormData) {
  'use server'
  const supabase = createClient()
  const key   = formData.get('key') as string
  const value = formData.get('value') as string
  if (!key) return
  await supabase
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
  revalidatePath('/admin/settings')
  revalidatePath('/')
  redirect('/admin/settings?saved=1')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sectionLabels: Record<string, string> = {
  empresa:       'Empresa',
  redes_sociais: 'Redes Sociais',
  rodape:        'Rodapé',
  links:         'Links',
}

const sectionOrder = ['empresa', 'redes_sociais', 'rodape', 'links']

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminSettingsPage() {
  const supabase = createClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .order('section')
    .order('key')

  const grouped: Record<string, typeof settings> = {}
  for (const row of settings ?? []) {
    if (!grouped[row.section]) grouped[row.section] = []
    grouped[row.section]!.push(row)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Configurações do Site</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Informações globais que aparecem no rodapé, contato e outras páginas
        </p>
      </div>

      <div className="space-y-8">
        {sectionOrder.map((section) => {
          const rows = grouped[section]
          if (!rows?.length) return null
          return (
            <div key={section} className="rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Section header */}
              <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                <Settings size={13} className="text-[#0EA5E9]" />
                <span className="text-xs font-black text-zinc-300 uppercase tracking-wider">
                  {sectionLabels[section] ?? section}
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {rows.map((row) => (
                  <form
                    key={row.key}
                    action={saveSetting}
                    className="flex items-center gap-4 px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900/40 transition-colors"
                  >
                    <input type="hidden" name="key" value={row.key} />

                    {/* Label */}
                    <label
                      className="w-44 shrink-0 text-sm font-semibold text-zinc-300"
                      title={row.key}
                    >
                      {row.label}
                    </label>

                    {/* Value input */}
                    <input
                      name="value"
                      defaultValue={row.value}
                      placeholder="(vazio)"
                      className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0EA5E9]"
                    />

                    <button
                      type="submit"
                      className="shrink-0 text-xs px-4 py-2 rounded-xl bg-[#0EA5E9] text-white font-bold hover:bg-[#0284C7] transition-colors"
                    >
                      Salvar
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        Chave técnica de cada campo entre parênteses — usada internamente pelo sistema.
      </p>
    </div>
  )
}

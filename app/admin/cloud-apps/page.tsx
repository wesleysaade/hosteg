import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, Plus, PencilSimple } from '@phosphor-icons/react/dist/ssr'

export default async function AdminCloudAppsPage() {
  const supabase = createClient()

  const { data: apps, error } = await supabase
    .from('cloud_apps')
    .select('id, name, category, tagline, logo, logo_color, logo_bg, highlight, position')
    .order('position')

  const empty = !apps || apps.length === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Cloud APPs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {empty ? 'Nenhum app cadastrado ainda' : `${apps.length} apps cadastrados`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/cloud-apps/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Categorias
          </Link>
          <Link
            href="/admin/cloud-apps/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors"
          >
            <Plus size={14} weight="bold" /> Novo app
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-sm">
          Tabela <code>cloud_apps</code> ainda não existe no banco de dados. Execute o schema SQL para criá-la.
        </div>
      )}

      {empty && !error ? (
        <div className="text-center py-16 rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Package size={20} className="text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-sm mb-4">Nenhum Cloud App cadastrado ainda.</p>
          <Link href="/admin/cloud-apps/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors">
            <Plus size={13} weight="bold" /> Cadastrar primeiro app
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500">App</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500">Categoria</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500">Destaque</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500">Pos.</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {(apps ?? []).map((app: any) => (
                <tr key={app.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {app.logo && (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: app.logo_bg || '#EFF9FF' }}>
                          <img src={app.logo} alt={app.name} width={18} height={18} style={{ filter: `drop-shadow(0 1px 2px ${app.logo_color || '#000'}55)` }} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white">{app.name}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-xs">{app.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-zinc-400">{app.category || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {app.highlight ? (
                      <span className="text-xs font-bold text-[#0EA5E9]">Sim</span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-zinc-500">{app.position}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/cloud-apps/${app.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors">
                      <PencilSimple size={11} /> Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

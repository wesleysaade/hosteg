'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FloppyDisk, Trash } from '@phosphor-icons/react'

interface CloudAppCategory {
  id?: string
  name: string
  position: number
}

interface Props { category?: CloudAppCategory }

export default function CloudAppCategoryEditor({ category }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const isNew = !category?.id

  const [name,     setName]     = useState(category?.name     ?? '')
  const [position, setPosition] = useState(category?.position ?? 0)

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError(''); setSaved(false)

    const payload = { name: name.trim(), position }

    const supabase = createClient()
    let err
    if (isNew) {
      const res = await supabase.from('cloud_app_categories').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('cloud_app_categories').update(payload).eq('id', category!.id!)
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    startTransition(() => router.refresh())
    if (isNew) router.push('/admin/cloud-apps/categories')
  }

  async function handleDelete() {
    if (!category?.id) return
    if (!confirm(`Excluir categoria "${name}"?\n\nOs apps desta categoria não serão excluídos, mas ficarão sem categoria.`)) return
    const supabase = createClient()
    await supabase.from('cloud_app_categories').delete().eq('id', category.id)
    router.push('/admin/cloud-apps/categories')
  }

  const inputClass = 'w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors'
  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1.5'

  return (
    <div className="max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/cloud-apps/categories"
            className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors">
            <ArrowLeft size={14} className="text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">
              {isNew ? 'Nova categoria' : `Editar: ${name}`}
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">cloud_app_categories</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-colors">
              <Trash size={14} /> Excluir
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors">
            <FloppyDisk size={14} /> {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
      {saved  && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">Salvo com sucesso!</div>}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-5">
        <div>
          <label className={labelClass}>Nome da categoria *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            placeholder="ex: Automação & Fluxos"
          />
          <p className="mt-1.5 text-[11px] text-zinc-600">
            Este nome aparece exatamente como grupo no /cloud-apps e no editor de apps.
          </p>
        </div>
        <div>
          <label className={labelClass}>Posição (ordem de exibição)</label>
          <input
            type="number"
            value={position}
            onChange={e => setPosition(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}

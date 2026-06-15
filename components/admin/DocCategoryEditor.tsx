'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FloppyDisk, Trash } from '@phosphor-icons/react'

// Ícones disponíveis no iconMap do /docs/page.tsx
const ICON_OPTIONS = [
  'HardDrives', 'Globe', 'Envelope', 'Lock', 'Lightning',
  'HardDrive', 'Terminal', 'Stack', 'Browser', 'Server', 'Layers',
]

interface DocCategory {
  id?: string
  name: string
  slug: string
  icon: string
  color: string
  description: string
  position: number
}

interface Props { category?: DocCategory }

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function DocCategoryEditor({ category }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const isNew = !category?.id

  const [name,        setName]        = useState(category?.name        ?? '')
  const [slug,        setSlug]        = useState(category?.slug        ?? '')
  const [icon,        setIcon]        = useState(category?.icon        ?? 'HardDrives')
  const [color,       setColor]       = useState(category?.color       ?? '#0EA5E9')
  const [description, setDescription] = useState(category?.description ?? '')
  const [position,    setPosition]    = useState(category?.position    ?? 0)

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function handleNameChange(val: string) {
    setName(val)
    if (isNew) setSlug(slugify(val))
  }

  async function handleSave() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    if (!slug.trim()) { setError('Slug é obrigatório'); return }
    setSaving(true); setError(''); setSaved(false)

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      icon: icon.trim(),
      color: color.trim(),
      description: description.trim(),
      position,
    }

    const supabase = createClient()
    let err
    if (isNew) {
      const res = await supabase.from('doc_categories').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('doc_categories').update(payload).eq('id', category!.id!)
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    startTransition(() => router.refresh())
    if (isNew) router.push('/admin/docs/categories')
  }

  async function handleDelete() {
    if (!category?.id) return
    if (!confirm(`Excluir categoria "${name}"?\n\nTodos os artigos desta categoria serão desvinculados.`)) return
    const supabase = createClient()
    await supabase.from('doc_categories').delete().eq('id', category.id)
    router.push('/admin/docs/categories')
  }

  const inputClass  = 'w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors'
  const labelClass  = 'block text-xs font-medium text-zinc-400 mb-1.5'

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/docs/categories"
            className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors">
            <ArrowLeft size={14} className="text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">
              {isNew ? 'Nova categoria' : `Editar: ${name}`}
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">doc_categories</p>
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

        {/* Nome + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nome da categoria *</label>
            <input value={name} onChange={e => handleNameChange(e.target.value)}
              className={inputClass} placeholder="ex: Cloud VPS" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <input value={slug} onChange={e => setSlug(e.target.value)}
              className={inputClass} placeholder="ex: cloud-vps" />
          </div>
        </div>

        {/* Ícone + Cor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Ícone (Phosphor)</label>
            <select value={icon} onChange={e => setIcon(e.target.value)} className={inputClass}>
              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <p className="mt-1.5 text-[11px] text-zinc-600">Nome do componente Phosphor usado no /docs</p>
          </div>
          <div>
            <label className={labelClass}>Cor (hex)</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer p-0.5 flex-shrink-0" />
              <input value={color} onChange={e => setColor(e.target.value)}
                className={inputClass} placeholder="#0EA5E9" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20` }}>
            <span className="text-xs font-black" style={{ color }}>{icon.slice(0, 2)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{name || 'Nome da categoria'}</p>
            <p className="text-xs text-zinc-500">/{slug || 'slug'}</p>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className={labelClass}>Descrição</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            rows={2} className={inputClass}
            placeholder="ex: Criação, configuração e gerenciamento de VPS" />
        </div>

        {/* Posição */}
        <div>
          <label className={labelClass}>Posição (ordem de exibição)</label>
          <input type="number" value={position} onChange={e => setPosition(Number(e.target.value))}
            className={inputClass} />
        </div>
      </div>
    </div>
  )
}

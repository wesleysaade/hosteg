'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FloppyDisk, Trash } from '@phosphor-icons/react'

interface CloudApp {
  id?: string
  name: string
  category: string
  tagline: string
  description: string
  logo: string
  logo_color: string
  logo_bg: string
  tags: string[]
  highlight: boolean
  modal_about: string
  modal_features: string[]
  modal_use_cases: string[]
  modal_requirements: string
  position: number
}

const FALLBACK_CATEGORIES = [
  'Automação & Fluxos',
  'WhatsApp & Comunicação',
  'CRM & Negócios',
  'DevOps & Infraestrutura',
  'Backend & Banco de Dados',
]

interface Props {
  app?: CloudApp
  categories?: string[]
}

export default function CloudAppEditor({ app, categories: categoriesProp }: Props) {
  const categories = categoriesProp?.length ? categoriesProp : FALLBACK_CATEGORIES
  const router = useRouter()
  const [, startTransition] = useTransition()
  const isNew = !app?.id

  const [name,               setName]              = useState(app?.name ?? '')
  const [category,           setCategory]          = useState(app?.category ?? '')
  const [tagline,            setTagline]            = useState(app?.tagline ?? '')
  const [description,        setDescription]       = useState(app?.description ?? '')
  const [logo,               setLogo]              = useState(app?.logo ?? '')
  const [logoColor,          setLogoColor]         = useState(app?.logo_color ?? '#0EA5E9')
  const [logoBg,             setLogoBg]            = useState(app?.logo_bg ?? '#EFF9FF')
  const [tagsRaw,            setTagsRaw]           = useState((app?.tags ?? []).join(', '))
  const [highlight,          setHighlight]         = useState(app?.highlight ?? false)
  const [modalAbout,         setModalAbout]        = useState(app?.modal_about ?? '')
  const [modalFeaturesRaw,   setModalFeaturesRaw]  = useState((app?.modal_features ?? []).join('\n'))
  const [modalUseCasesRaw,   setModalUseCasesRaw]  = useState((app?.modal_use_cases ?? []).join('\n'))
  const [modalRequirements,  setModalRequirements] = useState(app?.modal_requirements ?? '')
  const [position,           setPosition]          = useState(app?.position ?? 0)

  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError(''); setSaved(false)

    const payload = {
      name:                name.trim(),
      category:            category.trim(),
      tagline:             tagline.trim(),
      description:         description.trim(),
      logo:                logo.trim() || null,
      logo_color:          logoColor.trim(),
      logo_bg:             logoBg.trim(),
      tags:                tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
      highlight,
      modal_about:         modalAbout.trim(),
      modal_features:      modalFeaturesRaw.split('\n').map(l => l.trim()).filter(Boolean),
      modal_use_cases:     modalUseCasesRaw.split('\n').map(l => l.trim()).filter(Boolean),
      modal_requirements:  modalRequirements.trim(),
      position,
    }

    const supabase = createClient()
    let err
    if (isNew) {
      const res = await supabase.from('cloud_apps').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('cloud_apps').update(payload).eq('id', app!.id!)
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    startTransition(() => router.refresh())
    if (isNew) router.push('/admin/cloud-apps')
  }

  async function handleDelete() {
    if (!app?.id) return
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return
    const supabase = createClient()
    await supabase.from('cloud_apps').delete().eq('id', app.id)
    router.push('/admin/cloud-apps')
  }

  const inputClass = 'w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors'
  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1.5'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/cloud-apps" className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors">
            <ArrowLeft size={14} className="text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{isNew ? 'Novo Cloud App' : `Editar: ${name}`}</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Tabela: cloud_apps</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-colors">
              <Trash size={14} /> Excluir
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors">
            <FloppyDisk size={14} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
      {saved && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">Salvo com sucesso!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Informações básicas</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome *</label>
                <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="ex: N8N" />
              </div>
              <div>
                <label className={labelClass}>Categoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                  <option value="">— Selecione uma categoria —</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} placeholder="ex: Automação de fluxos sem código" />
              </div>
              <div>
                <label className={labelClass}>Descrição curta</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputClass} placeholder="Descrição para o card principal..." />
              </div>
              <div>
                <label className={labelClass}>Tags (separadas por vírgula)</label>
                <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} className={inputClass} placeholder="ex: Automação, No-code, Workflows" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="highlight" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="w-4 h-4 rounded accent-[#0EA5E9]" />
                <label htmlFor="highlight" className="text-sm text-zinc-300">Destaque (highlight)</label>
              </div>
              <div>
                <label className={labelClass}>Posição (ordem)</label>
                <input type="number" value={position} onChange={e => setPosition(Number(e.target.value))} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Logo & Cores</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Logo URL</label>
                <input value={logo} onChange={e => setLogo(e.target.value)} className={inputClass} placeholder="https://cdn.simpleicons.org/n8n" />
              </div>
              <div>
                <label className={labelClass}>Cor do logo (hex)</label>
                <input value={logoColor} onChange={e => setLogoColor(e.target.value)} className={inputClass} placeholder="#0EA5E9" />
              </div>
              <div>
                <label className={labelClass}>Cor de fundo do logo (hex)</label>
                <input value={logoBg} onChange={e => setLogoBg(e.target.value)} className={inputClass} placeholder="#EFF9FF" />
              </div>
              {logo && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: logoBg }}>
                    <img src={logo} alt={name} width={28} height={28} style={{ filter: `drop-shadow(0 1px 3px ${logoColor}55)` }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <span className="text-xs text-zinc-500">Preview do logo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Modal — Conteúdo detalhado</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Sobre o app (modal_about)</label>
                <textarea value={modalAbout} onChange={e => setModalAbout(e.target.value)} rows={4} className={inputClass} placeholder="Descrição completa para o modal..." />
              </div>
              <div>
                <label className={labelClass}>Features (modal_features) — uma por linha</label>
                <textarea value={modalFeaturesRaw} onChange={e => setModalFeaturesRaw(e.target.value)} rows={5} className={inputClass} placeholder="Interface visual drag-and-drop&#10;+400 integrações nativas&#10;Execução agendada (cron jobs)" />
              </div>
              <div>
                <label className={labelClass}>Casos de uso (modal_use_cases) — um por linha</label>
                <textarea value={modalUseCasesRaw} onChange={e => setModalUseCasesRaw(e.target.value)} rows={4} className={inputClass} placeholder="Automatizar envio de e-mails&#10;Sincronizar dados entre sistemas" />
              </div>
              <div>
                <label className={labelClass}>Requisitos (modal_requirements)</label>
                <input value={modalRequirements} onChange={e => setModalRequirements(e.target.value)} className={inputClass} placeholder="ex: VPS com mínimo 2GB RAM." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

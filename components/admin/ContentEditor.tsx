'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import type { PageConfig, SectionKey } from '@/lib/config/pages-config'
import { SECTION_LABELS } from '@/lib/config/pages-config'
import { ArrowLeft, FloppyDisk, Eye, Plus, Trash, ArrowUp, ArrowDown, CaretDown } from '@phosphor-icons/react'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false })

// ── Content types ──────────────────────────────────────────────────────────────
interface HeroContent   { badge?: string; title?: string; subtitle?: string; desc?: string; cta_label?: string; cta_href?: string }
interface FeatureItem   { text: string; tip?: string }
interface SharedFeaturesContent { items: FeatureItem[] }
interface DiferencialItem { title: string; desc: string }
interface DiferenciaisContent { items: DiferencialItem[] }
interface ContentBlockContent { text?: string; html?: string }
interface StatItem { value: string; label: string }
interface StatsContent { items: StatItem[] }

// ── Section editors ────────────────────────────────────────────────────────────
function HeroEditor({ content, onChange }: { content: HeroContent; onChange: (v: HeroContent) => void }) {
  const f = (key: keyof HeroContent, label: string, placeholder: string, type: 'text' | 'url' | 'textarea' = 'text') => (
    <div key={key} className={type === 'textarea' ? 'col-span-2' : ''}>
      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={content[key] ?? ''}
          onChange={e => onChange({ ...content, [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 resize-none placeholder-zinc-600"
        />
      ) : (
        <input
          type={type}
          value={content[key] ?? ''}
          onChange={e => onChange({ ...content, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
        />
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-3">
      {f('badge',     'Badge',          'Ex: Cloud VPS NVMe Gen4')}
      {f('title',     'Título',         'Título principal da página')}
      {f('subtitle',  'Subtítulo',      'Texto em destaque abaixo do título')}
      {f('desc',      'Descrição',      'Parágrafo descritivo', 'textarea')}
      {f('cta_label', 'CTA — Texto',    'Ex: Contratar agora')}
      {f('cta_href',  'CTA — Link',     'https://...', 'url')}
    </div>
  )
}

function SharedFeaturesEditor({ content, onChange }: { content: SharedFeaturesContent; onChange: (v: SharedFeaturesContent) => void }) {
  const items = content.items ?? []

  function updateItem(i: number, patch: Partial<FeatureItem>) {
    const next = items.map((it, idx) => idx === i ? { ...it, ...patch } : it)
    onChange({ items: next })
  }
  function addItem() {
    onChange({ items: [...items, { text: '', tip: '' }] })
  }
  function removeItem(i: number) {
    onChange({ items: items.filter((_, idx) => idx !== i) })
  }
  function moveItem(i: number, dir: -1 | 1) {
    const next = i + dir
    if (next < 0 || next >= items.length) return
    const arr = [...items]
    ;[arr[i], arr[next]] = [arr[next], arr[i]]
    onChange({ items: arr })
  }

  return (
    <div>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors">
                <ArrowUp size={10} />
              </button>
              <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors">
                <ArrowDown size={10} />
              </button>
            </div>
            <input
              value={item.text}
              onChange={e => updateItem(i, { text: e.target.value })}
              placeholder="Recurso (ex: Anti-DDoS incluso)"
              className="flex-1 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
            />
            <input
              value={item.tip ?? ''}
              onChange={e => updateItem(i, { tip: e.target.value })}
              placeholder="Tooltip (opcional)"
              className="w-52 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
            />
            <button type="button" onClick={() => removeItem(i)}
              className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash size={12} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 text-xs text-[#0EA5E9] hover:text-[#0284C7] font-semibold transition-colors"
      >
        <Plus size={11} weight="bold" /> Adicionar recurso
      </button>
      <p className="text-[10px] text-zinc-600 mt-1.5">
        Esses recursos aparecem na seção &ldquo;Incluso em todos os planos&rdquo; da página.
      </p>
    </div>
  )
}

function DiferenciaisEditor({ content, onChange }: { content: DiferenciaisContent; onChange: (v: DiferenciaisContent) => void }) {
  const items = content.items ?? []

  function updateItem(i: number, patch: Partial<DiferencialItem>) {
    onChange({ items: items.map((it, idx) => idx === i ? { ...it, ...patch } : it) })
  }
  function addItem() {
    onChange({ items: [...items, { title: '', desc: '' }] })
  }
  function removeItem(i: number) {
    onChange({ items: items.filter((_, idx) => idx !== i) })
  }
  function moveItem(i: number, dir: -1 | 1) {
    const next = i + dir
    if (next < 0 || next >= items.length) return
    const arr = [...items]
    ;[arr[i], arr[next]] = [arr[next], arr[i]]
    onChange({ items: arr })
  }

  return (
    <div>
      <div className="space-y-3 mb-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-zinc-700 p-3 bg-zinc-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                  className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors">
                  <ArrowUp size={10} />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                  className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors">
                  <ArrowDown size={10} />
                </button>
                <span className="text-[10px] text-zinc-500 ml-1">Item {i + 1}</span>
              </div>
              <button type="button" onClick={() => removeItem(i)}
                className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Título</label>
                <input value={item.title} onChange={e => updateItem(i, { title: e.target.value })}
                  placeholder="Título do diferencial"
                  className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Descrição</label>
                <input value={item.desc} onChange={e => updateItem(i, { desc: e.target.value })}
                  placeholder="Descrição breve"
                  className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 text-xs text-[#0EA5E9] hover:text-[#0284C7] font-semibold transition-colors"
      >
        <Plus size={11} weight="bold" /> Adicionar diferencial
      </button>
    </div>
  )
}

function StatsEditor({ content, onChange }: { content: StatsContent; onChange: (v: StatsContent) => void }) {
  const items = content.items ?? []

  function updateItem(i: number, patch: Partial<StatItem>) {
    onChange({ items: items.map((it, idx) => idx === i ? { ...it, ...patch } : it) })
  }
  function addItem() {
    onChange({ items: [...items, { value: '', label: '' }] })
  }
  function removeItem(i: number) {
    onChange({ items: items.filter((_, idx) => idx !== i) })
  }

  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-3">Cada item aparece como uma pílula no hero. Geralmente 4 itens.</p>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item.value}
              onChange={e => updateItem(i, { value: e.target.value })}
              placeholder="Valor (ex: 99.9%)"
              className="w-32 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
            />
            <input
              value={item.label}
              onChange={e => updateItem(i, { label: e.target.value })}
              placeholder="Rótulo (ex: SLA)"
              className="flex-1 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 placeholder-zinc-600"
            />
            <button type="button" onClick={() => removeItem(i)}
              className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash size={12} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem}
        className="inline-flex items-center gap-1.5 text-xs text-[#0EA5E9] hover:text-[#0284C7] font-semibold transition-colors">
        <Plus size={11} weight="bold" /> Adicionar item
      </button>
    </div>
  )
}

function ContentBlockEditor({ content, onChange }: { content: ContentBlockContent; onChange: (v: ContentBlockContent) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Conteúdo</label>
      <RichEditor
        content={content.html ?? content.text ?? ''}
        onChange={html => onChange({ ...content, html, text: html })}
      />
    </div>
  )
}

// ── Section card ───────────────────────────────────────────────────────────────
function SectionCard({
  sectionKey, content, onChange,
}: {
  sectionKey: SectionKey
  content: any
  onChange: (v: any) => void
}) {
  const [open, setOpen] = useState(true)

  function renderEditor() {
    switch (sectionKey) {
      case 'hero':
        return <HeroEditor content={content ?? {}} onChange={onChange} />
      case 'stats':
        return <StatsEditor content={content ?? { items: [] }} onChange={onChange} />
      case 'shared_features':
        return <SharedFeaturesEditor content={content ?? { items: [] }} onChange={onChange} />
      case 'diferenciais':
        return <DiferenciaisEditor content={content ?? { items: [] }} onChange={onChange} />
      case 'content':
        return <ContentBlockEditor content={content ?? { text: '' }} onChange={onChange} />
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-sm font-bold text-white">{SECTION_LABELS[sectionKey]}</span>
        <CaretDown size={13} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-5">
          {renderEditor()}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ContentEditor({
  pageConfig,
  initialSections,
}: {
  pageConfig: PageConfig
  initialSections: Record<string, any>
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [data,   setData]   = useState<Record<string, any>>(initialSections)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function updateSection(key: string, value: any) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true); setError('')
    const supabase = createClient()
    try {
      for (const sectionKey of pageConfig.sections) {
        const content = data[sectionKey] ?? {}
        const { error: saveError } = await supabase
          .from('page_sections')
          .upsert(
            {
              page_slug:   pageConfig.slug,
              section_key: sectionKey,
              content,
              updated_at:  new Date().toISOString(),
            },
            { onConflict: 'page_slug,section_key' }
          )
        if (saveError) throw new Error(saveError.message)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      startTransition(() => router.refresh())
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/content" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{pageConfig.name}</h1>
            <p className="text-xs text-zinc-500">{pageConfig.path}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={pageConfig.path}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all"
          >
            <Eye size={13} /> Ver no site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 transition-colors"
          >
            <FloppyDisk size={13} weight="fill" />
            {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar tudo'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="space-y-4">
        {pageConfig.sections.map(sectionKey => (
          <SectionCard
            key={sectionKey}
            sectionKey={sectionKey}
            content={data[sectionKey]}
            onChange={value => updateSection(sectionKey, value)}
          />
        ))}
      </div>
    </div>
  )
}

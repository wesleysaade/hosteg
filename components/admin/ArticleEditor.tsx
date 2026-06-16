'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Eye, FloppyDisk, Trash } from '@phosphor-icons/react'
import Link from 'next/link'

// TipTap editor — carregado apenas no client (evita SSR)
const RichEditor  = dynamic(() => import('./RichEditor'),    { ssr: false })

interface Category { id: string; name: string; slug: string; parent_id?: string | null }
interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category_id: string | null
  published: boolean
  position: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
}

interface Props {
  article?: Article
  categories: Category[]
  defaultCategoryId?: string
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function ArticleEditor({ article, categories, defaultCategoryId }: Props) {
  const router   = useRouter()
  const [pending, startTransition] = useTransition()
  const isNew    = !article

  const [title,      setTitle]      = useState(article?.title ?? '')
  const [slug,       setSlug]       = useState(article?.slug ?? '')
  const [excerpt,    setExcerpt]    = useState(article?.excerpt ?? '')
  const [content,    setContent]    = useState(article?.content ?? '')
  const [categoryId, setCategoryId] = useState(article?.category_id ?? defaultCategoryId ?? '')
  const [published,  setPublished]  = useState(article?.published ?? false)
  const [position,   setPosition]   = useState(article?.position ?? 0)
  const [seoTitle,    setSeoTitle]    = useState(article?.seo_title ?? '')
  const [seoDesc,     setSeoDesc]     = useState(article?.seo_description ?? '')
  const [seoKeywords, setSeoKeywords] = useState(article?.seo_keywords ?? '')
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [error,      setError]      = useState('')
  const [saved,      setSaved]      = useState(false)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  async function handleSave(publish?: boolean) {
    setError('')
    if (!title.trim()) { setError('Título obrigatório.'); return }
    if (!slug.trim())  { setError('Slug obrigatório.'); return }

    const supabase = createClient()
    const payload = {
      title,
      slug: slug.trim(),
      excerpt: excerpt || null,
      content,
      category_id: categoryId || null,
      published: publish !== undefined ? publish : published,
      position,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDesc.trim() || null,
      seo_keywords: seoKeywords.trim() || null,
    }

    let err
    if (isNew) {
      const res = await supabase.from('doc_articles').insert(payload).select('id').single()
      err = res.error
      if (!err && res.data) {
        router.push(`/admin/docs/articles/${res.data.id}`)
        return
      }
    } else {
      const res = await supabase.from('doc_articles').update(payload).eq('id', article!.id)
      err = res.error
    }

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      if (publish !== undefined) setPublished(publish)
      setTimeout(() => setSaved(false), 2000)
      startTransition(() => router.refresh())
    }
  }

  async function handleDelete() {
    if (!article || !confirm('Deletar este artigo? Esta ação não pode ser desfeita.')) return
    const supabase = createClient()
    await supabase.from('doc_articles').delete().eq('id', article.id)
    router.push('/admin/docs')
  }

  const selectedCategory = categories.find(c => c.id === categoryId)

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/docs" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{isNew ? 'Novo artigo' : 'Editar artigo'}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{isNew ? 'Preencha os campos e salve' : `ID: ${article!.id.slice(0, 8)}`}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <a
                href={slug ? `/docs/${slug}` : '#'}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all"
              >
                <Eye size={13} /> Visualizar
              </a>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all"
              >
                <Trash size={13} /> Deletar
              </button>
            </>
          )}
          {published ? (
            <button
              onClick={() => handleSave(false)}
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
            >
              Despublicar
            </button>
          ) : (
            <button
              onClick={() => handleSave(true)}
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
            >
              Publicar
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={pending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
          >
            <FloppyDisk size={13} weight="fill" />
            {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor principal */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Título *</label>
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Título do artigo"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Resumo (excerpt)</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Breve descrição do artigo (aparece na listagem)"
              rows={2}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-400">Conteúdo</label>
            </div>
            <RichEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Painel lateral */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Status</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${published ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
              <span className="text-sm text-white">{published ? 'Publicado' : 'Rascunho'}</span>
            </div>
          </div>

          {/* Categoria */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Categoria</h3>
            {(() => {
              const roots = categories.filter(c => !c.parent_id)
              const childMap: Record<string, Category[]> = {}
              for (const c of categories.filter(c => c.parent_id)) {
                if (!childMap[c.parent_id!]) childMap[c.parent_id!] = []
                childMap[c.parent_id!].push(c)
              }
              return (
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                >
                  <option value="">Sem categoria</option>
                  {roots.map(root => {
                    const subs = childMap[root.id] ?? []
                    if (subs.length === 0) {
                      return <option key={root.id} value={root.id}>{root.name}</option>
                    }
                    return (
                      <optgroup key={root.id} label={root.name}>
                        <option value={root.id}>{root.name} (geral)</option>
                        {subs.map(sub => (
                          <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                        ))}
                      </optgroup>
                    )
                  })}
                </select>
              )
            })()}
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Slug (URL)</h3>
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
              placeholder="meu-artigo"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
            />
            <p className="text-[10px] text-zinc-500 mt-2 break-all">
              /docs/…/<span className="text-zinc-300">{slug || 'slug'}</span>
            </p>
          </div>

          {/* Posição */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Ordem (posição)</h3>
            <input
              type="number"
              value={position}
              onChange={e => setPosition(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
            />
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-zinc-900 p-4">
            <h3 className="text-xs font-bold text-[#0EA5E9] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span>SEO</span>
              <span className="text-zinc-500 normal-case font-normal text-[10px]">Google</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-zinc-500 mb-1">
                  Title tag
                  <span className="ml-1 text-zinc-600">({seoTitle.length}/60)</span>
                </label>
                <input
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  maxLength={60}
                  placeholder={title || 'Título para o Google'}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 transition-colors placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-zinc-500 mb-1">
                  Meta description
                  <span className="ml-1 text-zinc-600">({seoDesc.length}/155)</span>
                </label>
                <textarea
                  value={seoDesc}
                  onChange={e => setSeoDesc(e.target.value)}
                  maxLength={155}
                  rows={3}
                  placeholder={excerpt || 'Descrição para o Google (até 155 caracteres)'}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs resize-none focus:outline-none focus:border-[#0EA5E9]/50 transition-colors placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-zinc-500 mb-1">
                  Palavras-chave
                  <span className="ml-1 text-zinc-600 font-normal">(separadas por vírgula)</span>
                </label>
                <input
                  value={seoKeywords}
                  onChange={e => setSeoKeywords(e.target.value)}
                  placeholder="hospedagem vps, servidor linux, cloud brasil"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#0EA5E9]/50 transition-colors placeholder-zinc-600"
                />
              </div>
              {/* Preview Google */}
              {(seoTitle || title) && (
                <div className="mt-2 p-3 rounded-xl bg-white border border-zinc-200">
                  <p className="text-[11px] text-zinc-400 mb-1">Prévia no Google</p>
                  <p className="text-[#1a0dab] text-sm font-medium leading-tight truncate">
                    {seoTitle || title} — Docs Hosteg
                  </p>
                  <p className="text-[#006621] text-[11px] truncate">
                    hosteg.com.br/docs/{slug || 'slug'}
                  </p>
                  <p className="text-zinc-600 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                    {seoDesc || excerpt || 'Sem descrição. Preencha o campo acima.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

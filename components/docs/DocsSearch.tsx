'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react'

interface Article {
  id: string
  title: string
  slug: string
  category_name: string
  category_slug: string
}

export default function DocsSearch({ articles }: { articles: Article[] }) {
  const [q, setQ] = useState('')
  const filtered = q.trim().length > 1
    ? articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.category_name.toLowerCase().includes(q.toLowerCase()))
    : []

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <MagnifyingGlass size={16} className="text-zinc-400" />
      </div>
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Pesquisar artigos, tutoriais..."
        className="w-full pl-11 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white transition-all"
      />
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-xl z-50 overflow-hidden">
          {filtered.slice(0, 8).map(a => (
            <Link key={a.id} href={`/docs/${a.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-500">{a.category_name}</span>
                <span className="text-sm text-zinc-700">{a.title}</span>
              </div>
              <ArrowRight size={12} className="text-zinc-400 flex-shrink-0" />
            </Link>
          ))}
          {filtered.length > 8 && (
            <div className="px-4 py-2 text-xs text-zinc-400 text-center">+{filtered.length - 8} resultados</div>
          )}
        </div>
      )}
      {q.trim().length > 1 && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-xl z-50 p-4 text-center text-sm text-zinc-400">
          Nenhum artigo encontrado para &quot;{q}&quot;
        </div>
      )}
    </div>
  )
}

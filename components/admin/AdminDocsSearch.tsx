'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

export default function AdminDocsSearch() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const q = searchParams.get('q') ?? ''

  const update = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
      params.delete('cat') // search overrides category filter
    } else {
      params.delete('q')
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }, [pathname, router, searchParams])

  return (
    <div className="relative">
      <MagnifyingGlass
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        value={q}
        onChange={e => update(e.target.value)}
        placeholder="Buscar artigos…"
        className="pl-8 pr-8 py-2 w-52 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
      />
      {q && (
        <button
          onClick={() => update('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </div>
  )
}

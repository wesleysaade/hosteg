'use client'

import { useState } from 'react'
import { Copy, X } from 'lucide-react'
import { clonePage } from './actions'

interface Page { slug: string; name: string }

interface Props {
  fromPage: Page
  allPages: Page[]
}

export function ClonePageButton({ fromPage, allPages }: Props) {
  const [open, setOpen] = useState(false)

  const targets = allPages.filter(p => p.slug !== fromPage.slug)

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors text-[11px] font-semibold"
      >
        <Copy size={11} />
        Clonar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white">Clonar conteúdo</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-zinc-400 mb-5">
              O conteúdo de <span className="text-white font-semibold">{fromPage.name}</span> será copiado para a página selecionada, substituindo o conteúdo existente.
            </p>

            <form action={clonePage}>
              <input type="hidden" name="from_slug" value={fromPage.slug} />

              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Copiar para:
              </label>
              <select
                name="to_slug"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9] mb-5 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Selecione uma página...</option>
                {targets.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold hover:bg-[#0284C7] transition-colors"
                >
                  Clonar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

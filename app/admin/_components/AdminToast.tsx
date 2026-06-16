'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export function AdminToast() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('saved') !== '1') return

    setVisible(true)

    // Remove o query param da URL sem reload
    const params = new URLSearchParams(searchParams.toString())
    params.delete('saved')
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname
    router.replace(newUrl, { scroll: false })

    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 shadow-2xl text-sm font-semibold text-white transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <CheckCircle size={15} className="text-emerald-400 shrink-0" />
      Salvo com sucesso!
    </div>
  )
}

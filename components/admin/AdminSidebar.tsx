'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  House, BookOpen, CurrencyDollar, SignOut, Globe, Package, Folders,
  PencilSimple, PuzzlePiece, Heartbeat, Server, Tag, Warning,
} from '@phosphor-icons/react'

const nav = [
  { href: '/admin',                          label: 'Dashboard',   icon: House,          sub: false },
  { href: '/admin/content',                  label: 'Conteúdo',    icon: PencilSimple,   sub: false },
  { href: '/admin/plans',                    label: 'Planos',      icon: CurrencyDollar, sub: false },
  { href: '/admin/addons',                   label: 'Adicionais',  icon: PuzzlePiece,    sub: false },
  { href: '/admin/docs',                     label: 'Docs',        icon: BookOpen,       sub: false },
  { href: '/admin/docs/categories',          label: 'Categorias',  icon: Folders,        sub: true  },
  { href: '/admin/cloud-apps',               label: 'Cloud APPs',  icon: Package,        sub: false },
  { href: '/admin/cloud-apps/categories',    label: 'Categorias',  icon: Folders,        sub: true  },
  { href: '/admin/status/services',          label: 'Status',      icon: Heartbeat,      sub: false },
  { href: '/admin/status/services',          label: 'Serviços',    icon: Server,         sub: true  },
  { href: '/admin/status/categories',        label: 'Categorias',  icon: Tag,            sub: true  },
  { href: '/admin/status/incidents',         label: 'Incidentes',  icon: Warning,        sub: true  },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <Link href="/" target="_blank" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
            <Globe size={14} weight="fill" className="text-white" />
          </div>
          <span className="font-black text-white text-sm">Hosteg</span>
          <span className="text-[10px] text-zinc-500 font-medium">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, sub }, idx) => {
          // "Status" parent entry should highlight for any /admin/status/* path
          const isStatusParent = href === '/admin/status/services' && label === 'Status'
          const active = href === '/admin'
            ? pathname === '/admin'
            : isStatusParent
              ? pathname.startsWith('/admin/status')
              : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${
                sub ? 'px-3 py-2 ml-5' : 'px-3 py-2.5'
              } ${
                active
                  ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon size={sub ? 14 : 16} weight={active ? 'fill' : 'regular'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <SignOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}

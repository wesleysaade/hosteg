'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CaretDown, List, X, ArrowSquareOut,
  HardDrives, Globe, Lightning, Stack, Cpu, ShareNetwork, Database, Monitor,
  GridFour, Robot, Package, Code, ChatCircle, GitFork, Browser, WindowsLogo,
  Buildings, MapPin, Info, Heartbeat, Shield, Lock, FolderOpen, Gear, Users,
  Cloud, Desktop, Rocket, Star, Fire, Wrench, TerminalWindow,
  ChartBar, Graph, Envelope, Phone, ShoppingCart, CreditCard, Tag, Archive,
  Briefcase, Bank, Book, Folder, File, Warning, CheckCircle, Circle,
  ArrowRight, House, Bell, Key, Network, ComputerTower, Buildings as BuildingsIcon,
} from '@phosphor-icons/react'
import type { NavMenuItem } from '@/lib/utils/nav'
import { groupByCategory } from '@/lib/utils/nav'

// ── Phosphor icon registry ────────────────────────────────────────────────────
const phosphorIconMap: Record<string, React.ComponentType<any>> = {
  Globe, Lightning, Stack, Cpu, HardDrives, ShareNetwork, Database, Monitor,
  GridFour, Robot, Package, Code, ChatCircle, GitFork, Browser, WindowsLogo,
  Buildings, MapPin, Info, Heartbeat, Shield, Lock, FolderOpen, Gear, Users,
  Cloud, Desktop, Rocket, Star, Fire, Wrench, TerminalWindow,
  ChartBar, Graph, Envelope, Phone, ShoppingCart, CreditCard, Tag, Archive,
  Briefcase, Bank, Book, Folder, File, Warning, CheckCircle, Circle,
  ArrowRight, House, Bell, Key, Network, Server: ComputerTower,
}
function getIcon(name: string): React.ComponentType<any> {
  return phosphorIconMap[name] ?? Globe
}

// ── Shared menu types ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavMenuSection = { category: string; items: { icon: React.ComponentType<any>; title: string; desc: string; href: string; badge: string }[] }

// ── Hardcoded fallbacks ───────────────────────────────────────────────────────
const defaultProdutosMenu: NavMenuSection[] = [
  {
    category: 'Hospedagem',
    items: [
      { icon: Globe,        title: 'Hospedagem Web',      desc: 'Sites e e-mail profissional com Painel Hosteg', href: '/hospedagem',        badge: '' },
      { icon: Lightning,    title: 'Hospedagem PRO',      desc: 'cPanel + LiteSpeed + Redis + Anti-spam',      href: '/hospedagem-pro',    badge: 'Popular' },
      { icon: Stack,        title: 'WordPress Hosting',   desc: 'Ambiente otimizado para WordPress',           href: '/wordpress',         badge: '' },
      { icon: WindowsLogo,  title: 'Hospedagem ASP.NET',  desc: 'Windows Server + Plesk + SQL Server',         href: '/hospedagem-aspnet', badge: 'Novo' },
    ],
  },
  {
    category: 'Agências e Revendas',
    items: [
      { icon: ShareNetwork, title: 'Revenda cPanel',      desc: 'Hospedagem white-label com cPanel',           href: '/revenda-cpanel',      badge: 'Novo' },
      { icon: ShareNetwork, title: 'Revenda Painel Hosteg', desc: 'Hospedagem white-label com Painel Hosteg',      href: '/revenda-hospedagem', badge: 'Novo' },
      { icon: WindowsLogo,  title: 'Revenda ASP.NET',     desc: 'Revenda Windows white-label com Plesk',       href: '/revenda-aspnet',      badge: 'Novo' },
    ],
  },
  {
    category: 'Corporativo',
    items: [
      { icon: Cpu,          title: 'Bare-Metal',          desc: 'Servidores Xeon dedicados, hardware exclusivo', href: '/bare-metal',      badge: '' },
      { icon: Database,     title: 'Database Cloud',      desc: 'MySQL, PostgreSQL, MongoDB, SQL Server',      href: '/database-cloud',   badge: '' },
      { icon: HardDrives,   title: 'BackupPRO',           desc: 'Backup gerenciado com tecnologia Acronis',    href: '/backup-pro',       badge: '' },
      { icon: GridFour,     title: 'ErpY',                desc: 'O Erp da Hosteg',                             href: '/hosteg-erp',       badge: '' },
      { icon: Monitor,      title: 'Terminal Server',     desc: 'Desktop Windows acessível pelo navegador',    href: '/terminal-server',  badge: '' },
    ],
  },
]

const defaultInstitucionalItems = [
  { icon: MapPin,    title: 'Datacenter',     desc: 'Infraestrutura física e certificações',      href: '/datacenter' },
  { icon: Heartbeat, title: 'Status',         desc: 'Disponibilidade dos serviços em tempo real', href: '/status' },
]

const defaultCloudAppsMenu: NavMenuSection[] = [
  {
    category: 'Automação & Comunicação',
    items: [
      { icon: GitFork,    title: 'N8N',           desc: 'Automação de fluxos e integrações',    href: '/cloud-apps', badge: '' },
      { icon: ChatCircle, title: 'Evolution API', desc: 'API WhatsApp multi-dispositivo',        href: '/cloud-apps', badge: 'Hot' },
      { icon: Robot,      title: 'Typebot',       desc: 'Construtor visual de chatbots',         href: '/cloud-apps', badge: '' },
      { icon: ChatCircle, title: 'Chatwoot',      desc: 'Suporte omnichannel unificado',         href: '/cloud-apps', badge: '' },
    ],
  },
  {
    category: 'Negócios & DevOps',
    items: [
      { icon: Browser,  title: 'Odoo',        desc: 'ERP open-source completo',                  href: '/cloud-apps', badge: '' },
      { icon: Code,     title: 'Supabase',    desc: 'Backend as a Service open-source',          href: '/cloud-apps', badge: '' },
      { icon: Package,  title: 'Easypanel',   desc: 'Gerenciador de servidores e apps',          href: '/cloud-apps', badge: '' },
      { icon: Stack,    title: 'Ver todos →', desc: '+ MinIO, MongoDB, Docker, Mautic e mais',   href: '/cloud-apps', badge: '' },
    ],
  },
]

// ── Build menu structures from DB navItems ────────────────────────────────────
function buildMenus(navItems: NavMenuItem[]) {
  const empty = !navItems.length
  const byGroup = (group: string) => navItems.filter(i => i.menu_group === group)
  // White-label: nunca exibir "DirectAdmin" no menu, mesmo vindo do banco
  const clean = (s: string) => (s ?? '').replace(/direct\s*admin/gi, 'Painel Hosteg')

  const produtosGroups  = empty ? [] : groupByCategory(byGroup('produtos'))
  const cloudAppsGroups = empty ? [] : groupByCategory(byGroup('cloud-apps'))

  const produtosFromDb = produtosGroups.map(g => ({
    category: g.category,
    items: g.items.map(i => ({ icon: getIcon(i.icon_name), title: clean(i.label), desc: clean(i.description), href: i.href, badge: i.badge })),
  }))
  const cloudAppsFromDb = cloudAppsGroups.map(g => ({
    category: g.category,
    items: g.items.map(i => ({ icon: getIcon(i.icon_name), title: clean(i.label), desc: clean(i.description), href: i.href, badge: i.badge })),
  }))

  const produtosBase  = produtosFromDb.length  ? produtosFromDb  : defaultProdutosMenu
  const cloudAppsBase = cloudAppsFromDb.length ? cloudAppsFromDb : defaultCloudAppsMenu

  // Cloud APPs deixou de ser menu de topo: agora é uma categoria dentro de "Produtos"
  const cloudAppsItems = cloudAppsBase.flatMap(s => s.items)
  const produtosMenu = cloudAppsItems.length
    ? [...produtosBase, { category: 'Cloud APPs', items: cloudAppsItems }]
    : produtosBase

  const institucionalDb = empty ? [] : byGroup('institucional').map(i => ({
    icon: getIcon(i.icon_name), title: clean(i.label), desc: clean(i.description), href: i.href,
  }))
  const institucionalItems = institucionalDb.length ? institucionalDb : defaultInstitucionalItems

  const mainItems = (!empty && byGroup('main').length) ? byGroup('main') : null
  const ctaItems  = (!empty && byGroup('cta').length)  ? byGroup('cta')  : null

  return { produtosMenu, institucionalItems, mainItems, ctaItems }
}

// ─────────────────────────────────────────────────────────────────────────────

type MenuName = 'produtos' | 'institucional' | 'cliente'

export default function NavbarClient({ navItems = [] }: { navItems?: NavMenuItem[] }) {
  const [openMenu, setOpenMenu]                       = useState<MenuName | null>(null)
  const [mobileOpen, setMobileOpen]                   = useState(false)
  const [scrolled, setScrolled]                       = useState(false)
  const [mobileProdutos, setMobileProdutos]           = useState(false)
  const [mobileInstitucional, setMobileInstitucional] = useState(false)
  const pathname                                      = usePathname()
  const navRef                                        = useRef<HTMLDivElement>(null)

  const { produtosMenu, institucionalItems, mainItems, ctaItems } = buildMenus(navItems)

  // Derived CTA data
  const supportHref      = ctaItems?.find(i => i.label.toLowerCase().includes('suporte'))?.href ?? '/contato'
  const clientAreaLabel  = ctaItems?.find(i => i.label.toLowerCase().includes('área') || i.label.toLowerCase().includes('cliente'))?.label ?? 'Área do Cliente'

  // Áreas do cliente — migração em 29/06/2026
  const newAreaHref = 'https://painel.hosteg.com.br'
  const oldAreaHref = 'https://painelcliente.com.br'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setOpenMenu(null) }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const toggle   = (name: MenuName) => setOpenMenu(prev => prev === name ? null : name)

  const linkCls = (active: boolean) =>
    `px-3.5 py-2 text-[15px] font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
      active ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70'
    }`

  const MegaMenuContent = ({ sections }: { sections: typeof produtosMenu }) => (
    <>
      <div className="p-6" style={{ display: 'grid', gridTemplateColumns: `repeat(${sections.length}, 1fr)`, gap: '1.5rem' }}>
        {sections.map((section) => (
          <div key={section.category}>
            <p className="text-[11px] font-bold text-[#0EA5E9] uppercase tracking-[0.13em] mb-3 pb-2.5 border-b border-zinc-100">
              {section.category}
            </p>
            <div className="space-y-px">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#0EA5E9]/5 transition-colors group"
                    onClick={() => setOpenMenu(null)}
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0EA5E9]/12 transition-colors mt-0.5">
                      <Icon size={17} weight="fill" className="text-zinc-400 group-hover:text-[#0EA5E9] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[15px] font-semibold text-zinc-800 group-hover:text-zinc-900">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0284C7] border border-[#0EA5E9]/20 uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-zinc-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-100 px-6 py-3 flex items-center justify-between bg-zinc-50/80">
        <span className="text-xs text-zinc-400">Precisa de ajuda para escolher?</span>
        <Link
          href="/contato"
          className="text-xs text-[#0284C7] hover:text-[#0EA5E9] font-bold flex items-center gap-1 transition-colors"
          onClick={() => setOpenMenu(null)}
        >
          Fale com a gente <ArrowSquareOut size={11} weight="bold" />
        </Link>
      </div>
    </>
  )

  return (
    <>
      {openMenu && (
        <div className="fixed inset-0 z-[49]" aria-hidden="true" onClick={() => setOpenMenu(null)} />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-200/70 shadow-[0_1px_24px_rgba(0,0,0,0.05)]'
            : 'bg-white border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={navRef} className="relative flex items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10 flex items-baseline gap-px group/logo">
              <span
                className="font-display text-[26px] font-bold leading-none tracking-[-0.05em] transition-colors duration-200"
                style={{ color: '#0EA5E9' }}
              >
                HOSTEG
              </span>
              <span className="font-display text-[26px] font-bold leading-none text-zinc-900 transition-opacity duration-200 group-hover/logo:opacity-40">.</span>
            </Link>

            {/* Desktop nav */}
            <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-0.5">
              {/* Main direct links from DB, or fallback to Cloud VPS + WordPress */}
              {mainItems ? (
                mainItems.map(item => (
                  <Link key={item.id} href={item.href} className={linkCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/cloud-vps" className={linkCls(isActive('/cloud-vps'))}>Cloud VPS</Link>
                  <Link href="/wordpress" className={linkCls(isActive('/wordpress'))}>WordPress</Link>
                </>
              )}

              {/* Produtos */}
              <button onClick={() => toggle('produtos')} className={linkCls(openMenu === 'produtos')}>
                <span className="flex items-center gap-1">
                  Produtos
                  <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ${openMenu === 'produtos' ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Institucional */}
              <div className="relative">
                <button
                  onClick={() => toggle('institucional')}
                  className={linkCls(openMenu === 'institucional' || isActive('/datacenter') || isActive('/contratos') || isActive('/status'))}
                >
                  <span className="flex items-center gap-1">
                    Institucional
                    <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ${openMenu === 'institucional' ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {openMenu === 'institucional' && (
                  <div className="absolute top-full right-0 mt-2.5 w-64 bg-white border border-zinc-200/80 rounded-[20px] shadow-[0_24px_70px_-20px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.02] overflow-hidden z-50">
                    <div className="p-2">
                      {institucionalItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0EA5E9]/5 transition-colors group"
                            onClick={() => setOpenMenu(null)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0EA5E9]/12 transition-colors">
                              <Icon size={15} weight="fill" className="text-zinc-400 group-hover:text-[#0EA5E9] transition-colors" />
                            </div>
                            <div>
                              <div className="text-[15px] font-semibold text-zinc-800 group-hover:text-zinc-900">{item.title}</div>
                              <div className="text-[13px] text-zinc-500 mt-0.5 leading-snug">{item.desc}</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* CTAs */}
            <div className="ml-auto hidden lg:flex items-center gap-1 z-10 flex-shrink-0">
              <Link href={supportHref} className="px-3 py-2 text-[15px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                Suporte
              </Link>

              <div className="relative ml-2">
                <button
                  onClick={() => toggle('cliente')}
                  className="inline-flex items-center gap-1.5 pl-4 pr-3 py-2.5 text-sm font-semibold text-white rounded-full bg-zinc-900 hover:bg-[#0EA5E9] transition-all duration-200 shadow-sm"
                >
                  {clientAreaLabel}
                  <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ${openMenu === 'cliente' ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === 'cliente' && (
                  <div className="absolute top-full right-0 mt-2.5 w-[300px] bg-white border border-zinc-200/80 rounded-[20px] shadow-[0_24px_70px_-20px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.02] overflow-hidden z-50">
                    <div className="px-4 pt-4 pb-1">
                      <p className="text-[11px] font-bold text-[#0EA5E9] uppercase tracking-[0.13em]">Acessar painel</p>
                    </div>
                    <div className="p-2">
                      <a
                        href={newAreaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#0EA5E9]/5 transition-colors group"
                        onClick={() => setOpenMenu(null)}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Rocket size={17} weight="fill" className="text-[#0EA5E9]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-semibold text-zinc-900">Nova Área</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0284C7] border border-[#0EA5E9]/20 uppercase tracking-wide">Atual</span>
                          </div>
                          <p className="text-[13px] text-zinc-500 mt-0.5 leading-snug">painel.hosteg.com.br</p>
                        </div>
                      </a>
                      <a
                        href={oldAreaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                        onClick={() => setOpenMenu(null)}
                      >
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-zinc-200/70 transition-colors">
                          <Archive size={17} weight="fill" className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[15px] font-semibold text-zinc-800">Área Antiga</span>
                          <p className="text-[13px] text-zinc-500 mt-0.5 leading-snug">Contas criadas antes de 29/06/2026</p>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-auto p-2 text-zinc-500 hover:text-zinc-900 transition-colors z-10"
            >
              {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>

            {/* Mega menu — Produtos (inclui Cloud APPs como categoria) */}
            {openMenu === 'produtos' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[1180px] bg-white border border-zinc-200/80 rounded-[20px] shadow-[0_24px_70px_-20px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.02] overflow-hidden z-50"
                style={{ maxWidth: 'calc(100vw - 2rem)' }}
              >
                <MegaMenuContent sections={produtosMenu} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden pt-16 overflow-y-auto">
          <div className="px-4 py-6 space-y-1 border-t border-zinc-100">
            {/* Main links */}
            {mainItems ? (
              mainItems.map(item => (
                <Link key={item.id} href={item.href}
                  className="flex items-center px-4 py-3 text-base font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors">
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="/cloud-vps" className="flex items-center px-4 py-3 text-base font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors">
                  Cloud VPS
                </Link>
                <Link href="/wordpress" className="flex items-center px-4 py-3 text-base font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors">
                  WordPress
                </Link>
              </>
            )}

            {/* Mobile Produtos */}
            <button onClick={() => setMobileProdutos(!mobileProdutos)}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors">
              Produtos
              <CaretDown size={16} weight="bold" className={`transition-transform duration-200 ${mobileProdutos ? 'rotate-180' : ''}`} />
            </button>
            {mobileProdutos && (
              <div className="ml-4 border-l-2 border-[#0EA5E9]/20 pl-4 space-y-0.5">
                {produtosMenu.map((section) => (
                  <div key={section.category} className="pt-2">
                    <p className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest mb-1 px-3">{section.category}</p>
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link key={item.title} href={item.href}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
                          <Icon size={15} weight="fill" className="text-zinc-400 flex-shrink-0" />
                          {item.title}
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0284C7] uppercase tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}


            {/* Mobile Institucional */}
            <button onClick={() => setMobileInstitucional(!mobileInstitucional)}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors">
              Institucional
              <CaretDown size={16} weight="bold" className={`transition-transform duration-200 ${mobileInstitucional ? 'rotate-180' : ''}`} />
            </button>
            {mobileInstitucional && (
              <div className="ml-4 border-l-2 border-[#0EA5E9]/20 pl-4 space-y-0.5">
                {institucionalItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.title} href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
                      <Icon size={15} weight="fill" className="text-zinc-400 flex-shrink-0" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            )}

            <div className="pt-4 space-y-3 border-t border-zinc-100">
              <Link href={supportHref}
                className="block text-center px-4 py-3 text-base font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                Suporte
              </Link>
              <p className="px-1 pt-1 text-[11px] font-bold text-[#0EA5E9] uppercase tracking-[0.13em]">Acessar painel</p>
              <a href={newAreaHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-base font-bold bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl transition-colors">
                <Rocket size={16} weight="fill" /> Nova Área
              </a>
              <a href={oldAreaHref} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                <Archive size={15} weight="fill" className="text-zinc-400" /> Área Antiga
                <span className="text-zinc-400 font-normal">· antes de 29/06/2026</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

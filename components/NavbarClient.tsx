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
  ArrowRight, House, Bell, Key, Network, ComputerTower as Server,
}
function getIcon(name: string): React.ComponentType<any> {
  return phosphorIconMap[name] ?? Globe
}

// ── Hardcoded fallbacks ───────────────────────────────────────────────────────
const defaultProdutosMenu = [
  {
    category: 'Hospedagem',
    items: [
      { icon: Globe,        title: 'Hospedagem Web',      desc: 'Sites e e-mail profissional com DirectAdmin', href: '/hospedagem',        badge: '' },
      { icon: Lightning,    title: 'Hospedagem PRO',      desc: 'cPanel + LiteSpeed + Redis + Anti-spam',      href: '/hospedagem-pro',    badge: 'Popular' },
      { icon: Stack,        title: 'WordPress Hosting',   desc: 'Ambiente otimizado para WordPress',           href: '/wordpress',         badge: '' },
      { icon: WindowsLogo,  title: 'Hospedagem ASP.NET',  desc: 'Windows Server + Plesk + SQL Server',         href: '/hospedagem-aspnet', badge: 'Novo' },
    ],
  },
  {
    category: 'Agências e Revendas',
    items: [
      { icon: ShareNetwork, title: 'Revenda cPanel',      desc: 'Hospedagem white-label com cPanel',           href: '/revenda-cpanel',      badge: 'Novo' },
      { icon: ShareNetwork, title: 'Revenda DirectAdmin', desc: 'Hospedagem white-label com DirectAdmin',      href: '/revenda-directadmin', badge: 'Novo' },
      { icon: WindowsLogo,  title: 'Revenda ASP.NET',     desc: 'Revenda Windows white-label com Plesk',       href: '/revenda-aspnet',      badge: 'Novo' },
    ],
  },
  {
    category: 'Corporativo',
    items: [
      { icon: Cpu,          title: 'Bare-Metal',          desc: 'Servidores Xeon dedicados, hardware exclusivo', href: '/bare-metal',      badge: '' },
      { icon: Database,     title: 'Database Cloud',      desc: 'MySQL, PostgreSQL, MongoDB, SQL Server',      href: '/database-cloud',   badge: '' },
      { icon: HardDrives,   title: 'BackupPRO',           desc: 'Backup gerenciado com tecnologia Acronis',    href: '/backup-pro',       badge: '' },
      { icon: GridFour,     title: 'Hosteg ERP',          desc: 'ERP completo na nuvem via hosteg.cloud',      href: '/hosteg-erp',       badge: '' },
      { icon: Monitor,      title: 'Terminal Server',     desc: 'Desktop Windows acessível pelo navegador',    href: '/terminal-server',  badge: '' },
    ],
  },
]

const defaultInstitucionalItems = [
  { icon: Info,      title: 'Sobre a Hosteg', desc: 'Nossa história, missão e valores',           href: '/sobre' },
  { icon: MapPin,    title: 'Datacenter',     desc: 'Infraestrutura física e certificações',      href: '/datacenter' },
  { icon: Heartbeat, title: 'Status',         desc: 'Disponibilidade dos serviços em tempo real', href: '/status' },
]

const defaultCloudAppsMenu = [
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
  if (!navItems.length) return { produtosMenu: defaultProdutosMenu, cloudAppsMenu: defaultCloudAppsMenu, institucionalItems: defaultInstitucionalItems, mainItems: null, ctaItems: null }

  const byGroup = (group: string) => navItems.filter(i => i.menu_group === group)

  // Mega menus
  const produtosGroups = groupByCategory(byGroup('produtos'))
  const cloudAppsGroups = groupByCategory(byGroup('cloud-apps'))

  const produtosMenu = produtosGroups.map(g => ({
    category: g.category,
    items: g.items.map(i => ({ icon: getIcon(i.icon_name), title: i.label, desc: i.description, href: i.href, badge: i.badge })),
  }))

  const cloudAppsMenu = cloudAppsGroups.map(g => ({
    category: g.category,
    items: g.items.map(i => ({ icon: getIcon(i.icon_name), title: i.label, desc: i.description, href: i.href, badge: i.badge })),
  }))

  const institucionalItems = byGroup('institucional').map(i => ({
    icon: getIcon(i.icon_name), title: i.label, desc: i.description, href: i.href,
  }))

  const mainItems = byGroup('main').length ? byGroup('main') : null
  const ctaItems  = byGroup('cta').length  ? byGroup('cta')  : null

  return {
    produtosMenu:  produtosMenu.length  ? produtosMenu  : defaultProdutosMenu,
    cloudAppsMenu: cloudAppsMenu.length ? cloudAppsMenu : defaultCloudAppsMenu,
    institucionalItems: institucionalItems.length ? institucionalItems : defaultInstitucionalItems,
    mainItems,
    ctaItems,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

type MenuName = 'produtos' | 'cloud-apps' | 'institucional'

export default function NavbarClient({ navItems = [] }: { navItems?: NavMenuItem[] }) {
  const [openMenu, setOpenMenu]                       = useState<MenuName | null>(null)
  const [mobileOpen, setMobileOpen]                   = useState(false)
  const [scrolled, setScrolled]                       = useState(false)
  const [mobileProdutos, setMobileProdutos]           = useState(false)
  const [mobileApps, setMobileApps]                   = useState(false)
  const [mobileInstitucional, setMobileInstitucional] = useState(false)
  const pathname                                      = usePathname()
  const navRef                                        = useRef<HTMLDivElement>(null)

  const { produtosMenu, cloudAppsMenu, institucionalItems, mainItems, ctaItems } = buildMenus(navItems)

  // Derived CTA data
  const supportHref      = ctaItems?.find(i => i.label.toLowerCase().includes('suporte'))?.href ?? '/contato'
  const loginHref        = ctaItems?.find(i => i.label.toLowerCase().includes('login'))?.href ?? 'https://painelcliente.com.br'
  const clientAreaHref   = ctaItems?.find(i => i.label.toLowerCase().includes('área') || i.label.toLowerCase().includes('cliente'))?.href ?? 'https://painelcliente.com.br'
  const clientAreaLabel  = ctaItems?.find(i => i.label.toLowerCase().includes('área') || i.label.toLowerCase().includes('cliente'))?.label ?? 'Área do Cliente'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setOpenMenu(null) }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const toggle   = (name: MenuName) => setOpenMenu(prev => prev === name ? null : name)

  const linkCls = (active: boolean) =>
    `px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap ${
      active ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
    }`

  const MegaMenuContent = ({ sections }: { sections: typeof produtosMenu }) => (
    <>
      <div className="p-6" style={{ display: 'grid', gridTemplateColumns: `repeat(${sections.length}, 1fr)`, gap: '1.5rem' }}>
        {sections.map((section) => (
          <div key={section.category}>
            <p className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest mb-3 pb-2 border-b border-zinc-100">
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
                        <span className="text-sm font-bold text-zinc-800 group-hover:text-zinc-900">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0284C7] border border-[#0EA5E9]/20 uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.desc}</p>
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white ${
          scrolled ? 'border-b border-zinc-200 shadow-sm' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={navRef} className="relative flex items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span className="text-2xl font-black tracking-tight" style={{ color: '#0EA5E9' }}>
                HOSTEG
              </span>
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

              {/* Cloud APPs */}
              <button onClick={() => toggle('cloud-apps')} className={linkCls(openMenu === 'cloud-apps')}>
                <span className="flex items-center gap-1">
                  Cloud APPs
                  <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ${openMenu === 'cloud-apps' ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Institucional */}
              <div className="relative">
                <button
                  onClick={() => toggle('institucional')}
                  className={linkCls(openMenu === 'institucional' || isActive('/sobre') || isActive('/datacenter') || isActive('/contratos') || isActive('/status'))}
                >
                  <span className="flex items-center gap-1">
                    Institucional
                    <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ${openMenu === 'institucional' ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {openMenu === 'institucional' && (
                  <div className="absolute top-full right-0 mt-2.5 w-64 bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
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
                              <div className="text-sm font-bold text-zinc-800 group-hover:text-zinc-900">{item.title}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
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
            <div className="ml-auto hidden lg:flex items-center gap-3 z-10 flex-shrink-0">
              <Link href={supportHref} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Suporte
              </Link>
              <a href={loginHref} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                Login
              </a>
              <a href={clientAreaHref} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg transition-colors shadow-sm shadow-[#0EA5E9]/30">
                {clientAreaLabel}
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-auto p-2 text-zinc-500 hover:text-zinc-900 transition-colors z-10"
            >
              {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>

            {/* Mega menus */}
            {openMenu === 'produtos' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[1000px] bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50"
                style={{ maxWidth: 'calc(100vw - 2rem)' }}
              >
                <MegaMenuContent sections={produtosMenu} />
              </div>
            )}
            {openMenu === 'cloud-apps' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[660px] bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50"
                style={{ maxWidth: 'calc(100vw - 2rem)' }}
              >
                <MegaMenuContent sections={cloudAppsMenu} />
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

            {/* Mobile Cloud APPs */}
            <button onClick={() => setMobileApps(!mobileApps)}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors">
              Cloud APPs
              <CaretDown size={16} weight="bold" className={`transition-transform duration-200 ${mobileApps ? 'rotate-180' : ''}`} />
            </button>
            {mobileApps && (
              <div className="ml-4 border-l-2 border-[#0EA5E9]/20 pl-4 space-y-0.5">
                {cloudAppsMenu.flatMap((s) => s.items).map((item) => {
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
              <a href={loginHref} target="_blank" rel="noopener noreferrer"
                className="block text-center px-4 py-3 text-base font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                Login
              </a>
              <a href={clientAreaHref} target="_blank" rel="noopener noreferrer"
                className="block text-center px-4 py-3 text-base font-bold bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl transition-colors">
                {clientAreaLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

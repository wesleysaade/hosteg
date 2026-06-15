import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  HardDrives, ShieldCheck, Lock, ArrowsClockwise, Globe, Desktop, ArrowRight,
  Monitor, DeviceMobile, Cloud, Database, FileLock,
} from '@phosphor-icons/react/dist/ssr'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'BackupPRO — Backup Gerenciado com Tecnologia Acronis',
  description: 'Solução de backup corporativo com tecnologia Acronis, entregue como HostegBACKUP. Proteção completa para servidores, VMs, arquivos e bancos de dados.',
}

const agentTypes = [
  {
    icon: Monitor,
    name: 'Servidores Físicos',
    desc: 'Linux e Windows Server',
    detail: 'Ubuntu, Debian, CentOS, AlmaLinux, Rocky, Windows Server 2016–2022. Agente leve de < 50 MB.',
  },
  {
    icon: Desktop,
    name: 'Workstations',
    desc: 'Windows e macOS',
    detail: 'Proteja computadores de usuários, laptops e desktops com backup incremental automático.',
  },
  {
    icon: Cloud,
    name: 'Máquinas Virtuais',
    desc: 'VMware e Hyper-V',
    detail: 'Backup sem agente de VMs via hypervisor. VMware vSphere, ESXi 6.x+ e Microsoft Hyper-V.',
  },
  {
    icon: Database,
    name: 'Bancos de Dados',
    desc: 'MySQL, MSSQL, PostgreSQL',
    detail: 'Snapshots consistentes sem downtime usando quiesce automático.',
  },
  {
    icon: Globe,
    name: 'Cloud Apps',
    desc: 'Microsoft 365 e Google Workspace',
    detail: 'E-mail, Drive, OneDrive, SharePoint, Teams, Gmail, Calendário e Contatos.',
  },
  {
    icon: DeviceMobile,
    name: 'Dispositivos Móveis',
    desc: 'Android e iOS',
    detail: 'Backup de contatos, fotos, SMS e configurações de dispositivos corporativos.',
  },
]

const restoreTypes = [
  {
    name: 'Bare-Metal Recovery',
    badge: 'Todos os planos',
    badgeColor: 'bg-zinc-100 text-zinc-700',
    desc: 'Restaure um servidor completo — sistema operacional, configurações, drivers e dados — em hardware totalmente diferente. Sem reinstalação, sem reconfigurações manuais.',
  },
  {
    name: 'Recuperação Granular',
    badge: 'Business+',
    badgeColor: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
    desc: 'Navegue pelo conteúdo de um backup completo e restaure apenas os arquivos e pastas que você precisa, sem restaurar o sistema inteiro.',
  },
  {
    name: 'Recuperação de Banco de Dados',
    badge: 'Business+',
    badgeColor: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
    desc: 'Restaure tabelas, registros ou schemas específicos dentro de um banco MySQL, MSSQL ou PostgreSQL — sem derrubar a instância.',
  },
  {
    name: 'RunVM (Recuperação Instantânea)',
    badge: 'Pro+',
    badgeColor: 'bg-purple-100 text-purple-700',
    desc: 'Execute uma VM diretamente do arquivo de backup em segundos. Ideal para continuar operando enquanto a restauração completa está em andamento.',
  },
  {
    name: 'Disaster Recovery',
    badge: 'Enterprise',
    badgeColor: 'bg-amber-100 text-amber-700',
    desc: 'Failover automático para infraestrutura de nuvem com RTO menor que 15 minutos. Seus sistemas voltam a operar sem intervenção manual.',
  },
  {
    name: 'Recuperação de Cloud Apps',
    badge: 'Pro+',
    badgeColor: 'bg-purple-100 text-purple-700',
    desc: 'Restaure e-mails, arquivos do Drive/OneDrive, calendários e contatos do Microsoft 365 ou Google Workspace — incluindo dados deletados.',
  },
]

const highlights = [
  { icon: ShieldCheck,     title: 'Tecnologia Acronis',        desc: 'HostegBACKUP é baseado na plataforma Acronis, líder mundial em backup corporativo. A mesma tecnologia usada por Fortune 500.' },
  { icon: Lock,            title: 'Criptografia AES-256',       desc: 'Todos os dados são criptografados antes de sair do servidor com AES-256. Nem a Hosteg consegue acessar seus dados.' },
  { icon: HardDrives,      title: 'Recuperação Bare-Metal',     desc: 'Restaure um servidor completo do zero em minutos, incluindo sistema operacional, configurações e dados.' },
  { icon: ArrowsClockwise, title: 'Deduplicação e Compressão',  desc: 'Economize até 70% de espaço com deduplicação inteligente. Dados idênticos não são duplicados no storage.' },
  { icon: Globe,           title: 'Painel Centralizado',        desc: 'Gerencie todos os backups de todos os dispositivos em um único painel web. Monitore status e restaure arquivos.' },
  { icon: FileLock,        title: 'Multi-plataforma',           desc: 'Proteja servidores físicos, VMs, bancos de dados, Microsoft 365 e Google Workspace em um único plano.' },
]

export default async function BackupProPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('backup-pro'),
    getHero('backup-pro', {
      badge:    'Corporativo',
      title:    'HostegBACKUP',
      subtitle: 'Backup corporativo com tecnologia Acronis. Seus dados protegidos com o melhor do mercado.',
      desc:     'Recuperação bare-metal, backup contínuo, criptografia AES-256 e painel centralizado.',
    }),
  ])

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
            <HardDrives size={12} weight="fill" /> Corporativo
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            {hero.subtitle}
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            {hero.desc}
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm">
            <img src="https://cdn.simpleicons.org/acronis/EF1C25" alt="Acronis" width={28} height={28} />
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-900">Powered by Acronis Technology</div>
              <div className="text-xs text-zinc-500">Entregue pela Hosteg como HostegBACKUP</div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="backup-pro" />
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">O que você pode proteger</h2>
            <p className="text-zinc-500">Agentes disponíveis para todos os ambientes da sua infraestrutura.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentTypes.map((agent) => {
              const Icon = agent.icon
              return (
                <div key={agent.name} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center group-hover:bg-[#0EA5E9]/20 transition-colors">
                      <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 text-sm">{agent.name}</div>
                      <div className="text-xs text-zinc-500">{agent.desc}</div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{agent.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Restore Types */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tipos de recuperação</h2>
            <p className="text-zinc-500">Do arquivo individual ao datacenter completo — você escolhe como recuperar.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restoreTypes.map((rt) => (
              <div key={rt.name} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-zinc-900 text-sm leading-snug">{rt.name}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full ${rt.badgeColor}`}>
                    {rt.badge}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{rt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que o HostegBACKUP */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Por que o HostegBACKUP?</h2>
            <p className="text-zinc-500">A tecnologia Acronis com o suporte humano da Hosteg.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Migração */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/4 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
              <ArrowsClockwise size={26} weight="fill" className="text-[#0EA5E9]" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração assistida gratuita</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nosso time migra seus backups existentes, instala os agentes e valida os primeiros backups sem custo adicional. Suporte completo durante toda a implantação.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Falar com especialista <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Proteja seus dados hoje</h2>
          <p className="text-zinc-500 mb-8">Um backup que nunca falha. Recuperação em minutos, não dias.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Contratar HostegBACKUP <ArrowRight size={15} weight="bold" />
            </a>
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Falar com consultor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

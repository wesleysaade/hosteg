import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import {

  WindowsLogo, Desktop, ShieldCheck, Lock, Database, ArrowRight, Lightning, Globe,
} from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hospedagem ASP.NET com Plesk — Hosteg',
  description: 'Hospedagem Windows com ASP.NET, Plesk, SQL Server e IIS. Ideal para sistemas .NET, aplicações C# e integrações Microsoft.',
}

const features = [
  { icon: WindowsLogo, title: 'Windows Server 2022',    desc: 'Servidores com a versão mais recente do Windows Server, atualizado e com patches de segurança aplicados automaticamente.' },
  { icon: Desktop,     title: 'Plesk Obsidian',         desc: 'O painel de controle mais completo para ambientes Windows. Gerencie domínios, e-mails, aplicações e bancos de dados com facilidade.' },
  { icon: Database,    title: 'SQL Server 2022',        desc: 'Banco de dados Microsoft integrado em todos os planos. Suporte a T-SQL, stored procedures, jobs e todas as funcionalidades do SQL Server.' },
  { icon: Lightning,   title: 'IIS + .NET Otimizado',  desc: 'Internet Information Services configurado e otimizado para ASP.NET MVC, Web API, gRPC e todas as variantes do .NET.' },
  { icon: ShieldCheck, title: 'Segurança Windows',      desc: 'Windows Defender, firewall configurado, certificados SSL automáticos e monitoramento de integridade via Plesk Security Advisor.' },
  { icon: Lock,        title: 'SSL Automático',         desc: 'Let\'s Encrypt integrado ao Plesk com renovação automática. Suporte a certificados próprios de terceiros via upload.' },
]

export default async function HospedagemAspNetPage() {
  const { plans, availablePeriods } = await fetchBillingPlans('hospedagem-aspnet')
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0078D4, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0078D4]/20 bg-[#0078D4]/8 text-[#0078D4] text-xs font-semibold">
            <WindowsLogo size={11} weight="fill" /> Hospedagem Windows
          </div>
          {/* Logos */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/logos/windows.svg"
              alt="Windows"
              width={36}
              height={36}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,120,212,0.3))' }}
            />
            <img
              src="/logos/plesk.svg"
              alt="Plesk"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(82,187,230,0.3))' }}
            />
            <img
              src="https://cdn.simpleicons.org/microsoftsqlserver/CC2222"
              alt="SQL Server"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 6px rgba(204,34,34,0.25))' }}
            />
            <img
              src="https://cdn.simpleicons.org/dotnet/512BD4"
              alt=".NET"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 6px rgba(81,43,212,0.25))' }}
            />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4 leading-tight">
            Hospedagem ASP.NET
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-3">
            Windows Server, Plesk, SQL Server e IIS — tudo incluso.
          </p>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Ideal para sistemas .NET, aplicações C#, APIs Web e integrações com o ecossistema Microsoft.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="hospedagem-aspnet" />
        </div>
      </section>

      {/* Migração */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#0078D4]/20 bg-[#0078D4]/4 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0078D4]/10 flex items-center justify-center flex-shrink-0">
              <img src="/logos/windows.svg" alt="Windows" width={28} height={28} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita de aplicações .NET</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nossa equipe migra suas aplicações ASP.NET, bancos SQL Server e configurações IIS gratuitamente. Suporte completo durante toda a implantação.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0078D4] hover:bg-[#0063B1] text-white font-bold rounded-xl text-sm transition-colors">
              Solicitar migração <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Stack Microsoft completo</h2>
            <p className="text-zinc-500">Tudo que você precisa para aplicações .NET em produção.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0078D4]/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0078D4]/10 flex items-center justify-center mb-4 group-hover:bg-[#0078D4]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0078D4]" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 mb-4">Precisa de mais poder para aplicações críticas?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cloud-vps"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Ver Cloud VPS <ArrowRight size={14} weight="bold" />
            </Link>
            <Link href="/revenda-aspnet"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 text-sm transition-colors">
              Ver Revenda ASP.NET <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

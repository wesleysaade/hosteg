import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import {

  WindowsLogo, Users, Globe, ShieldCheck, Lock, Database,
  ArrowRight, Lightning, Desktop, CaretDown,
} from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Revenda ASP.NET com Plesk — Hosteg',
  description: 'Revenda de hospedagem Windows com Plesk Obsidian para agências e desenvolvedores .NET. White-label, SQL Server incluso e suporte 24/7.',
}

const features = [
  { icon: Users,       title: 'Plesk Reseller Panel',         desc: 'Gerencie todas as contas Windows dos seus clientes via Plesk com visão de revendedor. Crie, edite e monitore recursos de cada conta.' },
  { icon: Globe,       title: 'White-label Total',            desc: 'Configure nameservers próprios e branding completo. Seus clientes verão somente a sua marca em todos os pontos de contato.' },
  { icon: Database,    title: 'SQL Server por Conta',         desc: 'Cada cliente recebe seu próprio SQL Server 2022, isolado e gerenciado via Plesk. Suporte a stored procedures, jobs e T-SQL.' },
  { icon: Lightning,   title: 'IIS + ASP.NET Otimizado',     desc: '.NET Framework e .NET Core configurados por conta, com IIS otimizado para máxima performance em aplicações Windows.' },
  { icon: ShieldCheck, title: 'SSL Automático para Todos',   desc: 'Emita certificados SSL grátis para todos os domínios de todos os seus clientes com um clique via Plesk Security Advisor.' },
  { icon: Desktop,     title: 'WHMCS Compatível',            desc: 'API do Plesk integra nativamente com WHMCS para automatizar ativação de contas, cobranças e gerenciamento da sua revenda.' },
]

const faqs = [
  { q: 'Como funciona o painel de revendedor Plesk?', a: 'Você recebe acesso ao Plesk com perfil de revendedor, podendo criar e gerenciar todas as contas dos seus clientes. Cada cliente tem seu próprio Plesk isolado.' },
  { q: 'Meus clientes saberão que uso a Hosteg?', a: 'Não, com white-label configurado. Configure nameservers próprios e seu domínio de painel — toda a hospedagem aparece com a sua marca.' },
  { q: 'Posso integrar com WHMCS para automatizar cobranças?', a: 'Sim! O Plesk tem API nativa compatível com WHMCS. Configure módulo Plesk no WHMCS para automatizar ativação, suspensão e cancelamento de contas.' },
  { q: 'Como funciona a migração dos clientes existentes?', a: 'Nossa equipe migra gratuitamente todas as aplicações ASP.NET, bancos SQL Server e configurações IIS dos seus clientes atuais para a Hosteg.' },
]

export default async function RevendaAspNetPage() {
  const { plans, availablePeriods } = await fetchBillingPlans('revenda-aspnet')
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0078D4, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0078D4]/20 bg-[#0078D4]/8 text-[#0078D4] text-xs font-bold uppercase tracking-wider">
            <Users size={12} weight="fill" /> Agências & Revendas Windows
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/logos/windows.svg"
              alt="Windows"
              width={38}
              height={38}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,120,212,0.3))' }}
            />
            <img
              src="/logos/plesk.svg"
              alt="Plesk"
              width={36}
              height={36}
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
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            Revenda ASP.NET<br />
            <span style={{ color: '#0078D4' }}>com Plesk</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            Crie sua empresa de hospedagem Windows com infraestrutura Hosteg.
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Plesk Obsidian Reseller incluso, white-label total, SQL Server e .NET para cada cliente.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="revenda-aspnet" />
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
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita de revendas e clientes Windows</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nossa equipe migra todas as aplicações ASP.NET, bancos SQL Server e configurações Plesk dos seus clientes gratuitamente. Zero downtime durante a migração.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0078D4] hover:bg-[#0063B1] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0078D4]/20">
              Falar com consultor <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#0078D4] text-xs font-bold uppercase tracking-widest mb-3">
              <Users size={13} weight="fill" /> Por que revender Windows com a Hosteg?
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tudo que você precisa para revender .NET</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Infraestrutura Windows de alto nível, white-label completo e suporte especializado em ASP.NET.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0078D4]/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0078D4]/10 flex items-center justify-center mb-4 group-hover:bg-[#0078D4]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0078D4]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zinc-900 mb-8 text-center">Dúvidas sobre a Revenda Windows</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 transition-colors">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                  <span className="text-sm font-semibold text-zinc-900 pr-4">{faq.q}</span>
                  <CaretDown size={16} weight="bold" className="text-zinc-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-5 border-t border-zinc-100">
                  <p className="text-sm text-zinc-500 leading-relaxed pt-4">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Monte sua revenda Windows hoje</h2>
          <p className="text-zinc-500 mb-8">Migração grátis dos clientes existentes. Ativação em minutos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0078D4] hover:bg-[#0063B1] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0078D4]/30">
              Contratar Revenda ASP.NET <ArrowRight size={15} weight="bold" />
            </a>
            <Link href="/hospedagem-aspnet"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Ver Hospedagem ASP.NET
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

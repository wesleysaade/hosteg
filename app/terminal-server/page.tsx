import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MonitorPlay, CheckCircle2, ArrowRight, Globe, Shield, Zap, Users, Lock, Wifi } from 'lucide-react'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Terminal Server Virtual — Desktop Windows na Nuvem',
  description: 'Acesse o Windows pela internet via navegador. Ideal para sistemas legados, software de gestão e aplicações que precisam rodar em ambiente Windows.',
}


const useCases = [
  {
    icon: Globe,
    title: 'Sistemas legados no navegador',
    desc: 'Tem um ERP antigo, software de gestão ou sistema que só funciona no Windows instalado? Rode na nuvem e acesse pelo navegador, sem precisar de máquina física.',
  },
  {
    icon: Users,
    title: 'Home office com segurança',
    desc: 'Permita que sua equipe trabalhe de casa com o mesmo ambiente Windows da empresa. Nada fica no computador do funcionário — tudo está na nuvem.',
  },
  {
    icon: Zap,
    title: 'Software pesado sem hardware caro',
    desc: 'Rode AutoCAD, Adobe Premiere, software de contabilidade ou ERP robusto sem precisar de computadores caros. O processamento fica na nuvem.',
  },
  {
    icon: Shield,
    title: 'Segurança e conformidade',
    desc: 'Dados sensíveis nunca ficam no dispositivo do usuário final. Controle total de quem acessa, quando e de onde. Logs de auditoria completos.',
  },
  {
    icon: Lock,
    title: 'Escritórios remotos unificados',
    desc: 'Unifique múltiplos escritórios em um único ambiente Windows compartilhado. Todos trabalham nos mesmos arquivos e sistemas, em tempo real.',
  },
  {
    icon: Wifi,
    title: 'Acesso de qualquer dispositivo',
    desc: 'Acesse do tablet, smartphone, MacBook ou computador fraco. Qualquer dispositivo com navegador funciona, sem instalar nada.',
  },
]

export default async function TerminalServerPage() {
  const { plans, availablePeriods } = await fetchBillingPlans('terminal-server')
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
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
            <MonitorPlay size={12} /> Corporativo
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            Terminal Server<br />
            <span className="text-[#0EA5E9]">Virtual</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            Desktop Windows completo acessível pelo navegador. Em qualquer lugar, a qualquer hora.
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            Ideal para sistemas legados, ERP, contabilidade e qualquer software que precise rodar em Windows.
          </p>

          {/* Demo badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <MonitorPlay size={18} className="text-[#0EA5E9]" />
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-900">Acesso via HTML5 — sem instalar nada</div>
              <div className="text-xs text-zinc-500">Funciona no Chrome, Firefox, Safari e Edge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Para quem é o Terminal Server?</h2>
            <p className="text-zinc-500">Empresas que precisam de Windows na nuvem sem complicação.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc) => {
              const Icon = uc.icon
              return (
                <div key={uc.title} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{uc.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{uc.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Planos */}
      {/* Planos */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="terminal-server" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Não sabe qual plano escolher?</h2>
          <p className="text-zinc-500 mb-8">Nossa equipe pode recomendar a melhor configuração para o seu cenário. Sem compromisso.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Falar com especialista <ArrowRight size={15} />
            </Link>
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Área do cliente
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

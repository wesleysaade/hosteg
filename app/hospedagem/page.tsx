import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Globe, Lock, Envelope, ShieldCheck, Lightning, HardDrive, Desktop, ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hospedagem Web',
  description: 'Hospedagem profissional com Painel Hosteg, SSL grátis, e-mail profissional e suporte 24/7. Planos a partir de R$ 19/mês.',
}

const features = [
  { icon: Lock, title: 'SSL Grátis', desc: 'Certificado Let\'s Encrypt automático para todos os domínios.', tip: 'Renovação automática antes do vencimento, sem intervenção manual.' },
  { icon: Envelope, title: 'E-mail Profissional', desc: 'Crie e-mails @seudomínio.com com webmail completo.', tip: 'Suporte IMAP, POP3 e SMTP com antivírus e anti-spam integrados.' },
  { icon: ShieldCheck, title: 'Anti-Spam', desc: 'Proteção contra spam e vírus em todos os e-mails.', tip: 'Filtros baseados em listas negras, DKIM, SPF e análise de conteúdo.' },
  { icon: Lightning, title: 'PHP 8.x Moderno', desc: 'Suporte às versões mais recentes do PHP com extensões.', tip: 'PHP 8.1, 8.2 e 8.3 disponíveis com múltiplas extensões instaladas.' },
  { icon: HardDrive, title: 'Backup Diário', desc: 'Seus dados protegidos com backup automático diário.', tip: 'Backups realizados fora do horário de pico para zero impacto no desempenho.' },
  { icon: Desktop, title: 'Painel Hosteg', desc: 'Painel de controle simples e eficiente para gerenciar seu hosting.', tip: 'Interface limpa com gerenciador de arquivos, DNS, banco de dados e e-mails.' },
]


export default async function HospedagemPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('hospedagem'),
    getHero('hospedagem', {
      badge:    'Hospedagem Web',
      title:    'Hospedagem Web',
      subtitle: 'Painel Hosteg, SSL grátis e e-mail profissional incluso.',
      desc:     'Perfeito para sites, blogs e pequenas empresas que precisam de confiabilidade.',
    }),
  ])
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <Globe size={11} weight="fill" /> {hero.badge}
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-3">
            {hero.subtitle}
          </p>
          <p className="text-zinc-500 max-w-lg mx-auto">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="hospedagem" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tudo incluso</h2>
            <p className="text-zinc-500">Sem taxas ocultas. Sem surpresas.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Migração Gratuita */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/4 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
              <Globe size={26} weight="fill" className="text-[#0EA5E9]" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita do seu site</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Já tem um site em outro servidor? Nossa equipe migra seus arquivos, banco de dados e e-mails de forma gratuita, sem downtime e sem complicação.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Solicitar migração <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compare with PRO */}
      <section className="py-12 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 mb-4">Precisa de mais performance?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/hospedagem-pro"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 text-sm transition-colors"
            >
              Ver Hospedagem PRO (cPanel) <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/wordpress"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 text-sm transition-colors"
            >
              Ver planos WordPress <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

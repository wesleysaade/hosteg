import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'
import {
  Users, Globe, ShieldCheck, Lightning, Desktop, CheckCircle, ArrowRight, CaretDown,
} from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Revenda de Hospedagem cPanel — Hosteg',
  description: 'Seja revendedor de hospedagem com cPanel. White-label, painel de gerenciamento de clientes, WHMCS compatível. A partir de R$ 99/mês.',
}

const features = [
  { icon: Users,      title: 'WHM — Gerenciamento de Clientes', desc: 'Crie, edite e delete contas de hospedagem dos seus clientes diretamente via WHM. Interface completa para gestão da sua revenda.' },
  { icon: Globe,      title: 'White-label Total',               desc: 'Seu nome, sua marca. Configure nameservers próprios (ns1.seudominio.com.br) e ofereça hospedagem como produto 100% seu.' },
  { icon: ShieldCheck,title: 'SSL para Todos os Clientes',      desc: 'Emita certificados SSL grátis (Let\'s Encrypt) para todos os domínios dos seus clientes com um clique no cPanel.' },
  { icon: Lightning,  title: 'LiteSpeed + LSCache',             desc: 'Performance excepcional para sites WordPress e PHP dos seus clientes com o servidor web mais rápido do mercado.' },
  { icon: Desktop,    title: 'WHMCS Compatível',                desc: 'Integração nativa com WHMCS para automatizar cobranças, ativação de contas e gestão do seu negócio de hospedagem.' },
  { icon: CheckCircle,title: 'Suporte Técnico para Revenda',    desc: 'Nossa equipe cuida da infraestrutura. Você foca em vender e atender seus clientes. Suporte técnico 24/7 para o revendedor.' },
]

const faqs = [
  { q: 'Posso ter meu próprio painel de controle?', a: 'Sim! Você recebe acesso ao WHM (Web Host Manager) para gerenciar todas as contas dos seus clientes. Cada cliente tem seu próprio cPanel.' },
  { q: 'Meus clientes saberão que uso a Hosteg?', a: 'Não, caso você configure corretamente. Com white-label ativo e nameservers próprios, toda a hospedagem aparece com a sua marca.' },
  { q: 'Como funciona a migração de clientes existentes?', a: 'Nossa equipe migra todos os sites dos seus clientes gratuitamente para a Hosteg. Basta abrir um ticket de migração após contratar o plano.' },
  { q: 'Posso vender domínios também?', a: 'A revenda de hospedagem não inclui venda de domínios diretamente, mas você pode registrar domínios para seus clientes e cobrar como serviço adicional.' },
]

export default async function RevendaCpanelPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('revenda-cpanel'),
    getHero('revenda-cpanel', {
      badge:    'Revenda cPanel',
      title:    'Revenda de Hospedagem cPanel',
      subtitle: 'Crie sua própria empresa de hospedagem com infraestrutura Hosteg.',
      desc:     'WHM + cPanel inclusos, white-label total, SSL grátis para todos os seus clientes.',
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
            <Users size={12} weight="fill" /> Agências & Revendas
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://cdn.simpleicons.org/cpanel/FF6C2C"
              alt="cPanel"
              width={40}
              height={40}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(255,108,44,0.3))' }}
            />
            <img
              src="/logos/litespeed.svg"
              alt="LiteSpeed"
              width={36}
              height={36}
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
            />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            {hero.subtitle}
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="revenda-cpanel" />
        </div>
      </section>

      {/* Migração de Revendas */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/4 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
              <img src="https://cdn.simpleicons.org/cpanel/FF6C2C" alt="cPanel" width={28} height={28} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita de revendas e clientes</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nossa equipe migra todos os sites dos seus clientes gratuitamente para a Hosteg. Contas cPanel, e-mails e bancos de dados migrados sem downtime.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Falar com consultor <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-bold uppercase tracking-widest mb-3">
              <Users size={13} weight="fill" /> Por que revender com a Hosteg?
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tudo que você precisa para revender</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Infraestrutura de ponta, white-label completo e suporte que te deixa vender com confiança.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
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

      {/* FAQ */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zinc-900 mb-8 text-center">Dúvidas sobre revenda</h2>
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
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Monte seu negócio de hospedagem</h2>
          <p className="text-zinc-500 mb-8">Comece a revender hoje. Migração grátis de clientes existentes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Contratar Revenda cPanel <ArrowRight size={15} weight="bold" />
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

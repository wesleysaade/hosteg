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
  title: 'Revenda de Hospedagem com Painel Hosteg Hospedagem — Hosteg',
  description: 'Revenda hospedagem com Painel Hosteg Hospedagem. White-label, painel leve e rápido, WHMCS compatível. A partir de R$ 79/mês.',
}

const directAdminVantagens = [
  { icon: Lightning,   title: 'Painel Mais Leve do Mercado',   desc: 'Painel Hosteg Hospedagem usa menos recursos que cPanel, resultando em mais performance para os sites dos seus clientes com o mesmo hardware.' },
  { icon: Globe,       title: 'White-label 100%',               desc: 'Configure seus próprios nameservers e ofereça hospedagem totalmente brandada com a identidade da sua empresa.' },
  { icon: ShieldCheck, title: 'Segurança Avançada',             desc: 'ModSecurity, CSF Firewall, Imunify360 e proteção contra brute-force configurados por padrão em todos os planos.' },
  { icon: Users,       title: 'Gestão Simplificada',            desc: 'Crie, suspenda e delete contas de clientes em segundos. Defina limites de recursos individuais por conta.' },
  { icon: Desktop,     title: 'Preço Mais Competitivo',         desc: 'Painel Hosteg Hospedagem tem licença mais acessível que cPanel, permitindo oferecer preços competitivos para seus clientes finais.' },
  { icon: CheckCircle, title: 'Migração do cPanel Incluída',    desc: 'Se você tem clientes em cPanel, migramos tudo para Painel Hosteg Hospedagem gratuitamente. O processo é transparente para seus clientes.' },
]

const faqs = [
  { q: 'Painel Hosteg Hospedagem é igual ao cPanel?', a: 'É similar em funcionalidades — os clientes gerenciam arquivos, e-mails, bancos de dados e domínios — mas é mais leve e rápido. Tem pequenas diferenças de interface que a maioria dos usuários adapta em poucos minutos.' },
  { q: 'WHMCS funciona com Painel Hosteg Hospedagem?', a: 'Sim! Painel Hosteg Hospedagem tem integração oficial com WHMCS via módulo de hospedagem. Você pode automatizar toda a gestão de clientes e cobranças.' },
  { q: 'Posso migrar do cPanel para Painel Hosteg Hospedagem?', a: 'Sim, nossa equipe cuida de toda a migração gratuitamente. Sites, e-mails e bancos de dados são migrados sem downtime.' },
  { q: 'Qual a diferença de preço entre cPanel e o Painel Hosteg Hospedagem?', a: 'Os planos Painel Hosteg Hospedagem são em média 20% mais baratos que os equivalentes cPanel, pois a licença tem custo inferior.' },
]

export default async function RevendaDirectAdminPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('revenda-directadmin'),
    getHero('revenda-directadmin', {
      badge:    'Revenda Painel Hosteg Hospedagem',
      title:    'Revenda de Hospedagem com Painel Hosteg Hospedagem',
      subtitle: 'O painel mais leve e rápido do mercado. Mais performance para seus clientes.',
      desc:     'White-label total, WHMCS compatível e migração grátis de cPanel.',
    }),
  ])
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #10B981, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Users size={12} weight="fill" /> Agências & Revendas
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://cdn.simpleicons.org/directadmin/1F6FEB"
              alt="Painel Hosteg Hospedagem"
              width={40}
              height={40}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(31,111,235,0.3))' }}
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
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="revenda-directadmin" />
        </div>
      </section>

      {/* Migração de Revendas */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <img src="https://cdn.simpleicons.org/directadmin/1F6FEB" alt="Painel Hosteg Hospedagem" width={28} height={28} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita de cPanel ou qualquer painel</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nossa equipe migra todos os sites dos seus clientes de cPanel, Plesk ou qualquer outro painel gratuitamente. Processo transparente, sem downtime.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Falar com consultor <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Por que Painel Hosteg Hospedagem */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-bold uppercase tracking-widest mb-3">
              <Lightning size={13} weight="fill" /> Por que Painel Hosteg Hospedagem?
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Mais performance, menor custo</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Painel Hosteg Hospedagem é a escolha de quem quer entregar mais por menos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {directAdminVantagens.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zinc-900 mb-8 text-center">Dúvidas sobre Painel Hosteg Hospedagem</h2>
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
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Comece sua revenda hoje</h2>
          <p className="text-zinc-500 mb-4">Migração grátis. Ativação imediata. Sem fidelidade.</p>
          <p className="text-sm text-zinc-400 mb-8">
            Também temos{' '}
            <Link href="/revenda-cpanel" className="text-[#0EA5E9] hover:underline font-semibold">Revenda cPanel</Link>
            {' '}caso prefira.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30">
              Contratar Revenda <ArrowRight size={15} weight="bold" />
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

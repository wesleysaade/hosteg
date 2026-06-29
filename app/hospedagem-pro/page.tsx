import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Lightning, ShieldCheck, Lock, Envelope, Desktop, Database, Star, ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hospedagem PRO — cPanel + LiteSpeed',
  description: 'Hospedagem profissional com cPanel, LiteSpeed, Redis, SSL grátis, antivírus e e-mail profissional. Ideal para sites de alto tráfego.',
}

const highlights = [
  { icon: Lightning, title: 'LiteSpeed', desc: 'Até 9x mais rápido que Apache, com cache nativo e suporte a HTTP/3.', tip: 'LiteSpeed é o servidor web mais rápido do mercado, com suporte a QUIC e HTTP/3.' },
  { icon: Database, title: 'Redis Cache', desc: 'Armazenamento em memória para queries ultrarrápidas.', tip: 'Ideal para WordPress, WooCommerce e aplicações com banco de dados intensivo.' },
  { icon: ShieldCheck, title: 'Imunify360', desc: 'Antivírus e firewall gerenciado que bloqueia ameaças em tempo real.', tip: 'Proteção proativa com machine learning que aprende novos padrões de ataque.' },
  { icon: Envelope, title: 'E-mail Profissional', desc: 'Crie contas @seudomínio com webmail, IMAP/POP3 e SMTP.', tip: 'Compatível com Outlook, Gmail, Apple Mail e qualquer cliente de e-mail.' },
  { icon: Lock, title: 'SSL Grátis', desc: 'Certificados automáticos para todos os domínios e subdomínios.', tip: 'Suporte a Let\'s Encrypt e certificados SSL/TLS de terceiros.' },
  { icon: Desktop, title: 'cPanel', desc: 'O painel de controle mais utilizado do mundo, intuitivo e completo.', tip: 'Interface familiar para desenvolvedores e gestores com documentação extensa.' },
]

export default async function HospedagemProPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('hospedagem-pro'),
    getHero('hospedagem-pro', {
      badge:    'cPanel + LiteSpeed + Redis',
      title:    'Hospedagem PRO',
      subtitle: 'Performance máxima com cPanel, LiteSpeed e Redis.',
      desc:     'Para sites profissionais que exigem velocidade, segurança e estabilidade.',
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
            <Lightning size={11} weight="fill" /> {hero.badge}
          </div>
          {/* cPanel logo */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://cdn.simpleicons.org/cpanel/FF6C2C"
              alt="cPanel"
              width={36}
              height={36}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(255,108,44,0.3))' }}
            />
            <img
              src="/logos/litespeed.svg"
              alt="LiteSpeed"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}
            />
            <img
              src="https://cdn.simpleicons.org/redis/DC382D"
              alt="Redis"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(220,56,45,0.3))' }}
            />
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
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="hospedagem-pro" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Tecnologias de ponta</h2>
            <p className="text-zinc-500">Stack profissional para alta performance.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((item) => {
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
              <Lightning size={26} weight="fill" className="text-[#0EA5E9]" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita para Hospedagem PRO</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Migramos seu site de qualquer provedor gratuitamente — cPanel, Plesk, Painel Hosteg Hospedagem ou painel próprio. Sem downtime, sem perda de dados.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Solicitar migração <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-12 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 mb-4">Procura ainda mais poder de processamento?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              Ver Cloud VPS <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/revenda-cpanel"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 text-sm transition-colors"
            >
              Ver Revenda cPanel <Star size={14} weight="fill" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

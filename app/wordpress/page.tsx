import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Lightning, ShieldCheck, Lock, ChartBar, ArrowsClockwise, Stack, ArrowRight,
} from '@phosphor-icons/react/dist/ssr'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'WordPress Hosting',
  description: 'Hospedagem WordPress otimizada com LiteSpeed, Redis, cPanel, SSL grátis e suporte especializado.',
}

const wpFeatures = [
  {
    icon: Lightning,
    title: 'LiteSpeed + LSCache',
    desc: 'Caching nativo específico para WordPress. Páginas carregam em milissegundos.',
    tip: 'LSCache é a única solução de cache que funciona no nível do servidor, sem plugin adicional.',
  },
  {
    icon: ArrowsClockwise,
    title: 'Auto-updates gerenciados',
    desc: 'WordPress e plugins atualizados com segurança, sem downtime.',
    tip: 'Atualizações testadas em staging antes de serem aplicadas em produção.',
  },
  {
    icon: ShieldCheck,
    title: 'Hardening de segurança',
    desc: 'Configurações específicas para bloquear ataques comuns ao WordPress.',
    tip: 'Proteção contra XML-RPC abuse, wp-login brute force e injeções SQL.',
  },
  {
    icon: ChartBar,
    title: 'Staging environment',
    desc: 'Teste mudanças em ambiente de staging antes de publicar em produção.',
    tip: 'Clone o site, faça alterações com segurança e publique com 1 clique.',
  },
  {
    icon: Stack,
    title: 'Multisite suportado',
    desc: 'Rode múltiplos sites WordPress em uma única instalação.',
    tip: 'Ideal para redes de blogs, portais e franchises que compartilham plugins e temas.',
  },
  {
    icon: Lock,
    title: 'SSL + HTTPS forçado',
    desc: 'Certificado automático com redirecionamento HTTPS em todos os domínios.',
    tip: 'Redirecionamento 301 automático e HSTS configurado para máxima segurança.',
  },
]

export default async function WordPressPage() {
  const [{ plans, availablePeriods }, hero] = await Promise.all([
    fetchBillingPlans('wordpress'),
    getHero('wordpress', {
      badge:    'WordPress Otimizado',
      title:    'WordPress Hosting',
      subtitle: 'Otimizado do zero para WordPress com LiteSpeed e Redis.',
      desc:     'Deploy em 1 clique, SSL automático e suporte especializado em WP.',
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
          {/* WordPress + cPanel logos */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://cdn.simpleicons.org/wordpress/21759B"
              alt="WordPress"
              width={36}
              height={36}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(33,117,155,0.3))' }}
            />
            <img
              src="https://cdn.simpleicons.org/cpanel/FF6C2C"
              alt="cPanel"
              width={34}
              height={34}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(255,108,44,0.25))' }}
            />
            <img
              src="https://cdn.simpleicons.org/redis/DC382D"
              alt="Redis"
              width={32}
              height={32}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(220,56,45,0.25))' }}
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
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="wordpress" />
        </div>
      </section>

      {/* Elementor PRO */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Left: branding */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <img
                  src="https://cdn.simpleicons.org/elementor/92003B"
                  alt="Elementor"
                  width={44}
                  height={44}
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(146,0,59,0.25))' }}
                />
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Incluso em todos os planos</div>
                  <div className="text-2xl font-black text-zinc-900">Elementor PRO</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#92003B]/8 border border-[#92003B]/20 text-[#92003B] text-xs font-bold">
                Valor R$199/ano — Grátis nos planos Hosteg
              </div>
            </div>

            {/* Right: features grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Construtor Drag & Drop', desc: 'Crie páginas profissionais visualmente sem escrever código.' },
                { title: '90+ Widgets Premium',    desc: 'Formulários, sliders, timelines, tabs, acordeões e muito mais.' },
                { title: 'WooCommerce Builder',    desc: 'Customize páginas de produto, carrinho e checkout visualmente.' },
                { title: 'Popup Builder',           desc: 'Crie pop-ups de captura, promoções e upsell sem plugins adicionais.' },
                { title: 'Motion Effects',          desc: 'Animações de scroll, parallax e transições profissionais.' },
                { title: 'Templates Library',       desc: 'Mais de 300 templates prontos para importar e personalizar.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#92003B] flex-shrink-0 mt-1.5" />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{item.title}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Migração Gratuita */}
      <section className="py-14 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/4 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
              <img src="https://cdn.simpleicons.org/wordpress/21759B" alt="WordPress" width={28} height={28} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Migração gratuita de WordPress</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Migramos seu WordPress de qualquer provedor gratuitamente — incluindo arquivos, banco de dados, plugins e configurações. Sem downtime.
              </p>
            </div>
            <Link href="/contato"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Solicitar migração <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* WP Features */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Otimizado para WordPress</h2>
            <p className="text-zinc-500">Cada configuração foi pensada para o melhor desempenho do WP.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wpFeatures.map((item) => {
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

      {/* Compare */}
      <section className="py-12 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 mb-4">Precisa de mais controle sobre o servidor?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              Ver Cloud VPS <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/hospedagem-pro"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 text-sm transition-colors"
            >
              Ver Hospedagem PRO <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

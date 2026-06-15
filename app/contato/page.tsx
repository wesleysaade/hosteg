import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ExternalLink, MessageSquare, Clock, Mail, Phone, Ticket, HelpCircle } from 'lucide-react'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a equipe da Hosteg. Suporte 24/7 via ticket, e-mail e chat.',
}

const channels = [
  {
    icon: Ticket,
    title: 'Abrir um Ticket',
    desc: 'A forma mais rápida de obter suporte técnico. Nossa equipe responde em até 30 minutos.',
    action: 'Abrir ticket',
    href: 'https://painelcliente.com.br/supporttickets.php',
    external: true,
    highlight: true,
    badge: '< 30 min',
  },
  {
    icon: MessageSquare,
    title: 'Chat ao Vivo',
    desc: 'Para dúvidas rápidas. Disponível no painel de cliente durante horário comercial.',
    action: 'Acessar painel',
    href: 'https://painelcliente.com.br',
    external: true,
    highlight: false,
    badge: 'Horário comercial',
  },
  {
    icon: Mail,
    title: 'E-mail',
    desc: 'Para solicitações formais, contratos e questões comerciais.',
    action: 'contato@hosteg.com.br',
    href: 'mailto:contato@hosteg.com.br',
    external: false,
    highlight: false,
    badge: '24h úteis',
  },
  {
    icon: HelpCircle,
    title: 'Base de Conhecimento',
    desc: 'Tutoriais, guias e documentação técnica para resolver dúvidas por conta própria.',
    action: 'Acessar tutoriais',
    href: '/suporte',
    external: false,
    highlight: false,
    badge: 'Autoatendimento',
  },
]

const faqs = [
  {
    q: 'Qual o tempo médio de resposta?',
    a: 'Tickets técnicos: até 30 minutos. E-mails comerciais: até 24 horas úteis. Chat: em tempo real durante horário comercial.',
  },
  {
    q: 'O suporte técnico é em português?',
    a: 'Sim! Todo o nosso time de suporte é brasileiro e atende exclusivamente em português.',
  },
  {
    q: 'Como faço para migrar meu site para a Hosteg?',
    a: 'Abra um ticket solicitando migração e nossa equipe cuida de tudo para você, sem downtime e sem custo adicional.',
  },
  {
    q: 'Tenho uma urgência fora do horário comercial?',
    a: 'Tickets técnicos urgentes são atendidos 24/7. Basta abrir o ticket com prioridade "Urgente" no painel.',
  },
]

export default async function ContatoPage() {
  const hero = await getHero('contato', {
    badge:    'Suporte 24/7',
    title:    'Contato',
    subtitle: 'Estamos sempre disponíveis para ajudar. Escolha o melhor canal para você.',
  })
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <MessageSquare size={11} /> Suporte 24/7
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4">{hero.title}</h1>
          <p className="text-xl text-zinc-500 max-w-lg mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map((ch) => {
              const Icon = ch.icon
              return (
                <div
                  key={ch.title}
                  className={`relative rounded-2xl p-7 border flex flex-col transition-all group ${
                    ch.highlight
                      ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8 shadow-xl shadow-[#0EA5E9]/10'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
                  }`}
                >
                  {ch.highlight && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent" />
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                      <Icon size={20} className="text-[#0EA5E9]" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      ch.highlight
                        ? 'border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0EA5E9]'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                    }`}>
                      {ch.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{ch.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed flex-1 mb-5">{ch.desc}</p>
                  <a
                    href={ch.href}
                    target={ch.external ? '_blank' : undefined}
                    rel={ch.external ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all ${
                      ch.highlight
                        ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-zinc-900 shadow-lg shadow-[#0EA5E9]/20'
                        : 'bg-zinc-100 hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    {ch.action}
                    {ch.external && <ExternalLink size={13} />}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="py-12 border-t border-zinc-200 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={18} className="text-[#0EA5E9]" />
            <h2 className="text-lg font-bold text-zinc-900">Horários de atendimento</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { channel: 'Tickets técnicos', hours: '24/7 — todos os dias' },
              { channel: 'Chat ao vivo', hours: 'Seg–Sex 9h–18h (BRT)' },
              { channel: 'E-mail comercial', hours: 'Seg–Sex 9h–18h (BRT)' },
            ].map((h) => (
              <div key={h.channel} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                <div className="text-xs text-zinc-500 mb-1">{h.channel}</div>
                <div className="text-sm font-semibold text-zinc-900">{h.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-6">Perguntas frequentes</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-zinc-50 transition-colors">
                  <span className="text-sm font-semibold text-zinc-900 pr-4">{faq.q}</span>
                  <span className="text-zinc-500 text-lg font-light group-open:rotate-45 transition-transform duration-200 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

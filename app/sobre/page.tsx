import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Heart, Target, Users, Zap, Shield, Clock, ArrowRight } from 'lucide-react'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sobre a Hosteg',
  description: 'Conheça a história da Hosteg — empresa brasileira de hospedagem e cloud fundada para oferecer infraestrutura de alto nível com suporte humano e próximo.',
}

const values = [
  {
    icon: Heart,
    title: 'Felicidade do cliente',
    desc: 'Nossa tagline não é marketing vazio. Cada decisão que tomamos tem o objetivo de fazer o cliente genuinamente feliz com nosso serviço.',
  },
  {
    icon: Target,
    title: 'Performance real',
    desc: 'Não vendemos especificações no papel. Entregamos performance mensurável com NVMe Gen4, baixa latência e SLA documentado.',
  },
  {
    icon: Users,
    title: 'Suporte humano',
    desc: 'Nenhum chatbot te responde na Hosteg. São pessoas reais, técnicas e empáticas, disponíveis 24 horas por dia.',
  },
  {
    icon: Zap,
    title: 'Inovação constante',
    desc: 'Acompanhamos e adotamos as tecnologias mais modernas antes de qualquer concorrente. Seu servidor sempre tem o melhor hardware.',
  },
  {
    icon: Shield,
    title: 'Confiabilidade',
    desc: 'SLA de 99.9% não é promessa — é compromisso contratual. Nossa infraestrutura redundante garante que seu serviço esteja sempre no ar.',
  },
  {
    icon: Clock,
    title: 'Transparência',
    desc: 'Comunicamos problemas antes que você perceba. Status em tempo real, notificações proativas e postmortems detalhados.',
  },
]

const timeline = [
  {
    year: '2018',
    title: 'Fundação',
    desc: 'A Hosteg nasce com foco em atender desenvolvedores e agências que precisavam de hosting confiável sem burocracia.',
  },
  {
    year: '2019',
    title: 'Primeiro datacenter próprio',
    desc: 'Migramos para infraestrutura própria no Brasil, controlando toda a cadeia de qualidade do serviço.',
  },
  {
    year: '2021',
    title: 'Cloud VPS e Bare-Metal',
    desc: 'Lançamos os produtos de Cloud VPS NVMe e servidores Bare-Metal para atender empresas de maior porte.',
  },
  {
    year: '2022',
    title: 'Expansão para o Canadá',
    desc: 'Abrimos o segundo datacenter em Montreal para atender clientes com audiência na América do Norte.',
  },
  {
    year: '2024',
    title: 'NVMe Gen4',
    desc: 'Migramos toda a frota de storage para NVMe de 4ª geração, multiplicando a performance de I/O.',
  },
  {
    year: '2026',
    title: 'Hoje',
    desc: 'Seguimos crescendo com o mesmo espírito: infraestrutura de ponta com o calor humano de uma empresa brasileira.',
  },
]

export default async function SobrePage() {
  const hero = await getHero('sobre', {
    badge:    'Nossa história',
    title:    'Sobre a Hosteg',
    subtitle: 'A Hosteg nasceu da frustração de dois desenvolvedores com hosting caro, lento e com suporte ruim.',
    desc:     'Decidimos criar a hospedagem que sempre quisemos usar.',
  })
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <Heart size={11} /> {hero.badge}
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 text-center">
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-4">Nossa missão</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4 leading-tight">
              Fazer você feliz com sua infraestrutura.
            </h2>
            <p className="text-zinc-500 leading-relaxed max-w-2xl mx-auto">
              Acreditamos que hospedar um site ou servidor não precisa ser fonte de estresse.
              Com a Hosteg, você tem performance real, preço justo e um time que se importa de verdade com o seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Nossos valores</h2>
            <p className="text-zinc-500">O que guia cada decisão que tomamos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((val) => {
              const Icon = val.icon
              return (
                <div
                  key={val.title}
                  className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{val.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Nossa jornada</h2>
            <p className="text-zinc-500">De uma ideia simples a uma infraestrutura robusta.</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-100" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-zinc-300 bg-black flex items-center justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      i === timeline.length - 1 ? 'bg-[#0EA5E9]' : 'bg-white/20'
                    }`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0EA5E9] mb-1 block">{item.year}</span>
                    <h3 className="text-base font-semibold text-zinc-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Vamos trabalhar juntos?</h2>
          <p className="text-zinc-500 mb-8">Migre para a Hosteg e sinta a diferença.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cloud-vps"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-zinc-900 font-semibold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              Ver planos <ArrowRight size={15} />
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 transition-colors"
            >
              Falar com a equipe
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

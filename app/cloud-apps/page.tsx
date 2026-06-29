import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Lightning } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase/server'
import CloudAppsClient, { type CloudApp } from '@/components/CloudAppsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cloud APPs — VPS com App Pré-Instalado | Hosteg',
  description: 'N8N, Evolution API, Odoo, Supabase e muito mais — VPS com app instalado e configurado em menos de 5 minutos.',
}

export default async function CloudAppsPage() {
  const supabase = createClient()

  const [{ data: appsRaw }, { data: cats }] = await Promise.all([
    supabase
      .from('cloud_apps')
      .select('id, name, category, tagline, description, logo, logo_color, logo_bg, tags, highlight, modal_about, modal_features, modal_use_cases, modal_requirements')
      .order('position'),
    supabase
      .from('cloud_app_categories')
      .select('name, color')
      .order('position'),
  ])

  // Mapeia DB → tipo CloudApp
  const apps: CloudApp[] = (appsRaw ?? []).map((a: any) => ({
    id:        a.id,
    name:      a.name,
    category:  a.category,
    tagline:   a.tagline,
    desc:      a.description,
    logo:      a.logo ?? null,
    logoColor: a.logo_color ?? '#0EA5E9',
    logoBg:    a.logo_bg    ?? '#EFF9FF',
    tags:      a.tags       ?? [],
    highlight: a.highlight  ?? false,
    modal: {
      about:        a.modal_about        ?? '',
      features:     a.modal_features     ?? [],
      useCases:     a.modal_use_cases    ?? [],
      requirements: a.modal_requirements ?? '',
    },
  }))

  // Cores de categoria vêm do banco; fallback para as cores padrão
  const categoryColors: Record<string, string> = {
    'Automação & Fluxos':         '#8B5CF6',
    'WhatsApp & Comunicação':     '#10B981',
    'CRM & Negócios':             '#F59E0B',
    'DevOps & Infraestrutura':    '#0EA5E9',
    'Backend & Banco de Dados':   '#EF4444',
  }
  for (const cat of cats ?? []) {
    if (cat.color) categoryColors[cat.name] = cat.color
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-black uppercase tracking-wider">
            <Lightning size={13} weight="fill" /> Cloud APPs
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            VPS com App<br /><span className="text-[#0EA5E9]">Pré-Instalado</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-4">
            Suba seu servidor com o app que você precisa já configurado e funcionando.
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            N8N, Evolution API, Odoo, Supabase, Chatwoot e muito mais — prontos em minutos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[['< 5 min', 'Pronto para uso'], ['NVMe Enterprise', 'Alta performance'], ['Root access', 'Controle total'], ['Suporte 24/7', 'Em português']].map(([v, l]) => (
              <div key={l} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200">
                <span className="font-black text-[#0EA5E9]">{v}</span>
                <span className="text-zinc-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-zinc-900 mb-2">Como funciona?</h2>
              <p className="text-zinc-500 text-sm">VPS NVMe com o app instalado, configurado e rodando.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Escolha o app',    desc: 'Selecione o app desejado e clique em Contratar.' },
                { step: '2', title: 'Configuramos tudo', desc: 'VPS criado com o app instalado, SSL configurado e pronto para uso.' },
                { step: '3', title: 'Comece a usar',    desc: 'Em menos de 5 minutos você recebe o acesso com usuário e senha.' },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#0EA5E9] flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-lg shadow-[#0EA5E9]/30">{s.step}</div>
                  <div>
                    <h3 className="font-black text-zinc-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-zinc-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client component — lista dinâmica + modais */}
      <CloudAppsClient apps={apps} categoryColors={categoryColors} />

      <Footer />
    </div>
  )
}

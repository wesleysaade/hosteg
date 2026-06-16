import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle2, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getHero } from '@/lib/utils/hero'
import * as PhosphorIcons from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Datacenter — Infraestrutura',
  description: 'Infraestrutura de alto nível em São Paulo, Toronto e Washington. Anti-DDoS, NVMe até 7.000 MB/s, rede 10 Gbps e Tier III certificado.',
}

// Phosphor icon lookup for tech cards
function TechIcon({ name }: { name: string }) {
  const Icon = (PhosphorIcons as any)[name] ?? PhosphorIcons.Shield
  return <Icon size={18} weight="fill" className="text-[#0EA5E9]" />
}

export default async function DatacenterPage() {
  const supabase = createClient()

  const [
    { data: locationsData },
    { data: techsData },
    hero,
  ] = await Promise.all([
    supabase.from('datacenter_locations').select('*').eq('is_active', true).order('order_index'),
    supabase.from('datacenter_technologies').select('*').eq('is_active', true).order('order_index'),
    getHero('datacenter', {
      badge:    'Infraestrutura',
      title:    'Datacenter',
      subtitle: 'Infraestrutura de nível enterprise no Brasil, Canadá e EUA.',
      desc:     'Tier III certificado, anti-DDoS, NVMe até 7.000 MB/s e rede 10 Gbps.',
    }),
  ])

  const locations  = locationsData  ?? []
  const techs      = techsData      ?? []

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <Building2 size={11} /> Infraestrutura
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4">{hero.title}</h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-3">{hero.subtitle}</p>
          <p className="text-zinc-500 max-w-lg mx-auto">{hero.desc}</p>
        </div>
      </section>

      {/* Locations */}
      {locations.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {locations.map((loc: any) => {
                const specs = Array.isArray(loc.specs)
                  ? loc.specs.map((s: any) => typeof s === 'string' ? s : s.value ?? s.label ?? JSON.stringify(s))
                  : []
                return (
                  <div key={loc.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                    <div className="p-8 border-b border-zinc-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-4xl mb-3 block">{loc.flag_emoji}</span>
                          <h2 className="text-2xl font-black text-zinc-900">{loc.city}</h2>
                          <p className="text-zinc-500 text-sm">{loc.name} • {loc.country}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-bold mb-2">
                            {loc.tier}
                          </span>
                          <div className="text-xs text-zinc-500">{loc.latency_br}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ['Uptime SLA', loc.uptime],
                          ['Energia',    loc.power],
                          ['Cooling',    loc.cooling],
                          ['Latência',   loc.latency_br],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <div key={k} className="p-3 rounded-xl bg-zinc-50 border border-white/[0.05] text-center">
                            <div className="text-sm font-bold text-zinc-900">{v}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{k}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {(specs.length > 0 || (loc.certifications ?? []).length > 0) && (
                      <div className="p-8">
                        {specs.length > 0 && (
                          <>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Características</p>
                            <ul className="space-y-2 mb-5">
                              {specs.map((spec: string, i: number) => (
                                <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-700">
                                  <CheckCircle2 size={13} className="text-[#0EA5E9] flex-shrink-0" />
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {(loc.certifications ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {(loc.certifications as string[]).map((cert) => (
                              <span key={cert} className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500">
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Technologies */}
      {techs.length > 0 && (
        <section className="py-16 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-zinc-900 mb-3">Tecnologias que usamos</h2>
              <p className="text-zinc-500 max-w-lg mx-auto">
                Cada camada da infraestrutura foi escolhida para garantir performance e confiabilidade.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techs.map((tech: any) => (
                <div key={tech.id}
                  className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4">
                    <TechIcon name={tech.icon_name} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{tech.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight, ArrowSquareOut, CheckCircle, Lightning, HardDrives, Info } from '@phosphor-icons/react'

export type CloudApp = {
  id: string
  name: string
  category: string
  tagline: string
  desc: string
  logo: string | null
  logoColor: string
  logoBg: string
  tags: string[]
  highlight: boolean
  modal: {
    about: string
    features: string[]
    useCases: string[]
    requirements: string
  }
}

// ── App Logo ──────────────────────────────────────────────────────────────────
function AppLogo({ app, size = 44 }: { app: CloudApp; size?: number }) {
  if (app.logo) {
    return (
      <img
        src={app.logo}
        alt={`${app.name} logo`}
        width={size}
        height={size}
        className="transition-transform duration-200 group-hover:scale-110"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
      />
    )
  }
  return (
    <div
      className="flex items-center justify-center font-black text-lg rounded-xl transition-transform duration-200 group-hover:scale-110"
      style={{ width: size, height: size, background: app.logoBg, color: app.logoColor, border: `2px solid ${app.logoColor}22` }}
    >
      {app.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function AppModal({ app, onClose }: { app: CloudApp; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-100 px-7 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-4">
            <AppLogo app={app} size={40} />
            <div>
              <h2 className="text-xl font-black text-zinc-900">{app.name}</h2>
              <p className="text-sm text-zinc-500">{app.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
          >
            <X size={18} weight="bold" className="text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 py-6 space-y-6">
          <div>
            <h3 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest mb-2">Sobre</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">{app.modal.about}</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest mb-3">Funcionalidades incluídas</h3>
            <ul className="space-y-2">
              {app.modal.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <CheckCircle size={15} weight="fill" className="text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest mb-3">Casos de uso</h3>
            <div className="flex flex-wrap gap-2">
              {app.modal.useCases.map((uc) => (
                <span key={uc}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700"
                >
                  {uc}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 flex items-start gap-3">
            <HardDrives size={18} weight="fill" className="text-[#0EA5E9] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black text-zinc-700 uppercase tracking-wider mb-1">Requisitos de VPS</div>
              <p className="text-sm text-zinc-500">{app.modal.requirements}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {app.tags.map((tag) => (
              <span key={tag}
                className="text-xs font-bold px-2.5 py-1 rounded-full border"
                style={{ background: app.logoBg, color: app.logoColor, borderColor: app.logoColor + '33' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-7 py-4 rounded-b-3xl flex gap-3">
          <a
            href="https://painelcliente.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/25 text-sm"
          >
            Contratar {app.name} <ArrowSquareOut size={14} weight="bold" />
          </a>
          <button onClick={onClose}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl transition-colors text-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Client Component ─────────────────────────────────────────────────────
export default function CloudAppsClient({
  apps,
  categoryColors,
}: {
  apps: CloudApp[]
  categoryColors: Record<string, string>
}) {
  const [activeModal, setActiveModal] = useState<CloudApp | null>(null)

  const grouped = apps.reduce<Record<string, CloudApp[]>>((acc, app) => {
    if (!acc[app.category]) acc[app.category] = []
    acc[app.category].push(app)
    return acc
  }, {})

  return (
    <>
      {/* Apps by category */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {Object.entries(grouped).map(([category, catApps]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 rounded-full" style={{ background: categoryColors[category] ?? '#0EA5E9' }} />
                <h2 className="text-xl font-black text-zinc-900">{category}</h2>
                <div className="flex-1 h-px bg-zinc-100 ml-2" />
                <span className="text-xs font-bold text-zinc-400">{catApps.length} apps</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catApps.map((app) => (
                  <div
                    key={app.id}
                    className={`relative rounded-2xl p-6 border flex flex-col transition-all group ${
                      app.highlight
                        ? 'border-[#0EA5E9]/40 bg-gradient-to-b from-[#0EA5E9]/5 to-white shadow-lg shadow-[#0EA5E9]/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
                    }`}
                  >
                    {app.highlight && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent" />
                    )}
                    <AppLogo app={app} size={48} />
                    <h3 className="text-base font-black text-zinc-900 mt-4 mb-1">{app.name}</h3>
                    <p className="text-xs font-semibold text-zinc-400 mb-2">{app.tagline}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed flex-1 mb-4">{app.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {app.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: app.logoBg, color: app.logoColor, border: `1px solid ${app.logoColor}33` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="https://painelcliente.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-1 text-sm font-black py-2.5 rounded-xl transition-all ${
                          app.highlight
                            ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-md shadow-[#0EA5E9]/20'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                        }`}
                      >
                        Contratar <ArrowRight size={13} weight="bold" />
                      </a>
                      <button
                        onClick={() => setActiveModal(app)}
                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-sm font-bold border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-[#0EA5E9]/30 text-zinc-600 hover:text-[#0EA5E9] transition-all"
                      >
                        <Info size={15} weight="fill" />
                        <span className="hidden sm:inline">Saiba mais</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {apps.length === 0 && (
            <div className="text-center py-20 text-zinc-400">
              <p>Nenhum Cloud App cadastrado ainda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom app CTA */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12">
            <div className="flex items-start gap-6 flex-col sm:flex-row">
              <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                <HardDrives size={26} weight="fill" className="text-[#0EA5E9]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-zinc-900 mb-3">Não encontrou o app que precisa?</h2>
                <p className="text-zinc-500 mb-5 leading-relaxed">
                  Nossa equipe configura qualquer app no seu VPS. Abra um ticket informando o app desejado. Gratuito para clientes com plano ativo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://painelcliente.com.br/supporttickets.php" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl transition-colors shadow-md shadow-[#0EA5E9]/20">
                    Solicitar app customizado <ArrowSquareOut size={14} weight="bold" />
                  </a>
                  <Link href="/cloud-vps"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
                    Ver planos de VPS <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeModal && <AppModal app={activeModal} onClose={() => setActiveModal(null)} />}
    </>
  )
}

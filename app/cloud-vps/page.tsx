import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Lightning, HardDrives, CheckCircle, ArrowRight, Globe, CaretDown,
  Robot, ChatCircle, GitFork, Browser, Package, Code,
} from '@phosphor-icons/react/dist/ssr'
import type { PlanFeature } from '@/components/PlanFeatureList'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'
import type { BillingPlan } from '@/components/PlanBillingSection'
import { fetchPageSection } from '@/lib/utils/content'
import { getHero } from '@/lib/utils/hero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cloud VPS NVMe — Hosteg',
  description: 'Cloud VPS com discos NVMe Gen4, IPv4/IPv6 dedicado, anti-DDoS incluso e suporte 24/7.',
}

// OS logos via devicons / simpleicons CDN
const osList = [
  { name: 'Ubuntu',         version: '22.04 / 24.04 LTS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg',       color: '#E95420', bg: '#FFF2EE', border: '#FECDBE' },
  { name: 'Debian',         version: '11 / 12',            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg',       color: '#A80030', bg: '#FFF0F3', border: '#FFCDD6' },
  { name: 'CentOS',         version: 'Stream 8 / 9',       logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/centos/centos-original.svg',       color: '#932279', bg: '#FAF0FA', border: '#EDD4EE' },
  { name: 'AlmaLinux',      version: '8 / 9',              logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/almalinux/almalinux-original.svg', color: '#2B4DA3', bg: '#EEF2FF', border: '#C7D2FE' },
  { name: 'Rocky Linux',    version: '8 / 9',              logo: 'https://cdn.simpleicons.org/rockylinux/10B981',                                       color: '#10B981', bg: '#EFFDF5', border: '#A7F3D0' },
  { name: 'Windows Server', version: '2019 / 2022',        logo: '/logos/windows.svg',                                                                  color: '#0078D4', bg: '#EFF6FF', border: '#BFDBFE' },
  { name: 'ISO Customizada',version: 'Upload da sua ISO',  logo: null,                                                                                  color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
]

const includes = [
  { text: 'IPv4 + IPv6 dedicados',          tip: 'Cada VPS recebe 1 endereço IPv4 e um /64 IPv6 exclusivos — não compartilhados com outros clientes.' },
  { text: 'Anti-DDoS incluso',              tip: 'Proteção automática contra ataques volumétricos de até 1 Tbps. Mitigação em camadas 3, 4 e 7.' },
  { text: 'Painel de controle',             tip: 'Painel web para reiniciar, reinstalar SO, monitorar uso de CPU/RAM e gerenciar backups.' },
  { text: 'Backup disponível como add-on',  tip: 'Backups diários automáticos disponíveis como serviço adicional. Retenção de 7 dias.' },
  { text: 'Linux ou Windows Server',        tip: 'Escolha Ubuntu, Debian, CentOS, Rocky, AlmaLinux ou Windows Server no momento do pedido.' },
  { text: 'Acesso root total',              tip: 'Você tem controle completo do servidor — root/Administrator — para instalar qualquer software.' },
  { text: 'Deploy em < 60 segundos',        tip: 'O VPS é criado e ativado automaticamente em menos de 60 segundos após confirmação do pagamento.' },
  { text: 'Suporte 24/7 em português',      tip: 'Suporte técnico humano disponível 24 horas por dia, 7 dias por semana, em português.' },
  { text: 'SLA 99.9% garantido',            tip: 'Uptime garantido em contrato. 99.9% equivale a menos de 8.7 horas de inatividade por ano.' },
  { text: 'Rede 10 Gbps',                   tip: 'Uplink de 10 Gigabits por segundo, com múltiplos provedores de trânsito para máxima redundância.' },
]

const faqs = [
  { q: 'Quanto tempo leva para ativar meu VPS?',        a: 'A ativação é automática e acontece em menos de 60 segundos após a confirmação do pagamento.' },
  { q: 'Posso fazer upgrade de plano sem downtime?',     a: 'Sim! Upgrade de RAM e CPU sem migrar dados. O upgrade de storage pode requerer uma janela de manutenção breve.' },
  { q: 'Quais sistemas operacionais estão disponíveis?', a: 'Ubuntu, Debian, CentOS, Rocky Linux, AlmaLinux e Windows Server. Outros sistemas via ISO personalizada.' },
  { q: 'O tráfego tem limite?',                          a: 'Cada plano tem uma cota mensal. Excedente cobrado a R$ 0,05/GB, ou faça upgrade de plano.' },
  { q: 'Como funciona o backup?',                        a: 'Backup automático diário disponível como add-on. Snapshots manuais a qualquer momento via painel.' },
  { q: 'Há contrato de fidelidade?',                     a: 'Não. Planos mensais, cancelamento sem multa. Desconto para contratações semestrais e anuais.' },
  { q: 'Os recursos são garantidos?',                    a: 'Sim. CPU, RAM e storage são garantidos via KVM — não compartilhados de forma que prejudique sua performance.' },
  { q: 'Qual a localização dos servidores?',             a: 'São Paulo (Ascenty SP4) ou Canadá (Montreal). Região escolhida no momento do pedido.' },
]

// Helper: get a spec value from plan.specs by label (case-insensitive)
function spec(plan: BillingPlan, label: string): string {
  return plan.specs?.find(s => s.label.toLowerCase() === label.toLowerCase())?.value ?? '—'
}

export default async function CloudVPSPage() {
  const [{ plans, availablePeriods }, sharedFeaturesSection, statsSection, hero] = await Promise.all([
    fetchBillingPlans('cloud-vps'),
    fetchPageSection('cloud-vps', 'shared_features'),
    fetchPageSection('cloud-vps', 'stats'),
    getHero('cloud-vps', {
      badge:    'Cloud VPS NVMe Gen4',
      title:    'Cloud VPS',
      subtitle: 'NVMe Gen4, anti-DDoS incluso e rede 10 Gbps.',
      desc:     'Ative em segundos. Suporte 24/7. SLA 99.9% garantido.',
    }),
  ])

  const defaultStats = [
    { value: '< 60s',    label: 'Ativação' },
    { value: 'NVMe Gen4', label: 'Storage' },
    { value: '10 Gbps',  label: 'Rede' },
    { value: '99.9%',    label: 'SLA' },
  ]
  const statItems: { value: string; label: string }[] =
    statsSection?.items?.length ? statsSection.items : defaultStats

  // Use DB features if available, otherwise fall back to hardcoded includes
  const featureItems: { text: string; tip?: string }[] =
    sharedFeaturesSection?.items?.length ? sharedFeaturesSection.items : includes

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-15"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
          <div className="grid-pattern absolute inset-0 opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-black uppercase tracking-wider">
            <Lightning size={13} weight="fill" /> {hero.badge}
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-zinc-900 mb-5 leading-tight">{hero.title}</h1>
          <p className="text-xl sm:text-2xl text-zinc-500 max-w-2xl mx-auto mb-3 font-medium">
            {hero.subtitle}
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">{hero.desc}</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {statItems.map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200">
                <span className="font-black text-[#0EA5E9]">{s.value}</span>
                <span className="text-zinc-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos — do banco de dados */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} hideFeatures productSlug="cloud-vps" />
        </div>
      </section>

      {/* Incluso em todos os planos — features comuns */}
      {featureItems.length > 0 && (
        <section className="py-10 pb-16 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-2">
                <CheckCircle size={13} weight="fill" /> Incluso em todos os planos
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {featureItems.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 transition-colors">
                  <CheckCircle size={15} weight="fill" className="text-[#0EA5E9] flex-shrink-0" />
                  <span className="text-sm text-zinc-700 font-semibold">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OS Logos */}
      <section className="py-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">
              <Lightning size={13} weight="fill" /> Sistemas Operacionais
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Escolha o SO no pedido</h2>
            <p className="text-zinc-500 text-sm">Reinstalação gratuita a qualquer momento pelo painel.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {osList.map((os) => (
              <div key={os.name}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all hover:shadow-md cursor-default group"
                style={{ backgroundColor: os.bg, borderColor: os.border }}
              >
                {os.logo ? (
                  <img src={os.logo} alt={`${os.name} logo`} width={44} height={44}
                    className="group-hover:scale-110 transition-transform duration-200"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-500 text-lg font-black">ISO</div>
                )}
                <div className="text-center">
                  <div className="text-xs font-black text-zinc-900">{os.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{os.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud APPs Teaser */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">
              <Package size={13} weight="fill" /> Apps Pré-instalados
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Suba qualquer app com um clique</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Instale N8N, Evolution API, Supabase, Odoo e dezenas de outros diretamente no seu VPS — sem configuração manual.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { icon: GitFork,    label: 'N8N',           desc: 'Automação de fluxos',    color: '#EA4B71', bg: '#FFF1F4' },
              { icon: ChatCircle, label: 'Evolution API', desc: 'WhatsApp API',            color: '#25D366', bg: '#F0FDF4' },
              { icon: Robot,      label: 'Typebot',       desc: 'Chatbots visuais',        color: '#7C3AED', bg: '#F5F3FF' },
              { icon: Browser,    label: 'Odoo',          desc: 'ERP open-source',         color: '#714B67', bg: '#F9F0F7' },
              { icon: Code,       label: 'Supabase',      desc: 'Backend as a Service',    color: '#3ECF8E', bg: '#F0FDF9' },
              { icon: Package,    label: 'Easypanel',     desc: 'Gerenciador de apps',     color: '#0EA5E9', bg: '#F0F9FF' },
            ].map((app) => {
              const Icon = app.icon
              return (
                <div key={app.label}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md transition-all group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: app.bg }}>
                    <Icon size={22} weight="fill" style={{ color: app.color }} />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black text-zinc-900">{app.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{app.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/4 p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex-1">
              <p className="text-zinc-900 font-black text-lg mb-1">+ MinIO, MongoDB, Mautic, Chatwoot, Docker e muito mais</p>
              <p className="text-zinc-500 text-sm">Catálogo completo de aplicações com deploy em 1 clique via Easypanel.</p>
            </div>
            <Link href="/cloud-apps"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20">
              Ver Cloud APPs <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#0EA5E9] text-xs font-black uppercase tracking-widest mb-3">
              <CheckCircle size={14} weight="fill" /> Incluso em todos os planos
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-2">Sem cobranças ocultas</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {includes.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 p-4 rounded-xl border border-zinc-200 bg-white hover:border-[#0EA5E9]/30 transition-colors group/tip relative">
                <CheckCircle size={16} weight="fill" className="text-[#0EA5E9] flex-shrink-0" />
                <span className="text-sm text-zinc-700 font-semibold">{item.text}</span>
                <span className="pointer-events-none absolute z-50 left-1/2 bottom-full mb-2 -translate-x-1/2 w-52 rounded-xl bg-zinc-900 text-white text-xs leading-relaxed p-3 opacity-0 group-hover/tip:opacity-100 transition-opacity shadow-xl">
                  {item.tip}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table — driven by DB plans */}
      {plans.length > 0 && (
        <section className="py-16 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Comparativo completo</h2>
              <p className="text-zinc-500">Todos os planos lado a lado</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="text-left px-5 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Plano</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">RAM</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">vCPU</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">NVMe</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Tráfego</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Preço/mês</th>
                    <th className="text-center px-4 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {plans.map((plan) => (
                    <tr key={plan.name} className={`transition-colors hover:bg-zinc-50 ${plan.popular ? 'bg-[#0EA5E9]/5' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{plan.name}</span>
                          {plan.popular && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/25 uppercase tracking-wide">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold">{spec(plan, 'RAM')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold">{spec(plan, 'vCPU')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold">{spec(plan, 'NVMe')}</td>
                      <td className="text-center px-4 py-4 text-zinc-700 font-semibold">{spec(plan, 'Tráfego')}</td>
                      <td className="text-center px-4 py-4 font-black text-zinc-900">R$ {plan.monthlyPrice}</td>
                      <td className="text-center px-4 py-4">
                        <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-lg transition-colors ${
                            plan.popular
                              ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-sm shadow-[#0EA5E9]/30'
                              : 'bg-zinc-100 hover:bg-[#0EA5E9]/10 hover:text-[#0284C7] text-zinc-800 border border-zinc-200 hover:border-[#0EA5E9]/20'
                          }`}
                        >
                          Contratar <ArrowRight size={11} weight="bold" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-2">Perguntas frequentes</h2>
            <p className="text-zinc-500">
              Ainda com dúvidas?{' '}
              <Link href="/contato" className="text-[#0EA5E9] font-bold hover:underline">Fale com o suporte 24/7.</Link>
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 transition-colors">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                  <span className="text-sm font-bold text-zinc-900 pr-4">{faq.q}</span>
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
      <section className="py-20 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Comece agora</h2>
          <p className="text-zinc-500 mb-8 text-lg">Ative seu Cloud VPS em menos de 60 segundos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://painelcliente.com.br" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30 text-base">
              Contratar Cloud VPS <ArrowRight size={16} weight="bold" />
            </a>
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-zinc-50 text-zinc-900 font-bold rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors text-base">
              Preciso de ajuda
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

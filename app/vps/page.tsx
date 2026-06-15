import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Zap,
  HardDrive,
  Cpu,
  Network,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Globe,
  Server,
  ChevronDown,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cloud VPS NVMe',
  description: '10 planos de Cloud VPS com discos NVMe Gen4, IPv4/IPv6 dedicado, anti-DDoS incluso e suporte 24/7. Preços em BRL a partir de R$ 39/mês.',
}

const vpsPlans = [
  {
    id: 'starter',
    name: 'VPS Starter',
    ram: '2 GB',
    cpu: '2 vCPU',
    storage: '40 GB NVMe',
    bandwidth: '2 TB',
    ip: '1 IPv4 + IPv6',
    price: 39,
    popular: false,
    desc: 'Ideal para projetos pessoais, testes e aplicações leves.',
  },
  {
    id: 'basic',
    name: 'VPS Basic',
    ram: '4 GB',
    cpu: '2 vCPU',
    storage: '80 GB NVMe',
    bandwidth: '4 TB',
    ip: '1 IPv4 + IPv6',
    price: 69,
    popular: false,
    desc: 'Perfeito para sites, blogs, e-mail e pequenas APIs.',
  },
  {
    id: 'comfort',
    name: 'VPS Comfort',
    ram: '6 GB',
    cpu: '3 vCPU',
    storage: '120 GB NVMe',
    bandwidth: '5 TB',
    ip: '1 IPv4 + IPv6',
    price: 99,
    popular: false,
    desc: 'Para quem precisa de mais RAM sem pagar muito.',
  },
  {
    id: 'standard',
    name: 'VPS Standard',
    ram: '8 GB',
    cpu: '4 vCPU',
    storage: '160 GB NVMe',
    bandwidth: '6 TB',
    ip: '1 IPv4 + IPv6',
    price: 119,
    popular: true,
    desc: 'Melhor custo-benefício. Ideal para e-commerce e SaaS.',
  },
  {
    id: 'pro',
    name: 'VPS Pro',
    ram: '12 GB',
    cpu: '4 vCPU',
    storage: '240 GB NVMe',
    bandwidth: '8 TB',
    ip: '1 IPv4 + IPv6',
    price: 169,
    popular: false,
    desc: 'Para aplicações que precisam de RAM abundante.',
  },
  {
    id: 'business',
    name: 'VPS Business',
    ram: '16 GB',
    cpu: '6 vCPU',
    storage: '320 GB NVMe',
    bandwidth: '10 TB',
    ip: '1 IPv4 + IPv6',
    price: 219,
    popular: false,
    desc: 'Ambientes de produção, bancos de dados e backends.',
  },
  {
    id: 'pro-plus',
    name: 'VPS Pro+',
    ram: '24 GB',
    cpu: '8 vCPU',
    storage: '480 GB NVMe',
    bandwidth: '12 TB',
    ip: '1 IPv4 + IPv6',
    price: 319,
    popular: false,
    desc: 'Para workloads intensivos com múltiplos serviços.',
  },
  {
    id: 'ultra',
    name: 'VPS Ultra',
    ram: '32 GB',
    cpu: '8 vCPU',
    storage: '640 GB NVMe',
    bandwidth: '15 TB',
    ip: '1 IPv4 + IPv6',
    price: 419,
    popular: false,
    desc: 'Alta performance para grandes aplicações e dados.',
  },
  {
    id: 'elite',
    name: 'VPS Elite',
    ram: '48 GB',
    cpu: '12 vCPU',
    storage: '960 GB NVMe',
    bandwidth: '20 TB',
    ip: '1 IPv4 + IPv6',
    price: 589,
    popular: false,
    desc: 'Para clusters, big data e cargas computacionais pesadas.',
  },
  {
    id: 'titan',
    name: 'VPS Titan',
    ram: '64 GB',
    cpu: '16 vCPU',
    storage: '1.28 TB NVMe',
    bandwidth: 'Ilimitado',
    ip: '1 IPv4 + IPv6',
    price: 779,
    popular: false,
    desc: 'O topo da linha VPS — máxima performance cloud.',
  },
]

const includes = [
  'IPv4 e IPv6 dedicados',
  'Anti-DDoS incluso',
  'Painel de controle',
  'Backup automático disponível',
  'SO Linux ou Windows',
  'Acesso root total',
  'Deploy em < 60 segundos',
  'Suporte 24/7 em português',
  'SLA 99.9% garantido',
  'Rede 10 Gbps',
]

const faqs = [
  {
    q: 'Quanto tempo leva para ativar meu VPS?',
    a: 'A ativação é automática e acontece em menos de 60 segundos após a confirmação do pagamento.',
  },
  {
    q: 'Posso fazer upgrade de plano sem downtime?',
    a: 'Sim! Você pode fazer upgrade de RAM e CPU sem migrar dados. O upgrade de armazenamento pode requerer uma janela de manutenção de poucos minutos.',
  },
  {
    q: 'Quais sistemas operacionais estão disponíveis?',
    a: 'Disponibilizamos Ubuntu, Debian, CentOS, Rocky Linux, AlmaLinux e Windows Server. Outros sistemas podem ser instalados via ISO personalizada.',
  },
  {
    q: 'O tráfego de rede tem limite?',
    a: 'Cada plano tem uma cota de tráfego mensal. Ao ultrapassar, o tráfego adicional é cobrado a R$ 0,05/GB, ou você pode fazer upgrade para um plano maior.',
  },
  {
    q: 'Como funciona o backup?',
    a: 'O backup automático diário está disponível como add-on. Você também pode criar snapshots manuais a qualquer momento pelo painel.',
  },
  {
    q: 'Há contrato de fidelidade?',
    a: 'Não. Todos os planos são mensais e podem ser cancelados a qualquer momento sem multa. Também oferecemos desconto para contratações anuais.',
  },
  {
    q: 'Os VPS são compartilhados?',
    a: 'Os recursos de CPU e RAM são garantidos (não compartilhados de forma que afetem sua performance). Usamos hypervisor KVM para isolamento total entre VMs.',
  },
  {
    q: 'Qual é a localização dos servidores?',
    a: 'Você escolhe entre São Paulo (Ascenty SP4) e Canadá (Montreal). A região pode ser escolhida no momento do pedido.',
  },
]

export default function VPSPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }}
          />
          <div className="grid-pattern absolute inset-0 opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <Zap size={11} /> Cloud VPS NVMe Gen4
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4 leading-tight">
            Cloud VPS
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-3">
            10 planos com NVMe Gen4, anti-DDoS incluso e rede 10 Gbps.
          </p>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Ative em segundos. Suporte 24/7 em português. SLA 99.9%.
          </p>
        </div>
      </section>

      {/* Plans grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vpsPlans.slice(0, 8).map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border flex flex-col transition-all duration-200 group ${
                  plan.popular
                    ? 'border-[#0EA5E9]/50 bg-gradient-to-b from-[#0EA5E9]/8 to-transparent shadow-xl shadow-[#0EA5E9]/10'
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent" />
                )}
                {plan.popular && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-[#0EA5E9] text-zinc-900 text-xs font-bold rounded-full">
                    Mais Popular
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-sm text-zinc-500">R$</span>
                    <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">/mês</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="h-px bg-zinc-100 my-4" />

                <ul className="space-y-2.5 flex-1 mb-5">
                  {[
                    { icon: HardDrive, text: plan.ram + ' RAM DDR4' },
                    { icon: Cpu, text: plan.cpu + ' vCPU' },
                    { icon: Zap, text: plan.storage },
                    { icon: Network, text: plan.bandwidth + ' Tráfego' },
                    { icon: Globe, text: plan.ip },
                  ].map((spec) => {
                    const Icon = spec.icon
                    return (
                      <li key={spec.text} className="flex items-center gap-2.5 text-sm text-zinc-700">
                        <Icon size={12} className="text-zinc-500 flex-shrink-0" />
                        <span>{spec.text}</span>
                      </li>
                    )
                  })}
                </ul>

                <a
                  href="https://painelcliente.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center text-sm font-semibold py-3 rounded-xl transition-all duration-150 ${
                    plan.popular
                      ? 'bg-[#0EA5E9] hover:bg-[#0284C7] text-zinc-900 shadow-lg shadow-[#0EA5E9]/20'
                      : 'bg-zinc-100 hover:bg-zinc-100 text-zinc-900'
                  }`}
                >
                  Contratar agora
                </a>
              </div>
            ))}
          </div>

          {/* Last 2 plans - wider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {vpsPlans.slice(8).map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl p-6 border border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-zinc-500">R$</span>
                      <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                      <span className="text-zinc-500 text-sm">/mês</span>
                    </div>
                  </div>
                  <a
                    href="https://painelcliente.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-100 text-zinc-900 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Contratar
                  </a>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'RAM', value: plan.ram },
                    { label: 'vCPU', value: plan.cpu.replace(' vCPU', '') },
                    { label: 'NVMe', value: plan.storage.replace(' NVMe', '') },
                    { label: 'Tráfego', value: plan.bandwidth },
                    { label: 'IPv4', value: '1 ded.' },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-2.5 rounded-lg bg-zinc-50 border border-white/[0.05]">
                      <div className="text-sm font-bold text-zinc-900">{s.value}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Included in all plans */}
      <section className="py-16 border-t border-zinc-200 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Incluso em todos os planos</h2>
            <p className="text-zinc-500 text-sm">Sem cobranças ocultas. Sem surpresas.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {includes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50"
              >
                <CheckCircle2 size={14} className="text-[#0EA5E9] flex-shrink-0" />
                <span className="text-xs text-zinc-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativo de specs */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Comparativo de planos</h2>
            <p className="text-zinc-500 text-sm">Todos os planos lado a lado</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Plano</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">RAM</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">vCPU</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">NVMe</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tráfego</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Preço/mês</th>
                </tr>
              </thead>
              <tbody>
                {vpsPlans.map((plan, i) => (
                  <tr
                    key={plan.id}
                    className={`border-b border-white/[0.04] transition-colors hover:bg-zinc-50 ${
                      plan.popular ? 'bg-[#0EA5E9]/8' : ''
                    } ${i === vpsPlans.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/25">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center px-4 py-4 text-zinc-700">{plan.ram}</td>
                    <td className="text-center px-4 py-4 text-zinc-700">{plan.cpu}</td>
                    <td className="text-center px-4 py-4 text-zinc-700">{plan.storage}</td>
                    <td className="text-center px-4 py-4 text-zinc-700">{plan.bandwidth}</td>
                    <td className="text-right px-5 py-4">
                      <span className="font-bold text-zinc-900">R$ {plan.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900 mb-2">Perguntas frequentes</h2>
            <p className="text-zinc-500">Ainda com dúvidas? Fale com o suporte 24/7.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-zinc-50 transition-colors">
                  <span className="text-sm font-semibold text-zinc-900 pr-4">{faq.q}</span>
                  <ChevronDown size={16} className="text-zinc-500 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4">Comece agora</h2>
          <p className="text-zinc-500 mb-8">Ative seu VPS em menos de 60 segundos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://painelcliente.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-zinc-900 font-semibold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              Contratar VPS <ArrowRight size={15} />
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl border border-zinc-200 transition-colors"
            >
              Preciso de ajuda
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

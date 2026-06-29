import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  LayoutGrid, CheckCircle2, ArrowRight, ExternalLink,
  Users, BarChart3, ShoppingCart, TruckIcon, FileText, Headphones,
  CalendarDays, Package, Globe, Lock,
} from 'lucide-react'
import PlanBillingSection from '@/components/PlanBillingSection'
import { fetchBillingPlans } from '@/lib/utils/plans'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'ErpY — O ERP da Hosteg',
  description: 'ERP completo e acessível na nuvem. Financeiro, vendas, estoque, RH, NF-e e muito mais. Acesse pelo navegador em qualquer dispositivo.',
}


const modules = [
  { icon: BarChart3, name: 'Financeiro', desc: 'Fluxo de caixa, DRE, contas a pagar/receber, conciliação bancária.' },
  { icon: ShoppingCart, name: 'Vendas & CRM', desc: 'Pipeline de vendas, orçamentos, pedidos e gestão de clientes.' },
  { icon: Package, name: 'Estoque', desc: 'Controle de entrada/saída, inventário, lotes e rastreabilidade.' },
  { icon: TruckIcon, name: 'Compras', desc: 'Pedidos de compra, cotações, fornecedores e recebimento de mercadorias.' },
  { icon: Users, name: 'RH & Folha', desc: 'Admissões, férias, ponto eletrônico e folha de pagamento.' },
  { icon: FileText, name: 'Fiscal & NF-e', desc: 'Emissão de NF-e, NFS-e, CT-e e SPED automatizado.' },
  { icon: CalendarDays, name: 'Projetos', desc: 'Gestão de projetos, tasks, timesheets e controle de horas.' },
  { icon: Headphones, name: 'Suporte (Helpdesk)', desc: 'Tickets internos, SLA, base de conhecimento e atendimento ao cliente.' },
  { icon: Globe, name: 'E-commerce', desc: 'Integração com marketplaces, gestão de pedidos online e sincronização.' },
]

export default async function HostegERPPage() {
  const { plans, availablePeriods } = await fetchBillingPlans('hosteg-erp')
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
            <LayoutGrid size={12} /> Corporativo
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-5 leading-tight">
            ErpY
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto mb-4">
            O ERP da Hosteg — gestão completa da sua empresa em um único sistema na nuvem.
          </p>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8">
            Financeiro, vendas, estoque, RH, NF-e e muito mais. Acesse de qualquer lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.hosteg.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/30"
            >
              Acessar demonstração <ExternalLink size={14} />
            </a>
            <Link href="/contato"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-900 font-bold rounded-xl border border-zinc-200 transition-colors">
              Falar com consultor
            </Link>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Módulos disponíveis</h2>
            <p className="text-zinc-500">Um sistema integrado para todos os setores da sua empresa.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <div key={mod.name} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/3 transition-all text-center group">
                  <div className="w-9 h-9 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={16} className="text-[#0EA5E9]" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900 mb-1">{mod.name}</div>
                  <div className="text-xs text-zinc-500 leading-relaxed">{mod.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Planos */}
      {/* Planos */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlanBillingSection plans={plans} availablePeriods={availablePeriods} productSlug="hosteg-erp" />
        </div>
      </section>

      {/* Access info */}
      <section className="py-16 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
              <Lock size={24} className="text-[#0EA5E9]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 mb-2">Acesse via hosteg.cloud</h3>
              <p className="text-zinc-500 leading-relaxed mb-4">
                O ErpY está disponível em{' '}
                <a href="https://www.hosteg.cloud" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] font-semibold hover:underline">
                  www.hosteg.cloud
                </a>
                . Você pode solicitar uma demonstração gratuita para ver todos os módulos em funcionamento antes de contratar.
              </p>
              <a
                href="https://www.hosteg.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
              >
                Abrir demonstração <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

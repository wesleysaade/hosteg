import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Search,
  Server,
  Globe,
  Mail,
  Lock,
  Zap,
  HardDrive,
  Terminal,
  Shield,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Layers,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Suporte — Base de Conhecimento',
  description: 'Central de suporte da Hosteg com tutoriais, guias e documentação técnica.',
}

const categories = [
  {
    icon: Server,
    title: 'Cloud VPS',
    count: 18,
    articles: [
      'Como criar e configurar seu VPS',
      'Acessando via SSH pela primeira vez',
      'Instalando painel de controle no VPS',
      'Configurando firewall com UFW',
      'Como fazer snapshot e backup',
    ],
    color: '#0EA5E9',
  },
  {
    icon: Globe,
    title: 'Hospedagem Web',
    count: 24,
    articles: [
      'Como apontar domínio para a Hosteg',
      'Criando contas de e-mail no DirectAdmin',
      'Instalando WordPress em um clique',
      'Configurando SSL no seu site',
      'Como usar o gerenciador de arquivos',
    ],
    color: '#10B981',
  },
  {
    icon: Layers,
    title: 'Hospedagem PRO / cPanel',
    count: 31,
    articles: [
      'Navegando pelo cPanel pela primeira vez',
      'Configurando banco de dados MySQL',
      'Como usar o Softaculous',
      'Gerenciando DNS no cPanel',
      'Configurando e-mail no Outlook/Thunderbird',
    ],
    color: '#F59E0B',
  },
  {
    icon: Mail,
    title: 'E-mail Profissional',
    count: 15,
    articles: [
      'Configurando e-mail no Gmail (SMTP)',
      'Configurando no iPhone/Android',
      'Como evitar que e-mails vão para spam',
      'Criando listas de distribuição',
      'Backup de e-mails',
    ],
    color: '#8B5CF6',
  },
  {
    icon: Lock,
    title: 'SSL / Segurança',
    count: 12,
    articles: [
      'Como emitir SSL gratuito (Let\'s Encrypt)',
      'Forçar HTTPS no seu site',
      'Corrigindo erros de certificado',
      'Configurando HSTS',
      'Firewall e proteção DDoS',
    ],
    color: '#EF4444',
  },
  {
    icon: Terminal,
    title: 'Linux / SSH',
    count: 22,
    articles: [
      'Comandos Linux essenciais',
      'Como usar chaves SSH',
      'Configurando Nginx do zero',
      'Instalando Node.js com NVM',
      'Usando tmux e screen',
    ],
    color: '#6B7280',
  },
  {
    icon: Zap,
    title: 'WordPress',
    count: 19,
    articles: [
      'Migrando WordPress para a Hosteg',
      'Otimizando performance com LiteSpeed',
      'Configurando Redis no WordPress',
      'Plugins de segurança recomendados',
      'Resolvendo erro 500 no WordPress',
    ],
    color: '#3B82F6',
  },
  {
    icon: HardDrive,
    title: 'Domínios & DNS',
    count: 11,
    articles: [
      'Como registrar um domínio',
      'Configurando DNS personalizado',
      'O que é TTL e como funciona',
      'Adicionando registro MX para e-mail',
      'Usando subdomínios',
    ],
    color: '#EC4899',
  },
]

const popularArticles = [
  { title: 'Como apontar domínio para a Hosteg', category: 'DNS', views: '12.4k' },
  { title: 'Configurando SSL grátis', category: 'SSL', views: '9.8k' },
  { title: 'Acessando VPS via SSH', category: 'VPS', views: '8.2k' },
  { title: 'Instalando WordPress em 1 click', category: 'WordPress', views: '7.5k' },
  { title: 'Configurando e-mail no Gmail', category: 'E-mail', views: '6.9k' },
  { title: 'Backup automático no VPS', category: 'VPS', views: '5.7k' },
]

export default function SuportePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0EA5E9, transparent 70%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/8 text-[#0EA5E9] text-xs font-semibold">
            <BookOpen size={11} /> Base de Conhecimento
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4">Central de Suporte</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto mb-8">
            Tutoriais, guias e documentação técnica para resolver tudo.
          </p>

          {/* Search bar (visual) */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar artigos, tutoriais..."
              className="w-full pl-11 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.07] transition-all"
            />
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-zinc-200 rounded-2xl bg-white/[0.01] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-sm font-semibold text-zinc-700">Artigos mais acessados</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {popularArticles.map((art) => (
                <div
                  key={art.title}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 border border-white/[0.07] text-zinc-500">
                      {art.category}
                    </span>
                    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                      {art.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{art.views} visualizações</span>
                    <ArrowRight size={13} className="text-zinc-500 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Todas as categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-50 transition-all p-6 cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${cat.color}18` }}
                  >
                    <Icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-900">{cat.title}</h3>
                    <span className="text-xs text-zinc-500">{cat.count} artigos</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {cat.articles.slice(0, 3).map((a) => (
                      <li key={a} className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors truncate cursor-pointer">
                        → {a}
                      </li>
                    ))}
                  </ul>
                  <button className="text-xs font-medium text-zinc-500 group-hover:text-zinc-700 transition-colors flex items-center gap-1">
                    Ver todos <ArrowRight size={11} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ticket CTA */}
      <section className="py-12 border-t border-zinc-200 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Não encontrou o que procurava?</h2>
          <p className="text-zinc-500 mb-6 text-sm">
            Nossa equipe técnica está disponível 24/7 para ajudar com qualquer dúvida.
          </p>
          <a
            href="https://painelcliente.com.br/supporttickets.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-zinc-900 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-[#0EA5E9]/20"
          >
            Abrir ticket de suporte <ExternalLink size={14} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

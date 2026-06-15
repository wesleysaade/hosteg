import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const footerLinks = {
  Hospedagem: [
    { label: 'Cloud VPS', href: '/cloud-vps' },
    { label: 'Hospedagem Web', href: '/hospedagem' },
    { label: 'Hospedagem PRO', href: '/hospedagem-pro' },
    { label: 'WordPress Hosting', href: '/wordpress' },
    { label: 'Bare-Metal', href: '/bare-metal' },
  ],
  Revendas: [
    { label: 'Revenda cPanel', href: '/revenda-cpanel' },
    { label: 'Revenda DirectAdmin', href: '/revenda-directadmin' },
    { label: 'Cloud APPs', href: '/cloud-apps' },
  ],
  Corporativo: [
    { label: 'Database Cloud', href: '/database-cloud' },
    { label: 'BackupPRO', href: '/backup-pro' },
    { label: 'Hosteg ERP', href: '/hosteg-erp' },
    { label: 'Terminal Server', href: '/terminal-server' },
  ],
  Suporte: [
    { label: 'Abrir Ticket', href: 'https://painelcliente.com.br/supporttickets.php', external: true },
    { label: 'Base de Conhecimento', href: '/suporte' },
    { label: 'Sobre a Hosteg', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
    { label: 'Área do Cliente', href: 'https://painelcliente.com.br', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight" style={{ color: '#0EA5E9' }}>
                HOSTEG
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5 max-w-[200px]">
              Infraestrutura cloud de alta performance no Brasil e Canadá.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  99.9% Uptime
                </span>
              </div>
              <div className="text-xs text-zinc-400">🇧🇷 São Paulo · 🇨🇦 Montreal</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 hover:text-[#0EA5E9] transition-colors flex items-center gap-1 group"
                      >
                        {link.label}
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-[#0EA5E9] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Hosteg. Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <Link href="#" className="hover:text-zinc-600 transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">SLA</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

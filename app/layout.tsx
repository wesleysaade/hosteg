import type { Metadata } from 'next'
import './compiled.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export const metadata: Metadata = {
  title: {
    default: 'Hosteg — Cloud VPS, Bare-Metal & Hospedagem',
    template: '%s | Hosteg',
  },
  description: 'Infraestrutura cloud de alta performance no Brasil. Cloud VPS NVMe, Bare-Metal dedicado, hospedagem profissional. Uptime 99.9%, suporte 24/7. Vem ser feliz na Hosteg!',
  keywords: ['cloud vps', 'servidor dedicado', 'bare metal', 'hospedagem', 'hospedagem brasil', 'vps brasil', 'hosteg'],
  authors: [{ name: 'Hosteg' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://hosteg.com.br',
    siteName: 'Hosteg',
    title: 'Hosteg — Cloud VPS, Bare-Metal & Hospedagem',
    description: 'Infraestrutura cloud de alta performance no Brasil.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hosteg — Cloud VPS, Bare-Metal & Hospedagem',
    description: 'Infraestrutura cloud de alta performance no Brasil.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-zinc-900 antialiased">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}

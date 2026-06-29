import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminAddonsClient from './AdminAddonsClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Adicionais — Admin Hosteg',
}

const PRODUCTS = [
  { slug: 'cloud-vps',           label: 'Cloud VPS'          },
  { slug: 'bare-metal',          label: 'Bare-Metal'         },
  { slug: 'hospedagem',          label: 'Hospedagem'         },
  { slug: 'hospedagem-pro',      label: 'Hospedagem PRO'     },
  { slug: 'wordpress',           label: 'WordPress'          },
  { slug: 'revenda-cpanel',      label: 'Revenda cPanel'     },
  { slug: 'revenda-directadmin', label: 'Revenda Painel Hosteg Hospedagem'},
  { slug: 'backup-pro',          label: 'BackupPRO'          },
  { slug: 'terminal-server',     label: 'Terminal Server'    },
]

export default async function AdminAddonsPage({
  searchParams,
}: {
  searchParams: { product?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const product = searchParams.product ?? 'cloud-vps'

  const { data: addons } = await supabase
    .from('product_addons')
    .select('*')
    .eq('product_slug', product)
    .order('category')
    .order('sort_order')

  return (
    <AdminAddonsClient
      products={PRODUCTS}
      currentProduct={product}
      initialAddons={addons ?? []}
    />
  )
}

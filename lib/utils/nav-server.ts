// Server-only — uses next/headers via @supabase/ssr. Do NOT import from client components.
import { createClient } from '@/lib/supabase/server'
import type { NavMenuItem } from './nav'

/** Busca itens de menu habilitados do banco */
export async function getNavMenuItems(): Promise<NavMenuItem[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('nav_menu_items')
      .select('*')
      .eq('is_enabled', true)
      .order('order_index')
    return (data ?? []) as NavMenuItem[]
  } catch {
    return []
  }
}

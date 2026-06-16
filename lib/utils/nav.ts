import { createClient } from '@/lib/supabase/server'

export type NavMenuItem = {
  id: string
  menu_group: 'main' | 'produtos' | 'cloud-apps' | 'institucional' | 'cta'
  category: string | null
  label: string
  description: string
  href: string
  icon_name: string
  badge: string
  order_index: number
  is_enabled: boolean
}

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

/** Agrupa itens por categoria para mega menus */
export function groupByCategory(
  items: NavMenuItem[]
): Array<{ category: string; items: NavMenuItem[] }> {
  const map = new Map<string, NavMenuItem[]>()
  const firstIndex = new Map<string, number>()
  for (const item of items) {
    const cat = item.category ?? 'Geral'
    if (!map.has(cat)) {
      map.set(cat, [])
      firstIndex.set(cat, item.order_index)
    }
    map.get(cat)!.push(item)
  }
  return [...map.entries()]
    .sort((a, b) => (firstIndex.get(a[0]) ?? 0) - (firstIndex.get(b[0]) ?? 0))
    .map(([category, items]) => ({ category, items }))
}

// Pure client-safe module — no server-only imports.
// Server-side fetch lives in lib/utils/nav-server.ts

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

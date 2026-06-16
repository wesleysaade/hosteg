import { createClient } from '@/lib/supabase/server'

/** Retorna todas as site_settings como objeto key → value */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    for (const row of data ?? []) map[row.key] = row.value
    return map
  } catch {
    return {}
  }
}

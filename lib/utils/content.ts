import { queryOne } from '@/lib/db/local'

export async function fetchPageSection(pageSlug: string, sectionKey: string): Promise<any> {
  try {
    const row = await queryOne<{ content: any }>(
      `SELECT content FROM page_sections WHERE page_slug = $1 AND section_key = $2 LIMIT 1`,
      [pageSlug, sectionKey]
    )
    return row?.content ?? null
  } catch {
    return null
  }
}

export async function fetchAllPageSections(pageSlug: string): Promise<Record<string, any>> {
  try {
    const rows = await queryOne<{ section_key: string; content: any }[]>(
      `SELECT section_key, content FROM page_sections WHERE page_slug = $1`,
      [pageSlug]
    ) as any
    const result: Record<string, any> = {}
    for (const row of (rows ?? [])) {
      result[row.section_key] = row.content
    }
    return result
  } catch {
    return {}
  }
}

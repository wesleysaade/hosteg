import { notFound } from 'next/navigation'
import { PAGES_CONFIG } from '@/lib/config/pages-config'
import { fetchAllPageSections } from '@/lib/utils/content'
import ContentEditor from '@/components/admin/ContentEditor'

export const dynamic = 'force-dynamic'

interface Props { params: { page: string } }

export default async function AdminContentEditorPage({ params }: Props) {
  const allPages = PAGES_CONFIG.flatMap(c => c.pages)
  const pageConfig = allPages.find(p => p.slug === params.page)
  if (!pageConfig) notFound()

  const dbSections = await fetchAllPageSections(params.page)

  // Merge: DB values override defaults; if DB is empty, defaults fill the editor
  const defaults = pageConfig.defaults ?? {}
  const sections: Record<string, any> = {}
  for (const sectionKey of pageConfig.sections) {
    sections[sectionKey] = dbSections[sectionKey] ?? defaults[sectionKey] ?? {}
  }

  return <ContentEditor pageConfig={pageConfig} initialSections={sections} />
}

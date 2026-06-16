import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DocCategoryEditor from '@/components/admin/DocCategoryEditor'

export const dynamic = 'force-dynamic'

interface Props { params: { id: string } }

export default async function EditDocCategoryPage({ params }: Props) {
  const supabase = createClient()

  const [{ data: category }, { data: allCategories }] = await Promise.all([
    supabase
      .from('doc_categories')
      .select('id, name, slug, icon, color, description, position, parent_id')
      .eq('id', params.id)
      .single(),
    supabase
      .from('doc_categories')
      .select('id, name, slug, icon, color, description, position, parent_id')
      .order('position'),
  ])

  if (!category) notFound()

  return <DocCategoryEditor category={category} allCategories={allCategories ?? []} />
}

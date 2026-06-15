import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DocCategoryEditor from '@/components/admin/DocCategoryEditor'

interface Props { params: { id: string } }

export default async function EditDocCategoryPage({ params }: Props) {
  const supabase = createClient()

  const { data: category } = await supabase
    .from('doc_categories')
    .select('id, name, slug, icon, color, description, position')
    .eq('id', params.id)
    .single()

  if (!category) notFound()

  return <DocCategoryEditor category={category} />
}

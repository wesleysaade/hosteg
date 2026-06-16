import { createClient } from '@/lib/supabase/server'
import DocCategoryEditor from '@/components/admin/DocCategoryEditor'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { parent?: string }
}

export default async function NewDocCategoryPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: allCategories } = await supabase
    .from('doc_categories')
    .select('id, name, slug, icon, color, description, position, parent_id')
    .order('position')

  return (
    <DocCategoryEditor
      allCategories={allCategories ?? []}
      defaultParentId={searchParams.parent}
    />
  )
}

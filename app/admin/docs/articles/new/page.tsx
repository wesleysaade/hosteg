import { createClient } from '@/lib/supabase/server'
import ArticleEditor from '@/components/admin/ArticleEditor'

interface Props {
  searchParams: { category?: string }
}

export default async function NewArticlePage({ searchParams }: Props) {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('doc_categories')
    .select('id, name, slug, parent_id')
    .order('position')

  return (
    <ArticleEditor
      categories={categories ?? []}
      defaultCategoryId={searchParams.category}
    />
  )
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const supabase = createClient()

  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase
      .from('doc_articles')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('doc_categories')
      .select('id, name, slug, parent_id')
      .order('position'),
  ])

  if (!article) notFound()

  return (
    <ArticleEditor
      article={article}
      categories={categories ?? []}
    />
  )
}

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CloudAppCategoryEditor from '@/components/admin/CloudAppCategoryEditor'

interface Props { params: { id: string } }

export default async function EditCloudAppCategoryPage({ params }: Props) {
  const supabase = createClient()

  const { data: category } = await supabase
    .from('cloud_app_categories')
    .select('id, name, position')
    .eq('id', params.id)
    .single()

  if (!category) notFound()

  return <CloudAppCategoryEditor category={category} />
}

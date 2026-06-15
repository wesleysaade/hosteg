import { createClient } from '@/lib/supabase/server'
import CloudAppEditor from '@/components/admin/CloudAppEditor'

export default async function NewCloudAppPage() {
  const supabase = createClient()
  const { data: cats } = await supabase
    .from('cloud_app_categories')
    .select('name')
    .order('position')

  const categories = (cats ?? []).map((c: any) => c.name)

  return <CloudAppEditor categories={categories} />
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CloudAppEditor from '@/components/admin/CloudAppEditor'

export default async function EditCloudAppPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: app }, { data: cats }] = await Promise.all([
    supabase.from('cloud_apps').select('*').eq('id', params.id).single(),
    supabase.from('cloud_app_categories').select('name').order('position'),
  ])

  if (!app) notFound()

  const categories = (cats ?? []).map((c: any) => c.name)

  return <CloudAppEditor app={app} categories={categories} />
}

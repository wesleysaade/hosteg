import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlansEditor from '@/components/admin/PlansEditor'

interface Props {
  params: { product: string }
}

export default async function EditProductPlansPage({ params }: Props) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from('product_pages')
    .select('*')
    .eq('slug', params.product)
    .single()

  if (!product) notFound()

  // Produtos que mostram features em seção compartilhada — não carregam por plano
  const SHARED_FEATURES_SLUGS = ['cloud-vps', 'bare-metal']
  const showFeatures = !SHARED_FEATURES_SLUGS.includes(product.slug)

  const { data: plans } = await supabase
    .from('plans')
    .select(showFeatures
      ? '*, plan_specs(id, label, value, tip, position), plan_features(id, text, tip, position)'
      : '*, plan_specs(id, label, value, tip, position)'
    )
    .eq('product_page_id', product.id)
    .order('position')

  // Sort nested arrays by position
  const sortedPlans = (plans ?? []).map((p: any) => ({
    ...p,
    plan_specs:    [...(p.plan_specs    ?? [])].sort((a: any, b: any) => a.position - b.position),
    plan_features: showFeatures
      ? [...(p.plan_features ?? [])].sort((a: any, b: any) => a.position - b.position)
      : [],
  }))

  return <PlansEditor product={product} initialPlans={sortedPlans} showFeatures={showFeatures} />
}

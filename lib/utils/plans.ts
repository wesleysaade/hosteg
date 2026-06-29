import { createClient } from '@/lib/supabase/server'
import type { BillingPlan, PeriodKey } from '@/components/PlanBillingSection'

const VALID_PERIODS: PeriodKey[] = ['mensal','trimestral','semestral','anual','bianual','trienal']

export async function fetchBillingPlans(slug: string): Promise<{
  plans: BillingPlan[]
  availablePeriods: PeriodKey[]
}> {
  try {
    const supabase = createClient()

    // Busca o produto
    const { data: product, error: productError } = await supabase
      .from('product_pages')
      .select('id, available_periods')
      .eq('slug', slug)
      .single()

    if (productError || !product) return { plans: [], availablePeriods: ['mensal'] }

    // Busca os planos
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select(`id, name, monthly_price, description, popular, position, cta_href,
               price_trimestral, price_semestral, price_anual, price_bianual, price_36months,
               setup_mensal, setup_anual, setup_bianual, setup_36months`)
      .eq('product_page_id', product.id)
      .order('position', { ascending: true })

    if (plansError || !plans?.length) return { plans: [], availablePeriods: ['mensal'] }

    const planIds = plans.map((p) => p.id)

    // Busca specs e features de todos os planos de uma vez
    const [{ data: specs }, { data: features }] = await Promise.all([
      supabase
        .from('plan_specs')
        .select('plan_id, label, value, tip, position')
        .in('plan_id', planIds)
        .order('position', { ascending: true }),
      supabase
        .from('plan_features')
        .select('plan_id, text, tip, position')
        .in('plan_id', planIds)
        .order('position', { ascending: true }),
    ])

    const specsByPlan: Record<string, any[]> = {}
    const featuresByPlan: Record<string, any[]> = {}
    for (const s of (specs ?? []))    (specsByPlan[s.plan_id]    ??= []).push(s)
    for (const f of (features ?? [])) (featuresByPlan[f.plan_id] ??= []).push(f)

    const billingPlans: BillingPlan[] = plans.map((p: any) => ({
      name:         p.name,
      desc:         p.description,
      monthlyPrice: Number(p.monthly_price),
      popular:      p.popular ?? false,
      ...(p.cta_href ? { ctaHref: p.cta_href } : {}),
      ...(p.price_36months != null ? { price36months: Number(p.price_36months) } : {}),
      ...(
        (p.setup_mensal != null || p.setup_anual != null || p.setup_bianual != null || p.setup_36months != null)
          ? { setupFees: {
              ...(p.setup_mensal   != null ? { mensal:   Number(p.setup_mensal)   } : {}),
              ...(p.setup_anual    != null ? { anual:    Number(p.setup_anual)    } : {}),
              ...(p.setup_bianual  != null ? { bianual:  Number(p.setup_bianual)  } : {}),
              ...(p.setup_36months != null ? { meses36:  Number(p.setup_36months) } : {}),
            } }
          : {}
      ),
      periodPrices: {
        ...(p.price_trimestral != null ? { trimestral: Number(p.price_trimestral) } : {}),
        ...(p.price_semestral  != null ? { semestral:  Number(p.price_semestral)  } : {}),
        ...(p.price_anual      != null ? { anual:      Number(p.price_anual)      } : {}),
        ...(p.price_bianual    != null ? { bianual:    Number(p.price_bianual)    } : {}),
        ...(p.price_36months   != null ? { trienal:    Number(p.price_36months)   } : {}),
      },
      specs:    (specsByPlan[p.id]    ?? []).map((s: any) => ({ label: s.label, value: s.value, tip: s.tip || undefined })),
      features: (featuresByPlan[p.id] ?? []).map((f: any) => ({ text: f.text, tip: f.tip || undefined })),
    }))

    const rawPeriods: string[] = product.available_periods?.length
      ? product.available_periods
      : ['mensal','trimestral','semestral','anual','bianual','trienal']

    const availablePeriods = rawPeriods.filter((p): p is PeriodKey => VALID_PERIODS.includes(p as PeriodKey))
    // Trienal (36 meses) habilitado em todos os produtos
    if (!availablePeriods.includes('trienal')) availablePeriods.push('trienal')

    return {
      plans: billingPlans,
      availablePeriods,
    }
  } catch (err) {
    console.error('[fetchBillingPlans] erro:', err)
    return { plans: [], availablePeriods: ['mensal'] }
  }
}

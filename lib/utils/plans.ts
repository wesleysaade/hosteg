import { query } from '@/lib/db/local'
import type { BillingPlan, PeriodKey } from '@/components/PlanBillingSection'

const VALID_PERIODS: PeriodKey[] = ['mensal','trimestral','semestral','anual','bianual']

export async function fetchBillingPlans(slug: string): Promise<{
  plans: BillingPlan[]
  availablePeriods: PeriodKey[]
}> {
  try {
    // Busca o produto
    const products = await query<{ id: string; available_periods: string[] }>(
      `SELECT id, available_periods FROM product_pages WHERE slug = $1 LIMIT 1`,
      [slug]
    )
    if (!products.length) return { plans: [], availablePeriods: ['mensal'] }
    const product = products[0]

    // Busca os planos
    const plans = await query<any>(
      `SELECT id, name, monthly_price, description, popular, position, cta_href,
              price_trimestral, price_semestral, price_anual, price_bianual, price_36months,
              setup_mensal, setup_anual, setup_bianual, setup_36months
       FROM plans
       WHERE product_page_id = $1
       ORDER BY position ASC`,
      [product.id]
    )

    if (!plans.length) return { plans: [], availablePeriods: ['mensal'] }

    // Busca specs e features de todos os planos de uma vez
    const planIds = plans.map((p: any) => p.id)
    const specs = await query<any>(
      `SELECT plan_id, label, value, tip, position FROM plan_specs
       WHERE plan_id = ANY($1) ORDER BY position ASC`,
      [planIds]
    )
    const features = await query<any>(
      `SELECT plan_id, text, tip, position FROM plan_features
       WHERE plan_id = ANY($1) ORDER BY position ASC`,
      [planIds]
    )

    const specsByPlan: Record<string, any[]> = {}
    const featuresByPlan: Record<string, any[]> = {}
    for (const s of specs)    (specsByPlan[s.plan_id]    ??= []).push(s)
    for (const f of features) (featuresByPlan[f.plan_id] ??= []).push(f)

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
      },
      specs:    (specsByPlan[p.id]    ?? []).map((s: any) => ({ label: s.label, value: s.value, tip: s.tip || undefined })),
      features: (featuresByPlan[p.id] ?? []).map((f: any) => ({ text: f.text, tip: f.tip || undefined })),
    }))

    const rawPeriods: string[] = product.available_periods?.length
      ? product.available_periods
      : ['mensal','trimestral','semestral','anual','bianual']

    return {
      plans: billingPlans,
      availablePeriods: rawPeriods.filter((p): p is PeriodKey => VALID_PERIODS.includes(p as PeriodKey)),
    }
  } catch (err) {
    console.error('[fetchBillingPlans] erro:', err)
    return { plans: [], availablePeriods: ['mensal'] }
  }
}

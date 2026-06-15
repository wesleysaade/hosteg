/**
 * Stripe — cartão de crédito
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   STRIPE_WEBHOOK_SECRET
 */

const STRIPE_BASE = 'https://api.stripe.com/v1'

async function stripeCall<T = any>(path: string, body?: Record<string, any>, method = 'POST'): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
  }
  if (body) {
    opts.body = new URLSearchParams(
      Object.entries(body).flatMap(([k, v]) =>
        typeof v === 'object'
          ? Object.entries(v as Record<string, string>).map(([sk, sv]) => [`${k}[${sk}]`, String(sv)])
          : [[k, String(v)]]
      )
    ).toString()
  }

  const res  = await fetch(`${STRIPE_BASE}${path}`, opts)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data as T
}

// ── Payment Intent ────────────────────────────────────────────────────────────
export interface StripePaymentIntentResult {
  id:           string
  clientSecret: string
  status:       string
}

export async function createPaymentIntent(params: {
  orderId:     string
  amountBRL:   number  // in BRL, e.g. 99.90
  customerEmail: string
  description:   string
}): Promise<StripePaymentIntentResult> {
  const data = await stripeCall('/payment_intents', {
    amount:               Math.round(params.amountBRL * 100),  // centavos
    currency:             'brl',
    payment_method_types: 'card',
    description:          params.description,
    receipt_email:        params.customerEmail,
    metadata: {
      order_id: params.orderId,
    },
  })
  return { id: data.id, clientSecret: data.client_secret, status: data.status }
}

// ── Webhook signature verification ───────────────────────────────────────────
export function constructStripeEvent(payload: string, sig: string): any {
  // For proper sig verification, use the official stripe npm package.
  // This is a simplified version that trusts the webhook — add verification in production.
  try {
    return JSON.parse(payload)
  } catch {
    throw new Error('Invalid Stripe webhook payload')
  }
}

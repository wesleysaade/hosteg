-- ── Checkout system migration ─────────────────────────────────────────────────

-- Enum de status do pedido
CREATE TYPE checkout_status AS ENUM (
  'pending',       -- aguardando pagamento
  'awaiting_payment', -- PIX/Boleto gerado
  'paid',          -- pagamento confirmado
  'processing',    -- enviando ao WHMCS
  'active',        -- criado no WHMCS com sucesso
  'failed',        -- erro no processamento
  'cancelled',     -- cancelado
  'expired'        -- expirou sem pagamento
);

CREATE TYPE payment_method AS ENUM ('pix', 'boleto', 'stripe');

-- ── Tabela principal de pedidos ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS checkout_orders (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  status          checkout_status NOT NULL DEFAULT 'pending',

  -- Cliente
  customer        jsonb NOT NULL DEFAULT '{}',
  -- { name, email, cpf_cnpj, phone, address: { street, number, complement, neighborhood, city, state, zip } }

  -- Produto
  product_slug    text NOT NULL,
  plan_name       text NOT NULL,
  plan_price      numeric(10,2) NOT NULL,
  billing_period  text NOT NULL, -- mensal | anual | etc.
  product_config  jsonb NOT NULL DEFAULT '{}',
  -- VPS: { os, datacenter }
  -- Hospedagem: { domain, domain_action (register|transfer|existing), nameservers }
  -- Bare-Metal: { os, raid, datacenter }

  -- Pagamento
  payment_method  payment_method,
  payment_id      text,           -- ID no Inter ou Stripe
  payment_url     text,           -- URL do boleto
  pix_qrcode      text,           -- QR code base64
  pix_copia_cola  text,           -- copia e cola
  paid_at         timestamptz,
  expires_at      timestamptz,

  -- WHMCS
  whmcs_client_id   integer,
  whmcs_order_id    integer,
  whmcs_invoice_id  integer,
  whmcs_error       text,

  -- Metadata
  ip_address  text,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS checkout_orders_status_idx   ON checkout_orders (status);
CREATE INDEX IF NOT EXISTS checkout_orders_email_idx    ON checkout_orders ((customer->>'email'));
CREATE INDEX IF NOT EXISTS checkout_orders_payment_idx  ON checkout_orders (payment_id);
CREATE INDEX IF NOT EXISTS checkout_orders_created_idx  ON checkout_orders (created_at DESC);

-- ── Histórico de eventos do pedido ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS checkout_events (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id   uuid NOT NULL REFERENCES checkout_orders(id) ON DELETE CASCADE,
  event      text NOT NULL,  -- 'payment.received', 'whmcs.created', 'status.changed', etc.
  payload    jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS checkout_events_order_idx ON checkout_events (order_id, created_at DESC);

-- ── Trigger: updated_at automático ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_checkout_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER checkout_orders_updated_at
  BEFORE UPDATE ON checkout_orders
  FOR EACH ROW EXECUTE FUNCTION update_checkout_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE checkout_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_events ENABLE ROW LEVEL SECURITY;

-- Leitura pública por ID (para polling de status pelo cliente)
CREATE POLICY "checkout_orders_read_by_id" ON checkout_orders
  FOR SELECT USING (true);

-- Inserção pública (qualquer um pode criar um pedido)
CREATE POLICY "checkout_orders_insert" ON checkout_orders
  FOR INSERT WITH CHECK (true);

-- Update apenas por service role (webhooks e API routes usam service role)
CREATE POLICY "checkout_orders_update_service" ON checkout_orders
  FOR UPDATE USING (true);

-- Eventos: leitura pública, inserção pelo service role
CREATE POLICY "checkout_events_read" ON checkout_events
  FOR SELECT USING (true);

CREATE POLICY "checkout_events_insert" ON checkout_events
  FOR INSERT WITH CHECK (true);

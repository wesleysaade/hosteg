-- ============================================================
-- HOSTEG — Schema local PostgreSQL (sem RLS Supabase)
-- ============================================================

-- ── DOCS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS doc_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  icon        text,
  color       text DEFAULT '#0EA5E9',
  description text,
  position    int  DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doc_articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES doc_categories(id) ON DELETE CASCADE,
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  content     text,
  excerpt     text,
  published   boolean DEFAULT false,
  views       int     DEFAULT 0,
  position    int     DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS doc_articles_updated_at ON doc_articles;
CREATE TRIGGER doc_articles_updated_at
  BEFORE UPDATE ON doc_articles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ── PLANS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_pages (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text UNIQUE NOT NULL,
  slug               text UNIQUE NOT NULL,
  available_periods  text[] DEFAULT ARRAY['mensal','trimestral','semestral','anual','bianual'],
  cta_href           text DEFAULT 'https://painelcliente.com.br',
  cta_label          text DEFAULT 'Contratar'
);

CREATE TABLE IF NOT EXISTS plans (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_page_id  uuid REFERENCES product_pages(id) ON DELETE CASCADE,
  name             text    NOT NULL,
  monthly_price    numeric NOT NULL,
  description      text,
  popular          boolean DEFAULT false,
  position         int     DEFAULT 0,
  cta_href         text,
  price_trimestral numeric(10,2),
  price_semestral  numeric(10,2),
  price_anual      numeric(10,2),
  price_bianual    numeric(10,2),
  price_36months   numeric(10,2),
  setup_mensal     numeric(10,2),
  setup_anual      numeric(10,2),
  setup_bianual    numeric(10,2),
  setup_36months   numeric(10,2)
);

CREATE TABLE IF NOT EXISTS plan_specs (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id  uuid REFERENCES plans(id) ON DELETE CASCADE,
  label    text NOT NULL,
  value    text NOT NULL,
  tip      text,
  position int  DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plan_features (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id  uuid REFERENCES plans(id) ON DELETE CASCADE,
  text     text NOT NULL,
  tip      text,
  position int  DEFAULT 0
);

-- ── CLOUD APPS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cloud_apps (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  category           text NOT NULL DEFAULT '',
  tagline            text NOT NULL DEFAULT '',
  description        text NOT NULL DEFAULT '',
  logo               text,
  logo_color         text NOT NULL DEFAULT '#0EA5E9',
  logo_bg            text NOT NULL DEFAULT '#EFF9FF',
  tags               text[] DEFAULT '{}',
  highlight          boolean NOT NULL DEFAULT false,
  modal_about        text DEFAULT '',
  modal_features     text[] DEFAULT '{}',
  modal_use_cases    text[] DEFAULT '{}',
  modal_requirements text DEFAULT '',
  position           integer NOT NULL DEFAULT 0,
  created_at         timestamptz DEFAULT now()
);

-- ── CONTRACTS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contracts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL UNIQUE,
  product_name text NOT NULL,
  title        text NOT NULL DEFAULT 'Contrato de Prestação de Serviços',
  content      text NOT NULL DEFAULT '',
  updated_at   timestamptz DEFAULT now()
);

-- ── PAGE SECTIONS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS page_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug   text NOT NULL,
  section_key text NOT NULL,
  content     jsonb,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- ── SEED: Produtos ───────────────────────────────────────────

INSERT INTO product_pages (name, slug) VALUES
  ('Hospedagem Web',        'hospedagem'),
  ('Hospedagem PRO',        'hospedagem-pro'),
  ('WordPress',             'wordpress'),
  ('Hospedagem ASP.NET',    'hospedagem-aspnet'),
  ('Revenda cPanel',        'revenda-cpanel'),
  ('Revenda DirectAdmin',   'revenda-directadmin'),
  ('Revenda ASP.NET',       'revenda-aspnet'),
  ('Cloud VPS',             'cloud-vps'),
  ('Cloud APPs',            'cloud-apps'),
  ('Database Cloud',        'database-cloud'),
  ('BackupPRO',             'backup-pro'),
  ('Hosteg ERP',            'hosteg-erp'),
  ('Terminal Server',       'terminal-server')
ON CONFLICT (slug) DO NOTHING;

-- ── SEED: Doc categories ─────────────────────────────────────

INSERT INTO doc_categories (name, slug, icon, color, description, position) VALUES
  ('Cloud VPS',              'cloud-vps',        'Server',    '#0EA5E9', 'Criação, configuração e gerenciamento de VPS',       1),
  ('Hospedagem Web',         'hospedagem-web',   'Globe',     '#10B981', 'DirectAdmin, SSL, e-mail e domínios',               2),
  ('Hospedagem PRO / cPanel','hospedagem-pro',   'Layers',    '#F59E0B', 'cPanel, Softaculous e configurações avançadas',      3),
  ('E-mail Profissional',    'email',            'Envelope',  '#8B5CF6', 'Configuração IMAP, SMTP e webmail',                 4),
  ('SSL / Segurança',        'ssl',              'Lock',      '#EF4444', 'Certificados SSL, HTTPS e firewall',                5),
  ('Linux / SSH',            'linux-ssh',        'Terminal',  '#6B7280', 'Comandos Linux, SSH e configurações de servidor',   6),
  ('WordPress',              'wordpress',        'Lightning', '#3B82F6', 'Instalação, performance e plugins WordPress',       7),
  ('Domínios & DNS',         'dominios-dns',     'HardDrive', '#EC4899', 'DNS, registros MX, TTL e subdomínios',             8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- HOSTEG — Tabela de categorias de Cloud APPs
-- Cole no SQL Editor do Supabase e execute
-- Seguro rodar mais de uma vez (IF NOT EXISTS + ON CONFLICT)
-- ============================================================

-- ── 1. Criar tabela ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cloud_app_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  position   integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cloud_app_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read cloud_app_categories"  ON cloud_app_categories;
DROP POLICY IF EXISTS "auth write cloud_app_categories"   ON cloud_app_categories;

CREATE POLICY "public read cloud_app_categories"
  ON cloud_app_categories FOR SELECT USING (true);

CREATE POLICY "auth write cloud_app_categories"
  ON cloud_app_categories FOR ALL USING (auth.role() = 'authenticated');

-- ── 2. Popular com as 5 categorias padrão ───────────────────
INSERT INTO cloud_app_categories (name, position) VALUES
  ('Automação & Fluxos',        1),
  ('WhatsApp & Comunicação',    2),
  ('CRM & Negócios',            3),
  ('DevOps & Infraestrutura',   4),
  ('Backend & Banco de Dados',  5)
ON CONFLICT (name) DO NOTHING;

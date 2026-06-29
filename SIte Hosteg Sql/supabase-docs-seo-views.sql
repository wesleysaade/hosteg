-- ============================================================
-- HOSTEG — Docs: SEO fields + rastreamento de visitas
-- Cole no SQL Editor do Supabase e execute
-- Seguro rodar mais de uma vez
-- ============================================================

-- ── 1. Campos de SEO em doc_articles ────────────────────────
ALTER TABLE doc_articles
  ADD COLUMN IF NOT EXISTS seo_title       text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_keywords    text;

-- ── 2. Tabela de visitas com timestamp ──────────────────────
CREATE TABLE IF NOT EXISTS doc_views (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  uuid        NOT NULL REFERENCES doc_articles(id) ON DELETE CASCADE,
  viewed_at   timestamptz NOT NULL DEFAULT now()
);

-- Índices para queries de contagem rápida
CREATE INDEX IF NOT EXISTS doc_views_article_id_idx  ON doc_views (article_id);
CREATE INDEX IF NOT EXISTS doc_views_viewed_at_idx   ON doc_views (viewed_at);

ALTER TABLE doc_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public insert doc_views"  ON doc_views;
DROP POLICY IF EXISTS "auth read doc_views"      ON doc_views;

-- Qualquer visitante pode registrar uma view
CREATE POLICY "public insert doc_views"
  ON doc_views FOR INSERT WITH CHECK (true);

-- Apenas autenticados podem ler estatísticas
CREATE POLICY "auth read doc_views"
  ON doc_views FOR SELECT USING (auth.role() = 'authenticated');

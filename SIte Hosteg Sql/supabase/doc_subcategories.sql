-- ── Subcategorias em doc_categories ─────────────────────────────────────────
-- Adiciona parent_id para suporte a hierarquia (categoria → subcategoria).
-- Execute no SQL Editor do Supabase.

ALTER TABLE doc_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES doc_categories(id) ON DELETE SET NULL;

-- Índice para buscas eficientes de filhos
CREATE INDEX IF NOT EXISTS idx_doc_categories_parent_id ON doc_categories(parent_id);

-- Exemplos de uso (opcional — descomente para inserir):
-- INSERT INTO doc_categories (name, slug, icon, color, description, position, parent_id)
-- VALUES ('cPanel', 'cpanel', 'Terminal', '#0EA5E9', 'Guias do painel cPanel', 1,
--         (SELECT id FROM doc_categories WHERE slug = 'hospedagem' LIMIT 1));

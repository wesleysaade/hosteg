-- ── page_sections ─────────────────────────────────────────────────────────────
-- Stores editable content blocks per page, keyed by (page_slug, section_key).
-- content is a flexible JSONB blob whose shape depends on section_key:
--   hero            → { badge?, title?, subtitle?, desc?, cta_label?, cta_href? }
--   shared_features → { items: [{ text, tip? }] }
--   diferenciais    → { items: [{ title, desc }] }
--   content         → { text }

CREATE TABLE IF NOT EXISTS page_sections (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug   text NOT NULL,
  section_key text NOT NULL,
  content     jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS page_sections_slug_idx ON page_sections (page_slug);

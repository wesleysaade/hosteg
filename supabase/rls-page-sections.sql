-- ── RLS policies for page_sections ───────────────────────────────────────────
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS (idempotent)
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- 2. Allow public read (the website reads sections server-side)
DROP POLICY IF EXISTS "page_sections_public_read" ON page_sections;
CREATE POLICY "page_sections_public_read"
  ON page_sections FOR SELECT
  USING (true);

-- 3. Allow authenticated users to insert / update / delete (admin panel)
DROP POLICY IF EXISTS "page_sections_auth_write" ON page_sections;
CREATE POLICY "page_sections_auth_write"
  ON page_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

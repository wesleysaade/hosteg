-- ============================================================
-- HOSTEG — Preços reais por período de contratação
-- Cole no SQL Editor do Supabase e execute
-- Seguro rodar mais de uma vez (IF NOT EXISTS)
-- ============================================================

-- Adiciona colunas de preço total por período na tabela plans
-- NULL = período não disponível / usa fallback do preço mensal
ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS price_trimestral numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_semestral  numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_anual      numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_bianual    numeric(10,2);

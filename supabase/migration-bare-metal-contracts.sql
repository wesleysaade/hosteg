-- ============================================================
-- Migração: colunas de contrato Bare-Metal
-- Execute no SQL Editor do Supabase ANTES de usar o admin
-- ============================================================

ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS price_36months  numeric,
  ADD COLUMN IF NOT EXISTS setup_mensal    numeric,
  ADD COLUMN IF NOT EXISTS setup_anual     numeric,
  ADD COLUMN IF NOT EXISTS setup_bianual   numeric,
  ADD COLUMN IF NOT EXISTS setup_36months  numeric;

-- Legenda de uso para bare-metal:
--   monthly_price  = taxa mensal (contrato mensal, sem fidelidade)
--   price_anual    = taxa mensal (contrato 12 meses)
--   price_bianual  = taxa mensal (contrato 24 meses)
--   price_36months = taxa mensal (contrato 36 meses)
--   setup_mensal   = taxa de setup para contrato mensal
--   setup_anual    = taxa de setup para contrato 12 meses
--   setup_bianual  = taxa de setup para contrato 24 meses
--   setup_36months = taxa de setup para contrato 36 meses (geralmente 0)

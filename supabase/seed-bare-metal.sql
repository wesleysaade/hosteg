-- ============================================================
-- Bare-Metal — product_pages + 6 planos + specs + features
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Produto
INSERT INTO product_pages (name, slug, cta_href, cta_label, available_periods)
VALUES ('Bare-Metal', 'bare-metal', 'https://painelcliente.com.br', 'Contratar', ARRAY['mensal'])
ON CONFLICT (slug) DO NOTHING;

-- 2. Planos
INSERT INTO plans (product_page_id, name, monthly_price, description, popular, position)
SELECT pp.id, v.plan_name, v.price, v.plan_desc, v.popular, v.pos
FROM product_pages pp,
(VALUES
  ('Xeon E5 Basic',  799,  'Entrada no mundo dedicado. Estável e confiável para cargas médias.',             false, 0),
  ('Xeon E5 Pro',    1199, 'Excelente equilíbrio entre custo e capacidade computacional.',                   true,  1),
  ('Xeon E5 Ultra',  1899, 'Para workloads intensivos que exigem grande quantidade de RAM.',                 false, 2),
  ('Xeon Gold Basic',1799, 'A geração Gold traz maior frequência e cache L3 aprimorado.',                   false, 3),
  ('Xeon Gold Pro',  2399, 'Para ambientes de virtualização, Big Data e IA com alta demanda.',               false, 4),
  ('Xeon Gold Elite',3299, 'O máximo em poder computacional dedicado. Sem compromissos.',                    false, 5)
) AS v(plan_name, price, plan_desc, popular, pos)
WHERE pp.slug = 'bare-metal'
ON CONFLICT DO NOTHING;

-- 3. Specs: Xeon E5 Basic
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon E5-2680 v2', 'Dual socket, geração Ivy Bridge-EP',                  0),
  ('Cores',   '20 Cores / 40 Threads',    '10 cores por socket com Hyper-Threading',             1),
  ('RAM',     '64 GB DDR3 ECC',           'Memória com correção de erro, anti-falhas',           2),
  ('Storage', '2× 480 GB SSD + 2× 1 TB', 'SATA SSD para OS + HDD para dados',                  3),
  ('Rede',    '1 Gbps',                   'Uplink dedicado com redundância',                      4),
  ('IP',      '1 IPv4 dedicado',          'Endereço IPv4 estático exclusivo',                    5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon E5 Basic';

-- 4. Specs: Xeon E5 Pro
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon E5-2680 v4', 'Dual socket, geração Broadwell-EP',                  0),
  ('Cores',   '28 Cores / 56 Threads',    '14 cores por socket com Hyper-Threading',            1),
  ('RAM',     '128 GB DDR4 ECC',          'Memória DDR4 com correção de erro',                  2),
  ('Storage', '2× 960 GB SSD NVMe',       'NVMe de alta performance, RAID 1 configurável',      3),
  ('Rede',    '1 Gbps',                   'Uplink dedicado com redundância',                     4),
  ('IP',      '1 IPv4 dedicado',          'Endereço IPv4 estático exclusivo',                   5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon E5 Pro';

-- 5. Specs: Xeon E5 Ultra
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon E5-2690 v4', 'Dual socket, maior clock da série E5 v4',            0),
  ('Cores',   '28 Cores / 56 Threads',    '14 cores por socket com Hyper-Threading',            1),
  ('RAM',     '256 GB DDR4 ECC',          'Ideal para bancos de dados e virtualização pesada',  2),
  ('Storage', '4× 1.92 TB NVMe',          'RAID 5/10 configurável, 7.68 TB bruto',              3),
  ('Rede',    '10 Gbps',                  'Uplink 10 Gbps dedicado',                             4),
  ('IP',      '2 IPv4 dedicados',         'Dois endereços IPv4 estáticos exclusivos',           5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon E5 Ultra';

-- 6. Specs: Xeon Gold Basic
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon Gold 6140',  'Dual socket, geração Skylake-SP',                    0),
  ('Cores',   '36 Cores / 72 Threads',    '18 cores por socket com Hyper-Threading',            1),
  ('RAM',     '128 GB DDR4 ECC',          'Memória DDR4 de 6 canais por socket',                2),
  ('Storage', '2× 1.92 TB NVMe',          'NVMe enterprise, 3.84 TB bruto',                     3),
  ('Rede',    '10 Gbps',                  'Uplink 10 Gbps dedicado',                             4),
  ('IP',      '1 IPv4 dedicado',          'Endereço IPv4 estático exclusivo',                   5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon Gold Basic';

-- 7. Specs: Xeon Gold Pro
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon Gold 6140',  'Dual socket, geração Skylake-SP',                    0),
  ('Cores',   '36 Cores / 72 Threads',    '18 cores por socket com Hyper-Threading',            1),
  ('RAM',     '256 GB DDR4 ECC',          'Ideal para virtualização e Big Data',                2),
  ('Storage', '4× 1.92 TB NVMe',          'RAID 5/10 configurável, 7.68 TB bruto',              3),
  ('Rede',    '10 Gbps',                  'Uplink 10 Gbps dedicado',                             4),
  ('IP',      '2 IPv4 dedicados',         'Dois endereços IPv4 estáticos exclusivos',           5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon Gold Pro';

-- 8. Specs: Xeon Gold Elite
INSERT INTO plan_specs (plan_id, label, value, tip, position)
SELECT p.id, v.label, v.value, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('CPU',     '2× Intel Xeon Gold 6140',  'Dual socket, geração Skylake-SP',                    0),
  ('Cores',   '36 Cores / 72 Threads',    '18 cores por socket com Hyper-Threading',            1),
  ('RAM',     '512 GB DDR4 ECC',          'Máxima memória disponível — ideal para IA e DBs',   2),
  ('Storage', '6× 1.92 TB NVMe',          'RAID configurável, 11.52 TB bruto',                  3),
  ('Rede',    '10 Gbps',                  'Uplink 10 Gbps dedicado',                             4),
  ('IP',      '4 IPv4 dedicados',         'Quatro endereços IPv4 estáticos exclusivos',         5)
) AS v(label, value, tip, pos)
WHERE pp.slug = 'bare-metal' AND p.name = 'Xeon Gold Elite';

-- 9. Features comuns a todos os planos Bare-Metal
INSERT INTO plan_features (plan_id, text, tip, position)
SELECT p.id, v.text, v.tip, v.pos
FROM plans p
JOIN product_pages pp ON p.product_page_id = pp.id,
(VALUES
  ('Anti-DDoS incluso',          'Proteção contra ataques volumétricos até 1 Tbps',       0),
  ('RAID configurável',          'RAID 0, 1, 5 ou 10 — configurado no provisionamento',  1),
  ('KVM Console',                'Acesso de emergência via KVM remoto 24/7',              2),
  ('Acesso root total',          'Controle completo do hardware e sistema operacional',   3),
  ('SLA 99.9% garantido',        'Uptime garantido em contrato com créditos automáticos', 4),
  ('Suporte 24/7 em português',  'Suporte técnico humano disponível a qualquer hora',     5),
  ('Monitoramento incluso',      'Alertas de CPU, RAM, disco e rede em tempo real',       6)
) AS v(text, tip, pos)
WHERE pp.slug = 'bare-metal';

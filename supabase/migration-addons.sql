-- ── Product Addons ────────────────────────────────────────────────────────────
-- Stores configurable add-ons per product (and optionally per plan).
-- plan_name = '__all__' means the addon applies to all plans for that product.

CREATE TABLE IF NOT EXISTS product_addons (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT         NOT NULL,
  plan_name    TEXT         NOT NULL DEFAULT '__all__',
  category     TEXT         NOT NULL,  -- 'disk','ip','ipv6','bandwidth','license','app','meta'
  addon_key    TEXT         NOT NULL,
  label        TEXT         NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_type   TEXT         DEFAULT 'monthly',   -- 'monthly' | 'setup'
  max_qty      INT          DEFAULT 1,
  unit         TEXT         DEFAULT 'unid',
  enabled      BOOLEAN      DEFAULT true,
  sort_order   INT          DEFAULT 0,
  metadata     JSONB        DEFAULT '{}',
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(product_slug, plan_name, addon_key)
);

CREATE INDEX IF NOT EXISTS idx_product_addons_slug_plan
  ON product_addons(product_slug, plan_name);

CREATE INDEX IF NOT EXISTS idx_product_addons_category
  ON product_addons(product_slug, category);

-- RLS
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_addons_public_read"
  ON product_addons FOR SELECT USING (true);

CREATE POLICY "product_addons_auth_write"
  ON product_addons FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- updated_at trigger (function already created in migration-checkout.sql)
CREATE OR REPLACE TRIGGER product_addons_updated_at
  BEFORE UPDATE ON product_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Seed: Cloud VPS ───────────────────────────────────────────────────────────
INSERT INTO product_addons
  (product_slug, category, addon_key, label, description, price, price_type, max_qty, unit, sort_order)
VALUES
  -- IPs
  ('cloud-vps','ip',       'ip_adicional',    'IP Adicional IPv4',        'Endereço IPv4 dedicado extra',                              25.00,'monthly',200,'IP',  10),
  ('cloud-vps','ipv6',     'ipv6_64',         'Bloco IPv6 /64',           'Bloco IPv6 /64 com prefixo dedicado',                       5.00,'monthly',  1,'bloco',20),

  -- Bandwidth
  ('cloud-vps','bandwidth','bw_1g',           'Upgrade para 1 Gbps',      'Uplink dedicado de 1 Gbps',                                50.00,'monthly',  1,'Gbps', 30),
  ('cloud-vps','bandwidth','bw_10g',          'Upgrade para 10 Gbps',     'Uplink dedicado de 10 Gbps',                              200.00,'monthly',  1,'Gbps', 31),

  -- Discos
  ('cloud-vps','disk',     'disk_ssd_50gb',   'SSD SATA 50GB',            'Disco SSD adicional de 50GB',                              25.00,'monthly',  4,'GB',   40),
  ('cloud-vps','disk',     'disk_ssd_100gb',  'SSD SATA 100GB',           'Disco SSD adicional de 100GB',                             45.00,'monthly',  4,'GB',   41),
  ('cloud-vps','disk',     'disk_nvme_50gb',  'NVMe Gen4 50GB',           'Disco NVMe de alta performance 50GB',                      35.00,'monthly',  4,'GB',   42),
  ('cloud-vps','disk',     'disk_nvme_100gb', 'NVMe Gen4 100GB',          'Disco NVMe de alta performance 100GB',                     65.00,'monthly',  4,'GB',   43),

  -- Licenças
  ('cloud-vps','license',  'lic_cpanel',      'Licença cPanel',           'cPanel & WHM para gerenciamento de hospedagem',           120.00,'monthly',  1,'lic',  50),
  ('cloud-vps','license',  'lic_litespeed',   'LiteSpeed Web Server',     'Servidor web de alta performance com LSCache',             80.00,'monthly',  1,'lic',  51),
  ('cloud-vps','license',  'lic_cloudlinux',  'CloudLinux OS',            'OS para isolamento e estabilidade de contas',              70.00,'monthly',  1,'lic',  52),
  ('cloud-vps','license',  'lic_directadmin', 'Licença DirectAdmin',      'Painel de controle DirectAdmin',                          25.00,'monthly',  1,'lic',  53),
  ('cloud-vps','license',  'lic_plesk',       'Licença Plesk',            'Painel Plesk Obsidian',                                   90.00,'monthly',  1,'lic',  54),
  ('cloud-vps','license',  'lic_imunify',     'Imunify360',               'Antivírus e firewall avançado',                           40.00,'monthly',  1,'lic',  55),

  -- Apps instaláveis (gratuitos)
  ('cloud-vps','app',      'app_wordpress',   'WordPress',                'CMS para sites, lojas e blogs',                            0.00,'monthly',  1,'',     60),
  ('cloud-vps','app',      'app_n8n',         'N8N',                      'Automação de fluxos de trabalho',                          0.00,'monthly',  1,'',     61),
  ('cloud-vps','app',      'app_typebot',     'Typebot',                  'Criador visual de chatbots',                               0.00,'monthly',  1,'',     62),
  ('cloud-vps','app',      'app_evolution',   'Evolution API',            'API WhatsApp multi-dispositivo',                           0.00,'monthly',  1,'',     63),
  ('cloud-vps','app',      'app_chatwoot',    'Chatwoot',                 'Suporte omnichannel unificado',                            0.00,'monthly',  1,'',     64),
  ('cloud-vps','app',      'app_minio',       'MinIO',                    'Object Storage compatível com S3',                         0.00,'monthly',  1,'',     65),
  ('cloud-vps','app',      'app_supabase',    'Supabase',                 'Backend as a Service open-source',                         0.00,'monthly',  1,'',     66),
  ('cloud-vps','app',      'app_odoo',        'Odoo',                     'ERP open-source completo',                                 0.00,'monthly',  1,'',     67),
  ('cloud-vps','app',      'app_grafana',     'Grafana',                  'Monitoramento e dashboards',                               0.00,'monthly',  1,'',     68),

-- ── Seed: Bare-Metal ──────────────────────────────────────────────────────────
  -- Meta: disk slots disponíveis (padrão 4; admin pode criar override por plano)
  ('bare-metal','meta',     'max_disk_slots',  'Slots de disco',           'Número máximo de discos adicionais permitidos',             0.00,'monthly',  4,'slots', 1),

  -- IPs
  ('bare-metal','ip',       'ip_adicional',    'IP Adicional IPv4',        'Endereço IPv4 dedicado extra',                             25.00,'monthly',200,'IP',   10),
  ('bare-metal','ipv6',     'ipv6_64',         'Bloco IPv6 /64',           'Bloco IPv6 /64 com prefixo dedicado',                      5.00,'monthly',  1,'bloco',11),

  -- Bandwidth
  ('bare-metal','bandwidth','bw_10g',          'Upgrade para 10 Gbps',     'Upgrade do uplink dedicado para 10 Gbps',                500.00,'monthly',  1,'Gbps', 20),

  -- Discos NVMe
  ('bare-metal','disk',     'nvme_1tb',        'NVMe Gen4 1TB',            'SSD NVMe de alta performance — 1TB',                     120.00,'monthly',  4,'TB',   30),
  ('bare-metal','disk',     'nvme_2tb',        'NVMe Gen4 2TB',            'SSD NVMe de alta performance — 2TB',                     220.00,'monthly',  4,'TB',   31),
  ('bare-metal','disk',     'nvme_4tb',        'NVMe Gen4 4TB',            'SSD NVMe de alta performance — 4TB',                     400.00,'monthly',  4,'TB',   32),

  -- Discos SSD SATA
  ('bare-metal','disk',     'ssd_240gb',       'SSD SATA 240GB',           'SSD SATA — 240GB',                                        40.00,'monthly',  4,'GB',   40),
  ('bare-metal','disk',     'ssd_480gb',       'SSD SATA 480GB',           'SSD SATA — 480GB',                                        70.00,'monthly',  4,'GB',   41),
  ('bare-metal','disk',     'ssd_1tb',         'SSD SATA 1TB',             'SSD SATA — 1TB',                                         120.00,'monthly',  4,'GB',   42),
  ('bare-metal','disk',     'ssd_2tb',         'SSD SATA 2TB',             'SSD SATA — 2TB',                                         200.00,'monthly',  4,'GB',   43),

  -- Discos HDD SATA
  ('bare-metal','disk',     'sata_4tb',        'HDD SATA 4TB',             'Disco rígido SATA — 4TB',                                 80.00,'monthly',  4,'TB',   50),
  ('bare-metal','disk',     'sata_6tb',        'HDD SATA 6TB',             'Disco rígido SATA — 6TB',                                110.00,'monthly',  4,'TB',   51),
  ('bare-metal','disk',     'sata_8tb',        'HDD SATA 8TB',             'Disco rígido SATA — 8TB',                                140.00,'monthly',  4,'TB',   52),
  ('bare-metal','disk',     'sata_10tb',       'HDD SATA 10TB',            'Disco rígido SATA — 10TB',                               160.00,'monthly',  4,'TB',   53),
  ('bare-metal','disk',     'sata_14tb',       'HDD SATA 14TB',            'Disco rígido SATA — 14TB',                               200.00,'monthly',  4,'TB',   54)

ON CONFLICT DO NOTHING;

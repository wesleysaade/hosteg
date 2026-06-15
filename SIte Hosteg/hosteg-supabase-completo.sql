-- ============================================================
-- HOSTEG — Schema + Dados Completos para Supabase
-- Gerado em 2026-06-15
-- Execute no SQL Editor do Supabase (pode rodar mais de uma vez)
-- ============================================================

-- ── 1. FUNÇÃO TRIGGER ────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── 2. TABELAS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS doc_categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  icon        text,
  color       text        DEFAULT '#0EA5E9',
  description text,
  position    int         DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doc_articles (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     uuid        REFERENCES doc_categories(id) ON DELETE CASCADE,
  title           text        NOT NULL,
  slug            text        UNIQUE NOT NULL,
  content         text,
  excerpt         text,
  published       boolean     DEFAULT false,
  views           int         DEFAULT 0,
  position        int         DEFAULT 0,
  seo_title       text,
  seo_description text,
  seo_keywords    text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doc_views (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid        NOT NULL REFERENCES doc_articles(id) ON DELETE CASCADE,
  viewed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_pages (
  id                uuid   PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text   UNIQUE NOT NULL,
  slug              text   UNIQUE NOT NULL,
  available_periods text[] DEFAULT ARRAY['mensal','trimestral','semestral','anual','bianual'],
  cta_href          text   DEFAULT 'https://painelcliente.com.br',
  cta_label         text   DEFAULT 'Contratar'
);

CREATE TABLE IF NOT EXISTS plans (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_page_id  uuid          REFERENCES product_pages(id) ON DELETE CASCADE,
  name             text          NOT NULL,
  monthly_price    numeric       NOT NULL,
  description      text,
  popular          boolean       DEFAULT false,
  position         int           DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS cloud_apps (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text        NOT NULL,
  category           text        NOT NULL DEFAULT '',
  tagline            text        NOT NULL DEFAULT '',
  description        text        NOT NULL DEFAULT '',
  logo               text,
  logo_color         text        NOT NULL DEFAULT '#0EA5E9',
  logo_bg            text        NOT NULL DEFAULT '#EFF9FF',
  tags               text[]      DEFAULT '{}',
  highlight          boolean     NOT NULL DEFAULT false,
  modal_about        text        DEFAULT '',
  modal_features     text[]      DEFAULT '{}',
  modal_use_cases    text[]      DEFAULT '{}',
  modal_requirements text        DEFAULT '',
  position           integer     NOT NULL DEFAULT 0,
  created_at         timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cloud_app_categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL UNIQUE,
  position   integer     NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_addons (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text          NOT NULL,
  plan_name    text          NOT NULL DEFAULT '__all__',
  category     text          NOT NULL,
  addon_key    text          NOT NULL,
  label        text          NOT NULL,
  description  text,
  price        decimal(10,2) NOT NULL DEFAULT 0,
  price_type   text          DEFAULT 'monthly',
  max_qty      int           DEFAULT 1,
  unit         text          DEFAULT 'unid',
  enabled      boolean       DEFAULT true,
  sort_order   int           DEFAULT 0,
  metadata     jsonb         DEFAULT '{}',
  created_at   timestamptz   DEFAULT now(),
  updated_at   timestamptz   DEFAULT now(),
  UNIQUE(product_slug, plan_name, addon_key)
);

CREATE TABLE IF NOT EXISTS contracts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text        NOT NULL UNIQUE,
  product_name text        NOT NULL,
  title        text        NOT NULL DEFAULT 'Contrato de Prestação de Serviços',
  content      text        NOT NULL DEFAULT '',
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_sections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug   text        NOT NULL,
  section_key text        NOT NULL,
  content     jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- ── 3. INDEXES ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS doc_views_article_id_idx      ON doc_views (article_id);
CREATE INDEX IF NOT EXISTS doc_views_viewed_at_idx       ON doc_views (viewed_at);
CREATE INDEX IF NOT EXISTS page_sections_slug_idx        ON page_sections (page_slug);
CREATE INDEX IF NOT EXISTS idx_product_addons_slug_plan  ON product_addons(product_slug, plan_name);
CREATE INDEX IF NOT EXISTS idx_product_addons_category   ON product_addons(product_slug, category);

-- ── 4. TRIGGERS ───────────────────────────────────────────────

DROP TRIGGER IF EXISTS doc_articles_updated_at ON doc_articles;
CREATE TRIGGER doc_articles_updated_at
  BEFORE UPDATE ON doc_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS product_addons_updated_at ON product_addons;
CREATE TRIGGER product_addons_updated_at
  BEFORE UPDATE ON product_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 5. ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE doc_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_views            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_pages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans                ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_specs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_apps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_app_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections        ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doc_categories_public_read"       ON doc_categories;
CREATE POLICY "doc_categories_public_read"       ON doc_categories       FOR SELECT USING (true);
DROP POLICY IF EXISTS "doc_categories_auth_write"        ON doc_categories;
CREATE POLICY "doc_categories_auth_write"        ON doc_categories       FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "doc_articles_public_read"         ON doc_articles;
CREATE POLICY "doc_articles_public_read"         ON doc_articles         FOR SELECT USING (true);
DROP POLICY IF EXISTS "doc_articles_auth_write"          ON doc_articles;
CREATE POLICY "doc_articles_auth_write"          ON doc_articles         FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public insert doc_views"          ON doc_views;
CREATE POLICY "public insert doc_views"          ON doc_views            FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth read doc_views"              ON doc_views;
CREATE POLICY "auth read doc_views"              ON doc_views            FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "product_pages_public_read"        ON product_pages;
CREATE POLICY "product_pages_public_read"        ON product_pages        FOR SELECT USING (true);
DROP POLICY IF EXISTS "product_pages_auth_write"         ON product_pages;
CREATE POLICY "product_pages_auth_write"         ON product_pages        FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "plans_public_read"                ON plans;
CREATE POLICY "plans_public_read"                ON plans                FOR SELECT USING (true);
DROP POLICY IF EXISTS "plans_auth_write"                 ON plans;
CREATE POLICY "plans_auth_write"                 ON plans                FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "plan_specs_public_read"           ON plan_specs;
CREATE POLICY "plan_specs_public_read"           ON plan_specs           FOR SELECT USING (true);
DROP POLICY IF EXISTS "plan_specs_auth_write"            ON plan_specs;
CREATE POLICY "plan_specs_auth_write"            ON plan_specs           FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "plan_features_public_read"        ON plan_features;
CREATE POLICY "plan_features_public_read"        ON plan_features        FOR SELECT USING (true);
DROP POLICY IF EXISTS "plan_features_auth_write"         ON plan_features;
CREATE POLICY "plan_features_auth_write"         ON plan_features        FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cloud_apps_public_read"           ON cloud_apps;
CREATE POLICY "cloud_apps_public_read"           ON cloud_apps           FOR SELECT USING (true);
DROP POLICY IF EXISTS "cloud_apps_auth_write"            ON cloud_apps;
CREATE POLICY "cloud_apps_auth_write"            ON cloud_apps           FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cloud_app_categories_public_read" ON cloud_app_categories;
CREATE POLICY "cloud_app_categories_public_read" ON cloud_app_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "cloud_app_categories_auth_write"  ON cloud_app_categories;
CREATE POLICY "cloud_app_categories_auth_write"  ON cloud_app_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "product_addons_public_read"       ON product_addons;
CREATE POLICY "product_addons_public_read"       ON product_addons       FOR SELECT USING (true);
DROP POLICY IF EXISTS "product_addons_auth_write"        ON product_addons;
CREATE POLICY "product_addons_auth_write"        ON product_addons       FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "contracts_public_read"            ON contracts;
CREATE POLICY "contracts_public_read"            ON contracts            FOR SELECT USING (true);
DROP POLICY IF EXISTS "contracts_auth_write"             ON contracts;
CREATE POLICY "contracts_auth_write"             ON contracts            FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "page_sections_public_read"        ON page_sections;
CREATE POLICY "page_sections_public_read"        ON page_sections        FOR SELECT USING (true);
DROP POLICY IF EXISTS "page_sections_auth_write"         ON page_sections;
CREATE POLICY "page_sections_auth_write"         ON page_sections        FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 6. SEED: Produtos ─────────────────────────────────────────

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

INSERT INTO product_pages (name, slug, cta_href, cta_label, available_periods)
VALUES ('Bare-Metal', 'bare-metal', 'https://painelcliente.com.br', 'Contratar', ARRAY['mensal'])
ON CONFLICT (slug) DO NOTHING;

-- ── 7. SEED: Doc Categories ───────────────────────────────────

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

-- ── 8. SEED: Cloud App Categories ────────────────────────────

INSERT INTO cloud_app_categories (name, position) VALUES
  ('Automação & Fluxos',        1),
  ('WhatsApp & Comunicação',    2),
  ('CRM & Negócios',            3),
  ('DevOps & Infraestrutura',   4),
  ('Backend & Banco de Dados',  5)
ON CONFLICT (name) DO NOTHING;


-- ── 9. SEED: Cloud Apps ───────────────────────────────────────

INSERT INTO cloud_apps (name,category,tagline,description,logo,logo_color,logo_bg,tags,highlight,modal_about,modal_features,modal_use_cases,modal_requirements,position) VALUES
('N8N','Automação & Fluxos','Automação de fluxos sem código','Automação de fluxos de trabalho e integrações entre sistemas sem código.','https://cdn.simpleicons.org/n8n','#EA4B71','#FFF0F5',ARRAY['Automação','No-code','Workflows'],true,'N8N é uma plataforma de automação de fluxos open-source.',ARRAY['Interface visual drag-and-drop','+400 integrações nativas','Execução agendada (cron jobs)','Webhooks e triggers em tempo real'],ARRAY['Automatizar envio de e-mails','Sincronizar dados entre sistemas'],'VPS com mínimo 2GB RAM.',0),
('Evolution API','WhatsApp & Comunicação','API WhatsApp multi-dispositivo','API de WhatsApp multi-dispositivo. Conecte seus sistemas ao WhatsApp com facilidade.','https://cdn.simpleicons.org/whatsapp/25D366','#25D366','#F0FFF4',ARRAY['WhatsApp','API','Multi-device'],true,'Evolution API é uma solução open-source para integração com WhatsApp.',ARRAY['Multi-instâncias','Envio de texto e mídia','Webhooks para recebimento'],ARRAY['Chatbot de atendimento','Notificações via WhatsApp'],'VPS com mínimo 2GB RAM.',1),
('Typebot','WhatsApp & Comunicação','Construtor visual de chatbots','Construtor visual de chatbots para WhatsApp, sites e Telegram. Sem código.','https://cdn.simpleicons.org/typebot/7C3AED','#7C3AED','#F5F3FF',ARRAY['Chatbot','WhatsApp','Visual'],false,'Typebot é um construtor de chatbots open-source com interface visual.',ARRAY['Interface drag-and-drop','Integrações com WhatsApp e Telegram','Coleta de leads'],ARRAY['Qualificação automática de leads','FAQ automatizado'],'VPS com mínimo 1GB RAM.',2),
('Chatwoot','WhatsApp & Comunicação','Central de atendimento omnichannel','Central de atendimento omnichannel. WhatsApp, e-mail, Instagram e muito mais.','https://cdn.simpleicons.org/chatwoot/1F93FF','#1F93FF','#EFF6FF',ARRAY['Atendimento','Omnichannel','Suporte'],false,'Chatwoot é uma plataforma open-source de atendimento ao cliente.',ARRAY['Múltiplos canais: WhatsApp, Instagram, Email','Caixa de entrada compartilhada','Respostas prontas'],ARRAY['Suporte ao cliente multicanal','Gestão de reclamações'],'VPS com mínimo 2GB RAM.',3),
('Odoo','CRM & Negócios','ERP open-source completo','ERP open-source completo: vendas, estoque, contabilidade, RH e muito mais.','https://cdn.simpleicons.org/odoo/714B67','#714B67','#FAF0F8',ARRAY['ERP','CRM','Open-source'],true,'Odoo é o ERP open-source mais popular do mundo.',ARRAY['CRM e pipeline de vendas','Gestão de estoque','Contabilidade e faturamento','RH e folha de pagamento'],ARRAY['Gestão empresarial completa','E-commerce com gestão integrada'],'VPS com mínimo 4GB RAM.',4),
('Easypanel','DevOps & Infraestrutura','Gerenciador de servidores e apps','Painel de gerenciamento de servidores e apps com interface visual. Deploy via Docker.','https://cdn.simpleicons.org/easypanel/5046E5','#5046E5','#EEF2FF',ARRAY['DevOps','Deploy','Docker'],true,'Easypanel é uma plataforma de gerenciamento de servidores.',ARRAY['Deploy com um clique via Docker','Gerenciamento de domínios e SSL','Logs em tempo real'],ARRAY['Deploy de aplicações web','Gerenciamento de múltiplos projetos'],'VPS com mínimo 1GB RAM.',5),
('Supabase','Backend & Banco de Dados','Backend as a Service open-source','Backend as a Service open-source. PostgreSQL + Auth + Storage + Realtime.','https://cdn.simpleicons.org/supabase/3ECF8E','#3ECF8E','#EFFDF5',ARRAY['Backend','PostgreSQL','BaaS'],true,'Supabase é uma alternativa open-source ao Firebase.',ARRAY['Banco de dados PostgreSQL completo','Autenticação e autorização','Storage de arquivos com CDN','Edge Functions (serverless)'],ARRAY['Backend de aplicativos mobile','APIs para frontends React/Vue'],'VPS com mínimo 4GB RAM.',6),
('MongoDB','Backend & Banco de Dados','Banco NoSQL pré-configurado','Banco de dados NoSQL pré-configurado com Compass e MongoExpress.','https://cdn.simpleicons.org/mongodb/47A248','#47A248','#F0FFF4',ARRAY['NoSQL','Banco de Dados','MongoDB'],false,'VPS com MongoDB pré-instalado e configurado.',ARRAY['MongoDB 7.x instalado','Mongo Express interface web','Backups automáticos configurados'],ARRAY['Banco de dados para APIs REST','Logs e dados de eventos'],'VPS com mínimo 2GB RAM.',7),
('Mautic','Automação & Fluxos','Automação de marketing open-source','Plataforma de automação de marketing open-source. E-mail marketing e CRM.','https://cdn.simpleicons.org/mautic/4E5E9E','#4E5E9E','#EEF2FF',ARRAY['Marketing','E-mail','CRM'],false,'Mautic é a plataforma de marketing automation open-source mais popular.',ARRAY['Campanhas de e-mail marketing','Landing pages e formulários','Automações baseadas em comportamento','Segmentação avançada de contatos'],ARRAY['Nutrição de leads automatizada','E-mail marketing em larga escala'],'VPS com mínimo 2GB RAM.',8),
('Docker + Portainer','DevOps & Infraestrutura','Gerenciamento visual de containers','Ambiente Docker pré-configurado com Portainer. Gerencie containers visualmente.','https://cdn.simpleicons.org/docker/2496ED','#2496ED','#EFF9FF',ARRAY['Docker','Containers','Portainer'],false,'VPS com Docker Engine e Portainer pré-instalados.',ARRAY['Docker Engine + Compose pré-instalados','Portainer CE com interface web','Deploy de stacks via Docker Compose'],ARRAY['Hospedar múltiplas aplicações','Ambiente de desenvolvimento isolado'],'VPS com mínimo 2GB RAM.',9),
('MinIO','DevOps & Infraestrutura','Object storage compatível com S3','Object storage de alta performance compatível com S3.','https://cdn.simpleicons.org/minio/C72C48','#C72C48','#FFF5F5',ARRAY['Storage','S3','Object Store'],false,'MinIO é um servidor de object storage de alta performance.',ARRAY['100% compatível com AWS S3 API','Interface web para gerenciamento','Versionamento de arquivos','Criptografia end-to-end'],ARRAY['Storage privado alternativo ao S3','Backups de banco de dados'],'VPS com mínimo 1GB RAM.',10)
ON CONFLICT DO NOTHING;

-- Extra cloud apps (idempotente via WHERE NOT EXISTS)
INSERT INTO cloud_apps (name,category,tagline,description,logo,logo_color,logo_bg,tags,highlight,modal_about,modal_features,modal_use_cases,modal_requirements,position)
SELECT 'Yeastar','WhatsApp & Comunicação','PABX IP e WhatsApp Business em um só lugar','Central telefônica IP + WhatsApp Business API integrada. PABX na nuvem para pequenas e médias empresas.','https://cdn.simpleicons.org/phone','#E8472F','#FFF5F3',ARRAY['PABX','VoIP','WhatsApp Business'],false,'Yeastar P-Series PABX IP é uma central telefônica cloud que une voz, vídeo e WhatsApp Business em uma única plataforma.',ARRAY['PABX IP na nuvem','WhatsApp Business integrado','Roteamento inteligente de chamadas','Gravação de chamadas'],ARRAY['Central telefônica para equipes de suporte','Integração de voz e WhatsApp'],'VPS com mínimo 4GB RAM.',12
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'Yeastar');

INSERT INTO cloud_apps (name,category,tagline,description,logo,logo_color,logo_bg,tags,highlight,modal_about,modal_features,modal_use_cases,modal_requirements,position)
SELECT 'SofiaCRM','CRM & Negócios','CRM brasileiro para vendas e atendimento','CRM desenvolvido no Brasil. Gestão de leads, funil de vendas e atendimento integrado ao WhatsApp.','https://cdn.simpleicons.org/salesforce','#F59E0B','#FFFBEB',ARRAY['CRM','Vendas','WhatsApp'],false,'SofiaCRM é um sistema de CRM brasileiro focado em pequenas e médias empresas.',ARRAY['Funil de vendas visual','Integração com WhatsApp','Automação de follow-up','Relatórios de conversão'],ARRAY['Gestão de leads para equipes de vendas','Atendimento integrado via WhatsApp'],'VPS com mínimo 2GB RAM.',13
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'SofiaCRM');

INSERT INTO cloud_apps (name,category,tagline,description,logo,logo_color,logo_bg,tags,highlight,modal_about,modal_features,modal_use_cases,modal_requirements,position)
SELECT 'OpenPanel','DevOps & Infraestrutura','Painel de hospedagem open-source moderno','Alternativa open-source ao cPanel. Interface moderna, Docker nativo e multi-servidor.','https://cdn.simpleicons.org/openpanel','#0EA5E9','#EFF9FF',ARRAY['DevOps','Painel','Open-source'],false,'OpenPanel é uma alternativa moderna e open-source ao cPanel/WHM.',ARRAY['Interface moderna e responsiva','Docker nativo por conta','Gerenciamento multi-servidor','SSL automático via Let''s Encrypt'],ARRAY['Hospedagem gerenciada self-hosted','Alternativa ao cPanel para revendedores'],'VPS com mínimo 2GB RAM.',14
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'OpenPanel');

-- ── 10. SEED: Contratos ───────────────────────────────────────

INSERT INTO contracts (product_slug, product_name, title, content) VALUES
  ('hospedagem',          'Hospedagem Web',       'Contrato de Hospedagem Web',          ''),
  ('cloud-vps',           'Cloud VPS',            'Contrato de Cloud VPS',               ''),
  ('hospedagem-pro',      'Hospedagem PRO',        'Contrato de Hospedagem PRO',          ''),
  ('wordpress',           'WordPress',             'Contrato de Hospedagem WordPress',    ''),
  ('revenda-cpanel',      'Revenda cPanel',        'Contrato de Revenda cPanel',          ''),
  ('revenda-directadmin', 'Revenda DirectAdmin',   'Contrato de Revenda DirectAdmin',     ''),
  ('database-cloud',      'Database Cloud',        'Contrato de Database Cloud',          ''),
  ('backup-pro',          'BackupPRO',             'Contrato de BackupPRO',               '')
ON CONFLICT (product_slug) DO NOTHING;


-- ── 11. SEED: Page Sections ───────────────────────────────────

INSERT INTO page_sections (page_slug, section_key, content) VALUES

-- home
('home','hero','{"title":"Infraestrutura de alta performance para o seu negócio","subtitle":"Hospedagem, Cloud VPS, Bare-Metal e muito mais. Suporte 24/7 em português, datacenter Tier III no Brasil.","cta":{"primary":{"label":"Ver planos","href":"/hospedagem"},"secondary":{"label":"Falar com especialista","href":"/contato"}}}'),

-- hospedagem
('hospedagem','hero','{"badge":"Hospedagem Web","title":"Hospedagem rápida e segura para seu site","subtitle":"DirectAdmin, SSL grátis, backups diários e suporte 24/7 em português. Datacenter Tier III no Brasil.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- hospedagem-pro
('hospedagem-pro','hero','{"badge":"Hospedagem PRO","title":"Hospedagem com cPanel para profissionais","subtitle":"cPanel completo, Softaculous, SSL grátis e recursos de alta performance. Para agências e desenvolvedores.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- wordpress
('wordpress','hero','{"badge":"WordPress","title":"Hospedagem otimizada para WordPress","subtitle":"Instalação em 1 clique, LiteSpeed, SSL grátis e atualizações automáticas. Seu WordPress voando.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- cloud-vps
('cloud-vps','hero','{"badge":"Cloud VPS","title":"Cloud VPS de alto desempenho","subtitle":"Servidores virtuais com NVMe Gen4, rede 10 Gbps e painel de controle completo. Deploy em minutos.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com especialista","href":"/contato"}}}'),

-- bare-metal
('bare-metal','hero','{"badge":"Bare-Metal","title":"Servidores dedicados para máxima performance","subtitle":"Processadores Xeon, NVMe Gen4, rede 10 Gbps e acesso root total. Para cargas de trabalho críticas.","cta":{"primary":{"label":"Solicitar servidor","href":"/contato?assunto=Bare-Metal"},"secondary":{"label":"Falar com especialista","href":"/contato"}}}'),

-- revenda-cpanel
('revenda-cpanel','hero','{"badge":"Revenda cPanel","title":"Revenda de hospedagem com cPanel","subtitle":"WHM completo, contas ilimitadas e suporte white-label. A plataforma ideal para sua agência ou provedor.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- revenda-directadmin
('revenda-directadmin','hero','{"badge":"Revenda DirectAdmin","title":"Revenda com DirectAdmin","subtitle":"Painel DirectAdmin completo, contas ilimitadas e margem de lucro garantida. Revenda com a Hosteg.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- database-cloud
('database-cloud','hero','{"badge":"Database Cloud","title":"Banco de dados gerenciado na nuvem","subtitle":"MySQL, PostgreSQL, MongoDB e SQL Server. Alta disponibilidade, backups automáticos e acesso seguro.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com especialista","href":"/contato"}}}'),

-- backup-pro
('backup-pro','hero','{"badge":"BackupPRO","title":"Backup profissional para sua empresa","subtitle":"Backup incremental, criptografado e com retenção configurável. Restauração em minutos.","cta":{"primary":{"label":"Ver planos","href":"#planos"},"secondary":{"label":"Falar com consultor","href":"/contato"}}}'),

-- sobre
('sobre','hero','{"badge":"Sobre a Hosteg","title":"Infraestrutura brasileira com padrão internacional","subtitle":"Fundada em 2018, a Hosteg oferece serviços de hospedagem e cloud com datacenter próprio Tier III em São Paulo.","cta":{"primary":{"label":"Conheça nossos planos","href":"/hospedagem"},"secondary":{"label":"Entre em contato","href":"/contato"}}}'),

-- datacenter
('datacenter','hero','{"badge":"Datacenter","title":"Datacenter Tier III em São Paulo","subtitle":"Infraestrutura certificada Tier III, 99.999% de uptime, redundância de energia e conectividade.","cta":{"primary":{"label":"Falar com especialista","href":"/contato"},"secondary":{"label":"Ver nossos planos","href":"/cloud-vps"}}}'),

-- contratos
('contratos','hero','{"badge":"Contratos","title":"Contratos de serviços Hosteg","subtitle":"Transparência em todos os nossos serviços. Leia os termos antes de contratar.","cta":{"primary":{"label":"Falar conosco","href":"/contato"}}}'),

-- contato
('contato','hero','{"badge":"Contato","title":"Fale com nossa equipe","subtitle":"Suporte 24/7 em português. Nossa equipe está pronta para ajudar você a escolher a melhor solução.","cta":{"primary":{"label":"Abrir chamado","href":"https://painelcliente.com.br"}}}')

ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Shared features: Cloud VPS
INSERT INTO page_sections (page_slug, section_key, content) VALUES
('cloud-vps','shared_features','{"items":[
  {"text":"Anti-DDoS avançado incluso","tip":"Proteção DDoS de até 1 Tbps em todos os planos"},
  {"text":"NVMe Gen4 ultrarrápido","tip":"Velocidade de leitura/escrita até 7000 MB/s"},
  {"text":"Rede 10 Gbps redundante","tip":"Uplink de 10 Gbps com redundância N+1"},
  {"text":"Snapshots e backups automáticos","tip":"Snapshots a qualquer momento + backup semanal gratuito"},
  {"text":"Painel de controle completo","tip":"Gerenciamento via painel web intuitivo"},
  {"text":"Deploy em menos de 5 minutos","tip":"Servidor ativo e pronto para uso em minutos"},
  {"text":"IPv4 + IPv6 dedicados","tip":"Cada VPS recebe endereços IPv4 e IPv6 exclusivos"},
  {"text":"Acesso root total","tip":"Controle completo sobre o servidor"},
  {"text":"SO escolha sua distro","tip":"Ubuntu, Debian, CentOS, Rocky Linux, AlmaLinux e mais"},
  {"text":"Suporte 24/7 em português","tip":"Equipe técnica disponível a qualquer hora"}
]}')
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Shared features: Bare-Metal
INSERT INTO page_sections (page_slug, section_key, content) VALUES
('bare-metal','shared_features','{"items":[
  {"text":"Anti-DDoS avançado incluso","tip":"Proteção DDoS de até 1 Tbps em todos os servidores"},
  {"text":"Hardware exclusivo dedicado","tip":"CPU, RAM e discos 100% dedicados a você"},
  {"text":"Rede 10 Gbps redundante","tip":"Uplink de 10 Gbps com redundância N+1"},
  {"text":"KVM Console dedicado","tip":"Acesso IPMI/KVM para gerenciamento out-of-band"},
  {"text":"RAID configurável","tip":"RAID 0, 1, 5 ou 10 conforme sua necessidade"},
  {"text":"Acesso root total","tip":"Controle completo sobre hardware e software"},
  {"text":"SLA 99.9% garantido","tip":"Uptime contratual com compensação em créditos"},
  {"text":"Suporte 24/7 em português","tip":"Equipe técnica especializada disponível a qualquer hora"}
]}')
ON CONFLICT (page_slug, section_key) DO NOTHING;


-- ── 12. PLANOS — Limpeza global ───────────────────────────────
-- Remove tudo antes de inserir (permite re-execução limpa)

DELETE FROM plan_features;
DELETE FROM plan_specs;
DELETE FROM plans;

-- ── 13. PLANOS: Hospedagem, PRO, WordPress, ASP.NET, Revendas, Cloud VPS ──

DO $$
DECLARE
  pid uuid;
  pl  uuid;
BEGIN

  -- ── Hospedagem Web ───────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Web Starter',19,'Para sites pessoais e portfólios simples.',false,1, 17,15,13,11)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','10 GB SSD',null,1),(pl,'Domínios','1',null,2),
    (pl,'E-mails','10',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','2 MySQL',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Painel DirectAdmin',null,1),(pl,'Instalador Softaculous',null,2),
    (pl,'Backups semanais',null,3),(pl,'Anti-DDoS incluso',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Web Business',39,'Para blogs, e-commerces e sites profissionais.',false,2, 35,31,27,23)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','30 GB SSD',null,1),(pl,'Domínios','5',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','10 MySQL',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Painel DirectAdmin',null,1),(pl,'Instalador Softaculous',null,2),
    (pl,'Backups diários',null,3),(pl,'Anti-DDoS incluso',null,4),
    (pl,'Certificado SSL Wildcard',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Web Premium',69,'Para empresas e lojas virtuais em crescimento.',true,3, 62,55,48,41)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','60 GB SSD',null,1),(pl,'Domínios','10',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','Ilimitados',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Painel DirectAdmin',null,1),(pl,'Instalador Softaculous',null,2),
    (pl,'Backups diários',null,3),(pl,'Anti-DDoS incluso',null,4),
    (pl,'IP Dedicado incluso',null,5),(pl,'Certificado SSL Wildcard',null,6),
    (pl,'Suporte 24/7 prioritário',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Web Enterprise',119,'Para grandes portais e aplicações de alto tráfego.',false,4, 107,95,83,71)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','120 GB SSD',null,1),(pl,'Domínios','Ilimitados',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','Ilimitados',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Painel DirectAdmin',null,1),(pl,'Instalador Softaculous',null,2),
    (pl,'Backups diários',null,3),(pl,'Anti-DDoS incluso',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Certificado SSL Wildcard',null,6),
    (pl,'Suporte 24/7 prioritário VIP',null,7);

  -- ── Hospedagem PRO ───────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem-pro';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PRO I',59,'Ideal para profissionais e agências iniciantes.',false,1, 53,47,41,35)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','20 GB SSD',null,1),(pl,'Domínios','5',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','10 MySQL',null,5),(pl,'cPanel','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PRO II',99,'Para agências e desenvolvedores com múltiplos projetos.',true,2, 89,79,69,59)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','50 GB SSD',null,1),(pl,'Domínios','15',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','Ilimitados',null,5),(pl,'cPanel','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PRO III',169,'Para empresas e portais de alto tráfego.',false,3, 152,135,118,101)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','100 GB SSD',null,1),(pl,'Domínios','30',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','Ilimitados',null,5),(pl,'cPanel','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PRO IV',299,'Máxima performance para grandes plataformas.',false,4, 269,239,209,179)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','200 GB SSD',null,1),(pl,'Domínios','Ilimitados',null,2),
    (pl,'E-mails','Ilimitados',null,3),(pl,'Tráfego Mensal','Ilimitado',null,4),
    (pl,'Banco de Dados','Ilimitados',null,5),(pl,'cPanel','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'CloudLinux incluso',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  -- ── WordPress ─────────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'wordpress';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'WP I',59,'WordPress otimizado para iniciantes.',false,1, 53,47,41,35)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','20 GB SSD',null,1),(pl,'Sites WordPress','1',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'Banco de Dados','5 MySQL',null,4),
    (pl,'LiteSpeed','Sim',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WordPress pré-instalado',null,1),(pl,'LiteSpeed + LSCache',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL grátis incluso',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'WP II',99,'Para blogs e lojas WooCommerce em crescimento.',true,2, 89,79,69,59)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','50 GB SSD',null,1),(pl,'Sites WordPress','3',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'Banco de Dados','Ilimitados',null,4),
    (pl,'LiteSpeed','Sim',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WordPress pré-instalado',null,1),(pl,'LiteSpeed + LSCache',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'WP III',169,'Para agências e múltiplos sites WordPress.',false,3, 152,135,118,101)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','100 GB SSD',null,1),(pl,'Sites WordPress','10',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'Banco de Dados','Ilimitados',null,4),
    (pl,'LiteSpeed','Sim',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WordPress pré-instalado',null,1),(pl,'LiteSpeed + LSCache',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Staging environment',null,6),
    (pl,'Suporte 24/7 prioritário',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'WP IV',299,'Máxima performance para grandes portais WordPress.',false,4, 269,239,209,179)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','200 GB SSD',null,1),(pl,'Sites WordPress','Ilimitados',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'Banco de Dados','Ilimitados',null,4),
    (pl,'LiteSpeed','Sim',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WordPress pré-instalado',null,1),(pl,'LiteSpeed + LSCache',null,2),
    (pl,'Backups diários',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'CloudLinux incluso',null,6),
    (pl,'Staging environment',null,7),(pl,'Suporte 24/7 VIP',null,8);

  -- ── Hospedagem ASP.NET ────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem-aspnet';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',79,'Para sites e APIs ASP.NET simples.',false,1, 71,63,55,47)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','20 GB SSD',null,1),(pl,'Domínios','1',null,2),
    (pl,'.NET','8.0 / 9.0',null,3),(pl,'Banco de Dados','2 SQL Server',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Deploy','FTP / Git',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'ASP.NET Core 8/9 LTS',null,1),(pl,'SQL Server Express',null,2),
    (pl,'Deploy via FTP e Git',null,3),(pl,'SSL grátis incluso',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',149,'Para sistemas corporativos e e-commerces.',false,2, 134,119,104,89)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','50 GB SSD',null,1),(pl,'Domínios','5',null,2),
    (pl,'.NET','8.0 / 9.0',null,3),(pl,'Banco de Dados','10 SQL Server',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Deploy','FTP / Git / CI',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'ASP.NET Core 8/9 LTS',null,1),(pl,'SQL Server Standard',null,2),
    (pl,'Deploy via FTP, Git e CI/CD',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',249,'Para aplicações de alto tráfego e missão crítica.',true,3, 224,199,174,149)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','100 GB SSD',null,1),(pl,'Domínios','20',null,2),
    (pl,'.NET','8.0 / 9.0',null,3),(pl,'Banco de Dados','Ilimitados',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Deploy','FTP / Git / CI',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'ASP.NET Core 8/9 LTS',null,1),(pl,'SQL Server Standard',null,2),
    (pl,'Deploy via FTP, Git e CI/CD',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',449,'Máxima performance para plataformas .NET críticas.',false,4, 404,359,314,269)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','200 GB SSD',null,1),(pl,'Domínios','Ilimitados',null,2),
    (pl,'.NET','8.0 / 9.0',null,3),(pl,'Banco de Dados','Ilimitados',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Deploy','FTP / Git / CI',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'ASP.NET Core 8/9 LTS',null,1),(pl,'SQL Server Enterprise',null,2),
    (pl,'Deploy via FTP, Git e CI/CD',null,3),(pl,'SSL Wildcard grátis',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'SLA 99.9% garantido',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  -- ── Revenda cPanel ────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-cpanel';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',99,'Ideal para freelancers e agências iniciantes.',false,1, 89,79,69,59)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','60 GB SSD',null,1),(pl,'Contas cPanel','20',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'WHM','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença cPanel','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WHM + cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL Wildcard por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',189,'Para agências com mais clientes e projetos.',true,2, 170,151,132,113)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','150 GB SSD',null,1),(pl,'Contas cPanel','60',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'WHM','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença cPanel','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WHM + cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL Wildcard por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',329,'Para provedores e revendedores profissionais.',false,3, 296,263,230,197)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','300 GB SSD',null,1),(pl,'Contas cPanel','150',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'WHM','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença cPanel','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WHM + cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL Wildcard por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'CloudLinux incluso',null,6),
    (pl,'Suporte 24/7 prioritário',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',549,'Para grandes provedores de hospedagem.',false,4, 494,439,384,329)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','600 GB SSD',null,1),(pl,'Contas cPanel','Ilimitadas',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'WHM','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença cPanel','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'WHM + cPanel completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL Wildcard por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'CloudLinux + Imunify360',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  -- ── Revenda DirectAdmin ───────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-directadmin';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'DA Starter',79,'Para freelancers com primeiros clientes.',false,1, 71,63,55,47)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','60 GB SSD',null,1),(pl,'Contas DA','20',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'DirectAdmin','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença DA','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'DirectAdmin completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'DA Business',159,'Para agências e provedores em crescimento.',true,2, 143,127,111,95)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','150 GB SSD',null,1),(pl,'Contas DA','60',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'DirectAdmin','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença DA','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'DirectAdmin completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'DA Pro',279,'Para provedores profissionais.',false,3, 251,223,195,167)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','300 GB SSD',null,1),(pl,'Contas DA','150',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'DirectAdmin','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença DA','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'DirectAdmin completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'DA Enterprise',479,'Máxima escala para grandes provedores.',false,4, 431,383,335,287)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','600 GB SSD',null,1),(pl,'Contas DA','Ilimitadas',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'DirectAdmin','Completo',null,4),
    (pl,'SSL Grátis','Sim',null,5),(pl,'Licença DA','Inclusa',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'DirectAdmin completo',null,1),(pl,'Softaculous Pro',null,2),
    (pl,'SSL por conta',null,3),(pl,'Backups diários',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'Imunify360',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  -- ── Revenda ASP.NET ───────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-aspnet';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',129,'Para freelancers e agências .NET.',false,1, 116,103,90,77)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','60 GB SSD',null,1),(pl,'Contas .NET','20',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'.NET','8.0/9.0',null,4),
    (pl,'SQL Server','Express',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Plesk Obsidian',null,1),(pl,'ASP.NET Core 8/9',null,2),
    (pl,'SQL Server Express',null,3),(pl,'SSL por conta',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',249,'Para agências com múltiplos clientes .NET.',true,2, 224,199,174,149)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','150 GB SSD',null,1),(pl,'Contas .NET','60',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'.NET','8.0/9.0',null,4),
    (pl,'SQL Server','Standard',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Plesk Obsidian',null,1),(pl,'ASP.NET Core 8/9',null,2),
    (pl,'SQL Server Standard',null,3),(pl,'SSL por conta',null,4),
    (pl,'IP Dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',449,'Para provedores .NET profissionais.',false,3, 404,359,314,269)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','300 GB SSD',null,1),(pl,'Contas .NET','150',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'.NET','8.0/9.0',null,4),
    (pl,'SQL Server','Standard',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Plesk Obsidian',null,1),(pl,'ASP.NET Core 8/9',null,2),
    (pl,'SQL Server Standard',null,3),(pl,'SSL por conta',null,4),
    (pl,'2 IPs Dedicados',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',749,'Máxima escala para grandes provedores .NET.',false,4, 674,599,524,449)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Espaço em Disco','600 GB SSD',null,1),(pl,'Contas .NET','Ilimitadas',null,2),
    (pl,'Tráfego Mensal','Ilimitado',null,3),(pl,'.NET','8.0/9.0',null,4),
    (pl,'SQL Server','Enterprise',null,5),(pl,'SSL Grátis','Sim',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Plesk Obsidian',null,1),(pl,'ASP.NET Core 8/9',null,2),
    (pl,'SQL Server Enterprise',null,3),(pl,'SSL por conta',null,4),
    (pl,'3 IPs Dedicados',null,5),(pl,'SLA 99.9% garantido',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  -- ── Cloud VPS ─────────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'cloud-vps';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',39,'Para projetos pequenos e aprendizado.',false,1, 35,31,27,23)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','1 core',null,1),(pl,'RAM','1 GB',null,2),
    (pl,'Disco','20 GB NVMe',null,3),(pl,'Tráfego','1 TB/mês',null,4),
    (pl,'Rede','1 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Painel de controle completo',null,2),
    (pl,'Snapshots gratuitos',null,3),(pl,'IPv4 dedicado',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Basic',69,'Para sites pessoais e projetos médios.',false,2, 62,55,48,41)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','2 cores',null,1),(pl,'RAM','2 GB',null,2),
    (pl,'Disco','40 GB NVMe',null,3),(pl,'Tráfego','2 TB/mês',null,4),
    (pl,'Rede','1 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Painel de controle completo',null,2),
    (pl,'Snapshots gratuitos',null,3),(pl,'IPv4 dedicado',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Comfort',99,'Para lojas e aplicações Node.js / PHP.',false,3, 89,79,69,59)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','2 cores',null,1),(pl,'RAM','4 GB',null,2),
    (pl,'Disco','60 GB NVMe',null,3),(pl,'Tráfego','4 TB/mês',null,4),
    (pl,'Rede','1 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Painel de controle completo',null,2),
    (pl,'Snapshots gratuitos',null,3),(pl,'IPv4 dedicado',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Standard',119,'O mais escolhido para produção.',true,4, 107,95,83,71)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','4 cores',null,1),(pl,'RAM','8 GB',null,2),
    (pl,'Disco','80 GB NVMe',null,3),(pl,'Tráfego','8 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 em português',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',169,'Para APIs, microserviços e bancos de dados.',false,5, 152,135,118,101)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','4 cores',null,1),(pl,'RAM','16 GB',null,2),
    (pl,'Disco','120 GB NVMe',null,3),(pl,'Tráfego','12 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',219,'Para plataformas SaaS e e-commerces.',false,6, 197,175,153,131)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','6 cores',null,1),(pl,'RAM','24 GB',null,2),
    (pl,'Disco','200 GB NVMe',null,3),(pl,'Tráfego','20 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro+',319,'Para grandes plataformas e ambientes Docker.',false,7, 287,255,223,191)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','8 cores',null,1),(pl,'RAM','32 GB',null,2),
    (pl,'Disco','300 GB NVMe',null,3),(pl,'Tráfego','30 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Ultra',419,'Para Kubernetes e ambientes containerizados.',false,8, 377,335,293,251)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','12 cores',null,1),(pl,'RAM','48 GB',null,2),
    (pl,'Disco','400 GB NVMe',null,3),(pl,'Tráfego','40 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 VIP',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Elite',589,'Para cargas críticas e alta disponibilidade.',false,9, 530,471,412,353)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','16 cores',null,1),(pl,'RAM','64 GB',null,2),
    (pl,'Disco','600 GB NVMe',null,3),(pl,'Tráfego','60 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'Suporte 24/7 VIP',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Titan',779,'Para as maiores plataformas e projetos enterprise.',false,10, 701,623,545,467)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','24 cores',null,1),(pl,'RAM','96 GB',null,2),
    (pl,'Disco','1 TB NVMe',null,3),(pl,'Tráfego','100 TB/mês',null,4),
    (pl,'Rede','10 Gbps',null,5),(pl,'IP','1 IPv4',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS incluso',null,1),(pl,'Rede 10 Gbps',null,2),
    (pl,'Painel de controle completo',null,3),(pl,'Snapshots gratuitos',null,4),
    (pl,'IPv4 dedicado',null,5),(pl,'SLA 99.9% garantido',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

END $$;


-- ── 14. PLANOS: Corporativo (BackupPRO, ERP, Terminal Server, Database Cloud) ──

DO $$
DECLARE
  pid uuid;
  pl  uuid;
BEGIN

  -- ── BackupPRO ─────────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'backup-pro';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',89,'Para pequenas empresas e profissionais autônomos.',false,1, 80,71,62,53)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Armazenamento','500 GB',null,1),(pl,'Retenção','30 dias',null,2),
    (pl,'Frequência','Diária',null,3),(pl,'Criptografia','AES-256',null,4),
    (pl,'Protocolos','FTP / SFTP',null,5),(pl,'Suporte','24/7',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Backup incremental automático',null,1),(pl,'Criptografia AES-256',null,2),
    (pl,'Restauração em minutos',null,3),(pl,'Painel web de gerenciamento',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',199,'Para empresas de médio porte.',true,2, 179,159,139,119)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Armazenamento','2 TB',null,1),(pl,'Retenção','90 dias',null,2),
    (pl,'Frequência','De hora em hora',null,3),(pl,'Criptografia','AES-256',null,4),
    (pl,'Protocolos','FTP / SFTP / S3',null,5),(pl,'Suporte','24/7',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Backup incremental automático',null,1),(pl,'Criptografia AES-256',null,2),
    (pl,'Restauração em minutos',null,3),(pl,'Painel web de gerenciamento',null,4),
    (pl,'Alertas por e-mail e SMS',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',399,'Para grandes empresas e dados críticos.',false,3, 359,319,279,239)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Armazenamento','5 TB',null,1),(pl,'Retenção','180 dias',null,2),
    (pl,'Frequência','A cada 15 minutos',null,3),(pl,'Criptografia','AES-256',null,4),
    (pl,'Protocolos','FTP / SFTP / S3 / NFS',null,5),(pl,'Suporte','24/7 VIP',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Backup incremental automático',null,1),(pl,'Criptografia AES-256',null,2),
    (pl,'Restauração em minutos',null,3),(pl,'Painel web de gerenciamento',null,4),
    (pl,'Deduplicação de dados',null,5),(pl,'SLA 99.9% garantido',null,6),
    (pl,'Suporte 24/7 VIP',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',799,'Para infraestruturas críticas com SLA máximo.',false,4, 719,639,559,479)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Armazenamento','20 TB',null,1),(pl,'Retenção','365 dias',null,2),
    (pl,'Frequência','Tempo real',null,3),(pl,'Criptografia','AES-256',null,4),
    (pl,'Protocolos','Todos os protocolos',null,5),(pl,'Suporte','24/7 VIP dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Backup incremental automático',null,1),(pl,'Criptografia AES-256',null,2),
    (pl,'Restauração em minutos',null,3),(pl,'Painel web de gerenciamento',null,4),
    (pl,'Deduplicação e compressão',null,5),(pl,'Backup geo-redundante',null,6),
    (pl,'SLA 99.99% garantido',null,7),(pl,'Suporte 24/7 VIP dedicado',null,8);

  -- ── Hosteg ERP ────────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'hosteg-erp';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Starter',149,'Para pequenas empresas e autônomos.',false,1, 134,119,104,89)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Usuários','5',null,1),(pl,'Módulos','Básicos',null,2),
    (pl,'Armazenamento','10 GB',null,3),(pl,'Suporte','24/7',null,4),
    (pl,'Backup','Diário',null,5),(pl,'SSL','Incluso',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Financeiro e contabilidade',null,1),(pl,'Emissão de NF-e',null,2),
    (pl,'CRM básico',null,3),(pl,'Suporte 24/7 em português',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',299,'Para empresas em crescimento.',true,2, 269,239,209,179)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Usuários','20',null,1),(pl,'Módulos','Completos',null,2),
    (pl,'Armazenamento','50 GB',null,3),(pl,'Suporte','24/7',null,4),
    (pl,'Backup','Diário',null,5),(pl,'SSL','Incluso',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Financeiro e contabilidade',null,1),(pl,'Emissão de NF-e / NFS-e',null,2),
    (pl,'CRM completo',null,3),(pl,'Gestão de estoque',null,4),
    (pl,'RH e ponto eletrônico',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Pro',549,'Para médias empresas com múltiplas filiais.',false,3, 494,439,384,329)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Usuários','60',null,1),(pl,'Módulos','Todos',null,2),
    (pl,'Armazenamento','200 GB',null,3),(pl,'Suporte','24/7 VIP',null,4),
    (pl,'Backup','Diário',null,5),(pl,'SSL','Incluso',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Módulos completos + multi-filial',null,1),(pl,'E-commerce integrado',null,2),
    (pl,'API para integração',null,3),(pl,'Relatórios avançados',null,4),
    (pl,'Suporte 24/7 VIP',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',999,'Para grandes empresas e grupos empresariais.',false,4, 899,799,699,599)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Usuários','Ilimitados',null,1),(pl,'Módulos','Todos + customizações',null,2),
    (pl,'Armazenamento','1 TB',null,3),(pl,'Suporte','24/7 VIP dedicado',null,4),
    (pl,'Backup','Tempo real',null,5),(pl,'SSL','Incluso',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Todos os módulos + white-label',null,1),(pl,'Customizações sob demanda',null,2),
    (pl,'SLA 99.9% garantido',null,3),(pl,'Gerente de conta dedicado',null,4),
    (pl,'Suporte 24/7 VIP dedicado',null,5);

  -- ── Terminal Server ────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'terminal-server';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Individual',189,'Para profissionais autônomos.',false,1, 170,151,132,113)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','2 cores',null,1),(pl,'RAM','4 GB',null,2),
    (pl,'Disco','50 GB SSD',null,3),(pl,'Usuários RDP','2',null,4),
    (pl,'Windows Server','2022',null,5),(pl,'Suporte','24/7',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Windows Server 2022',null,1),(pl,'Remote Desktop (RDP)',null,2),
    (pl,'Anti-DDoS incluso',null,3),(pl,'Backup semanal',null,4),
    (pl,'Suporte 24/7 em português',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Team',349,'Para equipes de até 15 pessoas.',true,2, 314,279,244,209)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','4 cores',null,1),(pl,'RAM','8 GB',null,2),
    (pl,'Disco','100 GB SSD',null,3),(pl,'Usuários RDP','15',null,4),
    (pl,'Windows Server','2022',null,5),(pl,'Suporte','24/7',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Windows Server 2022',null,1),(pl,'Remote Desktop (RDP)',null,2),
    (pl,'Anti-DDoS incluso',null,3),(pl,'Backup diário',null,4),
    (pl,'Gerenciamento de usuários AD',null,5),(pl,'Suporte 24/7 prioritário',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Business',649,'Para empresas com até 50 usuários.',false,3, 584,519,454,389)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','8 cores',null,1),(pl,'RAM','16 GB',null,2),
    (pl,'Disco','300 GB SSD',null,3),(pl,'Usuários RDP','50',null,4),
    (pl,'Windows Server','2022',null,5),(pl,'Suporte','24/7 VIP',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Windows Server 2022',null,1),(pl,'Remote Desktop (RDP)',null,2),
    (pl,'Anti-DDoS incluso',null,3),(pl,'Backup diário',null,4),
    (pl,'Active Directory incluso',null,5),(pl,'Suporte 24/7 VIP',null,6);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'Enterprise',1199,'Para grandes empresas com múltiplas equipes.',false,4, 1079,959,839,719)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'vCPU','16 cores',null,1),(pl,'RAM','32 GB',null,2),
    (pl,'Disco','600 GB SSD',null,3),(pl,'Usuários RDP','Ilimitados',null,4),
    (pl,'Windows Server','2022 Datacenter',null,5),(pl,'Suporte','24/7 VIP dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Windows Server 2022 Datacenter',null,1),(pl,'Remote Desktop (RDP)',null,2),
    (pl,'Anti-DDoS incluso',null,3),(pl,'Backup em tempo real',null,4),
    (pl,'Active Directory Enterprise',null,5),(pl,'SLA 99.9% garantido',null,6),
    (pl,'Suporte 24/7 VIP dedicado',null,7);

  -- ── Database Cloud ────────────────────────────────────────────
  SELECT id INTO pid FROM product_pages WHERE slug = 'database-cloud';

  -- MySQL
  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MySQL Starter',49,'MySQL gerenciado para projetos pequenos.',false,1, 44,39,34,29)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MySQL 8.x',null,1),(pl,'vCPU','1 core',null,2),
    (pl,'RAM','1 GB',null,3),(pl,'Armazenamento','20 GB SSD',null,4),
    (pl,'Conexões','50',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MySQL 8.x gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'phpMyAdmin incluso',null,3),(pl,'Suporte 24/7 em português',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MySQL Business',99,'MySQL para aplicações de produção.',false,2, 89,79,69,59)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MySQL 8.x',null,1),(pl,'vCPU','2 cores',null,2),
    (pl,'RAM','4 GB',null,3),(pl,'Armazenamento','60 GB SSD',null,4),
    (pl,'Conexões','200',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MySQL 8.x gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'Replicação read replica',null,3),(pl,'phpMyAdmin incluso',null,4),
    (pl,'Suporte 24/7 prioritário',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MySQL Pro',189,'MySQL para sistemas de alto tráfego.',false,3, 170,151,132,113)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MySQL 8.x',null,1),(pl,'vCPU','4 cores',null,2),
    (pl,'RAM','8 GB',null,3),(pl,'Armazenamento','150 GB SSD',null,4),
    (pl,'Conexões','500',null,5),(pl,'Backup','A cada 6h',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MySQL 8.x gerenciado',null,1),(pl,'Backups a cada 6 horas',null,2),
    (pl,'Replicação multi-AZ',null,3),(pl,'phpMyAdmin incluso',null,4),
    (pl,'Suporte 24/7 VIP',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MySQL Enterprise',349,'MySQL para grandes plataformas.',false,4, 314,279,244,209)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MySQL 8.x',null,1),(pl,'vCPU','8 cores',null,2),
    (pl,'RAM','16 GB',null,3),(pl,'Armazenamento','500 GB SSD',null,4),
    (pl,'Conexões','Ilimitadas',null,5),(pl,'Backup','Contínuo',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MySQL 8.x gerenciado',null,1),(pl,'Backup contínuo (PITR)',null,2),
    (pl,'Cluster multi-AZ',null,3),(pl,'SLA 99.9% garantido',null,4),
    (pl,'Suporte 24/7 VIP dedicado',null,5);

  -- PostgreSQL
  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PostgreSQL Starter',59,'PostgreSQL gerenciado para projetos pequenos.',false,5, 53,47,41,35)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','PostgreSQL 16',null,1),(pl,'vCPU','1 core',null,2),
    (pl,'RAM','2 GB',null,3),(pl,'Armazenamento','20 GB SSD',null,4),
    (pl,'Conexões','50',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'PostgreSQL 16 gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'pgAdmin incluso',null,3),(pl,'Suporte 24/7 em português',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PostgreSQL Business',119,'PostgreSQL para aplicações de produção.',true,6, 107,95,83,71)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','PostgreSQL 16',null,1),(pl,'vCPU','2 cores',null,2),
    (pl,'RAM','4 GB',null,3),(pl,'Armazenamento','60 GB SSD',null,4),
    (pl,'Conexões','200',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'PostgreSQL 16 gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'Extensões: PostGIS, pgvector',null,3),(pl,'pgAdmin incluso',null,4),
    (pl,'Suporte 24/7 prioritário',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PostgreSQL Pro',219,'PostgreSQL para sistemas de alto tráfego.',false,7, 197,175,153,131)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','PostgreSQL 16',null,1),(pl,'vCPU','4 cores',null,2),
    (pl,'RAM','8 GB',null,3),(pl,'Armazenamento','150 GB SSD',null,4),
    (pl,'Conexões','500',null,5),(pl,'Backup','A cada 6h',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'PostgreSQL 16 gerenciado',null,1),(pl,'Backups a cada 6 horas',null,2),
    (pl,'Extensões avançadas',null,3),(pl,'Read replicas',null,4),
    (pl,'Suporte 24/7 VIP',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'PostgreSQL Enterprise',399,'PostgreSQL para grandes plataformas.',false,8, 359,319,279,239)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','PostgreSQL 16',null,1),(pl,'vCPU','8 cores',null,2),
    (pl,'RAM','16 GB',null,3),(pl,'Armazenamento','500 GB SSD',null,4),
    (pl,'Conexões','Ilimitadas',null,5),(pl,'Backup','Contínuo',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'PostgreSQL 16 gerenciado',null,1),(pl,'Backup contínuo (PITR)',null,2),
    (pl,'HA cluster multi-AZ',null,3),(pl,'SLA 99.9% garantido',null,4),
    (pl,'Suporte 24/7 VIP dedicado',null,5);

  -- MongoDB
  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MongoDB Starter',59,'MongoDB gerenciado para projetos pequenos.',false,9, 53,47,41,35)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MongoDB 7.x',null,1),(pl,'vCPU','1 core',null,2),
    (pl,'RAM','2 GB',null,3),(pl,'Armazenamento','20 GB SSD',null,4),
    (pl,'Conexões','50',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MongoDB 7.x gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'Mongo Express incluso',null,3),(pl,'Suporte 24/7 em português',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MongoDB Business',119,'MongoDB para aplicações de produção.',false,10, 107,95,83,71)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MongoDB 7.x',null,1),(pl,'vCPU','2 cores',null,2),
    (pl,'RAM','4 GB',null,3),(pl,'Armazenamento','60 GB SSD',null,4),
    (pl,'Conexões','200',null,5),(pl,'Backup','Diário',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MongoDB 7.x gerenciado',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'Replica set incluso',null,3),(pl,'Mongo Express incluso',null,4),
    (pl,'Suporte 24/7 prioritário',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MongoDB Pro',219,'MongoDB para sistemas de alto tráfego.',false,11, 197,175,153,131)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MongoDB 7.x',null,1),(pl,'vCPU','4 cores',null,2),
    (pl,'RAM','8 GB',null,3),(pl,'Armazenamento','150 GB SSD',null,4),
    (pl,'Conexões','500',null,5),(pl,'Backup','A cada 6h',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MongoDB 7.x gerenciado',null,1),(pl,'Backups a cada 6 horas',null,2),
    (pl,'Sharding configurável',null,3),(pl,'Suporte 24/7 VIP',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'MongoDB Enterprise',399,'MongoDB para grandes plataformas.',false,12, 359,319,279,239)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','MongoDB 7.x',null,1),(pl,'vCPU','8 cores',null,2),
    (pl,'RAM','16 GB',null,3),(pl,'Armazenamento','500 GB SSD',null,4),
    (pl,'Conexões','Ilimitadas',null,5),(pl,'Backup','Contínuo',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'MongoDB 7.x gerenciado',null,1),(pl,'Backup contínuo (PITR)',null,2),
    (pl,'Sharding + replica set multi-AZ',null,3),(pl,'SLA 99.9% garantido',null,4),
    (pl,'Suporte 24/7 VIP dedicado',null,5);

  -- SQL Server
  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'SQL Server Starter',149,'SQL Server para projetos corporativos iniciais.',false,13, 134,119,104,89)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','SQL Server 2022',null,1),(pl,'vCPU','2 cores',null,2),
    (pl,'RAM','4 GB',null,3),(pl,'Armazenamento','30 GB SSD',null,4),
    (pl,'Conexões','50',null,5),(pl,'Edição','Express',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'SQL Server 2022 Express',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'SSMS via RDP',null,3),(pl,'Suporte 24/7 em português',null,4);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'SQL Server Business',279,'SQL Server Standard para sistemas corporativos.',false,14, 251,223,195,167)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','SQL Server 2022',null,1),(pl,'vCPU','4 cores',null,2),
    (pl,'RAM','8 GB',null,3),(pl,'Armazenamento','100 GB SSD',null,4),
    (pl,'Conexões','200',null,5),(pl,'Edição','Standard',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'SQL Server 2022 Standard',null,1),(pl,'Backups automáticos diários',null,2),
    (pl,'Always On Availability',null,3),(pl,'SSMS via RDP',null,4),
    (pl,'Suporte 24/7 prioritário',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'SQL Server Pro',499,'SQL Server para sistemas de missão crítica.',false,15, 449,399,349,299)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','SQL Server 2022',null,1),(pl,'vCPU','8 cores',null,2),
    (pl,'RAM','16 GB',null,3),(pl,'Armazenamento','300 GB SSD',null,4),
    (pl,'Conexões','500',null,5),(pl,'Edição','Standard',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'SQL Server 2022 Standard',null,1),(pl,'Backups a cada 6 horas',null,2),
    (pl,'Always On + failover automático',null,3),(pl,'SLA 99.9% garantido',null,4),
    (pl,'Suporte 24/7 VIP',null,5);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_trimestral,price_semestral,price_anual,price_bianual)
  VALUES (pid,'SQL Server Enterprise',899,'SQL Server Enterprise para grandes plataformas.',false,16, 809,719,629,539)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'Banco','SQL Server 2022',null,1),(pl,'vCPU','16 cores',null,2),
    (pl,'RAM','32 GB',null,3),(pl,'Armazenamento','1 TB SSD',null,4),
    (pl,'Conexões','Ilimitadas',null,5),(pl,'Edição','Enterprise',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'SQL Server 2022 Enterprise',null,1),(pl,'Backup contínuo (PITR)',null,2),
    (pl,'Always On multi-AZ',null,3),(pl,'SLA 99.99% garantido',null,4),
    (pl,'Suporte 24/7 VIP dedicado',null,5);

END $$;


-- ── 15. PLANOS: Bare-Metal ────────────────────────────────────

DO $$
DECLARE
  pid uuid;
  pl  uuid;
BEGIN
  SELECT id INTO pid FROM product_pages WHERE slug = 'bare-metal';

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon E5 Basic',799,'Servidor dedicado Xeon E5 para workloads de entrada.',false,1,
    699,649,599, 500,250,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','Xeon E5-2620 v4',null,1),(pl,'Cores','8 cores / 16 threads',null,2),
    (pl,'RAM','32 GB ECC DDR4',null,3),(pl,'Storage','1× 480 GB SSD SATA',null,4),
    (pl,'Rede','1 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon E5 Pro',1199,'Servidor dedicado Xeon E5 para produção.',true,2,
    1049,979,899, 500,250,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','Xeon E5-2650 v4',null,1),(pl,'Cores','12 cores / 24 threads',null,2),
    (pl,'RAM','64 GB ECC DDR4',null,3),(pl,'Storage','2× 480 GB SSD SATA RAID1',null,4),
    (pl,'Rede','1 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon E5 Ultra',1899,'Servidor dedicado Xeon E5 de alto desempenho.',false,3,
    1649,1549,1399, 500,250,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','2× Xeon E5-2650 v4',null,1),(pl,'Cores','24 cores / 48 threads',null,2),
    (pl,'RAM','128 GB ECC DDR4',null,3),(pl,'Storage','2× 960 GB SSD NVMe RAID1',null,4),
    (pl,'Rede','10 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon Gold Basic',1799,'Servidor dedicado Xeon Gold para cargas pesadas.',false,4,
    1549,1449,1299, 800,400,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','Xeon Gold 6226R',null,1),(pl,'Cores','16 cores / 32 threads',null,2),
    (pl,'RAM','128 GB ECC DDR4',null,3),(pl,'Storage','2× 960 GB NVMe Gen4 RAID1',null,4),
    (pl,'Rede','10 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon Gold Pro',2399,'Servidor dedicado Xeon Gold de última geração.',false,5,
    2099,1949,1749, 800,400,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','Xeon Gold 6330',null,1),(pl,'Cores','28 cores / 56 threads',null,2),
    (pl,'RAM','256 GB ECC DDR4',null,3),(pl,'Storage','2× 1.9 TB NVMe Gen4 RAID1',null,4),
    (pl,'Rede','10 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

  INSERT INTO plans (product_page_id,name,monthly_price,description,popular,position,
    price_anual,price_bianual,price_36months,
    setup_mensal,setup_anual,setup_bianual,setup_36months)
  VALUES (pid,'Xeon Gold Elite',3299,'Servidor dedicado Xeon Gold para infraestruturas críticas.',false,6,
    2899,2699,2399, 800,400,0,0)
  RETURNING id INTO pl;
  INSERT INTO plan_specs (plan_id,label,value,tip,position) VALUES
    (pl,'CPU','2× Xeon Gold 6330',null,1),(pl,'Cores','56 cores / 112 threads',null,2),
    (pl,'RAM','512 GB ECC DDR4',null,3),(pl,'Storage','4× 1.9 TB NVMe Gen4 RAID10',null,4),
    (pl,'Rede','10 Gbps dedicado',null,5),(pl,'IP','1 IPv4 dedicado',null,6);
  INSERT INTO plan_features (plan_id,text,tip,position) VALUES
    (pl,'Anti-DDoS avançado incluso',null,1),(pl,'RAID configurável',null,2),
    (pl,'KVM Console dedicado',null,3),(pl,'Acesso root total',null,4),
    (pl,'SLA 99.9% garantido',null,5),(pl,'Suporte 24/7 em português',null,6),
    (pl,'Monitoramento incluso',null,7);

END $$;

-- ── 16. SEED: Product Addons (Cloud VPS + Bare-Metal) ─────────

INSERT INTO product_addons
  (product_slug,category,addon_key,label,description,price,price_type,max_qty,unit,sort_order)
VALUES
  ('cloud-vps','ip',       'ip_adicional',    'IP Adicional IPv4',       'Endereço IPv4 dedicado extra',                   25.00,'monthly',200,'IP',  10),
  ('cloud-vps','ipv6',     'ipv6_64',         'Bloco IPv6 /64',          'Bloco IPv6 /64 com prefixo dedicado',             5.00,'monthly',  1,'bloco',20),
  ('cloud-vps','bandwidth','bw_1g',           'Upgrade para 1 Gbps',     'Uplink dedicado de 1 Gbps',                      50.00,'monthly',  1,'Gbps', 30),
  ('cloud-vps','bandwidth','bw_10g',          'Upgrade para 10 Gbps',    'Uplink dedicado de 10 Gbps',                    200.00,'monthly',  1,'Gbps', 31),
  ('cloud-vps','disk',     'disk_ssd_50gb',   'SSD SATA 50GB',           'Disco SSD adicional de 50GB',                    25.00,'monthly',  4,'GB',   40),
  ('cloud-vps','disk',     'disk_ssd_100gb',  'SSD SATA 100GB',          'Disco SSD adicional de 100GB',                   45.00,'monthly',  4,'GB',   41),
  ('cloud-vps','disk',     'disk_nvme_50gb',  'NVMe Gen4 50GB',          'Disco NVMe de alta performance 50GB',             35.00,'monthly',  4,'GB',   42),
  ('cloud-vps','disk',     'disk_nvme_100gb', 'NVMe Gen4 100GB',         'Disco NVMe de alta performance 100GB',            65.00,'monthly',  4,'GB',   43),
  ('cloud-vps','license',  'lic_cpanel',      'Licença cPanel',          'cPanel & WHM para gerenciamento de hospedagem',  120.00,'monthly',  1,'lic',  50),
  ('cloud-vps','license',  'lic_litespeed',   'LiteSpeed Web Server',    'Servidor web de alta performance com LSCache',    80.00,'monthly',  1,'lic',  51),
  ('cloud-vps','license',  'lic_cloudlinux',  'CloudLinux OS',           'OS para isolamento e estabilidade de contas',     70.00,'monthly',  1,'lic',  52),
  ('cloud-vps','license',  'lic_directadmin', 'Licença DirectAdmin',     'Painel de controle DirectAdmin',                 25.00,'monthly',  1,'lic',  53),
  ('cloud-vps','license',  'lic_plesk',       'Licença Plesk',           'Painel Plesk Obsidian',                          90.00,'monthly',  1,'lic',  54),
  ('cloud-vps','license',  'lic_imunify',     'Imunify360',              'Antivírus e firewall avançado',                  40.00,'monthly',  1,'lic',  55),
  ('cloud-vps','app',      'app_wordpress',   'WordPress',               'CMS para sites, lojas e blogs',                   0.00,'monthly',  1,'',     60),
  ('cloud-vps','app',      'app_n8n',         'N8N',                     'Automação de fluxos de trabalho',                 0.00,'monthly',  1,'',     61),
  ('cloud-vps','app',      'app_typebot',     'Typebot',                 'Criador visual de chatbots',                      0.00,'monthly',  1,'',     62),
  ('cloud-vps','app',      'app_evolution',   'Evolution API',           'API WhatsApp multi-dispositivo',                  0.00,'monthly',  1,'',     63),
  ('cloud-vps','app',      'app_chatwoot',    'Chatwoot',                'Suporte omnichannel unificado',                   0.00,'monthly',  1,'',     64),
  ('cloud-vps','app',      'app_minio',       'MinIO',                   'Object Storage compatível com S3',                0.00,'monthly',  1,'',     65),
  ('cloud-vps','app',      'app_supabase',    'Supabase',                'Backend as a Service open-source',                0.00,'monthly',  1,'',     66),
  ('cloud-vps','app',      'app_odoo',        'Odoo',                    'ERP open-source completo',                        0.00,'monthly',  1,'',     67),
  ('cloud-vps','app',      'app_grafana',     'Grafana',                 'Monitoramento e dashboards',                      0.00,'monthly',  1,'',     68),

  ('bare-metal','meta',     'max_disk_slots', 'Slots de disco',          'Número máximo de discos adicionais permitidos',    0.00,'monthly',  4,'slots', 1),
  ('bare-metal','ip',       'ip_adicional',   'IP Adicional IPv4',       'Endereço IPv4 dedicado extra',                   25.00,'monthly',200,'IP',   10),
  ('bare-metal','ipv6',     'ipv6_64',        'Bloco IPv6 /64',          'Bloco IPv6 /64 com prefixo dedicado',             5.00,'monthly',  1,'bloco',11),
  ('bare-metal','bandwidth','bw_10g',         'Upgrade para 10 Gbps',    'Upgrade do uplink dedicado para 10 Gbps',        500.00,'monthly',  1,'Gbps', 20),
  ('bare-metal','disk',     'nvme_1tb',       'NVMe Gen4 1TB',           'SSD NVMe de alta performance — 1TB',             120.00,'monthly',  4,'TB',   30),
  ('bare-metal','disk',     'nvme_2tb',       'NVMe Gen4 2TB',           'SSD NVMe de alta performance — 2TB',             220.00,'monthly',  4,'TB',   31),
  ('bare-metal','disk',     'nvme_4tb',       'NVMe Gen4 4TB',           'SSD NVMe de alta performance — 4TB',             400.00,'monthly',  4,'TB',   32),
  ('bare-metal','disk',     'ssd_240gb',      'SSD SATA 240GB',          'SSD SATA — 240GB',                               40.00,'monthly',  4,'GB',   40),
  ('bare-metal','disk',     'ssd_480gb',      'SSD SATA 480GB',          'SSD SATA — 480GB',                               70.00,'monthly',  4,'GB',   41),
  ('bare-metal','disk',     'ssd_1tb',        'SSD SATA 1TB',            'SSD SATA — 1TB',                                120.00,'monthly',  4,'GB',   42),
  ('bare-metal','disk',     'ssd_2tb',        'SSD SATA 2TB',            'SSD SATA — 2TB',                                200.00,'monthly',  4,'GB',   43),
  ('bare-metal','disk',     'sata_4tb',       'HDD SATA 4TB',            'Disco rígido SATA — 4TB',                        80.00,'monthly',  4,'TB',   50),
  ('bare-metal','disk',     'sata_6tb',       'HDD SATA 6TB',            'Disco rígido SATA — 6TB',                       110.00,'monthly',  4,'TB',   51),
  ('bare-metal','disk',     'sata_8tb',       'HDD SATA 8TB',            'Disco rígido SATA — 8TB',                       140.00,'monthly',  4,'TB',   52),
  ('bare-metal','disk',     'sata_10tb',      'HDD SATA 10TB',           'Disco rígido SATA — 10TB',                      160.00,'monthly',  4,'TB',   53),
  ('bare-metal','disk',     'sata_14tb',      'HDD SATA 14TB',           'Disco rígido SATA — 14TB',                      200.00,'monthly',  4,'TB',   54)
ON CONFLICT DO NOTHING;

-- ── FIM ───────────────────────────────────────────────────────
-- Execute no SQL Editor do Supabase em um único bloco.
-- Seguro para re-execução (idempotente via CREATE IF NOT EXISTS,
-- ON CONFLICT DO NOTHING, e DELETE antes dos planos).

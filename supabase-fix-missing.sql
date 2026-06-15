-- ============================================================
-- HOSTEG — Correção: tabelas e dados faltando
-- Cole no SQL Editor do Supabase e execute
-- Seguro rodar mais de uma vez (usa IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- ── 1. Corrigir trigger duplicado no schema ──────────────────
DROP TRIGGER IF EXISTS doc_articles_updated_at ON doc_articles;

CREATE TRIGGER doc_articles_updated_at
  BEFORE UPDATE ON doc_articles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ── 2. Adicionar colunas faltando em product_pages ───────────
ALTER TABLE product_pages
  ADD COLUMN IF NOT EXISTS available_periods text[]
  DEFAULT ARRAY['mensal','trimestral','semestral','anual','bianual'];

ALTER TABLE product_pages
  ADD COLUMN IF NOT EXISTS cta_href  text NOT NULL DEFAULT 'https://painelcliente.com.br';

ALTER TABLE product_pages
  ADD COLUMN IF NOT EXISTS cta_label text NOT NULL DEFAULT 'Contratar agora';

-- ── 3. Product pages faltando ────────────────────────────────
INSERT INTO product_pages (name, slug) VALUES
  ('Cloud APPs',         'cloud-apps'),
  ('Database Cloud',     'database-cloud'),
  ('BackupPRO',          'backup-pro'),
  ('Hosteg ERP',         'hosteg-erp'),
  ('Terminal Server',    'terminal-server')
ON CONFLICT (slug) DO NOTHING;

-- ── 4. Tabela cloud_apps ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS cloud_apps (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  category            text NOT NULL DEFAULT '',
  tagline             text NOT NULL DEFAULT '',
  description         text NOT NULL DEFAULT '',
  logo                text,
  logo_color          text NOT NULL DEFAULT '#0EA5E9',
  logo_bg             text NOT NULL DEFAULT '#EFF9FF',
  tags                text[] DEFAULT '{}',
  highlight           boolean NOT NULL DEFAULT false,
  modal_about         text DEFAULT '',
  modal_features      text[] DEFAULT '{}',
  modal_use_cases     text[] DEFAULT '{}',
  modal_requirements  text DEFAULT '',
  position            integer NOT NULL DEFAULT 0,
  created_at          timestamptz DEFAULT now()
);

ALTER TABLE cloud_apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read cloud_apps"  ON cloud_apps;
DROP POLICY IF EXISTS "auth write cloud_apps"   ON cloud_apps;

CREATE POLICY "public read cloud_apps"  ON cloud_apps FOR SELECT USING (true);
CREATE POLICY "auth write cloud_apps"   ON cloud_apps FOR ALL    USING (auth.role() = 'authenticated');

-- ── 5. Tabela contracts ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL UNIQUE,
  product_name text NOT NULL,
  title        text NOT NULL DEFAULT 'Contrato de Prestação de Serviços',
  content      text NOT NULL DEFAULT '',
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read contracts" ON contracts;
DROP POLICY IF EXISTS "auth write contracts"  ON contracts;

CREATE POLICY "public read contracts" ON contracts FOR SELECT USING (true);
CREATE POLICY "auth write contracts"  ON contracts FOR ALL    USING (auth.role() = 'authenticated');

-- ── 6. Seed Cloud APPs ───────────────────────────────────────
INSERT INTO cloud_apps (name,category,tagline,description,logo,logo_color,logo_bg,tags,highlight,modal_about,modal_features,modal_use_cases,modal_requirements,position) VALUES
('N8N','Automação & Fluxos','Automação de fluxos sem código','Automação de fluxos de trabalho e integrações entre sistemas sem código.',
 'https://cdn.simpleicons.org/n8n','#EA4B71','#FFF0F5',
 ARRAY['Automação','No-code','Workflows'],true,
 'N8N é uma plataforma de automação de fluxos de trabalho open-source que permite conectar centenas de serviços e APIs sem precisar escrever código.',
 ARRAY['Interface visual drag-and-drop','+400 integrações nativas (Slack, Google, GitHub, etc.)','Execução agendada (cron jobs)','Webhooks e triggers em tempo real','Execução de código Node.js dentro dos fluxos','Self-hosted — seus dados ficam no seu servidor'],
 ARRAY['Automatizar envio de e-mails e WhatsApp','Sincronizar dados entre sistemas','Processar formulários e notificações','Pipelines de dados e ETL'],
 'VPS com mínimo 2GB RAM. Recomendado 4GB+ para workflows intensivos.',0),

('Evolution API','WhatsApp & Comunicação','API WhatsApp multi-dispositivo','API de WhatsApp multi-dispositivo. Conecte seus sistemas ao WhatsApp com facilidade.',
 'https://cdn.simpleicons.org/whatsapp/25D366','#25D366','#F0FFF4',
 ARRAY['WhatsApp','API','Multi-device'],true,
 'Evolution API é uma solução open-source para integração com WhatsApp usando o protocolo multi-dispositivo.',
 ARRAY['Multi-instâncias (várias contas simultâneas)','Envio de texto, imagem, vídeo, áudio, documentos','Webhooks para recebimento de mensagens','Integração com N8N e Typebot'],
 ARRAY['Chatbot de atendimento automatizado','Notificações e alertas via WhatsApp','CRM integrado ao WhatsApp'],
 'VPS com mínimo 2GB RAM. 4GB+ recomendado para múltiplas instâncias.',1),

('Typebot','WhatsApp & Comunicação','Construtor visual de chatbots','Construtor visual de chatbots para WhatsApp, sites e Telegram. Sem código.',
 'https://cdn.simpleicons.org/typebot/7C3AED','#7C3AED','#F5F3FF',
 ARRAY['Chatbot','WhatsApp','Visual'],false,
 'Typebot é um construtor de chatbots open-source com interface visual. Crie fluxos conversacionais para WhatsApp, websites e Telegram.',
 ARRAY['Interface drag-and-drop intuitiva','Integrações com WhatsApp, Telegram, Web','Coleta de leads e informações','Lógica condicional e ramificações'],
 ARRAY['Qualificação automática de leads','FAQ automatizado','Onboarding de clientes'],
 'VPS com mínimo 1GB RAM.',2),

('Chatwoot','WhatsApp & Comunicação','Central de atendimento omnichannel','Central de atendimento omnichannel. WhatsApp, e-mail, Instagram e muito mais em um só lugar.',
 'https://cdn.simpleicons.org/chatwoot/1F93FF','#1F93FF','#EFF6FF',
 ARRAY['Atendimento','Omnichannel','Suporte'],false,
 'Chatwoot é uma plataforma open-source de atendimento ao cliente que unifica todas as suas conversas em um único lugar.',
 ARRAY['Múltiplos canais: WhatsApp, Instagram, Email, Telegram','Caixa de entrada compartilhada para toda a equipe','Respostas prontas e automações','Relatórios de performance e SLA'],
 ARRAY['Suporte ao cliente multicanal','Atendimento em equipe','Gestão de reclamações'],
 'VPS com mínimo 2GB RAM. 4GB+ recomendado.',3),

('Odoo','CRM & Negócios','ERP open-source completo','ERP open-source completo: vendas, estoque, contabilidade, RH e muito mais.',
 'https://cdn.simpleicons.org/odoo/714B67','#714B67','#FAF0F8',
 ARRAY['ERP','CRM','Open-source'],true,
 'Odoo é o ERP open-source mais popular do mundo. Com mais de 30 módulos integrados, oferece tudo que uma empresa precisa.',
 ARRAY['CRM e pipeline de vendas','Gestão de estoque e logística','Contabilidade e faturamento','RH e folha de pagamento','E-commerce integrado'],
 ARRAY['Gestão empresarial completa','Substituição de múltiplos sistemas','E-commerce com gestão integrada'],
 'VPS com mínimo 4GB RAM. 8GB+ recomendado para uso intensivo.',4),

('Easypanel','DevOps & Infraestrutura','Gerenciador de servidores e apps','Painel de gerenciamento de servidores e apps com interface visual. Deploy via Docker.',
 'https://cdn.simpleicons.org/easypanel/5046E5','#5046E5','#EEF2FF',
 ARRAY['DevOps','Deploy','Docker'],true,
 'Easypanel é uma plataforma de gerenciamento de servidores que torna o deploy de aplicações extremamente simples.',
 ARRAY['Deploy com um clique via Docker ou GitHub','Gerenciamento de domínios e SSL automático','Logs em tempo real','Monitoramento de CPU, RAM e disco'],
 ARRAY['Deploy de aplicações web','Substituição do Heroku/Vercel self-hosted','Gerenciamento de múltiplos projetos'],
 'VPS com mínimo 1GB RAM.',5),

('Supabase','Backend & Banco de Dados','Backend as a Service open-source','Backend as a Service open-source. PostgreSQL + Auth + Storage + Realtime em minutos.',
 'https://cdn.simpleicons.org/supabase/3ECF8E','#3ECF8E','#EFFDF5',
 ARRAY['Backend','PostgreSQL','BaaS'],true,
 'Supabase é uma alternativa open-source ao Firebase. Oferece banco de dados PostgreSQL, autenticação, storage e realtime prontos para uso.',
 ARRAY['Banco de dados PostgreSQL completo','Autenticação e autorização (OAuth, JWT)','Storage de arquivos com CDN','Realtime via WebSockets','Edge Functions (serverless)'],
 ARRAY['Backend de aplicativos mobile','APIs para frontends React/Vue','Apps com autenticação social'],
 'VPS com mínimo 4GB RAM. 8GB+ recomendado.',6),

('MongoDB','Backend & Banco de Dados','Banco NoSQL pré-configurado','Banco de dados NoSQL pré-configurado com MongoDB Compass e MongoExpress.',
 'https://cdn.simpleicons.org/mongodb/47A248','#47A248','#F0FFF4',
 ARRAY['NoSQL','Banco de Dados','MongoDB'],false,
 'VPS com MongoDB pré-instalado e configurado, incluindo MongoDB Compass e Mongo Express.',
 ARRAY['MongoDB 7.x instalado e configurado','Mongo Express (interface web)','Usuário admin criado com senha segura','Backups automáticos configurados'],
 ARRAY['Banco de dados para APIs REST','Dados de aplicações mobile','Logs e dados de eventos'],
 'VPS com mínimo 2GB RAM. 4GB+ para datasets maiores.',7),

('Mautic','Automação & Fluxos','Automação de marketing open-source','Plataforma de automação de marketing open-source. E-mail marketing, landing pages e CRM.',
 'https://cdn.simpleicons.org/mautic/4E5E9E','#4E5E9E','#EEF2FF',
 ARRAY['Marketing','E-mail','CRM'],false,
 'Mautic é a plataforma de marketing automation open-source mais popular do mundo.',
 ARRAY['Campanhas de e-mail marketing com templates','Landing pages e formulários integrados','Automações baseadas em comportamento','Segmentação avançada de contatos','Lead scoring automático'],
 ARRAY['Nutrição de leads automatizada','E-mail marketing em larga escala','Funil de vendas digital'],
 'VPS com mínimo 2GB RAM.',8),

('Docker + Portainer','DevOps & Infraestrutura','Gerenciamento visual de containers','Ambiente Docker pré-configurado com Portainer. Gerencie containers visualmente.',
 'https://cdn.simpleicons.org/docker/2496ED','#2496ED','#EFF9FF',
 ARRAY['Docker','Containers','Portainer'],false,
 'VPS com Docker Engine e Portainer pré-instalados. Portainer é a interface web mais popular para gerenciar containers Docker.',
 ARRAY['Docker Engine + Docker Compose pré-instalados','Portainer CE com interface web','Deploy de stacks via Docker Compose','Monitoramento de recursos por container'],
 ARRAY['Hospedar múltiplas aplicações em um único VPS','Ambiente de desenvolvimento isolado','Deploy de microserviços'],
 'VPS com mínimo 2GB RAM.',9),

('MinIO','DevOps & Infraestrutura','Object storage compatível com S3','Object storage de alta performance compatível com S3. Ideal para arquivos e media.',
 'https://cdn.simpleicons.org/minio/C72C48','#C72C48','#FFF5F5',
 ARRAY['Storage','S3','Object Store'],false,
 'MinIO é um servidor de object storage de alta performance, 100% compatível com a API S3 da Amazon.',
 ARRAY['100% compatível com AWS S3 API','Interface web para gerenciamento','Versionamento de arquivos','Criptografia end-to-end'],
 ARRAY['Storage privado alternativo ao S3','Backups de banco de dados','CDN para assets estáticos'],
 'VPS com mínimo 1GB RAM. Storage depende do volume de dados.',10)

ON CONFLICT DO NOTHING;

-- ── 7. Seed Contratos provisórios ────────────────────────────
INSERT INTO contracts (product_slug, product_name, title, content) VALUES
('hospedagem', 'Hospedagem Web', 'Contrato de Hospedagem Web',
'<h2>Contrato de Prestação de Serviços de Hospedagem Web</h2><p>Este contrato estabelece os termos e condições para a prestação de serviços de hospedagem web pela <strong>Hosteg Soluções em Tecnologia Ltda.</strong> (doravante "CONTRATADA") ao cliente (doravante "CONTRATANTE").</p><h3>1. Objeto do Contrato</h3><p>A CONTRATADA se compromete a fornecer serviços de hospedagem web conforme o plano contratado, incluindo espaço em disco SSD, contas de e-mail, certificado SSL e suporte técnico 24/7.</p><h3>2. Vigência</h3><p>O contrato é válido pelo período contratado, renovando-se automaticamente ao final de cada período, salvo aviso prévio de cancelamento com 30 dias de antecedência.</p><h3>3. Obrigações da CONTRATADA</h3><p>Manter disponibilidade mínima de 99,9% (SLA), fornecer suporte técnico 24/7 em português, realizar backups diários automáticos e garantir a segurança da infraestrutura.</p><h3>4. Obrigações do CONTRATANTE</h3><p>Manter seus dados de pagamento atualizados, utilizar os serviços de acordo com a legislação vigente e não hospedar conteúdo ilegal, spam ou que viole direitos de terceiros.</p><h3>5. Cancelamento</h3><p>O cancelamento pode ser solicitado a qualquer momento via painel do cliente. Não há reembolso proporcional para planos mensais.</p><h3>6. Foro</h3><p>Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias oriundas deste contrato.</p>'),

('cloud-vps', 'Cloud VPS', 'Contrato de Serviços Cloud VPS',
'<h2>Contrato de Prestação de Serviços de Cloud VPS</h2><p>Este contrato estabelece os termos e condições para a prestação de serviços de Cloud VPS pela <strong>Hosteg Soluções em Tecnologia Ltda.</strong></p><h3>1. Objeto</h3><p>Fornecimento de servidor virtual privado (VPS) com recursos dedicados de CPU, RAM e armazenamento NVMe, conforme plano contratado.</p><h3>2. Recursos Garantidos</h3><p>Os recursos de CPU (vCPU via KVM), RAM DDR4 ECC e armazenamento NVMe Gen4 são dedicados e garantidos.</p><h3>3. SLA</h3><p>Garantimos disponibilidade de 99,9% da infraestrutura. Em caso de indisponibilidade superior ao acordado, o cliente terá direito a crédito proporcional no próximo ciclo.</p><h3>4. Uso Aceitável</h3><p>É proibido o uso do VPS para mineração de criptomoedas em larga escala, ataques DDoS, spam, phishing ou qualquer atividade ilegal.</p><h3>5. Cancelamento e Reembolso</h3><p>O serviço pode ser cancelado a qualquer momento. O cancelamento entra em vigor ao final do período vigente. Não há reembolso proporcional.</p>'),

('hospedagem-pro', 'Hospedagem PRO', 'Contrato de Hospedagem PRO',
'<h2>Contrato de Hospedagem PRO (cPanel)</h2><p>Contrato de prestação de serviços de hospedagem profissional com cPanel pela Hosteg.</p><h3>1. Objeto</h3><p>Serviços de hospedagem avançada com painel cPanel/WHM, incluindo todos os recursos do plano contratado.</p><h3>2. Licença cPanel</h3><p>A licença cPanel está incluída no plano. Seu uso está sujeito aos termos da cPanel LLC.</p><h3>3. SLA e Disponibilidade</h3><p>Garantimos 99,9% de disponibilidade com monitoramento 24/7.</p><h3>4. Cancelamento</h3><p>O cancelamento pode ser solicitado via painel do cliente com 30 dias de antecedência.</p>'),

('wordpress', 'WordPress', 'Contrato de Hospedagem WordPress',
'<h2>Contrato de Hospedagem WordPress</h2><p>Contrato de prestação de serviços de hospedagem otimizada para WordPress pela Hosteg.</p><h3>1. Objeto</h3><p>Hospedagem especializada para WordPress com LiteSpeed, LSCache e Elementor Pro.</p><h3>2. Software Incluído</h3><p>O Elementor Pro incluso tem licença para uso exclusivo na hospedagem Hosteg. A exportação da licença para outros ambientes não é permitida.</p><h3>3. Atualizações</h3><p>Recomendamos manter WordPress e plugins sempre atualizados. A Hosteg não se responsabiliza por vulnerabilidades decorrentes de software desatualizado.</p>'),

('revenda-cpanel', 'Revenda cPanel', 'Contrato de Revenda cPanel',
'<h2>Contrato de Revenda de Hospedagem cPanel</h2><p>Contrato de prestação de serviços de hospedagem para revendedores via cPanel/WHM.</p><h3>1. Objeto</h3><p>Fornecimento de infraestrutura de revenda com cPanel/WHM, permitindo ao CONTRATANTE criar e gerenciar contas de hospedagem para seus próprios clientes.</p><h3>2. Responsabilidade</h3><p>O CONTRATANTE é inteiramente responsável pelos clientes cadastrados em sua revenda, incluindo o cumprimento das políticas de uso aceitável.</p><h3>3. White-label</h3><p>O serviço de white-label permite ao CONTRATANTE apresentar os serviços sob sua própria marca.</p>'),

('revenda-directadmin', 'Revenda DirectAdmin', 'Contrato de Revenda DirectAdmin',
'<h2>Contrato de Revenda DirectAdmin</h2><p>Contrato para serviços de revenda com painel DirectAdmin.</p><h3>1. Objeto</h3><p>Fornecimento de infraestrutura de revenda com DirectAdmin, permitindo criação e gestão de contas de hospedagem para clientes do revendedor.</p><h3>2. Responsabilidade do Revendedor</h3><p>O revendedor é responsável por seus clientes e pelo cumprimento das políticas de uso aceitável.</p>'),

('database-cloud', 'Database Cloud', 'Contrato de Database Cloud',
'<h2>Contrato de Database Cloud</h2><p>Contrato para serviços de banco de dados gerenciado na nuvem.</p><h3>1. Objeto</h3><p>Fornecimento de banco de dados gerenciado (MySQL, PostgreSQL, MongoDB ou SQL Server) em ambiente cloud dedicado.</p><h3>2. Backup e Disponibilidade</h3><p>Backup automático diário com retenção de 30 dias. SLA de 99,95% de disponibilidade.</p><h3>3. Acesso aos Dados</h3><p>O cliente tem acesso exclusivo ao seu banco de dados. A Hosteg não acessa dados do cliente, exceto para manutenção técnica com autorização prévia.</p>'),

('backup-pro', 'BackupPRO', 'Contrato de BackupPRO',
'<h2>Contrato de Serviços BackupPRO</h2><p>Contrato para serviços de backup gerenciado.</p><h3>1. Objeto</h3><p>Fornecimento de solução de backup em nuvem com agente instalado nos servidores do cliente.</p><h3>2. Retenção de Dados</h3><p>Os dados de backup são mantidos conforme o plano contratado. Após o cancelamento, os dados são excluídos em até 30 dias.</p><h3>3. Restauração</h3><p>A restauração pode ser solicitada a qualquer momento via painel ou suporte.</p>')

ON CONFLICT (product_slug) DO NOTHING;

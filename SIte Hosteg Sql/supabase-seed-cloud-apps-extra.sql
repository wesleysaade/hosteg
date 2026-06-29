-- ============================================================
-- HOSTEG — Cloud Apps extras (Yeastar, SofiaCRM, OpenPanel)
-- Cole no SQL Editor do Supabase e execute
-- Seguro rodar mais de uma vez (não duplica)
-- ============================================================

-- Yeastar
INSERT INTO cloud_apps
  (name, category, tagline, description, logo, logo_color, logo_bg,
   tags, highlight, modal_about, modal_features, modal_use_cases, modal_requirements, position)
SELECT
  'Yeastar',
  'WhatsApp & Comunicação',
  'PABX IP em nuvem para equipes modernas',
  'Plataforma de comunicação unificada com ramal SIP, URA, filas de atendimento e integração com WhatsApp e CRM.',
  NULL,
  '#E8472F',
  '#FFF5F5',
  ARRAY['PABX', 'SIP', 'Comunicação', 'URA'],
  false,
  'O Yeastar P-Series é uma plataforma PABX IP completa que une telefonia SIP, videoconferência, chat e integração com WhatsApp em um único painel. Ideal para empresas que precisam de comunicação profissional sem depender de infraestrutura física.',
  ARRAY[
    'Ramais SIP ilimitados',
    'URA (atendimento automático) configurável',
    'Filas de atendimento com relatórios',
    'Integração nativa com WhatsApp Business',
    'Gravação de chamadas e histórico completo',
    'App mobile para iOS e Android'
  ],
  ARRAY[
    'Central telefônica para empresas de médio porte',
    'Call center com fila e distribuição automática',
    'Comunicação multicanal (voz + WhatsApp + chat)'
  ],
  'VPS com mínimo 2GB RAM e 2 vCPU.',
  12
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'Yeastar');

-- SofiaCRM
INSERT INTO cloud_apps
  (name, category, tagline, description, logo, logo_color, logo_bg,
   tags, highlight, modal_about, modal_features, modal_use_cases, modal_requirements, position)
SELECT
  'SofiaCRM',
  'CRM & Negócios',
  'CRM focado em vendas e relacionamento',
  'Gerencie leads, oportunidades e clientes em um CRM visual e intuitivo, com pipeline Kanban e automações de follow-up.',
  NULL,
  '#F59E0B',
  '#FFFBEB',
  ARRAY['CRM', 'Vendas', 'Pipeline', 'Leads'],
  false,
  'SofiaCRM é um sistema de gestão de relacionamento com clientes desenvolvido para times de vendas brasileiros. Oferece pipeline visual, automação de follow-ups, integração com WhatsApp e relatórios de performance em tempo real.',
  ARRAY[
    'Pipeline de vendas estilo Kanban',
    'Gestão de leads e oportunidades',
    'Automação de follow-up por e-mail e WhatsApp',
    'Histórico completo de interações',
    'Relatórios de conversão e previsão de vendas',
    'App mobile para vendedores externos'
  ],
  ARRAY[
    'Gerenciamento do funil de vendas',
    'Equipes comerciais com múltiplos vendedores',
    'Acompanhamento de metas e comissões'
  ],
  'VPS com mínimo 2GB RAM.',
  13
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'SofiaCRM');

-- OpenPanel
INSERT INTO cloud_apps
  (name, category, tagline, description, logo, logo_color, logo_bg,
   tags, highlight, modal_about, modal_features, modal_use_cases, modal_requirements, position)
SELECT
  'OpenPanel',
  'DevOps & Infraestrutura',
  'Painel de hospedagem moderno e open source',
  'Alternativa moderna ao cPanel e Plesk, com interface limpa, suporte a Docker, múltiplos usuários e gestão de DNS.',
  NULL,
  '#0EA5E9',
  '#EFF9FF',
  ARRAY['Painel', 'Hospedagem', 'Docker', 'DNS'],
  false,
  'OpenPanel é um painel de controle de hospedagem web de código aberto, projetado para ser uma alternativa leve e moderna ao cPanel. Suporta múltiplos usuários, planos de hospedagem, MySQL/PostgreSQL, emails, certificados SSL automáticos via Let''s Encrypt e containers Docker.',
  ARRAY[
    'Multi-usuário com isolamento de recursos',
    'Gerenciador de arquivos web integrado',
    'MySQL, PostgreSQL e phpMyAdmin',
    'Criação e gerenciamento de emails',
    'SSL automático via Let''s Encrypt',
    'Suporte a containers Docker por site',
    'DNS Manager integrado'
  ],
  ARRAY[
    'Revenda de hospedagem com painel próprio',
    'Gerenciamento de múltiplos sites em um servidor',
    'Substituição do cPanel em VPS'
  ],
  'VPS com mínimo 2GB RAM e Ubuntu 22.04+.',
  14
WHERE NOT EXISTS (SELECT 1 FROM cloud_apps WHERE name = 'OpenPanel');

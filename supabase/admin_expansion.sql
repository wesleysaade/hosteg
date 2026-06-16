-- ═══════════════════════════════════════════════════════════════════════════
-- Admin Expansion Migration
-- Novas tabelas: site_settings, nav_menu_items, datacenter_locations,
--                datacenter_technologies
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── site_settings ────────────────────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      text not null default '',
  label      text not null default '',
  section    text not null default 'geral',
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;
create policy "Public read site_settings"  on site_settings for select using (true);
create policy "Auth write site_settings"   on site_settings for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

insert into site_settings (key, value, label, section) values
  ('company_cnpj',          'XX.XXX.XXX/0001-XX',                           'CNPJ',                   'empresa'),
  ('company_address',       'São Paulo, SP — Brasil',                        'Endereço',               'empresa'),
  ('company_email_vendas',  'vendas@hosteg.com.br',                          'E-mail de Vendas',       'empresa'),
  ('company_email_suporte', 'suporte@hosteg.com.br',                         'E-mail de Suporte',      'empresa'),
  ('company_whatsapp',      '',                                              'WhatsApp (com DDD)',      'empresa'),
  ('social_instagram',      '',                                              'Instagram (URL)',         'redes_sociais'),
  ('social_linkedin',       '',                                              'LinkedIn (URL)',          'redes_sociais'),
  ('social_youtube',        '',                                              'YouTube (URL)',           'redes_sociais'),
  ('social_twitter',        '',                                              'Twitter / X (URL)',       'redes_sociais'),
  ('footer_tagline',        'Infraestrutura cloud de alta performance no Brasil e Canadá.', 'Tagline do Rodapé', 'rodape'),
  ('footer_datacenters',    '🇧🇷 São Paulo · 🇨🇦 Toronto',                    'Datacenters no Rodapé',  'rodape'),
  ('area_cliente_url',      'https://painelcliente.com.br',                  'URL Área do Cliente',    'links'),
  ('ticket_url',            'https://painelcliente.com.br/supporttickets.php','URL Abrir Ticket',      'links'),
  ('terms_url',             '/contratos',                                    'URL Termos de Uso',      'links'),
  ('privacy_url',           '/privacidade',                                  'URL Política de Privacidade', 'links'),
  ('sla_url',               '/sla',                                          'URL SLA',                'links')
on conflict (key) do nothing;

-- ── nav_menu_items ────────────────────────────────────────────────────────────
create table if not exists nav_menu_items (
  id          uuid primary key default gen_random_uuid(),
  menu_group  text not null
              check (menu_group in ('main','produtos','cloud-apps','institucional','cta')),
  category    text,          -- para mega menus: nome da categoria
  label       text not null,
  description text not null default '',
  href        text not null,
  icon_name   text not null default 'Globe',
  badge       text not null default '',
  order_index integer not null default 0,
  is_enabled  boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table nav_menu_items enable row level security;
create policy "Public read nav_menu_items" on nav_menu_items for select using (true);
create policy "Auth write nav_menu_items"  on nav_menu_items for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- Seed: links diretos da nav
insert into nav_menu_items (menu_group, label, description, href, icon_name, badge, order_index) values
  ('main', 'Cloud VPS',  '', '/cloud-vps', 'HardDrives', '', 0),
  ('main', 'WordPress',  '', '/wordpress',  'Stack',      '', 1)
on conflict do nothing;

-- Seed: CTAs (lado direito)
insert into nav_menu_items (menu_group, label, href, icon_name, order_index) values
  ('cta', 'Suporte',         '/contato',                    '',       0),
  ('cta', 'Login',           'https://painelcliente.com.br', '',      1),
  ('cta', 'Área do Cliente', 'https://painelcliente.com.br', '',      2)
on conflict do nothing;

-- Seed: Institucional dropdown
insert into nav_menu_items (menu_group, label, description, href, icon_name, order_index) values
  ('institucional', 'Sobre a Hosteg', 'Nossa história, missão e valores',           '/sobre',      'Info',      0),
  ('institucional', 'Datacenter',     'Infraestrutura física e certificações',       '/datacenter', 'MapPin',    1),
  ('institucional', 'Status',         'Disponibilidade dos serviços em tempo real',  '/status',     'Heartbeat', 2)
on conflict do nothing;

-- Seed: Produtos mega menu
insert into nav_menu_items (menu_group, category, label, description, href, icon_name, badge, order_index) values
  ('produtos', 'Hospedagem',        'Hospedagem Web',      'Sites e e-mail profissional com DirectAdmin',      '/hospedagem',         'Globe',        '',       0),
  ('produtos', 'Hospedagem',        'Hospedagem PRO',      'cPanel + LiteSpeed + Redis + Anti-spam',           '/hospedagem-pro',     'Lightning',    'Popular',1),
  ('produtos', 'Hospedagem',        'WordPress Hosting',   'Ambiente otimizado para WordPress',                '/wordpress',          'Stack',        '',       2),
  ('produtos', 'Hospedagem',        'Hospedagem ASP.NET',  'Windows Server + Plesk + SQL Server',              '/hospedagem-aspnet',  'WindowsLogo',  'Novo',   3),
  ('produtos', 'Agências e Revendas','Revenda cPanel',     'Hospedagem white-label com cPanel',                '/revenda-cpanel',     'ShareNetwork', 'Novo',   10),
  ('produtos', 'Agências e Revendas','Revenda DirectAdmin','Hospedagem white-label com DirectAdmin',           '/revenda-directadmin','ShareNetwork', 'Novo',   11),
  ('produtos', 'Agências e Revendas','Revenda ASP.NET',    'Revenda Windows white-label com Plesk',            '/revenda-aspnet',     'WindowsLogo',  'Novo',   12),
  ('produtos', 'Corporativo',       'Bare-Metal',          'Servidores Xeon dedicados, hardware exclusivo',    '/bare-metal',         'Cpu',          '',       20),
  ('produtos', 'Corporativo',       'Database Cloud',      'MySQL, PostgreSQL, MongoDB, SQL Server',           '/database-cloud',     'Database',     '',       21),
  ('produtos', 'Corporativo',       'BackupPRO',           'Backup gerenciado com tecnologia Acronis',         '/backup-pro',         'HardDrives',   '',       22),
  ('produtos', 'Corporativo',       'Hosteg ERP',          'ERP completo na nuvem via hosteg.cloud',           '/hosteg-erp',         'GridFour',     '',       23),
  ('produtos', 'Corporativo',       'Terminal Server',     'Desktop Windows acessível pelo navegador',         '/terminal-server',    'Monitor',      '',       24)
on conflict do nothing;

-- Seed: Cloud APPs mega menu
insert into nav_menu_items (menu_group, category, label, description, href, icon_name, badge, order_index) values
  ('cloud-apps', 'Automação & Comunicação', 'N8N',           'Automação de fluxos e integrações',     '/cloud-apps', 'GitFork',    '',    0),
  ('cloud-apps', 'Automação & Comunicação', 'Evolution API', 'API WhatsApp multi-dispositivo',        '/cloud-apps', 'ChatCircle', 'Hot', 1),
  ('cloud-apps', 'Automação & Comunicação', 'Typebot',       'Construtor visual de chatbots',         '/cloud-apps', 'Robot',      '',    2),
  ('cloud-apps', 'Automação & Comunicação', 'Chatwoot',      'Suporte omnichannel unificado',         '/cloud-apps', 'ChatCircle', '',    3),
  ('cloud-apps', 'Negócios & DevOps',       'Odoo',          'ERP open-source completo',              '/cloud-apps', 'Browser',    '',    10),
  ('cloud-apps', 'Negócios & DevOps',       'Supabase',      'Backend as a Service open-source',      '/cloud-apps', 'Code',       '',    11),
  ('cloud-apps', 'Negócios & DevOps',       'Easypanel',     'Gerenciador de servidores e apps',      '/cloud-apps', 'Package',    '',    12),
  ('cloud-apps', 'Negócios & DevOps',       'Ver todos →',   '+ MinIO, MongoDB, Docker, Mautic e mais','/cloud-apps','Stack',     '',    13)
on conflict do nothing;

-- ── datacenter_locations ──────────────────────────────────────────────────────
create table if not exists datacenter_locations (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  city             text not null,
  country          text not null,
  flag_emoji       text not null default '🌐',
  tier             text not null default 'Tier III',
  uptime           text not null default '99.99%',
  latency_br       text not null default '',
  power            text not null default '',
  cooling          text not null default '',
  certifications   text[] not null default '{}',
  specs            jsonb not null default '[]',
  is_active        boolean not null default true,
  order_index      integer not null default 0,
  created_at       timestamptz not null default now()
);

alter table datacenter_locations enable row level security;
create policy "Public read datacenter_locations" on datacenter_locations for select using (true);
create policy "Auth write datacenter_locations"  on datacenter_locations for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

insert into datacenter_locations
  (name, city, country, flag_emoji, tier, uptime, latency_br, power, cooling, certifications, specs, order_index)
values
(
  'Ascenty SP4', 'São Paulo', 'Brasil', '🇧🇷',
  'Tier III', '99.995%', '~20 ms (Média BR)',
  'N+1 (800 kW)', 'Precision Cooling',
  ARRAY['ISO 27001','PCI DSS','SOC 2'],
  '[{"label":"RAM ECC DDR5","value":"até 1.5 TB"},{"label":"NVMe","value":"até 7.000 MB/s"},{"label":"Rede","value":"10 Gbps redundante"}]'::jsonb,
  0
),
(
  'Cologix TOR1', 'Toronto', 'Canadá', '🇨🇦',
  'Tier III', '99.99%', '~130 ms (Média BR)',
  'N+1 (400 kW)', 'Precision Cooling',
  ARRAY['SOC 2','ISO 50001'],
  '[{"label":"Conectividade","value":"5 Gbps uplink"},{"label":"Localização","value":"Downtown Toronto"}]'::jsonb,
  1
),
(
  'Equinix DC6', 'Washington DC', 'EUA', '🇺🇸',
  'Tier III', '99.99%', '~110 ms (Média BR)',
  'N+1', 'Precision Cooling',
  ARRAY['SOC 2','ISO 27001','FISMA'],
  '[{"label":"Conectividade","value":"10 Gbps uplink"},{"label":"Localização","value":"Ashburn, VA"}]'::jsonb,
  2
)
on conflict do nothing;

-- ── datacenter_technologies ───────────────────────────────────────────────────
create table if not exists datacenter_technologies (
  id          uuid primary key default gen_random_uuid(),
  icon_name   text not null default 'Shield',
  title       text not null,
  description text not null default '',
  order_index integer not null default 0,
  is_active   boolean not null default true
);

alter table datacenter_technologies enable row level security;
create policy "Public read datacenter_technologies" on datacenter_technologies for select using (true);
create policy "Auth write datacenter_technologies"  on datacenter_technologies for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

insert into datacenter_technologies (icon_name, title, description, order_index) values
  ('Shield',     'Anti-DDoS',       'Proteção automática contra ataques volumétricos e de aplicação', 0),
  ('HardDrives', 'NVMe 7.000 MB/s', 'Storage NVMe de última geração com leitura de até 7.000 MB/s',  1),
  ('Lightning',  'Rede 10 Gbps',    'Uplinks redundantes de 10 Gbps com BGP full-route',             2),
  ('Lock',       'Segurança física', 'Acesso biométrico, CFTV 24/7 e controle de zona segura',        3),
  ('Globe',      'IPv4 + IPv6',      'Endereços IPv4 e IPv6 dedicados inclusos em todos os planos',   4),
  ('Cpu',        'Hardware premium', 'Processadores Intel Xeon e AMD EPYC de última geração',         5)
on conflict do nothing;

-- ── contracts RLS (caso ainda não exista) ────────────────────────────────────
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'contracts' and policyname = 'Public read contracts'
  ) then
    alter table contracts enable row level security;
    create policy "Public read contracts"  on contracts for select using (true);
    create policy "Auth write contracts"   on contracts for all
      using (auth.uid() is not null) with check (auth.uid() is not null);
  end if;
end $$;

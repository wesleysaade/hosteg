-- ============================================================
-- Hosteg Status Page — Supabase Migration
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- 1. Tabelas
-- ------------------------------------------------------------

create table if not exists status_categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  order_index integer     not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists status_services (
  id          uuid        primary key default gen_random_uuid(),
  category_id uuid        references status_categories(id) on delete cascade,
  name        text        not null,
  icon_name   text        not null default 'server',
  status      text        not null default 'operational'
                          check (status in ('operational','degraded','outage','maintenance')),
  latency_br  text        not null default '—',
  order_index integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists status_incidents (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  description   text        not null default '',
  type          text        not null default 'ok'
                            check (type in ('ok','maintenance','incident')),
  incident_date date        not null default current_date,
  created_at    timestamptz not null default now()
);

-- 2. RLS — leitura pública, escrita via service role (server-side)
-- ------------------------------------------------------------

alter table status_categories enable row level security;
alter table status_services    enable row level security;
alter table status_incidents   enable row level security;

-- Leitura pública (status page)
create policy "Public read status_categories"
  on status_categories for select using (true);

create policy "Public read status_services"
  on status_services for select using (true);

create policy "Public read status_incidents"
  on status_incidents for select using (true);

-- Escrita para usuários autenticados (admin)
create policy "Auth write status_categories"
  on status_categories for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Auth write status_services"
  on status_services for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Auth write status_incidents"
  on status_incidents for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- 3. Seed — Categorias
-- ------------------------------------------------------------

insert into status_categories (name, order_index) values
  ('Infraestrutura',   1),
  ('Hospedagem',       2),
  ('Rede & Segurança', 3),
  ('Plataforma & APIs',4)
on conflict do nothing;

-- 4. Seed — Serviços
-- ------------------------------------------------------------

do $$
declare
  infra_id uuid;
  hosp_id  uuid;
  rede_id  uuid;
  plat_id  uuid;
begin
  select id into infra_id from status_categories where name = 'Infraestrutura'    limit 1;
  select id into hosp_id  from status_categories where name = 'Hospedagem'        limit 1;
  select id into rede_id  from status_categories where name = 'Rede & Segurança'  limit 1;
  select id into plat_id  from status_categories where name = 'Plataforma & APIs' limit 1;

  insert into status_services (category_id, name, icon_name, status, latency_br, order_index) values
    -- Infraestrutura
    (infra_id, 'Cloud VPS — São Paulo',      'server',   'operational', '20ms',  1),
    (infra_id, 'Cloud VPS — Toronto',        'server',   'operational', '130ms', 2),
    (infra_id, 'Cloud VPS — Washington',     'server',   'operational', '110ms', 3),
    (infra_id, 'Bare-Metal Dedicado',        'zap',      'operational', '—',     4),
    -- Hospedagem
    (hosp_id,  'Hospedagem Web / cPanel',    'globe',    'operational', '—',     1),
    (hosp_id,  'Hospedagem PRO / LiteSpeed', 'globe',    'operational', '—',     2),
    (hosp_id,  'WordPress Hosting',          'globe',    'operational', '—',     3),
    (hosp_id,  'Hospedagem ASP.NET / Plesk', 'globe',    'operational', '—',     4),
    -- Rede & Segurança
    (rede_id,  'Rede 10 Gbps — SP',          'wifi',     'operational', '—',     1),
    (rede_id,  'Anti-DDoS Layer 3/4/7',      'shield',   'operational', '—',     2),
    (rede_id,  'DNS Autoritativo',           'globe',    'operational', '—',     3),
    -- Plataforma & APIs
    (plat_id,  'Painel do Cliente',          'monitor',  'operational', '—',     1),
    (plat_id,  'API de Provisionamento',     'database', 'operational', '—',     2),
    (plat_id,  'BackupPRO / Acronis',        'database', 'operational', '—',     3);

  -- 5. Seed — Incidentes (últimos 7 dias, 1 manutenção)
  insert into status_incidents (title, description, type, incident_date) values
    ('Operação normal',   '', 'ok',          current_date),
    ('Operação normal',   '', 'ok',          current_date - 1),
    ('Operação normal',   '', 'ok',          current_date - 2),
    ('Operação normal',   '', 'ok',          current_date - 3),
    ('Operação normal',   '', 'ok',          current_date - 4),
    ('Manutenção planejada: atualização de rede em SP — concluída às 03:40',
                          '', 'maintenance', current_date - 5),
    ('Operação normal',   '', 'ok',          current_date - 6);
end $$;

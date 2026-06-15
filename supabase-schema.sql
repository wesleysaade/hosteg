-- ============================================================
-- HOSTEG — Schema Supabase
-- Cole este SQL no SQL Editor do Supabase e execute
-- ============================================================

-- ── DOCS ─────────────────────────────────────────────────────

create table if not exists doc_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  icon        text,            -- nome do ícone Phosphor, ex: "Server"
  color       text default '#0EA5E9',
  description text,
  position    int  default 0,
  created_at  timestamptz default now()
);

create table if not exists doc_articles (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references doc_categories(id) on delete cascade,
  title       text not null,
  slug        text unique not null,
  content     text,            -- HTML gerado pelo TipTap
  excerpt     text,
  published   boolean default false,
  views       int     default 0,
  position    int     default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger: atualiza updated_at automaticamente
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger doc_articles_updated_at
  before update on doc_articles
  for each row execute procedure update_updated_at();

-- ── PLANS ────────────────────────────────────────────────────

create table if not exists product_pages (
  id        uuid primary key default gen_random_uuid(),
  name      text unique not null,   -- ex: "Hospedagem Web"
  slug      text unique not null,   -- ex: "hospedagem"
  cta_href  text default 'https://painelcliente.com.br',
  cta_label text default 'Contratar'
);

create table if not exists plans (
  id              uuid primary key default gen_random_uuid(),
  product_page_id uuid references product_pages(id) on delete cascade,
  name            text    not null,
  monthly_price   numeric not null,
  description     text,
  popular         boolean default false,
  position        int     default 0
);

create table if not exists plan_specs (
  id       uuid primary key default gen_random_uuid(),
  plan_id  uuid references plans(id) on delete cascade,
  label    text not null,
  value    text not null,
  tip      text,
  position int  default 0
);

create table if not exists plan_features (
  id       uuid primary key default gen_random_uuid(),
  plan_id  uuid references plans(id) on delete cascade,
  text     text not null,
  tip      text,
  position int  default 0
);

-- ── RLS (Row Level Security) ─────────────────────────────────
-- Leitura pública para o site; escrita apenas autenticado

alter table doc_categories  enable row level security;
alter table doc_articles     enable row level security;
alter table product_pages    enable row level security;
alter table plans            enable row level security;
alter table plan_specs       enable row level security;
alter table plan_features    enable row level security;

-- Leitura pública
create policy "public read categories"  on doc_categories  for select using (true);
create policy "public read articles"    on doc_articles    for select using (published = true);
create policy "public read products"    on product_pages   for select using (true);
create policy "public read plans"       on plans           for select using (true);
create policy "public read specs"       on plan_specs      for select using (true);
create policy "public read features"    on plan_features   for select using (true);

-- Admin: leitura total (inclui artigos não publicados)
create policy "admin read articles"     on doc_articles    for select
  using (auth.role() = 'authenticated');

-- Admin: escrita total
create policy "admin all categories"    on doc_categories  for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all articles"      on doc_articles    for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all products"      on product_pages   for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all plans"         on plans           for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all specs"         on plan_specs      for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all features"      on plan_features   for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── SEED: Produtos (slugs dos planos existentes) ─────────────

insert into product_pages (name, slug) values
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
on conflict (slug) do nothing;

-- ── CLOUD APPS ───────────────────────────────────────────────

create table if not exists cloud_apps (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null default '',
  tagline      text not null default '',
  description  text not null default '',
  logo         text,
  logo_color   text not null default '#0EA5E9',
  logo_bg      text not null default '#EFF9FF',
  tags         text[] default '{}',
  highlight    boolean not null default false,
  modal_about      text default '',
  modal_features   text[] default '{}',
  modal_use_cases  text[] default '{}',
  modal_requirements text default '',
  position     integer not null default 0,
  created_at   timestamptz default now()
);

alter table cloud_apps enable row level security;
create policy "public read cloud_apps" on cloud_apps for select using (true);
create policy "auth write cloud_apps" on cloud_apps for all using (auth.role() = 'authenticated');

-- ── CONTRACTS ────────────────────────────────────────────────

create table if not exists contracts (
  id           uuid primary key default gen_random_uuid(),
  product_slug text not null unique,
  product_name text not null,
  title        text not null default 'Contrato de Prestação de Serviços',
  content      text not null default '',
  updated_at   timestamptz default now()
);

alter table contracts enable row level security;
create policy "public read contracts" on contracts for select using (true);
create policy "auth write contracts" on contracts for all using (auth.role() = 'authenticated');

-- ── SEED: Categorias docs iniciais ───────────────────────────

insert into doc_categories (name, slug, icon, color, description, position) values
  ('Cloud VPS',             'cloud-vps',        'Server',      '#0EA5E9', 'Criação, configuração e gerenciamento de VPS',         1),
  ('Hospedagem Web',        'hospedagem-web',   'Globe',       '#10B981', 'DirectAdmin, SSL, e-mail e domínios',                 2),
  ('Hospedagem PRO / cPanel','hospedagem-pro',  'Layers',      '#F59E0B', 'cPanel, Softaculous e configurações avançadas',        3),
  ('E-mail Profissional',   'email',            'Envelope',    '#8B5CF6', 'Configuração IMAP, SMTP e webmail',                   4),
  ('SSL / Segurança',       'ssl',              'Lock',        '#EF4444', 'Certificados SSL, HTTPS e firewall',                  5),
  ('Linux / SSH',           'linux-ssh',        'Terminal',    '#6B7280', 'Comandos Linux, SSH e configurações de servidor',      6),
  ('WordPress',             'wordpress',        'Lightning',   '#3B82F6', 'Instalação, performance e plugins WordPress',         7),
  ('Domínios & DNS',        'dominios-dns',     'HardDrive',   '#EC4899', 'DNS, registros MX, TTL e subdomínios',                8)
on conflict (slug) do nothing;

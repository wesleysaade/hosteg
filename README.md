# Hosteg — Site Institucional

Site da Hosteg construído com **Next.js 14 App Router** + **Tailwind CSS** + **Supabase**.

## Localização do projeto

```
/Users/wesleysaade/Documents/Claude/Claude-Hosteg/hosteg/
```

O arquivo SQL completo para importar no Supabase está em:
```
SIte Hosteg/hosteg-supabase-completo.sql
```

## Requisitos

- Node.js 18+
- npm
- Conta no Supabase (projeto novo)

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase — obrigatório para dados de planos, docs, etc.
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# PostgreSQL local — opcional, habilita queries extras em dev
# LOCAL_DATABASE_URL=postgresql://wesleysaade@localhost:5432/hosteg_dev
```

> As variáveis `NEXT_PUBLIC_*` vão em Settings → Environment Variables no Vercel também.

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento (porta 3003)
./restart-dev.command
# Acessa: http://localhost:3003

# 3. Build para produção
npm run build
npm start
```

O script `npm run dev` roda o compilador do Tailwind em paralelo com o Next.js:
```
tailwindcss -i ./app/globals.css -o ./app/compiled.css --watch & next dev
```

## Importar banco no Supabase

1. Acesse **SQL Editor** no painel do Supabase
2. Cole o conteúdo de `SIte Hosteg/hosteg-supabase-completo.sql`
3. Execute — o script é **idempotente** (pode rodar mais de uma vez sem duplicar dados)

O SQL cria 12 tabelas, aplica RLS completo e popula com todos os dados de seed (72 planos, 14 produtos, docs, cloud apps, page sections, addons).

## Páginas públicas

| Rota | Descrição |
|------|-----------|
| `/` | Home — Hero, grid de produtos, diferenciais, CTA |
| `/cloud-vps` | Cloud VPS — 10 planos NVMe |
| `/bare-metal` | Bare-Metal — 6 servidores Xeon dedicados |
| `/hospedagem` | Hospedagem Web — planos cPanel |
| `/hospedagem-pro` | Hospedagem PRO — cPanel + LiteSpeed |
| `/hospedagem-aspnet` | Hospedagem ASP.NET |
| `/wordpress` | WordPress Gerenciado |
| `/revenda-cpanel` | Revenda cPanel |
| `/revenda-directadmin` | Revenda DirectAdmin |
| `/revenda-aspnet` | Revenda ASP.NET |
| `/backup-pro` | BackupPRO |
| `/hosteg-erp` | Hosteg ERP |
| `/terminal-server` | Terminal Server |
| `/database-cloud` | Database Cloud (MySQL, PostgreSQL, MongoDB, SQL Server) |
| `/cloud-apps` | Aplicativos de Cloud |
| `/datacenter` | Infraestrutura SP + Canadá |
| `/sobre` | História e valores da empresa |
| `/contato` | Canais de atendimento |
| `/suporte` | Base de conhecimento (docs) |
| `/docs/[slug]` | Artigos individuais da base de conhecimento |

## Painel Admin

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard do admin |
| `/admin/login` | Login do administrador |
| `/admin/plans` | Gerenciar planos de hospedagem |
| `/admin/addons` | Gerenciar addons |
| `/admin/docs` | Gerenciar base de conhecimento |
| `/admin/content` | Gerenciar page sections / heroes |
| `/admin/cloud-apps` | Gerenciar cloud apps |

## Stack

- **Next.js 14.2.29** — App Router
- **Tailwind CSS 3.x** — Utilitários (compila globals.css → compiled.css)
- **Supabase** — Auth + banco de dados (tabelas de planos, docs, page sections)
- **@supabase/ssr** — Server-side rendering com Supabase
- **Tiptap** — Editor rich text no admin
- **lucide-react + @phosphor-icons/react** — Ícones
- **TypeScript** — Tipagem estática
- **Inter** — Tipografia (Google Fonts)
- **pg (Pool)** — Conexão local com PostgreSQL (opcional, circuit breaker 2500ms)

## Design system

- Fundo: `#000000`
- Superfície: `#0A0A0A` / `#111111`
- Bordas: `#1A1A1A` / `#222222`
- Texto: `#FFFFFF` / `#888888`
- Accent: `#0EA5E9` (azul Hosteg)

## Estrutura do banco (Supabase)

| Tabela | Descrição |
|--------|-----------|
| `product_pages` | 14 produtos com slug, nome, descrição |
| `plans` | 72 planos com preços mensais, anuais, bienais e 36 meses |
| `plan_specs` | Especificações técnicas por plano |
| `plan_features` | Features (checkmarks) por plano |
| `product_addons` | Addons extras (Cloud VPS e Bare-Metal) |
| `contracts` | Contratos por produto (mensal/anual/bianual/36meses) |
| `doc_categories` | Categorias da base de conhecimento |
| `doc_articles` | Artigos com SEO (seo_title, seo_description, seo_keywords) |
| `doc_views` | Contador de visualizações de artigos |
| `cloud_apps` | Aplicativos disponíveis (Nextcloud, Mautic, etc.) |
| `cloud_app_categories` | Categorias dos cloud apps |
| `page_sections` | Seções de conteúdo dinâmico (heroes, features) |

## Deploy

O projeto é deployado no **Vercel**. O deploy acontece automaticamente ao fazer push para o branch principal. Variáveis de ambiente devem ser configuradas em Settings → Environment Variables no painel do Vercel.

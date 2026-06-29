-- ============================================================
-- HOSTEG — Seed de Planos
-- Cole no SQL Editor do Supabase e execute
-- Adiciona coluna available_periods + importa todos os planos
-- ============================================================

-- Adicionar coluna de períodos disponíveis por produto
ALTER TABLE product_pages
  ADD COLUMN IF NOT EXISTS available_periods text[]
  DEFAULT ARRAY['mensal','trimestral','semestral','anual','bianual'];

-- Limpar planos existentes antes de re-importar (seguro rodar mais de uma vez)
DO $$
BEGIN
  DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans);
  DELETE FROM plan_specs     WHERE plan_id IN (SELECT id FROM plans);
  DELETE FROM plans;
END $$;

-- ============================================================
DO $$
DECLARE
  pid   uuid;
  pl_id uuid;
BEGIN

-- ════════════════════════════════════════════════════════════
-- HOSPEDAGEM WEB
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Web Starter',19,'Para sites pessoais, portfólios e blogs.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','10 GB SSD','Armazenamento SSD de alta velocidade para arquivos, banco de dados e e-mails.',0),
(pl_id,'Sites','1 site','Quantidade de domínios/sites ativos que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','5 contas','Número máximo de contas de e-mail @seudomínio que podem ser criadas.',2),
(pl_id,'Domínios','1 domínio','Domínios adicionais que podem ser apontados para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','Painel de controle intuitivo para gerenciar arquivos, e-mails, bancos de dados e domínios.',0),
(pl_id,'SSL Let''s Encrypt grátis','Certificado HTTPS automático para seu domínio, renovado sem custo.',1),
(pl_id,'E-mail profissional (5 contas)','Crie contas @seudomínio.com com webmail, IMAP e SMTP.',2),
(pl_id,'PHP 8.x + MySQL','Suporte às versões mais recentes do PHP com MySQL para aplicações web.',3),
(pl_id,'Backup diário','Cópias automáticas diárias dos seus arquivos e bancos de dados.',4),
(pl_id,'Suporte 24/7','Equipe técnica disponível a qualquer hora por chat ou ticket.',5);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Web Business',39,'Para pequenas empresas e lojas virtuais.',false,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','30 GB SSD','Armazenamento SSD de alta velocidade para arquivos, banco de dados e e-mails.',0),
(pl_id,'Sites','5 sites','Quantidade de domínios/sites ativos que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','30 contas','Número máximo de contas de e-mail @seudomínio que podem ser criadas.',2),
(pl_id,'Domínios','Ilimitados','Domínios adicionais que podem ser apontados para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','Painel completo para gerenciar múltiplos domínios e contas de e-mail.',0),
(pl_id,'SSL Let''s Encrypt grátis','HTTPS automático em todos os seus domínios sem custo adicional.',1),
(pl_id,'E-mail profissional (30 contas)','Até 30 contas de e-mail @seudomínio com filtro anti-spam incluso.',2),
(pl_id,'PHP 8.x + MySQL + Redis','Redis adiciona cache em memória para acelerar aplicações dinâmicas.',3),
(pl_id,'Backup diário','Retenção de 7 dias de backups, restauração com 1 clique.',4),
(pl_id,'Anti-spam avançado','Filtros de e-mail baseados em IA que bloqueiam spam antes de chegar na caixa de entrada.',5),
(pl_id,'Suporte prioritário 24/7','Atendimento com prioridade de resposta mais rápida.',6),
(pl_id,'Instalador de apps 1-click','Instale WordPress, Joomla, Magento e mais com um único clique.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Web Premium',69,'Para múltiplos projetos e agências.',true,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','80 GB SSD','Armazenamento SSD de alta velocidade para arquivos, banco de dados e e-mails.',0),
(pl_id,'Sites','Ilimitados','Quantidade de domínios/sites ativos que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','Ilimitadas','Número máximo de contas de e-mail @seudomínio que podem ser criadas.',2),
(pl_id,'Domínios','Ilimitados','Domínios adicionais que podem ser apontados para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','Painel completo com gestão de múltiplos domínios e usuários.',0),
(pl_id,'SSL Let''s Encrypt grátis','HTTPS automático e renovação transparente em todos os domínios.',1),
(pl_id,'E-mails ilimitados','Crie quantas contas @seudomínio quiser, sem restrição de quantidade.',2),
(pl_id,'PHP 8.x + MySQL + Redis','Stack completo com Redis para aplicações de alta performance.',3),
(pl_id,'Backup diário','Retenção de 14 dias com opção de restauração granular por arquivo.',4),
(pl_id,'Anti-spam + Anti-vírus','Proteção dupla com filtros de spam e varredura de vírus em e-mails e arquivos.',5),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com SLA garantido.',6),
(pl_id,'Instalador de apps 1-click','Centenas de aplicações disponíveis para instalação instantânea.',7),
(pl_id,'SSH access','Acesso ao servidor via terminal SSH para configurações avançadas.',8),
(pl_id,'Cronjobs avançados','Agendamento de tarefas recorrentes com interface visual.',9);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Web Enterprise',119,'Para operações críticas com máxima performance.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','150 GB SSD','Armazenamento SSD de alta velocidade para arquivos, banco de dados e e-mails.',0),
(pl_id,'Sites','Ilimitados','Quantidade de domínios/sites ativos que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','Ilimitadas','Número máximo de contas de e-mail @seudomínio que podem ser criadas.',2),
(pl_id,'Domínios','Ilimitados','Domínios adicionais que podem ser apontados para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','Acesso completo ao DirectAdmin com permissões de nível admin.',0),
(pl_id,'SSL Wildcard + Let''s Encrypt','Certificado wildcard cobre domínio principal e todos os subdomínios.',1),
(pl_id,'E-mails ilimitados + anti-spam premium','E-mails ilimitados com proteção avançada e relatórios de entregabilidade.',2),
(pl_id,'PHP 8.x + MySQL + Redis + OPcache','OPcache armazena scripts PHP compilados em memória para resposta instantânea.',3),
(pl_id,'Backup diário + retenção 30 dias','Histórico de 30 dias de backups completos com restauração seletiva.',4),
(pl_id,'Anti-spam + Anti-vírus premium','Camada extra de proteção com relatórios detalhados de ameaças bloqueadas.',5),
(pl_id,'Suporte VIP 24/7','Canal exclusivo de atendimento com engenheiro dedicado.',6),
(pl_id,'Instalador de apps 1-click','Biblioteca completa de aplicações com instalação e configuração automática.',7),
(pl_id,'SSH + IP dedicado','IP dedicado exclusivo para reputação de e-mail e acesso direto ao servidor.',8),
(pl_id,'Cronjobs + Node.js + Python','Suporte a runtimes adicionais para aplicações modernas.',9),
(pl_id,'Relatórios mensais de performance','Dashboard com métricas de uso, uptime e performance do servidor.',10);

-- ════════════════════════════════════════════════════════════
-- HOSPEDAGEM PRO
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem-pro';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PRO I',59,'Ideal para sites profissionais com alto tráfego.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','20 GB NVMe','Armazenamento NVMe de alta velocidade para máxima performance.',0),
(pl_id,'Sites','3 sites','Número de domínios/sites que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','20 contas','Contas de e-mail @seudomínio com webmail e anti-spam inclusos.',2),
(pl_id,'Domínios','3 domínios','Domínios adicionais gerenciados via cPanel.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','O painel mais utilizado do mundo com interface intuitiva e recursos avançados.',0),
(pl_id,'LiteSpeed Web Server','Servidor web até 9x mais rápido que Apache, com suporte nativo a HTTP/3.',1),
(pl_id,'Redis Cache','Cache em memória que reduz o tempo de resposta de aplicações dinâmicas.',2),
(pl_id,'SSL grátis (todos os domínios)','HTTPS automático em todos os domínios e subdomínios adicionados.',3),
(pl_id,'E-mail profissional (20 contas)','Contas @seudomínio com webmail, IMAP/POP3/SMTP e anti-spam.',4),
(pl_id,'Anti-spam profissional','Filtros avançados baseados em IA e listas negras em tempo real.',5),
(pl_id,'Antivírus Imunify360','Proteção em tempo real com varredura automática e bloqueio de malware.',6),
(pl_id,'PHP 8.x + Python + NodeJS','Múltiplos runtimes disponíveis para aplicações modernas.',7),
(pl_id,'Backup diário','Cópias automáticas com retenção de 7 dias e restauração em 1 clique.',8),
(pl_id,'Suporte 24/7','Equipe técnica disponível por chat e ticket a qualquer hora.',9);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PRO II',99,'Para agências e portfólios com múltiplos clientes.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','50 GB NVMe','Armazenamento NVMe de alta velocidade para máxima performance.',0),
(pl_id,'Sites','10 sites','Número de domínios/sites que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','50 contas','Contas de e-mail @seudomínio com webmail e anti-spam inclusos.',2),
(pl_id,'Domínios','10 domínios','Domínios adicionais gerenciados via cPanel.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','Gestão completa de múltiplos domínios, contas e recursos em uma interface.',0),
(pl_id,'LiteSpeed Web Server','Performance superior com LSCache integrado para WordPress e outras plataformas.',1),
(pl_id,'Redis + Memcached','Duas camadas de cache em memória para máxima velocidade de resposta.',2),
(pl_id,'SSL grátis (todos os domínios)','Certificados automáticos com renovação transparente, sem interrupções.',3),
(pl_id,'E-mail profissional (50 contas)','Até 50 caixas de e-mail com filtros avançados e criptografia TLS.',4),
(pl_id,'Anti-spam profissional','Proteção enterprise com SpamAssassin e filtros personalizáveis.',5),
(pl_id,'Antivírus Imunify360','Scans automáticos e remoção de malware sem impacto na performance.',6),
(pl_id,'PHP 8.x + Python + NodeJS','Stack completo para desenvolvimento de aplicações modernas.',7),
(pl_id,'Backup diário','Retenção de 14 dias com opção de download dos backups.',8),
(pl_id,'SSH access','Acesso seguro via terminal para configurações e deploys avançados.',9),
(pl_id,'Cronjobs avançados','Agendamento de tarefas com interface visual e logs de execução.',10),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com tempo de resposta reduzido.',11);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PRO III',169,'Máximo desempenho para projetos críticos.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','120 GB NVMe','Armazenamento NVMe de alta velocidade para máxima performance.',0),
(pl_id,'Sites','Ilimitados','Número de domínios/sites que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','Ilimitadas','Contas de e-mail @seudomínio com webmail e anti-spam inclusos.',2),
(pl_id,'Domínios','Ilimitados','Domínios adicionais gerenciados via cPanel.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','Acesso completo ao cPanel com todas as funcionalidades premium desbloqueadas.',0),
(pl_id,'LiteSpeed Web Server','LiteSpeed Enterprise com QUIC/HTTP3 e otimizações avançadas de performance.',1),
(pl_id,'Redis + Memcached + OPcache','Tripla camada de cache para aplicações de alto volume de acesso.',2),
(pl_id,'SSL grátis (todos os domínios)','Suporte a Let''s Encrypt e certificados SSL/TLS externos.',3),
(pl_id,'E-mails ilimitados','Sem limite de contas, com cotas personalizáveis por caixa de e-mail.',4),
(pl_id,'Anti-spam profissional','Proteção avançada com relatórios mensais de e-mails bloqueados.',5),
(pl_id,'Antivírus Imunify360','Proteção proativa com firewall de aplicação web (WAF) integrado.',6),
(pl_id,'PHP 8.x + Python + NodeJS + Ruby','Todos os runtimes populares disponíveis com múltiplas versões.',7),
(pl_id,'Backup diário','Retenção de 30 dias com restauração granular de arquivos individuais.',8),
(pl_id,'SSH access','Acesso root restrito via SSH para gestão avançada do ambiente.',9),
(pl_id,'IP dedicado opcional','IP exclusivo para reputação de e-mail e acesso direto ao servidor.',10),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com engenheiro de suporte dedicado à sua conta.',11);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PRO IV',299,'Infraestrutura premium para empresas e e-commerce de grande porte.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','250 GB NVMe','Armazenamento NVMe de alta velocidade para máxima performance.',0),
(pl_id,'Sites','Ilimitados','Número de domínios/sites que podem ser hospedados neste plano.',1),
(pl_id,'E-mails','Ilimitadas','Contas de e-mail @seudomínio com webmail e anti-spam inclusos.',2),
(pl_id,'Domínios','Ilimitados','Domínios adicionais gerenciados via cPanel.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel WHM incluso','Acesso ao WHM (Web Host Manager) para gestão de múltiplas contas cPanel.',0),
(pl_id,'LiteSpeed Enterprise + QUIC','LiteSpeed Enterprise com protocolo QUIC para latência ultra-baixa.',1),
(pl_id,'Redis + Memcached + OPcache + Varnish','Quatro camadas de cache para performance extrema em qualquer aplicação.',2),
(pl_id,'SSL Wildcard + Let''s Encrypt','Certificado wildcard para proteger o domínio principal e todos os subdomínios.',3),
(pl_id,'E-mails ilimitados + proteção premium','Caixas ilimitadas com proteção avançada e relatórios de entregabilidade.',4),
(pl_id,'WAF + Imunify360 Enterprise','Firewall de aplicação web com regras customizáveis e proteção DDoS.',5),
(pl_id,'Antivírus + EDR','Detecção e resposta a endpoints com proteção proativa contra malware avançado.',6),
(pl_id,'PHP 8.x + Python + NodeJS + Ruby','Todos os runtimes com múltiplas versões e ambientes isolados.',7),
(pl_id,'Backup diário + retenção 60 dias','60 dias de histórico de backups completos com restauração de arquivos individuais.',8),
(pl_id,'SSH + IP dedicado incluso','IP dedicado incluído no plano com acesso SSH completo.',9),
(pl_id,'SLA 99,99% uptime garantido','Acordo de nível de serviço com compensação por indisponibilidade.',10),
(pl_id,'Suporte VIP + gerente de conta','Gerente de conta dedicado e canal de suporte com SLA de 1 hora.',11);

-- ════════════════════════════════════════════════════════════
-- WORDPRESS
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'wordpress';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'WordPress I',59,'Para blogs e sites WordPress de qualquer porte.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','20 GB NVMe','Armazenamento NVMe otimizado para WordPress.',0),
(pl_id,'Sites WP','1 WP','Instalações WordPress com configuração otimizada.',1),
(pl_id,'E-mails','10 contas','Contas @seudomínio com webmail e anti-spam.',2),
(pl_id,'Tráfego','Ilimitado','Tráfego mensal sem limite de transferência.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','Painel de controle completo com instalador WordPress 1-click.',0),
(pl_id,'LiteSpeed + LSCache','Cache específico para WordPress que acelera páginas sem configuração adicional.',1),
(pl_id,'Redis Cache','Armazenamento em memória para queries de banco de dados ultrarrápidas.',2),
(pl_id,'WordPress pré-instalado','WordPress já configurado e pronto para uso no momento da ativação.',3),
(pl_id,'SSL grátis automático','Certificado HTTPS automático com redirecionamento forçado configurado.',4),
(pl_id,'E-mails profissionais','Crie contas @seudomínio.com com webmail e filtro anti-spam.',5),
(pl_id,'Anti-spam + Antivírus','Proteção dupla contra spam em e-mails e malware em arquivos.',6),
(pl_id,'Backup diário','Backups automáticos diários com retenção de 7 dias.',7),
(pl_id,'Elementor PRO incluso','Licença original Elementor Pro inclusa gratuitamente. Construtor visual drag & drop com 90+ widgets premium.',8),
(pl_id,'Suporte 24/7','Equipe com conhecimento especializado em WordPress disponível a qualquer hora.',9);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'WordPress II',99,'Para lojas WooCommerce e sites corporativos.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','50 GB NVMe','Armazenamento NVMe otimizado para WordPress.',0),
(pl_id,'Sites WP','3 WP','Instalações WordPress com configuração otimizada.',1),
(pl_id,'E-mails','30 contas','Contas @seudomínio com webmail e anti-spam.',2),
(pl_id,'Tráfego','Ilimitado','Tráfego mensal sem limite de transferência.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','Gerencie múltiplos sites WordPress em uma única interface.',0),
(pl_id,'LiteSpeed + LSCache avançado','Cache avançado com suporte a ESI para WooCommerce.',1),
(pl_id,'Redis + Memcached','Duas camadas de cache para performance superior em lojas e sites corporativos.',2),
(pl_id,'WordPress pré-instalado','Instalação limpa com configurações otimizadas para performance.',3),
(pl_id,'SSL grátis automático','HTTPS em todos os domínios com suporte a wildcard subdomínios.',4),
(pl_id,'E-mails profissionais','Até 30 contas @seudomínio com proteção anti-spam avançada.',5),
(pl_id,'Anti-spam + Antivírus','Imunify360 com WAF integrado para proteção WordPress específica.',6),
(pl_id,'Backup diário','Retenção de 14 dias com opção de download para backup local.',7),
(pl_id,'PHP 8.x + Python','Suporte a Python para scripts de automação e integrações.',8),
(pl_id,'SSH access','Acesso SSH para usar WP-CLI, Git e ferramentas de desenvolvimento.',9),
(pl_id,'Elementor PRO incluso','Licença Elementor Pro original inclusa. Construtor avançado com WooCommerce Builder e Popup Builder.',10),
(pl_id,'Suporte prioritário 24/7','Fila prioritária com suporte especializado em WordPress e WooCommerce.',11);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'WordPress III',169,'Para múltiplos projetos WordPress em alta escala.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','120 GB NVMe','Armazenamento NVMe otimizado para WordPress.',0),
(pl_id,'Sites WP','Ilimitados','Instalações WordPress com configuração otimizada.',1),
(pl_id,'E-mails','Ilimitadas','Contas @seudomínio com webmail e anti-spam.',2),
(pl_id,'Tráfego','Ilimitado','Tráfego mensal sem limite de transferência.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel incluso','Acesso completo com gerenciamento avançado de domínios e usuários.',0),
(pl_id,'LiteSpeed + LSCache premium','LSCache premium com otimização automática de imagens e lazy load.',1),
(pl_id,'Redis + Memcached + OPcache','Tripla camada de cache para sites de alto tráfego sem degradação.',2),
(pl_id,'WordPress pré-instalado','Instalação otimizada com plugins de segurança e performance pré-configurados.',3),
(pl_id,'SSL grátis automático','Wildcards e certificados para todos os domínios e subdomínios.',4),
(pl_id,'E-mails ilimitados','Sem limite de contas com cotas personalizáveis por caixa.',5),
(pl_id,'Anti-spam + Antivírus','Proteção enterprise com relatórios semanais de ameaças.',6),
(pl_id,'Backup diário + semanal','Backups diários (30 dias) e semanais (12 semanas) de retenção.',7),
(pl_id,'PHP 8.x + Python + NodeJS','Stack completo para integrações e automações avançadas.',8),
(pl_id,'SSH access + WP-CLI','WP-CLI pré-instalado para gestão de WordPress via linha de comando.',9),
(pl_id,'IP dedicado opcional','IP exclusivo para melhor reputação de e-mail e SPF/DKIM configurados.',10),
(pl_id,'Elementor PRO incluso','Elementor Pro com acesso a todos os recursos premium e atualizações automáticas.',11),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com engenheiro WordPress dedicado à sua conta.',12);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'WordPress IV',299,'Solução enterprise para agencies e operações críticas.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','250 GB NVMe','Armazenamento NVMe otimizado para WordPress.',0),
(pl_id,'Sites WP','Ilimitados','Instalações WordPress com configuração otimizada.',1),
(pl_id,'E-mails','Ilimitadas','Contas @seudomínio com webmail e anti-spam.',2),
(pl_id,'Tráfego','Ilimitado','Tráfego mensal sem limite de transferência.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel WHM incluso','WHM para criar e gerenciar múltiplas contas cPanel independentes.',0),
(pl_id,'LiteSpeed Enterprise + QUIC','LiteSpeed Enterprise com HTTP/3 e QUIC para latência mínima global.',1),
(pl_id,'Redis + Memcached + OPcache + Varnish','Quatro camadas de cache para escala empresarial sem limites de concorrência.',2),
(pl_id,'WordPress Multisite suportado','Suporte nativo ao WordPress Multisite para redes de sites.',3),
(pl_id,'SSL Wildcard + IP dedicado incluso','IP dedicado e certificado wildcard inclusos, sem custo adicional.',4),
(pl_id,'E-mails ilimitados + reputação gerenciada','Monitoramento ativo de reputação de envio com blacklist removals.',5),
(pl_id,'WAF + Imunify360 Enterprise','Web Application Firewall com regras específicas para WordPress e WooCommerce.',6),
(pl_id,'Backup diário + retenção 60 dias','60 dias de backups completos com restauração ponto-a-ponto.',7),
(pl_id,'PHP 8.x + Python + NodeJS + Ruby','Todos os runtimes modernos disponíveis com múltiplas versões.',8),
(pl_id,'SSH + WP-CLI + Git','Ambiente de desenvolvimento completo com Git para controle de versão.',9),
(pl_id,'Staging environment','Ambiente de staging isolado para testar atualizações antes de ir para produção.',10),
(pl_id,'Elementor PRO incluso (ilimitado)','Elementor Pro para todos os sites WordPress do plano, com acesso a todos os recursos Enterprise.',11),
(pl_id,'Suporte VIP + gerente de conta','Gerente de conta dedicado com revisões mensais de performance.',12);

-- ════════════════════════════════════════════════════════════
-- HOSPEDAGEM ASP.NET
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'hospedagem-aspnet';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ASP.NET Starter',79,'Para sites e aplicações .NET de pequeno porte.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'SSD/NVMe','20 GB SSD','Armazenamento de alta velocidade para arquivos da aplicação e banco de dados.',0),
(pl_id,'Domínios','1 domínio','Número de domínios que podem ser adicionados e gerenciados via Plesk.',1),
(pl_id,'SQL Server','1 DB SQL Server','Número máximo de bancos de dados SQL Server que podem ser criados.',2),
(pl_id,'RAM dedicada','512 MB','Memória RAM garantida para os processos da aplicação .NET e IIS.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian incluso','Painel de controle líder para ambientes Windows com interface moderna e recursos avançados.',0),
(pl_id,'ASP.NET 4.x + .NET 8 (Core)','Suporte ao .NET Framework legado e .NET 8 moderno em paralelo.',1),
(pl_id,'IIS (Internet Information Services)','Servidor web Microsoft oficial para aplicações ASP.NET e APIs REST.',2),
(pl_id,'SQL Server 2022 Express incluso','SQL Server Express com limite de 10 GB por banco — ideal para aplicações pequenas.',3),
(pl_id,'SSL grátis automático','Certificado Let''s Encrypt com renovação automática via Plesk.',4),
(pl_id,'Backup diário','Cópias automáticas diárias dos seus arquivos e banco de dados.',5),
(pl_id,'Suporte 24/7','Equipe com conhecimento em ambientes Windows e .NET.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ASP.NET Business',149,'Para sistemas corporativos e APIs em .NET.',false,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'SSD/NVMe','50 GB SSD','Armazenamento de alta velocidade para arquivos da aplicação e banco de dados.',0),
(pl_id,'Domínios','5 domínios','Número de domínios que podem ser adicionados e gerenciados via Plesk.',1),
(pl_id,'SQL Server','5 DB SQL Server','Número máximo de bancos de dados SQL Server que podem ser criados.',2),
(pl_id,'RAM dedicada','1 GB','Memória RAM garantida para os processos da aplicação .NET e IIS.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian incluso','Plesk com recursos avançados para múltiplos domínios e gestão de aplicações.',0),
(pl_id,'ASP.NET 4.x + .NET 8 (Core)','Suporte simultâneo às versões legacy e modernas do .NET.',1),
(pl_id,'IIS + ARR (Application Request Routing)','ARR permite load balancing e proxying de requisições para múltiplas aplicações.',2),
(pl_id,'SQL Server 2022 Standard','SQL Server Standard sem limitação de tamanho de banco por instância.',3),
(pl_id,'SSL grátis automático','Certificados para todos os domínios adicionados ao Plesk.',4),
(pl_id,'Backup diário + semanal','Retenção de 14 dias com backups diários e semanais automáticos.',5),
(pl_id,'SMTP relay configurado','Envio de e-mails transacionais com reputação gerenciada.',6),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com suporte especializado em .NET e SQL Server.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ASP.NET Pro',249,'Para aplicações de alto tráfego e ERP .NET.',true,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'SSD/NVMe','100 GB NVMe','Armazenamento de alta velocidade para arquivos da aplicação e banco de dados.',0),
(pl_id,'Domínios','20 domínios','Número de domínios que podem ser adicionados e gerenciados via Plesk.',1),
(pl_id,'SQL Server','Ilimitados','Número máximo de bancos de dados SQL Server que podem ser criados.',2),
(pl_id,'RAM dedicada','2 GB','Memória RAM garantida para os processos da aplicação .NET e IIS.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian incluso','Plesk Enterprise com monitoramento avançado e alertas de performance.',0),
(pl_id,'ASP.NET 4.x + .NET 8 + .NET 6','Todas as versões LTS do .NET disponíveis simultaneamente.',1),
(pl_id,'IIS + ARR + WebSockets','Suporte a WebSockets para aplicações real-time (SignalR, etc.).',2),
(pl_id,'SQL Server 2022 Standard (sem limite)','Bancos ilimitados sem restrição de tamanho.',3),
(pl_id,'SSL grátis + wildcard opcional','SSL automático com opção de wildcard para todos os subdomínios.',4),
(pl_id,'Backup diário + semanal + mensal','Histórico de 30 dias com múltiplas frequências de backup.',5),
(pl_id,'SSH + Remote Desktop opcional','Acesso SSH e opção de Remote Desktop para administração avançada.',6),
(pl_id,'SMTP relay + antispam','Envio de e-mails com proteção antispam e relatórios de entregabilidade.',7),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com engenheiros especializados em Windows Server e .NET.',8);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ASP.NET Enterprise',449,'Para grandes sistemas, integrações e alta disponibilidade.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'SSD/NVMe','250 GB NVMe','Armazenamento de alta velocidade para arquivos da aplicação e banco de dados.',0),
(pl_id,'Domínios','Ilimitados','Número de domínios que podem ser adicionados e gerenciados via Plesk.',1),
(pl_id,'SQL Server','Ilimitados','Número máximo de bancos de dados SQL Server que podem ser criados.',2),
(pl_id,'RAM dedicada','4 GB','Memória RAM garantida para os processos da aplicação .NET e IIS.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian Enterprise','Todos os módulos Plesk premium ativados com licença Enterprise completa.',0),
(pl_id,'ASP.NET + .NET 8 + Framework 4.x','Stack .NET completo com suporte a todas as versões modernas e legadas.',1),
(pl_id,'IIS + ARR + WebSockets + SignalR','Suporte completo a aplicações real-time e APIs de alta performance.',2),
(pl_id,'SQL Server 2022 Enterprise features','Recursos enterprise como Always-On, Partitioning e Advanced Analytics.',3),
(pl_id,'SSL Wildcard incluso','Certificado wildcard para o domínio principal e todos os subdomínios.',4),
(pl_id,'Backup diário + retenção 60 dias','60 dias de histórico de backups com restauração granular.',5),
(pl_id,'Remote Desktop + PowerShell remoto','Acesso completo via RDP e PowerShell remoto para administração total.',6),
(pl_id,'IP dedicado incluso','IP exclusivo para reputação de e-mail e configurações de firewall.',7),
(pl_id,'SLA 99,99% + gerente de conta','SLA enterprise com gerente de conta dedicado e suporte de 30 minutos.',8);

-- ════════════════════════════════════════════════════════════
-- REVENDA CPANEL
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-cpanel';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda Starter',99,'Para quem está começando a revender hospedagem.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','50 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','25 contas','Número máximo de contas cPanel que podem ser criadas para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel/WHM inclusos','Cada cliente tem seu próprio cPanel; você gerencia tudo via WHM.',0),
(pl_id,'White-label completo','Configure sua própria marca e nameservers — seus clientes não saberão que usa a Hosteg.',1),
(pl_id,'SSL grátis para todos clientes','Let''s Encrypt automático para todos os domínios dos seus clientes.',2),
(pl_id,'Anti-spam + Antivírus','SpamAssassin e Imunify360 ativos em todas as contas da sua revenda.',3),
(pl_id,'LiteSpeed Web Server','Sites dos seus clientes carregam mais rápido com LiteSpeed no lugar do Apache.',4),
(pl_id,'Backup diário','Backups automáticos com retenção de 7 dias para todas as contas.',5),
(pl_id,'Suporte 24/7','Nossa equipe atende você (revendedor) — você atende seus clientes.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda Business',189,'Ideal para agências digitais em crescimento.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','100 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','60 contas','Número máximo de contas cPanel que podem ser criadas para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel/WHM inclusos','WHM com recursos avançados de gerenciamento de contas e limites de recursos.',0),
(pl_id,'White-label completo','Nameservers próprios configurados e branding 100% sua empresa.',1),
(pl_id,'SSL grátis para todos clientes','Emissão e renovação automática para todos os domínios dos clientes.',2),
(pl_id,'Anti-spam + Antivírus','Imunify360 + SpamAssassin com relatórios por conta de cliente.',3),
(pl_id,'LiteSpeed + Redis Cache','Redis Cache por conta para melhor performance em sites WordPress e PHP.',4),
(pl_id,'Backup diário + semanal','Retenção de 14 dias com backups diários e semanais automáticos.',5),
(pl_id,'IP dedicado disponível','Adicione um IP dedicado para clientes que precisam de certificados SSL próprios.',6),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com tempo de resposta reduzido.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda Pro',329,'Para revendedores com alta demanda e múltiplos clientes.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','250 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','Ilimitadas','Número máximo de contas cPanel que podem ser criadas para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel/WHM inclusos','Acesso completo ao WHM com gerenciamento avançado de quotas e recursos.',0),
(pl_id,'White-label completo','Branding 100% personalizado com nameservers e painel de cliente com sua marca.',1),
(pl_id,'SSL grátis para todos clientes','Wildcard e Let''s Encrypt para todos os domínios e subdomínios.',2),
(pl_id,'Anti-spam + Antivírus','Proteção enterprise com WAF e relatórios mensais de ameaças.',3),
(pl_id,'LiteSpeed + Redis + OPcache','Tripla camada de cache para máxima performance dos clientes.',4),
(pl_id,'Backup diário + semanal + mensal','Histórico de 30 dias de backups com três frequências diferentes.',5),
(pl_id,'IP dedicado opcional','IP dedicado adicional disponível para contas que necessitem.',6),
(pl_id,'DNS privado (nameservers próprios)','ns1.seudominio.com e ns2.seudominio.com configurados e gerenciados.',7),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com prioridade máxima de atendimento.',8);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda Enterprise',549,'Infraestrutura completa para grandes revendedores.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','500 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','Ilimitadas','Número máximo de contas cPanel que podem ser criadas para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'cPanel/WHM inclusos','WHM Enterprise com recursos avançados de monitoramento e gestão de recursos.',0),
(pl_id,'White-label completo','Solução 100% brandada com todos os pontos de contato com sua marca.',1),
(pl_id,'SSL grátis para todos clientes','Todos os certificados gerenciados automaticamente sem intervenção.',2),
(pl_id,'Anti-spam + Antivírus','Imunify360 Enterprise com EDR e relatórios detalhados de conformidade.',3),
(pl_id,'LiteSpeed + Redis + OPcache + Memcached','Quatro camadas de cache para performance extrema em qualquer aplicação.',4),
(pl_id,'Backup completo redundante','Backup redundante em dois datacenters com retenção de 60 dias.',5),
(pl_id,'IP dedicado incluso','IP dedicado incluído no plano sem custo adicional.',6),
(pl_id,'DNS privado configurado','Nameservers próprios configurados e gerenciados pela equipe Hosteg.',7),
(pl_id,'Gerente de conta dedicado','Profissional alocado para sua revenda com revisões mensais de performance.',8),
(pl_id,'Suporte VIP 24/7','SLA garantido com resposta em até 1 hora para incidentes críticos.',9);

-- ════════════════════════════════════════════════════════════
-- REVENDA DIRECTADMIN
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-directadmin';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda DA Starter',79,'Comece sua revenda com DirectAdmin sem custo alto.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','50 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','25 contas','Número máximo de contas DirectAdmin para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','Painel de controle leve e rápido, compatível com todas as funcionalidades essenciais de hospedagem.',0),
(pl_id,'White-label completo','Configure sua própria marca e nameservers — seus clientes não saberão que usa a Hosteg.',1),
(pl_id,'SSL grátis para todos clientes','Let''s Encrypt automático para todos os domínios dos seus clientes.',2),
(pl_id,'Anti-spam + Antivírus','SpamAssassin e Imunify360 ativos em todas as contas da sua revenda.',3),
(pl_id,'LiteSpeed Web Server','Performance superior com LiteSpeed em vez de Apache.',4),
(pl_id,'Backup diário','Backups automáticos com retenção de 7 dias para todas as contas.',5),
(pl_id,'Suporte 24/7','Nossa equipe atende você (revendedor) — você atende seus clientes.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda DA Business',159,'Ideal para agências e revendedores em crescimento.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','100 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','60 contas','Número máximo de contas DirectAdmin para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','DirectAdmin com recursos completos de gestão de contas e limites individuais por cliente.',0),
(pl_id,'White-label completo','Nameservers próprios e branding 100% da sua empresa.',1),
(pl_id,'SSL grátis para todos clientes','Emissão e renovação automática para todos os domínios.',2),
(pl_id,'Anti-spam + Antivírus','Imunify360 + SpamAssassin com relatórios por conta de cliente.',3),
(pl_id,'LiteSpeed + Redis Cache','Redis Cache adicional para performance superior em sites WordPress.',4),
(pl_id,'Backup diário + semanal','Retenção de 14 dias com backups diários e semanais automáticos.',5),
(pl_id,'IP dedicado disponível','Adicione IP dedicado para clientes que necessitem.',6),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com tempo de resposta reduzido.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda DA Pro',279,'Para revendedores com muitos clientes e alta demanda.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','250 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','Ilimitadas','Número máximo de contas DirectAdmin para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','DirectAdmin completo com gerenciamento avançado de quotas e recursos por conta.',0),
(pl_id,'White-label completo','Branding total com nameservers e painel com sua identidade.',1),
(pl_id,'SSL grátis para todos clientes','Wildcards e Let''s Encrypt para todos os domínios e subdomínios.',2),
(pl_id,'Anti-spam + Antivírus','Proteção enterprise com WAF e relatórios mensais.',3),
(pl_id,'LiteSpeed + Redis + OPcache','Tripla camada de cache para máxima performance de todos os clientes.',4),
(pl_id,'Backup diário + semanal + mensal','Histórico de 30 dias com três frequências de backup.',5),
(pl_id,'IP dedicado opcional','IP dedicado adicional disponível para contas que necessitem.',6),
(pl_id,'DNS privado configurado','ns1.seudominio.com e ns2.seudominio.com configurados pela equipe Hosteg.',7),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com prioridade máxima de atendimento.',8);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda DA Enterprise',479,'Infraestrutura robusta para operações de grande escala.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','500 GB NVMe','Armazenamento total NVMe compartilhado entre as contas.',0),
(pl_id,'Contas','Ilimitadas','Número máximo de contas DirectAdmin para seus clientes.',1),
(pl_id,'Tráfego','Ilimitado','Transferência de dados mensal sem limite.',2),
(pl_id,'E-mails','Ilimitados','E-mails ilimitados distribuídos entre as contas dos clientes.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'DirectAdmin incluso','DirectAdmin Enterprise com módulos avançados de monitoramento e gestão.',0),
(pl_id,'White-label completo','Solução 100% brandada com todos os pontos de contato com sua marca.',1),
(pl_id,'SSL grátis para todos clientes','Todos os certificados gerenciados automaticamente sem intervenção.',2),
(pl_id,'Anti-spam + Antivírus','Imunify360 Enterprise com EDR e relatórios de conformidade.',3),
(pl_id,'LiteSpeed + Redis + OPcache + Memcached','Quatro camadas de cache para performance extrema.',4),
(pl_id,'Backup redundante completo','Backup redundante em dois datacenters com retenção de 60 dias.',5),
(pl_id,'IP dedicado incluso','IP dedicado incluído no plano sem custo adicional.',6),
(pl_id,'DNS privado configurado','Nameservers próprios configurados e gerenciados pela equipe Hosteg.',7),
(pl_id,'Gerente de conta dedicado','Profissional alocado para sua revenda com revisões mensais de performance.',8),
(pl_id,'Suporte VIP 24/7','SLA garantido com resposta em até 1 hora para incidentes críticos.',9);

-- ════════════════════════════════════════════════════════════
-- REVENDA ASPNET
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'revenda-aspnet';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda ASP.NET Starter',129,'Para agências que estão entrando no mercado Windows.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','50 GB NVMe','Armazenamento total NVMe compartilhado entre as contas da sua revenda.',0),
(pl_id,'Contas','10 contas','Número máximo de contas Windows/Plesk que podem ser criadas para seus clientes.',1),
(pl_id,'SQL Server','2 DBs/conta','Quantidade de bancos de dados SQL Server disponíveis por conta de cliente.',2),
(pl_id,'RAM/conta','256 MB/conta','Memória RAM garantida para os processos .NET e IIS de cada conta de cliente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian Reseller','Painel Plesk com visão de revendedor — gerencie todas as contas dos seus clientes em um único lugar.',0),
(pl_id,'White-label completo','Configure sua própria marca, nameservers e domínio de painel — seus clientes não verão a Hosteg.',1),
(pl_id,'ASP.NET 4.x + .NET 8 por conta','Cada conta de cliente tem suporte completo ao .NET Framework e .NET 8 Core.',2),
(pl_id,'SQL Server 2022 Express incluso','SQL Server Express com até 10 GB por banco — ideal para aplicações pequenas de clientes.',3),
(pl_id,'SSL grátis para todos os clientes','Let''s Encrypt automático via Plesk para todos os domínios das contas dos seus clientes.',4),
(pl_id,'Backup diário','Backups automáticos diários de todas as contas com retenção de 7 dias.',5),
(pl_id,'Suporte 24/7','Nossa equipe cuida da infraestrutura Windows. Você foca em vender e atender seus clientes.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda ASP.NET Business',249,'Ideal para agências digitais com clientes .NET ativos.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','150 GB NVMe','Armazenamento total NVMe compartilhado entre as contas da sua revenda.',0),
(pl_id,'Contas','30 contas','Número máximo de contas Windows/Plesk que podem ser criadas para seus clientes.',1),
(pl_id,'SQL Server','5 DBs/conta','Quantidade de bancos de dados SQL Server disponíveis por conta de cliente.',2),
(pl_id,'RAM/conta','512 MB/conta','Memória RAM garantida para os processos .NET e IIS de cada conta de cliente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian Reseller','Visão unificada de todas as contas com gerenciamento de quotas e recursos por cliente.',0),
(pl_id,'White-label completo','Nameservers próprios configurados + branding 100% da sua empresa em todos os pontos de contato.',1),
(pl_id,'ASP.NET 4.x + .NET 8 + .NET 6','Suporte a múltiplas versões LTS do .NET por conta de cliente.',2),
(pl_id,'SQL Server 2022 Standard','SQL Server Standard por conta, sem limitação de tamanho.',3),
(pl_id,'SSL grátis para todos os clientes','Emissão e renovação automática de certificados para todos os domínios de todos os clientes.',4),
(pl_id,'IIS + ARR por conta','Application Request Routing habilitado por conta para load balancing e proxying avançado.',5),
(pl_id,'Backup diário + semanal','Retenção de 14 dias com backups automáticos em duas frequências.',6),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com suporte especializado em ambientes Windows e Plesk.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda ASP.NET Pro',449,'Para revendedores com alto volume de clientes .NET.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','400 GB NVMe','Armazenamento total NVMe compartilhado entre as contas da sua revenda.',0),
(pl_id,'Contas','80 contas','Número máximo de contas Windows/Plesk que podem ser criadas para seus clientes.',1),
(pl_id,'SQL Server','Ilimitados/conta','Quantidade de bancos de dados SQL Server disponíveis por conta de cliente.',2),
(pl_id,'RAM/conta','1 GB/conta','Memória RAM garantida para os processos .NET e IIS de cada conta de cliente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian Reseller Pro','Acesso avançado com relatórios de performance, alertas e automações via API do Plesk.',0),
(pl_id,'White-label completo','Solução 100% brandada — do painel ao e-mail de boas-vindas do cliente.',1),
(pl_id,'ASP.NET + .NET 8 + Framework completo','Todas as versões do .NET disponíveis por conta de cliente.',2),
(pl_id,'SQL Server 2022 Standard (ilimitado)','Bancos de dados ilimitados por conta sem restrição de tamanho.',3),
(pl_id,'SSL grátis + wildcard por conta','Let''s Encrypt + opção de wildcard para subdomínios de cada cliente.',4),
(pl_id,'IIS + ARR + WebSockets','Suporte a WebSockets para aplicações real-time (SignalR) nas contas dos clientes.',5),
(pl_id,'Backup diário + semanal + mensal','Histórico de 30 dias com múltiplas frequências automáticas.',6),
(pl_id,'DNS privado (nameservers próprios)','ns1.seudominio.com.br e ns2.seudominio.com.br configurados e gerenciados.',7),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com prioridade máxima e especialistas em Windows Server e Plesk.',8);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Revenda ASP.NET Enterprise',749,'Infraestrutura Windows completa para grandes revendedores.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'NVMe','1 TB NVMe','Armazenamento total NVMe compartilhado entre as contas da sua revenda.',0),
(pl_id,'Contas','Ilimitadas','Número máximo de contas Windows/Plesk que podem ser criadas para seus clientes.',1),
(pl_id,'SQL Server','Ilimitados/conta','Quantidade de bancos de dados SQL Server disponíveis por conta de cliente.',2),
(pl_id,'RAM/conta','2 GB/conta','Memória RAM garantida para os processos .NET e IIS de cada conta de cliente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Plesk Obsidian Enterprise','Todos os módulos Plesk premium ativados com licença Enterprise completa.',0),
(pl_id,'White-label completo + API','Acesso à API do Plesk para automação total — integre com WHMCS ou sistema próprio.',1),
(pl_id,'Stack .NET completo por conta','.NET 8, .NET 6, Framework 4.x e todas as versões LTS disponíveis por cliente.',2),
(pl_id,'SQL Server 2022 Enterprise features','Recursos Enterprise como Always-On, Partitioning e Advanced Analytics por conta.',3),
(pl_id,'SSL Wildcard incluso por conta','Certificado wildcard para o domínio principal e todos os subdomínios de cada cliente.',4),
(pl_id,'IIS + ARR + WebSockets + SignalR','Stack IIS completo para aplicações de alta performance e real-time.',5),
(pl_id,'Backup completo + retenção 60 dias','60 dias de histórico de backups redundantes com restauração granular por conta.',6),
(pl_id,'IP dedicado por conta (opcional)','Solicite IPs dedicados adicionais para contas que necessitem de certificados SSL próprios.',7),
(pl_id,'Gerente de conta dedicado','Profissional alocado para sua revenda com revisões mensais de performance e crescimento.',8),
(pl_id,'SLA 99,99% + suporte VIP 24/7','SLA enterprise com resposta em até 30 minutos para incidentes críticos.',9);

-- ════════════════════════════════════════════════════════════
-- CLOUD VPS
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'cloud-vps';

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Starter',39,'Ideal para projetos pessoais, testes e aplicações leves.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','2 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','40 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','2 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Basic',69,'Perfeito para sites, blogs, e-mail e pequenas APIs.',false,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','4 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','80 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','4 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Comfort',99,'Para quem precisa de mais RAM sem pagar muito.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','6 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','3 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','120 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','5 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Standard',119,'Melhor custo-benefício. Ideal para e-commerce e SaaS.',true,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','8 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','160 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','6 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Pro',169,'Para aplicações que precisam de RAM abundante.',false,4) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','12 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','240 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','8 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Business',219,'Ambientes de produção, bancos de dados e backends.',false,5) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','16 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','6 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','320 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','10 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Pro+',319,'Para workloads intensivos com múltiplos serviços.',false,6) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','24 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','8 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','480 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','12 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Ultra',419,'Alta performance para grandes aplicações e dados.',false,7) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','32 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','8 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','640 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','15 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Elite',589,'Para clusters, big data e cargas computacionais pesadas.',false,8) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','48 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','12 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','960 GB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','20 TB','Cota de tráfego mensal na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'VPS Titan',779,'O topo da linha VPS — máxima performance cloud.',false,9) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','64 GB','Memória RAM DDR4 ECC dedicada — não compartilhada com outros servidores.',0),
(pl_id,'vCPU','16 vCPU','Núcleos de CPU virtual garantidos via KVM.',1),
(pl_id,'NVMe','1.28 TB','Disco NVMe Gen4 — até 7.000 MB/s de leitura sequencial.',2),
(pl_id,'Tráfego','Ilimitado','Tráfego ilimitado na porta 10 Gbps.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'IPv4 + IPv6 dedicados','Endereços IP exclusivos do seu VPS, não compartilhados com outros clientes.',0),
(pl_id,'Anti-DDoS incluso','Proteção automática contra ataques de até 1 Tbps sem custo extra.',1),
(pl_id,'Acesso root total','Controle completo do servidor para instalar qualquer software.',2),
(pl_id,'Deploy < 60 segundos','VPS ativo em menos de 1 minuto após confirmação do pagamento.',3);

END $$;

-- ============================================================
-- Cloud Apps
-- ============================================================
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

-- ============================================================
-- Contratos provisórios
-- ============================================================
INSERT INTO contracts (product_slug, product_name, title, content) VALUES
('hospedagem', 'Hospedagem Web', 'Contrato de Hospedagem Web', '<h2>Contrato de Prestação de Serviços de Hospedagem Web</h2><p>Este contrato estabelece os termos e condições para a prestação de serviços de hospedagem web pela <strong>Hosteg Soluções em Tecnologia Ltda.</strong> (doravante "CONTRATADA") ao cliente (doravante "CONTRATANTE").</p><h3>1. Objeto do Contrato</h3><p>A CONTRATADA se compromete a fornecer serviços de hospedagem web conforme o plano contratado, incluindo espaço em disco SSD, contas de e-mail, certificado SSL e suporte técnico 24/7.</p><h3>2. Vigência</h3><p>O contrato é válido pelo período contratado (mensal, trimestral, semestral, anual ou bianual), renovando-se automaticamente ao final de cada período, salvo aviso prévio de cancelamento com 30 dias de antecedência.</p><h3>3. Obrigações da CONTRATADA</h3><p>Manter disponibilidade mínima de 99,9% (SLA), fornecer suporte técnico 24/7 em português, realizar backups diários automáticos e garantir a segurança da infraestrutura.</p><h3>4. Obrigações do CONTRATANTE</h3><p>Manter seus dados de pagamento atualizados, utilizar os serviços de acordo com a legislação vigente e não hospedar conteúdo ilegal, spam ou que viole direitos de terceiros.</p><h3>5. Cancelamento</h3><p>O cancelamento pode ser solicitado a qualquer momento via painel do cliente. Não há reembolso proporcional para planos mensais. Para planos anuais ou bianuals, será analisado caso a caso.</p><h3>6. Foro</h3><p>Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias oriundas deste contrato.</p>'),
('cloud-vps', 'Cloud VPS', 'Contrato de Serviços Cloud VPS', '<h2>Contrato de Prestação de Serviços de Cloud VPS</h2><p>Este contrato estabelece os termos e condições para a prestação de serviços de Cloud VPS pela <strong>Hosteg Soluções em Tecnologia Ltda.</strong></p><h3>1. Objeto</h3><p>Fornecimento de servidor virtual privado (VPS) com recursos dedicados de CPU, RAM e armazenamento NVMe, conforme plano contratado.</p><h3>2. Recursos Garantidos</h3><p>Os recursos de CPU (vCPU via KVM), RAM DDR4 ECC e armazenamento NVMe Gen4 são dedicados e garantidos — não compartilhados de forma que prejudique a performance do cliente.</p><h3>3. SLA</h3><p>Garantimos disponibilidade de 99,9% da infraestrutura. Em caso de indisponibilidade superior ao acordado, o cliente terá direito a crédito proporcional no próximo ciclo de cobrança.</p><h3>4. Uso Aceitável</h3><p>É proibido o uso do VPS para mineração de criptomoedas em larga escala, ataques DDoS, spam, phishing ou qualquer atividade ilegal. O descumprimento resultará em suspensão imediata sem reembolso.</p><h3>5. Cancelamento e Reembolso</h3><p>O serviço pode ser cancelado a qualquer momento. O cancelamento entra em vigor ao final do período vigente. Não há reembolso proporcional.</p>'),
('hospedagem-pro', 'Hospedagem PRO', 'Contrato de Hospedagem PRO', '<h2>Contrato de Hospedagem PRO (cPanel)</h2><p>Contrato de prestação de serviços de hospedagem profissional com cPanel pela Hosteg.</p><h3>1. Objeto</h3><p>Serviços de hospedagem avançada com painel cPanel/WHM, incluindo todos os recursos do plano contratado.</p><h3>2. Licença cPanel</h3><p>A licença cPanel está incluída no plano. Seu uso está sujeito aos termos da cPanel LLC. A transferência da licença para outros fins não é permitida.</p><h3>3. SLA e Disponibilidade</h3><p>Garantimos 99,9% de disponibilidade com monitoramento 24/7.</p><h3>4. Cancelamento</h3><p>O cancelamento pode ser solicitado via painel do cliente com 30 dias de antecedência. Para planos anuais, análise de reembolso proporcional disponível.</p>'),
('wordpress', 'WordPress', 'Contrato de Hospedagem WordPress', '<h2>Contrato de Hospedagem WordPress</h2><p>Contrato de prestação de serviços de hospedagem otimizada para WordPress pela Hosteg.</p><h3>1. Objeto</h3><p>Hospedagem especializada para WordPress com LiteSpeed, LSCache, Elementor Pro e otimizações específicas para a plataforma.</p><h3>2. Software Incluído</h3><p>O Elementor Pro incluso na conta tem licença para uso exclusivo na hospedagem Hosteg. A exportação da licença para outros ambientes não é permitida.</p><h3>3. Atualizações</h3><p>Recomendamos manter WordPress e plugins sempre atualizados. A Hosteg não se responsabiliza por vulnerabilidades decorrentes de software desatualizado.</p>'),
('revenda-cpanel', 'Revenda cPanel', 'Contrato de Revenda cPanel', '<h2>Contrato de Revenda de Hospedagem cPanel</h2><p>Contrato de prestação de serviços de hospedagem para revendedores via cPanel/WHM.</p><h3>1. Objeto</h3><p>Fornecimento de infraestrutura de revenda com cPanel/WHM, permitindo ao CONTRATANTE criar e gerenciar contas de hospedagem para seus próprios clientes.</p><h3>2. Responsabilidade</h3><p>O CONTRATANTE é inteiramente responsável pelos clientes cadastrados em sua revenda, incluindo o cumprimento das políticas de uso aceitável por parte de seus clientes.</p><h3>3. White-label</h3><p>O serviço de white-label permite ao CONTRATANTE apresentar os serviços sob sua própria marca, sem mencionar a Hosteg.</p>'),
('revenda-directadmin', 'Revenda DirectAdmin', 'Contrato de Revenda DirectAdmin', '<h2>Contrato de Revenda DirectAdmin</h2><p>Contrato para serviços de revenda com painel DirectAdmin.</p><h3>1. Objeto</h3><p>Fornecimento de infraestrutura de revenda com DirectAdmin, permitindo criação e gestão de contas de hospedagem para clientes do revendedor.</p><h3>2. Responsabilidade do Revendedor</h3><p>O revendedor é responsável por seus clientes e pelo cumprimento das políticas de uso aceitável.</p>'),
('database-cloud', 'Database Cloud', 'Contrato de Database Cloud', '<h2>Contrato de Database Cloud</h2><p>Contrato para serviços de banco de dados gerenciado na nuvem.</p><h3>1. Objeto</h3><p>Fornecimento de banco de dados gerenciado (MySQL, PostgreSQL, MongoDB ou SQL Server) em ambiente cloud dedicado.</p><h3>2. Backup e Disponibilidade</h3><p>Backup automático diário com retenção de 30 dias. SLA de 99,95% de disponibilidade.</p><h3>3. Acesso aos Dados</h3><p>O cliente tem acesso exclusivo ao seu banco de dados. A Hosteg não acessa dados do cliente, exceto para manutenção técnica com autorização prévia.</p>'),
('backup-pro', 'BackupPRO', 'Contrato de BackupPRO', '<h2>Contrato de Serviços BackupPRO</h2><p>Contrato para serviços de backup gerenciado.</p><h3>1. Objeto</h3><p>Fornecimento de solução de backup em nuvem com agente instalado nos servidores do cliente, garantindo cópias automáticas e restauração rápida.</p><h3>2. Retenção de Dados</h3><p>Os dados de backup são mantidos conforme o plano contratado (7, 15 ou 30 dias). Após o cancelamento, os dados são excluídos em até 30 dias.</p><h3>3. Restauração</h3><p>A restauração pode ser solicitada a qualquer momento via painel ou suporte. O tempo de restauração varia conforme o volume de dados.</p>')
ON CONFLICT (product_slug) DO NOTHING;

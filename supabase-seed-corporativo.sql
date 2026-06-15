-- ============================================================
-- HOSTEG — Seed de Planos Corporativos
-- Cole no SQL Editor do Supabase e execute APÓS supabase-fix-missing.sql
-- Seguro rodar mais de uma vez
-- ============================================================

DO $$
DECLARE
  pid   uuid;
  pl_id uuid;
BEGIN

-- ════════════════════════════════════════════════════════════
-- BACKUPPRO
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'backup-pro';

-- Limpar planos existentes
DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plan_specs     WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plans WHERE product_page_id = pid;

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'BackupPRO Starter',89,'Para proteção básica de servidores e workstations.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','100 GB','Espaço total de armazenamento em nuvem para seus backups.',0),
(pl_id,'Dispositivos','3 dispositivos','Número máximo de servidores, VMs ou workstations protegidos simultaneamente.',1),
(pl_id,'Retenção','30 dias','Por quanto tempo os backups ficam disponíveis para restauração.',2),
(pl_id,'Frequência','Diário','Com que frequência os backups são realizados automaticamente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Backup de servidores Linux e Windows','Agente instalado diretamente no servidor, compatível com todas as distros Linux e Windows Server 2016+.',0),
(pl_id,'Recuperação bare-metal','Restaure o sistema operacional completo em hardware diferente do original, sem reinstalação manual.',1),
(pl_id,'Compressão e deduplicação automática','Reduz até 70% do espaço utilizado eliminando dados duplicados e comprimindo blocos.',2),
(pl_id,'Criptografia AES-256 end-to-end','Dados criptografados no servidor antes do envio. Nem a Hosteg tem acesso às chaves.',3),
(pl_id,'Painel web centralizado','Gerencie agentes, agende tarefas e monitore status de todos os backups em um único painel.',4),
(pl_id,'Suporte 24/7','Equipe técnica especializada em backup e recuperação de dados disponível a qualquer hora.',5);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'BackupPRO Business',199,'Para empresas com múltiplos servidores e sistemas críticos.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','500 GB','Espaço total de armazenamento em nuvem para seus backups.',0),
(pl_id,'Dispositivos','10 dispositivos','Número máximo de servidores, VMs ou workstations protegidos simultaneamente.',1),
(pl_id,'Retenção','60 dias','Por quanto tempo os backups ficam disponíveis para restauração.',2),
(pl_id,'Frequência','Horário','Com que frequência os backups são realizados automaticamente.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Backup de servidores Linux e Windows','Suporte a todos os sistemas operacionais modernos com agente leve (< 50 MB).',0),
(pl_id,'Backup de VMs (VMware, Hyper-V)','Backup sem agente de máquinas virtuais VMware vSphere, ESXi e Microsoft Hyper-V.',1),
(pl_id,'Recuperação bare-metal','Restaure servidores físicos ou virtuais completos para hardware diferente.',2),
(pl_id,'Recuperação granular de arquivos','Restaure arquivos individuais de dentro de um backup completo sem precisar restaurar tudo.',3),
(pl_id,'Backup de bancos de dados (MySQL, MSSQL)','Backup consistente de bancos de dados sem downtime, usando snapshots a quente.',4),
(pl_id,'Criptografia AES-256 end-to-end','Chaves gerenciadas pelo cliente. Zero acesso pela Hosteg.',5),
(pl_id,'Alertas por e-mail e WhatsApp','Notificações imediatas em caso de falha de backup ou espaço crítico.',6),
(pl_id,'Suporte prioritário 24/7','SLA de resposta de 4 horas para incidentes críticos de recuperação.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'BackupPRO Pro',399,'Para infraestruturas maiores que precisam de backup contínuo.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','2 TB','Espaço total de armazenamento em nuvem para seus backups.',0),
(pl_id,'Dispositivos','25 dispositivos','Número máximo de servidores, VMs ou workstations protegidos simultaneamente.',1),
(pl_id,'Retenção','90 dias','Por quanto tempo os backups ficam disponíveis para restauração.',2),
(pl_id,'Frequência','Contínuo (CDC)','Change Data Capture — backup contínuo com RPO de segundos.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Tudo do Business','Inclui todos os recursos e limites do plano Business.',0),
(pl_id,'Backup contínuo CDC para DBs','Change Data Capture captura cada transação em tempo real — RPO de segundos para bancos críticos.',1),
(pl_id,'Backup Microsoft 365 e Google Workspace','Proteja e-mails, OneDrive, SharePoint, Gmail, Drive e calendários de todos os usuários.',2),
(pl_id,'Recuperação instantânea (RunVM)','Inicie uma VM diretamente do backup em segundos para continuar operando enquanto restaura.',3),
(pl_id,'Replicação para segundo datacenter','Cópia automática para datacenter secundário — proteção geográfica contra desastres.',4),
(pl_id,'Relatórios de conformidade','Relatórios prontos para auditoria LGPD, ISO 27001 e PCI-DSS com logs imutáveis.',5),
(pl_id,'Suporte VIP 24/7','SLA de resposta de 1 hora para qualquer incidente.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'BackupPRO Enterprise',799,'Para grandes empresas com requisitos de conformidade e DR.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Storage','5 TB','Espaço total de armazenamento em nuvem para seus backups.',0),
(pl_id,'Dispositivos','Ilimitados','Proteção para todos os dispositivos da empresa sem limite.',1),
(pl_id,'Retenção','365 dias','Histórico de 1 ano completo de backups disponíveis para restauração.',2),
(pl_id,'Frequência','Contínuo (CDC)','Change Data Capture com replicação geográfica em tempo real.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Tudo do Pro','Inclui todos os recursos e limites do plano Pro.',0),
(pl_id,'Disaster Recovery automatizado','Failover automático para nuvem em caso de desastre — RTO menor que 15 minutos.',1),
(pl_id,'Failover automático para VMs','VMs críticas reiniciam automaticamente no datacenter de DR sem intervenção manual.',2),
(pl_id,'Conformidade LGPD / ISO 27001','Relatórios e controles específicos para compliance com legislação brasileira.',3),
(pl_id,'Auditoria e logs imutáveis','Logs de acesso armazenados em storage WORM — impossível de deletar ou modificar.',4),
(pl_id,'SLA 99,99% para recovery','Garantia contratual de disponibilidade do sistema de backup.',5),
(pl_id,'Suporte VIP 24/7 + SLA 30 min','Resposta garantida em 30 minutos para incidentes P1.',6);

-- ════════════════════════════════════════════════════════════
-- HOSTEG ERP
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'hosteg-erp';

DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plan_specs     WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plans WHERE product_page_id = pid;

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ERP Starter',149,'Para pequenas empresas que precisam de controle financeiro e de vendas.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','3 usuários','Número de usuários simultâneos com acesso ao sistema.',0),
(pl_id,'Módulos','Financeiro + Vendas + Estoque','Módulos inclusos no plano.',1),
(pl_id,'Storage','5 GB','Espaço em disco para documentos, anexos e arquivos do ERP.',2),
(pl_id,'Suporte','E-mail','Canal de suporte disponível para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Módulo Financeiro (fluxo de caixa, contas)','Controle completo de contas a pagar e receber, fluxo de caixa e conciliação bancária.',0),
(pl_id,'Módulo de Vendas e Pedidos','Gestão de orçamentos, pedidos, clientes e pipeline de vendas.',1),
(pl_id,'Controle de Estoque','Entrada e saída de produtos, inventário e rastreabilidade.',2),
(pl_id,'Emissão de NF-e','Emissão de Nota Fiscal Eletrônica integrada diretamente no sistema.',3),
(pl_id,'Acesso via navegador 24/7','Acesse o ERP de qualquer lugar, sem precisar instalar nada.',4),
(pl_id,'App mobile (iOS e Android)','Aplicativo nativo para acesso ao ERP pelo celular.',5),
(pl_id,'Suporte via e-mail','Atendimento técnico por e-mail com resposta em até 24h.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ERP Business',299,'Para empresas em crescimento que precisam de gestão completa.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','10 usuários','Número de usuários simultâneos com acesso ao sistema.',0),
(pl_id,'Módulos','Todos os módulos principais','Acesso a todos os módulos essenciais do ERP.',1),
(pl_id,'Storage','20 GB','Espaço em disco para documentos, anexos e arquivos do ERP.',2),
(pl_id,'Suporte','Chat + E-mail','Canais de suporte disponíveis para este plano.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Todos os módulos do Starter','Inclui todos os recursos e módulos do plano Starter.',0),
(pl_id,'CRM completo','Gestão de relacionamento com cliente, funil de vendas e histórico de interações.',1),
(pl_id,'RH e Folha de Pagamento','Gestão de funcionários, férias, ponto eletrônico e folha de pagamento.',2),
(pl_id,'Compras e Fornecedores','Pedidos de compra, cotações e gestão de fornecedores.',3),
(pl_id,'Relatórios avançados e dashboards','Relatórios personalizados e dashboards interativos para tomada de decisão.',4),
(pl_id,'API para integrações externas','Conecte o ERP com outros sistemas via API REST.',5),
(pl_id,'Suporte chat + e-mail prioritário','Atendimento por chat em tempo real com prioridade de resposta.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ERP Pro',549,'Para empresas de médio porte com múltiplos departamentos.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','30 usuários','Número de usuários simultâneos com acesso ao sistema.',0),
(pl_id,'Módulos','Todos os módulos + BI','Acesso a todos os módulos incluindo Business Intelligence.',1),
(pl_id,'Storage','50 GB','Espaço em disco para documentos, anexos e arquivos do ERP.',2),
(pl_id,'Suporte','Phone + Chat + E-mail','Todos os canais de suporte disponíveis.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Todos os módulos do Business','Inclui todos os recursos e módulos do plano Business.',0),
(pl_id,'Business Intelligence integrado','Dashboards e relatórios avançados com análise de dados em tempo real.',1),
(pl_id,'Múltiplas filiais e unidades','Gerencie várias unidades ou filiais da empresa em um único sistema.',2),
(pl_id,'Gestão de projetos e tarefas','Controle de projetos, tarefas, timesheets e horas trabalhadas.',3),
(pl_id,'Importação/exportação de dados','Importe e exporte dados em Excel, CSV e outros formatos.',4),
(pl_id,'Treinamento de onboarding incluso','Sessões de treinamento com a equipe Hosteg para toda a empresa.',5),
(pl_id,'Suporte telefônico prioritário','Atendimento telefônico com fila prioritária.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'ERP Enterprise',999,'Para grandes empresas com necessidades específicas de customização.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','Ilimitados','Acesso para todos os usuários da empresa sem restrição.',0),
(pl_id,'Módulos','Customizável por demanda','Módulos selecionados e customizados conforme necessidade.',1),
(pl_id,'Storage','200 GB','Espaço em disco para documentos, anexos e arquivos do ERP.',2),
(pl_id,'Suporte','Gerente de conta dedicado','Profissional alocado exclusivamente para sua empresa.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Todos os módulos do Pro','Inclui todos os recursos e módulos do plano Pro.',0),
(pl_id,'Customizações sob demanda','Desenvolvimento de funcionalidades exclusivas para seu negócio.',1),
(pl_id,'Integração com sistemas legados','Conecte o ERP com sistemas ERP, contábeis ou bancários existentes.',2),
(pl_id,'Importação de dados históricos','Migração de dados históricos de outros sistemas com validação.',3),
(pl_id,'SLA com tempo de resposta garantido','Contrato de nível de serviço com penalidades em caso de descumprimento.',4),
(pl_id,'Treinamento para toda a equipe','Treinamento presencial ou remoto para todos os departamentos.',5),
(pl_id,'Gerente de conta dedicado','Profissional alocado para sua conta com reuniões mensais de acompanhamento.',6),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com prioridade máxima e engenheiros seniores.',7);

-- ════════════════════════════════════════════════════════════
-- TERMINAL SERVER
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'terminal-server';

DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plan_specs     WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plans WHERE product_page_id = pid;

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'TS Individual',189,'Para um único usuário que precisa de acesso remoto ao Windows.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','1 usuário','Número de usuários simultâneos com acesso ao ambiente Windows.',0),
(pl_id,'RAM','4 GB','Memória RAM dedicada para o servidor Windows.',1),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual dedicados.',2),
(pl_id,'Storage','60 GB SSD','Armazenamento para o sistema operacional e aplicações.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Windows Server 2022','Sistema operacional Windows Server 2022 com licença inclusa.',0),
(pl_id,'Acesso via navegador (HTML5)','Acesse o desktop Windows de qualquer navegador, sem instalar nada.',1),
(pl_id,'Acesso via RDP (Remote Desktop)','Conexão nativa via protocolo RDP para melhor performance.',2),
(pl_id,'Antivírus incluso','Solução de antivírus licenciada e atualizada automaticamente.',3),
(pl_id,'Backup diário','Backup automático diário do ambiente completo.',4),
(pl_id,'IP dedicado','Endereço IP exclusivo para acesso ao servidor.',5),
(pl_id,'Suporte 24/7','Suporte técnico em português disponível a qualquer hora.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'TS Team',349,'Para equipes pequenas que compartilham um ambiente Windows na nuvem.',true,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','5 usuários simultâneos','Número de usuários que podem acessar ao mesmo tempo.',0),
(pl_id,'RAM','8 GB','Memória RAM dedicada para o servidor Windows.',1),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual dedicados.',2),
(pl_id,'Storage','120 GB SSD','Armazenamento para o sistema operacional, aplicações e dados da equipe.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Windows Server 2022 com RDS','Remote Desktop Services para múltiplos usuários simultâneos.',0),
(pl_id,'Acesso via navegador (HTML5)','Cada usuário acessa de qualquer navegador com sessão individual.',1),
(pl_id,'Acesso via RDP (Remote Desktop)','Conexão nativa RDP com perfil de usuário isolado.',2),
(pl_id,'Perfis de usuário individuais','Cada usuário tem seu perfil, desktop e configurações separados.',3),
(pl_id,'Antivírus incluso','Solução de antivírus licenciada para todos os usuários.',4),
(pl_id,'Backup diário','Backup automático diário do ambiente e dados de todos os usuários.',5),
(pl_id,'Instalação de software sob demanda','Solicite a instalação de qualquer software compatível com Windows Server.',6),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com SLA de resposta mais rápido.',7);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'TS Business',649,'Para empresas com time médio que usa sistemas Windows críticos.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','15 usuários simultâneos','Número de usuários que podem acessar ao mesmo tempo.',0),
(pl_id,'RAM','16 GB','Memória RAM dedicada para o servidor Windows.',1),
(pl_id,'vCPU','6 vCPU','Núcleos de CPU virtual dedicados.',2),
(pl_id,'Storage','250 GB NVMe','Armazenamento NVMe de alta velocidade para performance máxima.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Windows Server 2022 com RDS','Ambiente corporativo com RDS completo para múltiplas sessões.',0),
(pl_id,'Active Directory incluso','Gerenciamento centralizado de usuários, grupos e políticas de segurança.',1),
(pl_id,'Antivírus + EDR incluso','Proteção avançada com Endpoint Detection and Response.',2),
(pl_id,'Backup diário + semanal','Duas frequências de backup para máxima proteção dos dados.',3),
(pl_id,'Domínio corporativo Windows','Ambiente Windows integrado com domínio corporativo da empresa.',4),
(pl_id,'Perfis de usuário individuais','Cada usuário tem ambiente isolado com configurações e dados próprios.',5),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com prioridade máxima de atendimento.',6);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'TS Enterprise',1199,'Para grandes equipes com alta demanda de performance e segurança.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'Usuários','Usuários ilimitados','Acesso para todos os colaboradores da empresa.',0),
(pl_id,'RAM','32 GB','Memória RAM de alta capacidade para suportar muitos usuários simultâneos.',1),
(pl_id,'vCPU','12 vCPU','Alto número de núcleos para performance em cargas intensas.',2),
(pl_id,'Storage','500 GB NVMe','Grande capacidade NVMe para empresas com volume alto de dados.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'Tudo do Business','Inclui todos os recursos e configurações do plano Business.',0),
(pl_id,'Alta disponibilidade (HA)','Redundância automática — failover instantâneo em caso de falha.',1),
(pl_id,'Load balancing entre servidores','Distribuição de carga entre múltiplos servidores para performance máxima.',2),
(pl_id,'Disaster Recovery configurado','Ambiente de DR pronto para uso em caso de falha catastrófica.',3),
(pl_id,'VPN site-to-site inclusa','Conexão segura entre o Terminal Server e a rede interna da empresa.',4),
(pl_id,'Conformidade LGPD','Controles de acesso e logs de auditoria para conformidade com a LGPD.',5),
(pl_id,'Gerente de conta dedicado','Profissional alocado para sua conta com revisões mensais.',6),
(pl_id,'Suporte VIP 24/7','SLA de resposta em até 30 minutos para incidentes críticos.',7);

-- ════════════════════════════════════════════════════════════
-- DATABASE CLOUD
-- (16 planos: 4 por banco de dados — MySQL, PostgreSQL, MongoDB, SQL Server)
-- ════════════════════════════════════════════════════════════
SELECT id INTO pid FROM product_pages WHERE slug = 'database-cloud';

DELETE FROM plan_features WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plan_specs     WHERE plan_id IN (SELECT id FROM plans WHERE product_page_id = pid);
DELETE FROM plans WHERE product_page_id = pid;

-- MySQL
INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'MySQL Starter',49,'Banco MySQL gerenciado para aplicações web e sistemas leves.',false,0) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','1 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','1 vCPU','Núcleo de CPU virtual dedicado.',1),
(pl_id,'Storage','20 GB SSD','Armazenamento SSD para os dados e logs do banco.',2),
(pl_id,'Conexões','100','Número máximo de conexões simultâneas ao banco de dados.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MySQL 8.x gerenciado','Versão mais recente do MySQL com configurações otimizadas.',0),
(pl_id,'Backup diário automático','Cópias de segurança diárias com retenção de 7 dias.',1),
(pl_id,'IP dedicado com SSL/TLS','Conexão segura via IP exclusivo com certificado SSL.',2),
(pl_id,'Monitoramento 24/7','Alertas proativos de performance e disponibilidade.',3),
(pl_id,'Suporte 24/7','Equipe especializada em banco de dados disponível a qualquer hora.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'MySQL Business',99,'MySQL com mais recursos para aplicações em produção.',false,1) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','2 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','50 GB NVMe','Armazenamento NVMe para alta velocidade de leitura/escrita.',2),
(pl_id,'Conexões','300','Número máximo de conexões simultâneas ao banco de dados.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MySQL 8.x gerenciado','Versão mais recente com configurações para ambientes de produção.',0),
(pl_id,'Backup diário automático','Retenção de 14 dias com restauração com 1 clique.',1),
(pl_id,'IP dedicado com SSL/TLS','Conexão segura com firewall configurado por padrão.',2),
(pl_id,'Slow query log e análise','Identificação automática de queries lentas com sugestões de otimização.',3),
(pl_id,'Suporte prioritário 24/7','Fila de atendimento prioritária com especialistas em MySQL.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'MySQL Pro',189,'Alta performance MySQL para e-commerce e SaaS.',false,2) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','4 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','100 GB NVMe','Armazenamento NVMe Gen4 para máxima performance.',2),
(pl_id,'Conexões','1.000','Número máximo de conexões simultâneas ao banco de dados.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MySQL 8.x gerenciado','Configurado para alta performance com buffer pool otimizado.',0),
(pl_id,'Backup diário + semanal','Retenção de 30 dias com múltiplas janelas de restauração.',1),
(pl_id,'Réplica de leitura disponível','Add-on de read replica para distribuir consultas e aumentar performance.',2),
(pl_id,'Análise de performance avançada','Dashboard com métricas detalhadas e recomendações automáticas.',3),
(pl_id,'Suporte VIP 24/7','Canal exclusivo com DBA especialista disponível a qualquer hora.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'MySQL Enterprise',349,'MySQL Enterprise para cargas críticas e alta disponibilidade.',false,3) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','8 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','8 vCPU','Alto número de núcleos para consultas paralelas intensas.',1),
(pl_id,'Storage','250 GB NVMe','Grande capacidade NVMe para datasets volumosos.',2),
(pl_id,'Conexões','Ilimitadas','Sem limite de conexões simultâneas com pool gerenciado.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MySQL 8.x com HA','Alta disponibilidade com failover automático configurado.',0),
(pl_id,'Backup horário automático','Snapshots a cada hora com retenção de 60 dias.',1),
(pl_id,'Réplica de leitura inclusa','Read replica configurada sem custo adicional.',2),
(pl_id,'DBA dedicado','Administrador de banco de dados alocado para sua conta.',3),
(pl_id,'SLA 99,95% garantido','Disponibilidade contratual com créditos automáticos.',4);

-- PostgreSQL
INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PG Starter',59,'PostgreSQL gerenciado para aplicações que precisam de robustez.',false,4) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','1 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','1 vCPU','Núcleo de CPU virtual dedicado.',1),
(pl_id,'Storage','20 GB SSD','Armazenamento SSD para os dados e logs do banco.',2),
(pl_id,'Conexões','100','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'PostgreSQL 16.x gerenciado','Versão LTS mais recente com extensões populares pré-instaladas.',0),
(pl_id,'Backup diário automático','Retenção de 7 dias com restauração point-in-time.',1),
(pl_id,'IP dedicado com SSL/TLS','Conexão segura com autenticação por certificado.',2),
(pl_id,'Suporte a extensões','pg_stat_statements, uuid-ossp, postgis e mais pré-habilitados.',3),
(pl_id,'Suporte 24/7','Equipe especializada em PostgreSQL.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PG Business',119,'PostgreSQL robusto para APIs REST e backends modernos.',true,5) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','2 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','50 GB NVMe','Armazenamento NVMe para alta velocidade.',2),
(pl_id,'Conexões','300','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'PostgreSQL 16.x gerenciado','Otimizado para workloads OLTP e JSON com performance superior.',0),
(pl_id,'Backup diário automático','Retenção de 14 dias com restauração granular por transação.',1),
(pl_id,'JSONB e full-text search','Suporte nativo a dados semi-estruturados e busca textual avançada.',2),
(pl_id,'Monitoramento de queries','pg_stat_statements para análise de performance em tempo real.',3),
(pl_id,'Suporte prioritário 24/7','Especialistas em PostgreSQL com fila prioritária.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PG Pro',219,'PostgreSQL para dados complexos e análises avançadas.',false,6) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','4 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','100 GB NVMe','Armazenamento NVMe Gen4 de alta performance.',2),
(pl_id,'Conexões','1.000','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'PostgreSQL 16.x com extensões premium','PostGIS, TimescaleDB e outras extensões avançadas disponíveis.',0),
(pl_id,'Backup diário + semanal','Retenção de 30 dias com PITR (Point-in-Time Recovery).',1),
(pl_id,'Réplica de leitura disponível','Read replica para distribuição de consultas analíticas.',2),
(pl_id,'Particionamento e indexação avançada','Suporte a tabelas particionadas e índices BRIN, GIN, GiST.',3),
(pl_id,'Suporte VIP 24/7','DBA experiente em PostgreSQL disponível a qualquer hora.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'PG Enterprise',399,'PostgreSQL Enterprise para missão crítica.',false,7) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','8 GB','Memória RAM dedicada ao servidor de banco de dados.',0),
(pl_id,'vCPU','8 vCPU','Alto número de núcleos para queries paralelas complexas.',1),
(pl_id,'Storage','250 GB NVMe','Grande capacidade NVMe para datasets analíticos.',2),
(pl_id,'Conexões','Ilimitadas','Sem limite de conexões com PgBouncer integrado.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'PostgreSQL 16.x com HA','Alta disponibilidade com Patroni e failover automático.',0),
(pl_id,'Backup horário com PITR','Restauração para qualquer ponto no tempo com granularidade de segundos.',1),
(pl_id,'Streaming replication inclusa','Réplica síncrona ou assíncrona configurada e monitorada.',2),
(pl_id,'DBA dedicado','Administrador de banco de dados alocado para sua conta.',3),
(pl_id,'SLA 99,95% garantido','Disponibilidade contratual com créditos automáticos em violação.',4);

-- MongoDB
INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Mongo Starter',59,'MongoDB gerenciado para APIs e dados não estruturados.',false,8) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','1 GB','Memória RAM dedicada ao servidor MongoDB.',0),
(pl_id,'vCPU','1 vCPU','Núcleo de CPU virtual dedicado.',1),
(pl_id,'Storage','20 GB SSD','Armazenamento SSD para documentos e índices.',2),
(pl_id,'Conexões','100','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MongoDB 7.x gerenciado','Versão mais recente com configurações de segurança ativas.',0),
(pl_id,'Backup diário automático','Retenção de 7 dias com restauração de collections individuais.',1),
(pl_id,'Mongo Express incluso','Interface web para visualizar e editar documentos via navegador.',2),
(pl_id,'IP dedicado com autenticação SSL','Conexão segura com usuário admin configurado.',3),
(pl_id,'Suporte 24/7','Equipe especializada em MongoDB.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Mongo Business',119,'MongoDB robusto para aplicações mobile e real-time.',false,9) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','2 GB','Memória RAM dedicada ao servidor MongoDB.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','50 GB NVMe','Armazenamento NVMe para alta velocidade de leitura.',2),
(pl_id,'Conexões','300','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MongoDB 7.x com agregações','Pipeline de agregação completo para análises complexas.',0),
(pl_id,'Backup diário + oplog','Restauração point-in-time via oplog para dados críticos.',1),
(pl_id,'Change Streams habilitado','Notificações em tempo real de mudanças nos documentos.',2),
(pl_id,'Índices compostos e geoespaciais','Suporte a todos os tipos de índice MongoDB para performance.',3),
(pl_id,'Suporte prioritário 24/7','Especialistas em MongoDB e modelagem de dados.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Mongo Pro',219,'MongoDB para big data e análises em tempo real.',false,10) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','4 GB','Memória RAM dedicada ao servidor MongoDB.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','100 GB NVMe','NVMe de alta capacidade para datasets volumosos.',2),
(pl_id,'Conexões','1.000','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MongoDB 7.x com Atlas-like features','Recursos avançados similares ao MongoDB Atlas sem o custo.',0),
(pl_id,'Backup diário + semanal com oplog','Histórico de 30 dias com PITR granular.',1),
(pl_id,'Réplica secundária disponível','Replica set para leitura distribuída e alta disponibilidade.',2),
(pl_id,'Time Series Collections','Suporte nativo a dados de série temporal para IoT e monitoramento.',3),
(pl_id,'Suporte VIP 24/7','DBA especialista em MongoDB para otimização e modelagem.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'Mongo Enterprise',399,'MongoDB Enterprise para missão crítica.',false,11) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','8 GB','Memória RAM de alta capacidade para datasets grandes.',0),
(pl_id,'vCPU','8 vCPU','Alto número de núcleos para aggregations intensas.',1),
(pl_id,'Storage','250 GB NVMe','Grande capacidade NVMe para dados em volume.',2),
(pl_id,'Conexões','Ilimitadas','Pool de conexões gerenciado sem limite.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'MongoDB 7.x com Replica Set HA','Replica set com 3 membros e eleição automática de primário.',0),
(pl_id,'Backup horário com PITR','Granularidade de segundos para restauração de dados críticos.',1),
(pl_id,'Sharding disponível como add-on','Escalonamento horizontal para datasets que ultrapassam TB.',2),
(pl_id,'DBA dedicado MongoDB','Especialista alocado para modelagem, tuning e suporte.',3),
(pl_id,'SLA 99,95% garantido','Disponibilidade contratual com créditos automáticos.',4);

-- SQL Server
INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'SQL Starter',149,'SQL Server gerenciado para sistemas Windows e .NET.',false,12) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','2 GB','Memória RAM dedicada ao servidor SQL Server.',0),
(pl_id,'vCPU','2 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','50 GB SSD','Armazenamento SSD para dados, logs e tempdb.',2),
(pl_id,'Conexões','50','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'SQL Server 2022 Express','Versão Express com até 10 GB por banco — ideal para sistemas leves.',0),
(pl_id,'Backup diário automático','Cópias de segurança diárias com retenção de 7 dias.',1),
(pl_id,'Acesso via SQL Server Management Studio','Conecte o SSMS ao servidor remoto com autenticação SQL.',2),
(pl_id,'Windows Server 2022','Ambiente Windows nativo para compatibilidade total.',3),
(pl_id,'Suporte 24/7','Equipe especializada em SQL Server e Windows.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'SQL Business',279,'SQL Server para sistemas corporativos em produção.',false,13) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','4 GB','Memória RAM dedicada ao servidor SQL Server.',0),
(pl_id,'vCPU','4 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','100 GB NVMe','Armazenamento NVMe para performance em consultas complexas.',2),
(pl_id,'Conexões','200','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'SQL Server 2022 Standard','Versão Standard sem limitações de tamanho de banco.',0),
(pl_id,'Backup diário + transaction log','Backup de transações a cada hora para RPO baixo.',1),
(pl_id,'SQL Server Agent','Agendamento de jobs, alertas e manutenção automática.',2),
(pl_id,'Linked Servers disponível','Conecte a outros bancos SQL Server ou fontes ODBC.',3),
(pl_id,'Suporte prioritário 24/7','Especialistas em T-SQL, performance e SQL Server.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'SQL Pro',499,'SQL Server de alta performance para cargas intensas.',false,14) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','8 GB','Memória RAM dedicada ao servidor SQL Server.',0),
(pl_id,'vCPU','6 vCPU','Núcleos de CPU virtual dedicados.',1),
(pl_id,'Storage','250 GB NVMe','NVMe de alta capacidade para bancos grandes.',2),
(pl_id,'Conexões','500','Número máximo de conexões simultâneas.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'SQL Server 2022 Standard avançado','Configurado para workloads OLTP intensos com In-Memory OLTP.',0),
(pl_id,'Backup diário + semanal + transaction log','Múltiplas frequências com retenção de 30 dias.',1),
(pl_id,'Always Encrypted disponível','Criptografia de dados sensíveis em nível de coluna.',2),
(pl_id,'Performance tuning incluído','Análise mensal de queries lentas e recomendações de índice.',3),
(pl_id,'Suporte VIP 24/7','DBA especialista em SQL Server para otimização contínua.',4);

INSERT INTO plans(product_page_id,name,monthly_price,description,popular,position)
VALUES(pid,'SQL Enterprise',899,'SQL Server Enterprise para missão crítica e compliance.',false,15) RETURNING id INTO pl_id;
INSERT INTO plan_specs(plan_id,label,value,tip,position) VALUES
(pl_id,'RAM','16 GB','Memória RAM de alto desempenho para grandes workloads.',0),
(pl_id,'vCPU','8 vCPU','Alto número de núcleos para paralelismo máximo.',1),
(pl_id,'Storage','500 GB NVMe','Grande capacidade NVMe para data warehouses e ERP.',2),
(pl_id,'Conexões','Ilimitadas','Connection pooling gerenciado sem limite de conexões.',3);
INSERT INTO plan_features(plan_id,text,tip,position) VALUES
(pl_id,'SQL Server 2022 Enterprise features','Particionamento, columnstore indexes e advanced analytics.',0),
(pl_id,'Always On Availability Groups','Alta disponibilidade com failover automático e réplica síncrona.',1),
(pl_id,'Backup horário com point-in-time','Granularidade de minutos para conformidade e recovery rápido.',2),
(pl_id,'Transparent Data Encryption (TDE)','Criptografia de todo o banco de dados em repouso.',3),
(pl_id,'DBA dedicado SQL Server','Especialista alocado para sua instância com revisões mensais.',4),
(pl_id,'SLA 99,95% garantido','Disponibilidade contratual com créditos automáticos em violação.',5);

END $$;

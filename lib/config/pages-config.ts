export type SectionKey = 'hero' | 'shared_features' | 'diferenciais' | 'content' | 'stats'

export interface HeroDefaults {
  badge?: string; title?: string; subtitle?: string; desc?: string
}
export interface SharedFeaturesDefaults {
  items: { text: string; tip?: string }[]
}

export type SectionDefaults = HeroDefaults | SharedFeaturesDefaults | Record<string, any>

export interface PageConfig {
  slug: string
  name: string
  path: string
  sections: SectionKey[]
  defaults?: Partial<Record<SectionKey, SectionDefaults>>
}

export interface CategoryConfig {
  category: string
  pages: PageConfig[]
}

const VPS_SHARED_FEATURES: SharedFeaturesDefaults = {
  items: [
    { text: 'IPv4 + IPv6 dedicados',         tip: 'Cada VPS recebe 1 endereço IPv4 e um /64 IPv6 exclusivos — não compartilhados com outros clientes.' },
    { text: 'Anti-DDoS incluso',             tip: 'Proteção automática contra ataques volumétricos de até 1 Tbps. Mitigação em camadas 3, 4 e 7.' },
    { text: 'Painel de controle',            tip: 'Painel web para reiniciar, reinstalar SO, monitorar uso de CPU/RAM e gerenciar backups.' },
    { text: 'Backup disponível como add-on', tip: 'Backups diários automáticos disponíveis como serviço adicional. Retenção de 7 dias.' },
    { text: 'Linux ou Windows Server',       tip: 'Escolha Ubuntu, Debian, CentOS, Rocky, AlmaLinux ou Windows Server no momento do pedido.' },
    { text: 'Acesso root total',             tip: 'Você tem controle completo do servidor — root/Administrator — para instalar qualquer software.' },
    { text: 'Deploy em < 60 segundos',       tip: 'O VPS é criado e ativado automaticamente em menos de 60 segundos após confirmação do pagamento.' },
    { text: 'Suporte 24/7 em português',     tip: 'Suporte técnico humano disponível 24 horas por dia, 7 dias por semana, em português.' },
    { text: 'SLA 99.9% garantido',           tip: 'Uptime garantido em contrato. 99.9% equivale a menos de 8.7 horas de inatividade por ano.' },
    { text: 'Rede 10 Gbps',                  tip: 'Uplink de 10 Gigabits por segundo, com múltiplos provedores de trânsito para máxima redundância.' },
  ],
}

const BARE_METAL_SHARED_FEATURES: SharedFeaturesDefaults = {
  items: [
    { text: 'Anti-DDoS avançado',        tip: 'Proteção robusta contra ataques volumétricos inclusa em todos os servidores.' },
    { text: 'RAID configurável',          tip: 'RAID 0, 1, 5 ou 10 conforme sua necessidade de performance e redundância.' },
    { text: 'Rede 10 Gbps dedicada',      tip: 'Uplink dedicado de 10 Gbps com múltiplos provedores de trânsito.' },
    { text: 'IPs adicionais disponíveis', tip: 'Blocos de IP adicionais disponíveis mediante solicitação e justificativa técnica.' },
    { text: 'KVM / IPMI remoto',          tip: 'Acesso remoto de baixo nível via KVM/IPMI para reinstalação e manutenção fora de banda.' },
    { text: 'Suporte 24/7 em português',  tip: 'Suporte técnico humano disponível 24h por dia, 7 dias por semana, em português.' },
    { text: 'SLA 99.9% garantido',        tip: 'Uptime garantido em contrato — menos de 8.7h de inatividade por ano.' },
    { text: 'Implantação em até 24h',     tip: 'Servidores disponibilizados em até 24h úteis após confirmação do pedido.' },
  ],
}

export const PAGES_CONFIG: CategoryConfig[] = [
  {
    category: 'Página Inicial',
    pages: [
      {
        slug: 'home', name: 'Home', path: '/', sections: ['hero', 'diferenciais'],
        defaults: {
          hero: { badge: 'NVMe · Anti-DDoS · Suporte 24/7', title: 'Cloud VPS que você confia.', subtitle: 'Vem ser feliz na Hosteg!', desc: 'Infraestrutura cloud de alta performance com NVMe, anti-DDoS e suporte técnico brasileiro 24/7. Do VPS ao Bare-Metal, temos o servidor ideal para você.' },
        },
      },
    ],
  },
  {
    category: 'Hospedagem',
    pages: [
      {
        slug: 'hospedagem', name: 'Hospedagem Compartilhada', path: '/hospedagem', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'Hospedagem Web', title: 'Hospedagem Web', subtitle: 'Painel Hosteg Hospedagem, SSL grátis e e-mail profissional incluso.', desc: 'Perfeito para sites, blogs e pequenas empresas que precisam de confiabilidade.' },
        },
      },
      {
        slug: 'hospedagem-pro', name: 'Hospedagem PRO', path: '/hospedagem-pro', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'cPanel + LiteSpeed + Redis', title: 'Hospedagem PRO', subtitle: 'Performance máxima com cPanel, LiteSpeed e Redis.', desc: 'Para sites profissionais que exigem velocidade, segurança e estabilidade.' },
        },
      },
      {
        slug: 'wordpress', name: 'WordPress', path: '/wordpress', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'WordPress Otimizado', title: 'WordPress Hosting', subtitle: 'Otimizado do zero para WordPress com LiteSpeed e Redis.', desc: 'Deploy em 1 clique, SSL automático e suporte especializado em WP.' },
        },
      },
    ],
  },
  {
    category: 'Cloud',
    pages: [
      {
        slug: 'cloud-vps', name: 'Cloud VPS', path: '/cloud-vps', sections: ['hero', 'stats', 'shared_features'],
        defaults: {
          hero: { badge: 'Cloud VPS NVMe Enterprise', title: 'Cloud VPS', subtitle: 'NVMe Enterprise, anti-DDoS incluso e rede 10 Gbps.', desc: 'Ative em segundos. Suporte 24/7. SLA 99.9% garantido.' },
          stats: { items: [
            { value: '< 60s',    label: 'Ativação' },
            { value: 'NVMe Enterprise', label: 'Storage' },
            { value: '10 Gbps',  label: 'Rede' },
            { value: '99.9%',    label: 'SLA' },
          ]},
          shared_features: VPS_SHARED_FEATURES,
        },
      },
      {
        slug: 'bare-metal', name: 'Bare-Metal', path: '/bare-metal', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'Servidores Dedicados', title: 'Bare-Metal', subtitle: 'Máximo poder computacional com Intel Xeon E5 e Gold.', desc: '100% dos recursos são seus. Sem vizinhos. Sem compartilhamento.' },
          shared_features: BARE_METAL_SHARED_FEATURES,
        },
      },
    ],
  },
  {
    category: 'Revenda',
    pages: [
      {
        slug: 'revenda-cpanel', name: 'Revenda cPanel', path: '/revenda-cpanel', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'Revenda cPanel', title: 'Revenda de Hospedagem cPanel', subtitle: 'Crie sua própria empresa de hospedagem com infraestrutura Hosteg.', desc: 'WHM + cPanel inclusos, white-label total, SSL grátis para todos os seus clientes.' },
        },
      },
      {
        slug: 'revenda-directadmin', name: 'Revenda Painel Hosteg Hospedagem', path: '/revenda-directadmin', sections: ['hero', 'shared_features'],
        defaults: {
          hero: { badge: 'Revenda Painel Hosteg Hospedagem', title: 'Revenda de Hospedagem com Painel Hosteg Hospedagem', subtitle: 'O painel mais leve e rápido do mercado. Mais performance para seus clientes.', desc: 'White-label total, WHMCS compatível e migração grátis de cPanel.' },
        },
      },
    ],
  },
  {
    category: 'Corporativo',
    pages: [
      {
        slug: 'database-cloud', name: 'Database Cloud', path: '/database-cloud', sections: ['hero'],
        defaults: {
          hero: { badge: 'Corporativo', title: 'Database Cloud', subtitle: 'MySQL, PostgreSQL, MongoDB e SQL Server gerenciados na nuvem.', desc: 'Backups automáticos, alta disponibilidade e suporte 24/7 para seus bancos de dados.' },
        },
      },
      {
        slug: 'backup-pro', name: 'BackupPRO', path: '/backup-pro', sections: ['hero'],
        defaults: {
          hero: { badge: 'Corporativo', title: 'HostegBACKUP', subtitle: 'Backup corporativo com tecnologia Acronis. Seus dados protegidos com o melhor do mercado.', desc: 'Recuperação bare-metal, backup contínuo, criptografia AES-256 e painel centralizado.' },
        },
      },
      {
        slug: 'erp', name: 'ErpY', path: '/erp', sections: ['hero'],
        defaults: { hero: { badge: 'Corporativo', title: 'ErpY', subtitle: 'O Erp da Hosteg', desc: '' } },
      },
      {
        slug: 'terminal-server', name: 'Terminal Server', path: '/terminal-server', sections: ['hero'],
        defaults: { hero: { badge: 'Corporativo', title: 'Terminal Server', subtitle: '', desc: '' } },
      },
    ],
  },
  {
    category: 'Institucional',
    pages: [
      {
        slug: 'sobre', name: 'Sobre', path: '/sobre', sections: ['hero', 'content'],
        defaults: {
          hero: { badge: 'Nossa história', title: 'Sobre a Hosteg', subtitle: 'A Hosteg nasceu da frustração de dois desenvolvedores com hosting caro, lento e com suporte ruim.', desc: 'Decidimos criar a hospedagem que sempre quisemos usar.' },
        },
      },
      {
        slug: 'datacenter', name: 'Datacenter', path: '/datacenter', sections: ['hero', 'content'],
        defaults: {
          hero: { badge: 'Infraestrutura', title: 'Datacenter', subtitle: 'Infraestrutura de nível enterprise no Brasil e Canadá.', desc: 'Tier III certificado, anti-DDoS, NVMe Enterprise e rede 10 Gbps.' },
        },
      },
      {
        slug: 'contratos', name: 'Contratos', path: '/contratos', sections: ['hero', 'content'],
        defaults: {
          hero: { badge: 'Documentos Legais', title: 'Contratos', subtitle: 'Contratos de prestação de serviços para todos os produtos Hosteg.', desc: '' },
        },
      },
      {
        slug: 'contato', name: 'Contato', path: '/contato', sections: ['hero'],
        defaults: {
          hero: { badge: 'Suporte 24/7', title: 'Contato', subtitle: 'Estamos sempre disponíveis para ajudar. Escolha o melhor canal para você.', desc: '' },
        },
      },
    ],
  },
]

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero:            'Hero',
  stats:           'Estatísticas (pills do hero)',
  shared_features: 'Recursos Compartilhados',
  diferenciais:    'Diferenciais',
  content:         'Conteúdo',
}

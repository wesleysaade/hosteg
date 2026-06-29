const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/vps',
        destination: '/cloud-vps',
        permanent: true,
      },
      {
        // Página "Sobre" temporariamente desativada (reverter: remover este bloco)
        source: '/sobre',
        destination: '/',
        permanent: false,
      },
    ]
  },
  webpack(config) {
    // Garante que o alias @/ resolve para a raiz do projeto
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    return config
  },
}

module.exports = nextConfig

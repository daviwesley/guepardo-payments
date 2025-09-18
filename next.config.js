/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    dirs: ['pages', 'utils', 'lib', 'components', 'app'],
  },
  // Configuração para Static Export (GitHub Pages) - Comentado durante desenvolvimento
  // output: 'export',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true, // Necessário para static export
  // },
  // BasePath para GitHub Pages (será usado apenas em produção)
  // basePath: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '',
  // Asset prefix para GitHub Pages
  // assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '',
  // Otimizações de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
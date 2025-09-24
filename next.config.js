/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true, // Para exportación estática
  },
  output: 'export', // Para exportación estática
  trailingSlash: true, // Para compatibilidad con Capacitor
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
}

module.exports = nextConfig

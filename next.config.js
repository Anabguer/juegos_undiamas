/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Para exportación estática
  },
  // Comentado para desarrollo - descomentar para producción
  // output: 'export', // Para exportación estática
  // trailingSlash: true, // Para compatibilidad con Capacitor
  // assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
}

module.exports = nextConfig

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'bun',
    storage: {
      redis: {
        driver: 'redis',
        url: process.env.REDIS_URL,
      },
    },
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
    disableTransition: false
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'IDX Stocks Ownership',
      short_name: 'ISO',
      description: 'Lihat data kepemilikan saham, investor, dan free float terbaru di Bursa Efek Indonesia.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },
    devOptions: {
      enabled: process.env.NODE_ENV === 'development',
    }
  },
})
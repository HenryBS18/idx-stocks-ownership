export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'bun',
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
    disableTransition: false
  },
})
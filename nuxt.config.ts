export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: process.env.NODE_ENV !== 'development',
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
})

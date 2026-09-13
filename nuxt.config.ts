import { motionDirectives } from './motion.config'
import { sitemapUrls } from './sitemap.config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  app: {
    pageTransition: {
      mode: 'out-in',
      enterActiveClass: 'transition-opacity duration-200 ease-out motion-reduce:transition-none',
      enterFromClass: 'opacity-0',
      leaveActiveClass: 'transition-opacity duration-150 ease-in motion-reduce:transition-none',
      leaveToClass: 'opacity-0',
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/color-mode', '@nuxtjs/sitemap', '@vite-pwa/nuxt', '@vueuse/motion', 'nuxt-gtag'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      motion: { directives: motionDirectives },
    },
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL!,
    name: 'IDX Stocks Ownership',
    defaultLocale: 'id-ID',
  },
  sitemap: {
    exclude: ['/api/**'],
    xsl: false,
    credits: false,
    discoverImages: false,
    discoverVideos: false,
    urls: sitemapUrls(),
    defaults: {
      changefreq: 'monthly',
    },
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production' && !!process.env.NUXT_PUBLIC_GTAG_ID,
  },
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'node-server',
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
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'workbox-window', 'clsx', 'tailwind-merge', 'errx']
    }
  }
})

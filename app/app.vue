<script setup lang="ts">
const siteConfig = useSiteConfig()

useHead({
  htmlAttrs: {
    lang: 'id',
  },
  meta: [
    { name: 'google-site-verification', content: '8U9sEmx8mBBT9BqOZwHr1k1yc9MW97z6D1KIfJTxPpE' },
    { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#0f172b', media: '(prefers-color-scheme: dark)' },
  ],
})

useSeoMeta({
  title: 'IDX Stocks Ownership',
  description: 'Lihat data lengkap kepemilikan saham, profil investor, dan free float perusahaan tercatat di Bursa Efek Indonesia (BEI).',
  ogTitle: 'IDX Stocks Ownership',
  ogDescription: 'Lihat data lengkap kepemilikan saham, profil investor, dan free float perusahaan tercatat di Bursa Efek Indonesia (BEI).',
  ogType: 'website',
  ogLocale: 'id_ID',
  ogUrl: siteConfig.url,
  twitterCard: 'summary_large_image',
  robots: 'index, follow, max-image-preview:large',
})
</script>

<template>
  <VitePwaManifest />

  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

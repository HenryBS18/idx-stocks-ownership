<script setup lang="ts">
useHead({
  meta: [
    { name: 'google-site-verification', content: '8U9sEmx8mBBT9BqOZwHr1k1yc9MW97z6D1KIfJTxPpE' },
  ],
  link: [
    { rel: 'canonical', href: 'https://idx-stocks-ownership.vercel.app' },
  ],
})

useSeoMeta({
  title: 'IDX Stocks Ownership',
  description: 'Lihat data lengkap kepemilikan saham, profil investor, dan free float perusahaan tercatat di Bursa Efek Indonesia (BEI).',
  ogTitle: 'IDX Stocks Ownership',
  ogDescription: 'Lihat data lengkap kepemilikan saham, profil investor, dan free float perusahaan tercatat di Bursa Efek Indonesia (BEI).',
  ogType: 'website',
  ogLocale: 'id_ID',
  ogUrl: 'https://idx-stocks-ownership.vercel.app',
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

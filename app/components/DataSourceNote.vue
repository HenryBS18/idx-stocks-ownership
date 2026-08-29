<script setup lang="ts">
import { IDX_SOURCE_URL } from '~/utils/constants'
</script>

<template>
  <p class="text-[10px] sm:text-xs text-muted">
    Sumber:
    <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
      aria-label="Pengumuman Bursa — Semua Emiten Saham di situs IDX (buka di tab baru)"
      class="inline-block py-3.5 -my-3.5 rounded-sm underline decoration-accented underline-offset-2 transition-colors hover:text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Pengumuman Bursa — Semua Emiten Saham (IDX)</a>{{ ' ' }}
    <span aria-hidden="true">·</span>
    Bukan saran investasi
  </p>
</template>

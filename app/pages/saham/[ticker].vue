<script setup lang="ts">
definePageMeta({ middleware: ['detail-canonical', 'auth'] })
const route = useRoute()
</script>

<template>
  <OwnershipDetailPage :key="String(route.params.ticker)" kind="stock" :identifier="String(route.params.ticker)" />
</template>

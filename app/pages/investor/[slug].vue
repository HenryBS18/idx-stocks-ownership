<script setup lang="ts">
definePageMeta({ middleware: ['detail-canonical', 'auth'] })
const route = useRoute()
</script>

<template>
  <OwnershipDetailPage :key="String(route.params.slug)" kind="investor" :identifier="String(route.params.slug)" />
</template>

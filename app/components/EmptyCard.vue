<script setup lang="ts">
defineProps<{
  message: string
  onReset?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-4 py-16">
    <UIcon name="i-lucide-search-x" class="size-12 text-muted" />
    <p class="max-w-xs text-center text-sm leading-relaxed text-muted md:max-w-sm">{{ message }}</p>
    <UButton v-if="onReset" label="Reset filter" color="neutral" variant="outline" @click="onReset" />
  </div>
</template>

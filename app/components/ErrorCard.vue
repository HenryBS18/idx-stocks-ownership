<script setup lang="ts">
defineProps<{
  message: string
  onRetry?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 gap-y-4">
    <UIcon name="i-lucide-alert-circle" class="size-12 text-red-500" />
    <p class="text-sm text-gray-600 text-center max-w-xs">{{ message }}</p>
    <UButton v-if="onRetry" color="primary" @click="onRetry">
      Coba Lagi
    </UButton>
  </div>
</template>

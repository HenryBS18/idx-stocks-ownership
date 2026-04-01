<script setup lang="ts">
const route = useRoute()

const pages = [
  { label: 'Saham', icon: 'i-lucide-chart-candlestick', to: '/saham' },
  { label: 'Investor', icon: 'i-lucide-user', to: '/investor' }
]

const activeIndex = computed(() =>
  pages.findIndex(page => page.to === route.path)
)
</script>

<template>
  <UHeader title="IDX Stocks Ownership" :ui="{ container: 'max-w-none', right: 'hidden' }" />

  <div class="px-8 py-4">
    <div class="relative flex w-full mb-4 border-b border-gray-200">
      <NuxtLink v-for="page in pages" :key="page.to" :to="page.to" class="flex items-center justify-center w-1/2 py-2 space-x-1.5"
        :class="route.path === page.to ? 'text-primary' : 'text-gray-500'">
        <UIcon :name="page.icon" class="size-5" />

        <span class="text-sm font-semibold transition-colors duration-300">
          {{ page.label }}
        </span>
      </NuxtLink>

      <div class="absolute bottom-0 h-1 transition-all duration-300 bg-primary" :style="{
        width: `${100 / pages.length}%`,
        transform: `translateX(${activeIndex * 100}%)`
      }" />
    </div>

    <slot />
  </div>
</template>
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

  <div :class="cn(
    'px-4 pt-4 pb-20',
    'md:px-8 md:py-4 xl:pb-4',
  )">
    <div class="relative hidden xl:flex w-full mb-4 border-b border-gray-200">
      <NuxtLink v-for="page in pages" :key="page.to" :to="page.to" class="flex items-center justify-center w-1/2 py-2 gap-x-1.5"
        :class="route.path === page.to ? 'text-primary' : 'text-gray-600'">
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

  <nav
    class="fixed bottom-0 inset-x-0 z-50 flex xl:hidden items-center justify-around h-16 bg-white/90 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] shadow-lg">
    <NuxtLink v-for="page in pages" :key="page.to" :to="page.to"
      class="flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors duration-200"
      :class="route.path === page.to ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'">
      <UIcon :name="page.icon" class="size-5 mb-1" />
      <span>{{ page.label }}</span>
    </NuxtLink>
  </nav>
</template>
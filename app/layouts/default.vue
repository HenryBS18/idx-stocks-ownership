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
  <UHeader title="IDX Stocks Ownership" :toggle="false" :ui="{ container: 'max-w-none px-4 sm:px-6', right: 'flex items-center' }">
    <template #right>
      <UColorModeButton
        color="neutral"
        variant="outline"
        size="sm"
        square
        class="border border-accented"
        aria-label="Ubah tema warna"
      />
    </template>
  </UHeader>

  <div :class="cn(
    'pb-20',
    'xl:pb-4',
  )">
    <div class="relative hidden xl:flex w-full border-b border-accented">
      <NuxtLink v-for="page in pages" :key="page.to" :to="page.to"
        class="flex items-center justify-center w-1/2 py-3 gap-x-1.5 transition-colors duration-200"
        :class="route.path === page.to ? 'text-primary' : 'text-muted hover:text-highlighted hover:bg-elevated'">
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

    <div class="mt-4">
      <slot />
    </div>
  </div>

  <nav
    class="fixed bottom-0 inset-x-0 z-50 flex xl:hidden items-center justify-around h-16 bg-default/90 backdrop-blur-md border-t border-accented pb-[env(safe-area-inset-bottom)] shadow-lg">
    <NuxtLink v-for="page in pages" :key="page.to" :to="page.to"
      class="flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors duration-200"
      :class="route.path === page.to ? 'text-primary font-semibold' : 'text-muted hover:text-default'">
      <UIcon :name="page.icon" class="size-5 mb-1" />
      <span>{{ page.label }}</span>
    </NuxtLink>
  </nav>
</template>

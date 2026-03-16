<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui"
const StockAccordion = defineAsyncComponent(() =>
  import("~/components/StockAccordion.vue")
)

const tabItems: TabsItem[] = [
  { label: 'Saham', slot: 'stock', icon: 'i-lucide-chart-candlestick' },
  { label: 'Investor', slot: 'investor', icon: 'i-lucide-user' },
]

const stocks = ref([])
const showStockAccordion = ref(false)

onMounted(() => {
  requestAnimationFrame(async () => {
    const data = await $fetch('/api/stock')
    stocks.value = data
    showStockAccordion.value = true
  })
})
</script>

<template>
  <div class="bg-gray-50">
    <UHeader title="IDX 1% Ownership" :ui="{ container: 'max-w-none' }" />

    <div class="px-8 py-4">
      <UTabs :items="tabItems" variant="link" :ui="{
        list: 'w-full',
        trigger: 'flex-1 justify-center cursor-pointer',
        indicator: 'h-1',
      }">
        <template #stock>
          <div class="px-4 py-2">
            <UInput icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ leadingIcon: 'size-4' }" />

            <div v-if="!showStockAccordion && stocks.length === 0" class="mt-6 space-y-3">
              <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
            </div>

            <StockAccordion v-else :stocks="stocks" />
          </div>
        </template>

        <template #investor>
          <div class="px-4 py-2">
            <UInput icon="i-lucide-search" placeholder="Cari investor..." />
            <p>Investor table here</p>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watchDebounced } from "@vueuse/core"
import type { Sort, Stock, StockResponse, StockSortField } from "~/types"

const StockAccordion = defineAsyncComponent(() => import("~/components/StockAccordion.vue"))

const stocks = ref<Stock[]>([])
const lastUpdatedDate = ref<string>('')
const showStockAccordion = ref<boolean>(false)
const search = ref<string>('')
const searchDebounced = ref<string>('')
const sortField = ref<StockSortField>('ticker')
const sortOrder = ref<Sort>('asc')

const filteredStocks = computed<Stock[]>(() => {
  let result = [...stocks.value]

  if (searchDebounced.value) {
    const q = searchDebounced.value.toLowerCase()

    result = result.filter(stock =>
      stock.ticker.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => {
    let compare = 0

    if (sortField.value === 'ticker') {
      compare = a.ticker.localeCompare(b.ticker)
    }

    if (sortField.value === 'freeFloat') {
      compare = Number(a.freeFloat) - Number(b.freeFloat)
    }

    if (sortField.value === 'investor-count') {
      compare = Number(a.investorCount) - Number(b.investorCount)
    }

    return sortOrder.value === 'asc' ? compare : -compare
  })

  return result
})

const toggleSort = (field: StockSortField) => {
  sortField.value = field
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

watchDebounced(search, (v) => {
  searchDebounced.value = v
}, { debounce: 500 })

onMounted(() => {
  requestAnimationFrame(async () => {
    const { data, lastUpdated } = await $fetch<StockResponse>('/api/stock')
    stocks.value = data
    lastUpdatedDate.value = lastUpdated
    showStockAccordion.value = true
  })
})
</script>

<template>
  <div class="py-2">
    <div class="flex items-end justify-between">
      <div class="flex items-center space-x-4">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ trailing: 'pe-1' }">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="search = ''" />
          </template>
        </UInput>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <div class="flex items-center space-x-2">
          <p class="text-sm text-gray-500">URUTKAN</p>

          <div class="flex">
            <UButton label="Ticker" :trailing-icon="sortField === 'ticker' && sortOrder === 'asc'
              ? 'i-lucide-arrow-up-a-z'
              : 'i-lucide-arrow-down-z-a'
              " variant="outline" class="rounded-tr-none rounded-br-none cursor-pointer" :active="sortField === 'ticker'" active-variant="solid"
              @click="toggleSort('ticker')" />

            <UButton label="Free Float (%)" :trailing-icon="sortField === 'freeFloat' && sortOrder === 'asc'
              ? 'i-lucide-arrow-up-0-1'
              : 'i-lucide-arrow-down-1-0'
              " variant="outline" class="rounded-none cursor-pointer" :active="sortField === 'freeFloat'" active-variant="solid"
              @click="toggleSort('freeFloat')" />

            <UButton label="Jumlah Investor" :trailing-icon="sortField === 'investor-count' && sortOrder === 'asc'
              ? 'i-lucide-arrow-up-0-1'
              : 'i-lucide-arrow-down-1-0'
              " variant="outline" class="rounded-tl-none rounded-bl-none cursor-pointer" :active="sortField === 'investor-count'"
              active-variant="solid" @click="toggleSort('investor-count')" />
          </div>
        </div>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <p class="text-sm text-gray-500">{{ filteredStocks.length.toLocaleString() }} emiten</p>
      </div>

      <p class="text-sm text-gray-400">Terakhir diperbarui: {{ lastUpdatedDate }}</p>
    </div>

    <div v-if="!showStockAccordion && filteredStocks.length === 0" class="space-y-3">
      <USkeleton class="w-full h-16 rounded-lg" v-for="i in 5" :key="i" />
    </div>

    <StockAccordion v-else :stocks="filteredStocks" />
  </div>
</template>
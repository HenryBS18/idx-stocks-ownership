<script setup lang="ts">
import type { Stock, StockResponse } from "~/types"

const StockAccordion = defineAsyncComponent(() => import("~/components/StockAccordion.vue"))

const stocks = ref<Stock[]>([])
const lastUpdatedDate = ref<string>('')
const showStockAccordion = ref<boolean>(false)
const search = ref<string>("")
const sortField = ref<'alphabet' | 'freeFloat'>('alphabet')
const sortOrder = ref<'asc' | 'desc'>('asc')

const toggleAlphabetSort = () => {
  sortField.value = 'alphabet'
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const toggleFreeFloatSort = () => {
  sortField.value = 'freeFloat'
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const filteredStocks = computed<Stock[]>(() => {
  let result = [...stocks.value]

  if (search.value) {
    const q = search.value.toLowerCase()

    result = result.filter(stock =>
      stock.ticker.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => {
    let compare = 0

    if (sortField.value === 'alphabet') {
      compare = a.ticker.localeCompare(b.ticker)
    }

    if (sortField.value === 'freeFloat') {
      compare = Number(a.freeFloat) - Number(b.freeFloat)
    }

    return sortOrder.value === 'asc' ? compare : -compare
  })

  return result
})

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
  <div class="px-4 py-2">
    <div class="flex items-end justify-between">
      <div class="flex space-x-10">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ leadingIcon: 'size-4' }" />

        <div class="flex">
          <UButton label="Alphabet" :trailing-icon="sortField === 'alphabet' && sortOrder === 'asc'
            ? 'i-lucide-arrow-up-a-z'
            : 'i-lucide-arrow-down-z-a'
            " variant="outline" class="rounded-tr-none rounded-br-none cursor-pointer" :active="sortField === 'alphabet'" active-variant="solid"
            @click="toggleAlphabetSort" />

          <UButton label="Free Float (%)" :trailing-icon="sortField === 'freeFloat' && sortOrder === 'asc'
            ? 'i-lucide-arrow-up-0-1'
            : 'i-lucide-arrow-down-1-0'
            " variant="outline" class="rounded-tl-none rounded-bl-none cursor-pointer" :active="sortField === 'freeFloat'" active-variant="solid"
            @click="toggleFreeFloatSort" />
        </div>
      </div>

      <p class="text-sm text-gray-600">Last Updated: {{ lastUpdatedDate }}</p>
    </div>

    <div v-if="!showStockAccordion && filteredStocks.length === 0" class="space-y-3">
      <USkeleton class="w-full h-16 rounded-lg" v-for="i in 5" :key="i" />
    </div>

    <StockAccordion v-else :stocks="filteredStocks" />
  </div>
</template>
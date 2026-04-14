<script setup lang="ts">
import { useStockStore } from "~/stores/useStockStore"

const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)

const stockStore = useStockStore()
const { search, showStockAccordion, sortField, sortOrder, stockCount, fetchedDate } = storeToRefs(stockStore)
const { fetchStocks, resetFilter, toggleSort } = stockStore

watch(selectedDate, async (newDate, oldDate) => {
  if (!newDate || newDate === oldDate) return
  if (fetchedDate.value === newDate) return

  showStockAccordion.value = false
  await fetchStocks()
}, {
  immediate: true
})

useSeoMeta({
  title: 'Daftar Saham Indonesia & Kepemilikan Investor (IDX) | IDX Stocks Ownership',
  description: 'Jelajahi data saham Indonesia di BEI (IDX), termasuk free float, jumlah investor, dan distribusi kepemilikan. Cari, filter, dan analisis emiten dengan mudah.'
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <div :class="cn(
      'w-full flex flex-col space-y-3',
      'lg:w-auto lg:justify-between',
      'xl:flex-row xl:space-y-0'
    )">
      <div :class="cn(
        'w-full flex flex-col space-y-3',
        'lg:w-auto lg:flex-row lg:space-x-4 lg:space-y-0'
      )">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ trailing: 'pe-1' }" :class="cn(
          'w-full min-w-51',
          'md:w-auto'
        )">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="search = ''" />
          </template>
        </UInput>

        <div :class="cn(
          'flex flex-col items-start space-y-3',
          'md:flex-row md:items-center md:space-x-4 md:space-y-0'
        )">
          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <div :class="cn(
            'flex flex-col space-y-1',
            'md:flex-row md:items-center md:space-x-2 md:space-y-0'
          )">
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

          <USeparator orientation="vertical" color="primary" class="hidden h-6 md:inline" />

          <div :class="cn(
            'flex items-center space-x-4',
          )">
            <div class="flex items-center space-x-2">
              <p class="text-sm text-gray-500 text-nowrap">RESET FILTER</p>

              <UButton icon="i-lucide-rotate-ccw" class="cursor-pointer" :ui="{ leadingIcon: 'size-5' }" @click="resetFilter" />
            </div>

            <USeparator orientation="vertical" color="primary" class="h-6" />

            <p v-if="stockCount != 0" class="text-sm text-gray-500 text-nowrap">{{ stockCount.toLocaleString() }} emiten</p>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <p class="text-sm text-gray-500 text-nowrap">DATA PER</p>

        <USelect v-model="selectedDate" :items="dates" class="focus:ring focus:ring-gray-300" :ui="{ content: 'min-w-fit mr-6' }" />
      </div>
    </div>

    <div class="mt-8">
      <UScrollArea v-if="!showStockAccordion" class="h-[calc(100vh-224px)] pr-4">
        <div class="space-y-4">
          <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
        </div>
      </UScrollArea>

      <SahamAccordion v-else />
    </div>
  </main>
</template>
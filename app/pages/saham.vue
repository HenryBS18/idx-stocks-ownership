<script setup lang="ts">
import { useStockStore } from "~/stores/useStockStore"

const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)

const stockStore = useStockStore()
const { search, showStockAccordion, sortField, sortOrder, stockCount, fetchedDate, error, errorMessage } = storeToRefs(stockStore)
const { error: dateError } = storeToRefs(dateStore)
const { fetchStocks, resetFilter, toggleSort, clearError } = stockStore

const token = useCookie('token')

const route = useRoute()

useHead({
  link: [
    { rel: 'canonical', href: `https://idx-stocks-ownership.vercel.app${route.path}` },
  ],
})

watch(selectedDate, async (newDate, oldDate) => {
  if (!newDate || newDate === oldDate) return
  if (fetchedDate.value === newDate) return

  showStockAccordion.value = false
  if (token.value) await fetchStocks(token.value)
})

useSeoMeta({
  title: 'Daftar Saham Indonesia & Kepemilikan Investor (IDX) | IDX Stocks Ownership',
  description: 'Cek daftar saham Indonesia di BEI lengkap dengan data free float, jumlah investor, dan distribusi kepemilikan. Filter dan urutkan emiten berdasarkan ticker, free float, atau jumlah investor.',
  ogTitle: 'Daftar Saham Indonesia & Kepemilikan Investor (IDX)',
  ogDescription: 'Cek daftar saham Indonesia di BEI dengan data free float dan distribusi kepemilikan investor.',
  ogUrl: 'https://idx-stocks-ownership.vercel.app/saham',
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <h1 class="sr-only">Daftar Saham Indonesia &amp; Kepemilikan Investor (IDX)</h1>
    <div :class="cn(
      'w-full flex flex-col gap-y-3',
      'lg:w-auto lg:justify-between',
      'xl:flex-row xl:gap-y-0'
    )">
      <div :class="cn(
        'w-full flex flex-col gap-y-3',
        'lg:w-auto lg:flex-row lg:gap-x-4 lg:gap-y-0'
      )">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ trailing: 'pe-1', base: 'pr-8' }" :class="cn(
          'w-full',
          'lg:w-fit'
        )">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="void (search = '')" />
          </template>
        </UInput>

        <div :class="cn(
          'flex flex-col items-start gap-y-3',
          'md:flex-row md:items-center md:gap-x-4 md:gap-y-0'
        )">
          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <div :class="cn(
            'flex flex-col gap-y-1',
            'md:flex-row md:items-center md:gap-x-2 md:gap-y-0'
          )">
            <p class="text-xs text-gray-500 sm:text-sm">URUTKAN</p>

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

              <UButton label="Jumlah Investor" :trailing-icon="sortField === 'stockCount' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-tl-none rounded-bl-none cursor-pointer" :active="sortField === 'stockCount'"
                active-variant="solid" @click="toggleSort('stockCount')" />
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 md:inline" />

          <div class="flex items-center gap-x-4">
            <div class="flex items-center gap-x-2">
              <p class="text-xs text-gray-500 text-nowrap sm:text-sm">RESET FILTER</p>

              <UButton icon="i-lucide-rotate-ccw" class="cursor-pointer" :ui="{ leadingIcon: 'size-5' }" @click="resetFilter" />
            </div>

            <USeparator orientation="vertical" color="primary" class="h-6" />

            <p v-if="stockCount != 0" class="text-sm text-gray-500 text-nowrap">{{ stockCount.toLocaleString() }} emiten</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-x-2">
        <p class="text-xs text-gray-500 text-nowrap sm:text-sm">DATA PER</p>

        <USelect v-model="selectedDate" :items="dates" class="focus:ring focus:ring-gray-300" :ui="{ content: 'min-w-fit mr-6' }" />
      </div>
    </div>

    <div class="mt-4 md:mt-8">
      <UScrollArea v-if="!showStockAccordion && !error && !dateError" class="h-[calc(100vh-224px)] pr-4">
        <div class="space-y-4">
          <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
        </div>
      </UScrollArea>

      <ErrorCard v-else-if="error || dateError" :message="error ? errorMessage : 'Gagal terhubung ke server. Silakan muat ulang halaman.'" :on-retry="error ? () => { clearError(); if (token.value) fetchStocks(token.value) } : undefined" />

      <SahamAccordion v-else />
    </div>
  </main>
</template>
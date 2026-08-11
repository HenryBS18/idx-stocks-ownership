<script setup lang="ts">
import { useStockStore } from "~/stores/useStockStore"

const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)

const stockStore = useStockStore()
const { search, showStockAccordion, sortField, sortOrder, stockCount, fetchedDate, error, errorMessage } = storeToRefs(stockStore)
const { error: dateError } = storeToRefs(dateStore)
const { fetchStocks, resetFilter, toggleSort, clearError } = stockStore

const isFiltersOpen = ref(false)

const activeFilterCount = computed(() => {
  return sortField.value !== 'ticker' || sortOrder.value !== 'asc' ? 1 : 0
})

const filterButtonLabel = computed(() => activeFilterCount.value > 0 ? `Filter (${activeFilterCount.value})` : 'Filter')

const token = useCookie('token')

const handleStockRetry = () => {
  if (!token.value) return
  clearError()
  fetchStocks(token.value)
}

const handleDateRetry = () => {
  window.location.reload()
}

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
      'w-full flex flex-col gap-y-3 px-4',
      'xl:flex-row xl:flex-wrap xl:justify-between lg:pl-8 lg:pr-8',
      '2xl:gap-y-0'
    )">
      <div :class="cn(
        'w-full flex flex-col gap-y-3',
        'xl:w-fit xl:flex-row xl:gap-x-4 xl:gap-y-0'
      )">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." :ui="{ trailing: 'pe-1', base: 'pr-8' }" :class="cn(
          'w-full',
          'xl:w-fit'
        )">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="void (search = '')" />
          </template>
        </UInput>

        <div class="flex items-center justify-between gap-x-3 xl:hidden">
          <UButton :label="filterButtonLabel" icon="i-lucide-list-filter" variant="outline" color="neutral" :aria-expanded="isFiltersOpen"
            aria-controls="stock-filters" @click="isFiltersOpen = !isFiltersOpen" />

          <div v-if="!dateError" class="flex items-center gap-x-2">
            <p class="text-[13px] font-medium text-muted text-nowrap">DATA PER</p>

            <USelect v-model="selectedDate" :items="dates" aria-label="Data per" class="focus:ring focus:ring-gray-300"
              :ui="{ content: 'min-w-fit mr-6' }" />
          </div>
        </div>

        <div class="hidden xl:flex xl:items-center xl:gap-x-4">
          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <div class="flex items-center gap-x-2">
            <p class="text-[13px] md:text-sm font-medium text-muted">URUTKAN</p>

            <div class="flex">
              <UButton label="Ticker" :trailing-icon="sortField === 'ticker' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-a-z'
                : 'i-lucide-arrow-down-z-a'
                " variant="outline" class="rounded-tr-none rounded-br-none" :active="sortField === 'ticker'" active-variant="solid"
                @click="toggleSort('ticker')" />

              <UButton label="Free Float (%)" :trailing-icon="sortField === 'freeFloat' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-none" :active="sortField === 'freeFloat'" active-variant="solid"
                @click="toggleSort('freeFloat')" />

              <UButton label="Jumlah Investor" :trailing-icon="sortField === 'stockCount' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-tl-none rounded-bl-none" :active="sortField === 'stockCount'" active-variant="solid"
                @click="toggleSort('stockCount')" />
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 xl:inline" />

          <div class="flex items-center gap-x-4">
            <UButton label="Reset filter" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="resetFilter" />

            <USeparator v-if="showStockAccordion" orientation="vertical" color="primary" class="h-6" />

            <p v-if="showStockAccordion" class="text-[13px] md:text-sm text-muted text-nowrap">{{ stockCount.toLocaleString() }}
              emiten
            </p>
          </div>
        </div>
      </div>

      <div v-if="!dateError" class="hidden items-center gap-x-2 xl:flex">
        <p class="text-[13px] md:text-sm font-medium text-muted text-nowrap">DATA PER</p>

        <USelect v-model="selectedDate" :items="dates" aria-label="Data per" class="focus:ring focus:ring-gray-300"
          :ui="{ content: 'min-w-fit mr-6' }" />
      </div>

      <section v-if="isFiltersOpen" id="stock-filters" class="w-full rounded-xl border border-accented bg-default p-3 sm:p-4 xl:hidden">
        <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
          <div class="flex w-full flex-col items-start gap-2">
            <p class="text-[13px] font-medium text-muted">URUTKAN</p>

            <div class="flex w-full max-w-full">
              <UButton label="Ticker" :trailing-icon="sortField === 'ticker' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-a-z'
                : 'i-lucide-arrow-down-z-a'
                " variant="outline" class="shrink-0 rounded-tr-none rounded-br-none" :ui="{ label: 'max-[400px]:text-[11px]' }"
                :active="sortField === 'ticker'" active-variant="solid" @click="toggleSort('ticker')" />

              <UButton label="Free Float (%)" :trailing-icon="sortField === 'freeFloat' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="shrink-0 rounded-none" :ui="{ label: 'max-[400px]:text-[11px]' }" :active="sortField === 'freeFloat'"
                active-variant="solid" @click="toggleSort('freeFloat')" />

              <UButton label="Jumlah Investor" :trailing-icon="sortField === 'stockCount' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="shrink-0 rounded-tl-none rounded-bl-none" :ui="{ label: 'max-[400px]:text-[11px]' }"
                :active="sortField === 'stockCount'" active-variant="solid" @click="toggleSort('stockCount')" />
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-start border-t border-accented pt-3">
          <UButton label="Reset filter" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="resetFilter" />
        </div>
      </section>

      <p v-if="showStockAccordion" class="self-start text-[13px] text-muted text-nowrap xl:hidden">
        {{ stockCount.toLocaleString() }} emiten
      </p>
    </div>

    <div class="mt-4 md:mt-8">
      <UScrollArea v-if="!showStockAccordion && !error && !dateError" class="h-[calc(100vh-224px)] pr-4">
        <div class="space-y-4">
          <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
        </div>
      </UScrollArea>

      <ErrorCard v-else-if="error || dateError" :message="error ? errorMessage : 'Gagal terhubung ke server. Silakan muat ulang halaman.'"
        :on-retry="error ? handleStockRetry : handleDateRetry" />

      <SahamAccordion v-else-if="stockCount > 0" />

      <EmptyCard v-else message="Tidak ada emiten yang cocok dengan pencarian atau filter saat ini." :on-reset="resetFilter" />
    </div>
  </main>
</template>

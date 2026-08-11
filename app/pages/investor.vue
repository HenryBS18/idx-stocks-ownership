<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"
import { investorOrigin, investorType } from "~/utils/constants"

const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)

const store = useInvestorStore()
const { investorCount, search, selectedInvestorOrigin, selectedInvestorTypes, showInvestorsAccordion, sortField, sortOrder, fetchedDate, error, errorMessage } = storeToRefs(store)
const { error: dateError } = storeToRefs(dateStore)
const { fetchInvestors, resetFilter, toggleSort, clearError } = store

const isFiltersOpen = ref(false)

const activeFilterCount = computed(() => {
  let count = 0

  if (selectedInvestorOrigin.value !== 'Semua') count++
  if (!selectedInvestorTypes.value.includes('Semua')) count++
  if (sortField.value !== 'name' || sortOrder.value !== 'asc') count++

  return count
})

const filterButtonLabel = computed(() => activeFilterCount.value > 0 ? `Filter (${activeFilterCount.value})` : 'Filter')

const handleInvestorRetry = () => {
  if (!token.value) return
  clearError()
  fetchInvestors(token.value)
}

const handleDateRetry = () => {
  window.location.reload()
}

const investorTypeItems = computed(() => {
  return investorType.map((type) => ({
    label: type,
    type: 'checkbox',
    checked: selectedInvestorTypes.value.includes(type),
    onUpdateChecked(checked: boolean) {
      if (type === 'Semua') {
        selectedInvestorTypes.value = ['Semua']
        return
      }

      const set = new Set(selectedInvestorTypes.value)

      if (checked) {
        set.add(type)
        set.delete('Semua')
      } else {
        set.delete(type)
      }

      if (set.size === 0) {
        set.add('Semua')
      }

      selectedInvestorTypes.value = Array.from(set)
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }))
}) satisfies ComputedRef<DropdownMenuItem[]>

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

  showInvestorsAccordion.value = false
  if (token.value) await fetchInvestors(token.value)
})

useSeoMeta({
  title: 'Data Investor Saham Indonesia (IDX) - Kepemilikan & Distribusi Investor | IDX Stocks Ownership',
  description: 'Lihat data lengkap investor saham di Bursa Efek Indonesia (IDX), termasuk asal (lokal/asing), tipe investor, dan portofolio kepemilikan saham. Filter berdasarkan tipe dan asal investor.',
  ogTitle: 'Data Investor Saham Indonesia (IDX) - Kepemilikan & Distribusi Investor',
  ogDescription: 'Lihat data investor saham Indonesia di IDX berdasarkan tipe, asal, dan portofolio kepemilikan.',
  ogUrl: 'https://idx-stocks-ownership.vercel.app/investor',
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <h1 class="sr-only">Data Investor Saham Indonesia (IDX) - Kepemilikan &amp; Distribusi Investor</h1>
    <div :class="cn(
      'w-full flex flex-col gap-y-3 px-4',
      'xl:flex-row xl:flex-wrap xl:justify-between lg:pl-8 lg:pr-8',
      '2xl:gap-y-0'
    )">
      <div :class="cn(
        'w-full flex flex-col gap-y-3',
        'xl:w-fit xl:flex-row xl:items-center xl:gap-x-4 xl:gap-y-0'
      )">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari investor..." :ui="{ trailing: 'pe-1', base: 'pr-8' }" :class="cn(
          'w-full',
          'xl:w-fit'
        )">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="void (search = '')" />
          </template>
        </UInput>

        <div class="flex items-center justify-between gap-x-3 max-[360px]:gap-x-0 xl:hidden">
          <UButton :label="filterButtonLabel" icon="i-lucide-list-filter" variant="outline" color="neutral" :aria-expanded="isFiltersOpen"
            aria-controls="investor-filters" :ui="{ leadingIcon: 'max-[360px]:size-3', label: 'max-[360px]:text-xs' }"
            @click="isFiltersOpen = !isFiltersOpen" />

          <div v-if="!dateError" class="flex items-center gap-x-2">
            <p class="text-[13px] font-medium text-muted text-nowrap max-[360px]:text-xs">DATA PER</p>

            <USelect v-model="selectedDate" :items="dates" class="focus:ring focus:ring-gray-300"
              :ui="{ content: 'min-w-fit mr-6', value: 'max-[360px]:text-xs' }" />
          </div>
        </div>

        <div class="hidden xl:flex xl:items-center xl:gap-x-4">
          <USeparator orientation="vertical" color="primary" class="hidden h-6 xl:inline" />

          <div class="flex items-center gap-x-4">
            <div class="flex items-center gap-x-2">
              <p class="text-[13px] md:text-sm font-medium text-muted">ASAL</p>

              <USelect v-model="selectedInvestorOrigin" :items="investorOrigin" class="focus:ring focus:ring-gray-300" />
            </div>

            <USeparator orientation="vertical" color="primary" class="hidden h-6 md:inline" />

            <div class="flex items-center gap-x-2">
              <p class="text-[13px] md:text-sm font-medium text-muted">TIPE</p>

              <UDropdownMenu :items="investorTypeItems" :ui="{ viewport: 'max-h-64 overflow-y-auto' }">
                <UButton :label="selectedInvestorTypes.includes('Semua') ? 'Semua' : `${selectedInvestorTypes.length} dipilih`" variant="outline"
                  color="neutral" trailing-icon="i-lucide-chevron-down" :ui="{ label: 'font-medium' }" />
              </UDropdownMenu>
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <div class="flex items-center gap-x-2">
            <p class="text-[13px] md:text-sm font-medium text-muted">URUTKAN</p>

            <div class="flex">
              <UButton label="Nama" :trailing-icon="sortField === 'name' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-a-z'
                : 'i-lucide-arrow-down-z-a'
                " variant="outline" class="rounded-tr-none rounded-br-none" :active="sortField === 'name'" active-variant="solid"
                @click="toggleSort('name')" />

              <UButton label="Jumlah Saham" :trailing-icon="sortField === 'stockCount' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-tl-none rounded-bl-none" :active="sortField === 'stockCount'" active-variant="solid"
                @click="toggleSort('stockCount')" />
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <div class="flex items-center gap-x-4">
            <div class="flex items-center gap-x-2">
              <p class="text-[13px] md:text-sm font-medium text-muted text-nowrap">RESET FILTER</p>

              <UButton icon="i-lucide-rotate-ccw" :ui="{ leadingIcon: 'size-5' }" @click="resetFilter" />
            </div>

            <USeparator v-if="showInvestorsAccordion && investorCount != 0" class="h-6" orientation="vertical" color="primary" />

            <p v-if="showInvestorsAccordion && investorCount != 0" class="text-[13px] md:text-sm text-muted text-nowrap">{{
              investorCount.toLocaleString()
            }} investor</p>
          </div>
        </div>
      </div>

      <div v-if="!dateError" class="hidden items-center gap-x-2 xl:flex">
        <p class="text-[13px] md:text-sm font-medium text-muted text-nowrap">DATA PER</p>

        <USelect v-model="selectedDate" :items="dates" class="focus:ring focus:ring-gray-300" :ui="{ content: 'min-w-fit mr-6' }" />
      </div>

      <section v-if="isFiltersOpen" id="investor-filters" class="w-full rounded-xl border border-accented bg-default p-3 sm:p-4 xl:hidden">
        <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
          <div class="flex items-center gap-x-2">
            <p class="text-[13px] font-medium text-muted">ASAL</p>

            <USelect v-model="selectedInvestorOrigin" :items="investorOrigin" class="focus:ring focus:ring-gray-300" />
          </div>

          <div class="flex items-center gap-x-2">
            <p class="text-[13px] font-medium text-muted">TIPE</p>

            <UDropdownMenu :items="investorTypeItems" :ui="{ viewport: 'max-h-64 overflow-y-auto' }">
              <UButton :label="selectedInvestorTypes.includes('Semua') ? 'Semua' : `${selectedInvestorTypes.length} dipilih`" variant="outline"
                color="neutral" trailing-icon="i-lucide-chevron-down" :ui="{ label: 'font-medium' }" />
            </UDropdownMenu>
          </div>

          <div class="flex items-center gap-x-2">
            <p class="text-[13px] font-medium text-muted">URUTKAN</p>

            <div class="flex">
              <UButton label="Nama" :trailing-icon="sortField === 'name' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-a-z'
                : 'i-lucide-arrow-down-z-a'
                " variant="outline" class="rounded-tr-none rounded-br-none" :active="sortField === 'name'" active-variant="solid"
                @click="toggleSort('name')" />

              <UButton label="Jumlah Saham" :trailing-icon="sortField === 'stockCount' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-tl-none rounded-bl-none" :active="sortField === 'stockCount'" active-variant="solid"
                @click="toggleSort('stockCount')" />
            </div>
          </div>
        </div>

        <div class="mt-4 flex border-t border-accented pt-3">
          <UButton label="Reset filter" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" @click="resetFilter" />
        </div>
      </section>

      <p v-if="showInvestorsAccordion && investorCount !== 0" class="self-start text-[13px] text-muted text-nowrap xl:hidden">
        {{ investorCount.toLocaleString() }} investor
      </p>
    </div>

    <div class="mt-4 md:mt-8">
      <UScrollArea v-if="!showInvestorsAccordion && !error && !dateError" class="h-[calc(100vh-224px)] pr-4">
        <div class="space-y-4">
          <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
        </div>
      </UScrollArea>

      <ErrorCard v-else-if="error || dateError" :message="error ? errorMessage : 'Gagal terhubung ke server. Silakan muat ulang halaman.'"
        :on-retry="error ? handleInvestorRetry : handleDateRetry" />

      <InvestorAccordion v-else />
    </div>
  </main>
</template>

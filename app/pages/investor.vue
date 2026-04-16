<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"
import { investorOrigin, investorType } from "~/utils/constants"

const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)

const store = useInvestorStore()
const { investorCount, search, selectedInvestorOrigin, selectedInvestorType, showInvestorsAccordion, sortField, sortOrder, fetchedDate } = storeToRefs(store)
const { fetchInvestors, resetFilter, toggleSort } = store

const investorTypeItems = computed(() => {
  return investorType.map((type) => ({
    label: type,
    type: 'checkbox',
    checked: selectedInvestorType.value.includes(type),
    onUpdateChecked(checked: boolean) {
      if (type === 'Semua') {
        selectedInvestorType.value = ['Semua']
        return
      }

      const set = new Set(selectedInvestorType.value)

      if (checked) {
        set.add(type)
        set.delete('Semua')
      } else {
        set.delete(type)
      }

      if (set.size === 0) {
        set.add('Semua')
      }

      selectedInvestorType.value = Array.from(set)
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }))
}) satisfies ComputedRef<DropdownMenuItem[]>

watch(selectedDate, async (newDate, oldDate) => {
  if (!newDate || newDate === oldDate) return
  if (fetchedDate.value === newDate) return

  showInvestorsAccordion.value = false
  await fetchInvestors()
}, {
  immediate: true
})

useSeoMeta({
  title: 'Data Investor Saham Indonesia (IDX) - Kepemilikan & Distribusi Investor | IDX Stocks Ownership',
  description: 'Eksplorasi data investor saham di Bursa Efek Indonesia (IDX), termasuk asal, tipe (individu, institusi), dan jumlah kepemilikan saham. Filter dan analisis investor dengan mudah.'
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <div :class="cn(
      'w-full flex flex-col gap-y-3',
      'xl:flex-row xl:flex-wrap xl:justify-between 2xl:gap-y-0'
    )">
      <div :class="cn(
        'w-full flex flex-col items-start gap-y-3',
        'xl:w-fit xl:flex-row xl:items-center xl:gap-x-4 xl:gap-y-0'
      )">
        <!-- search -->
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari investor..." :ui="{ trailing: 'pe-1', base: 'pr-8' }" :class="cn(
          'w-full',
          'xl:w-fit'
        )">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="search = ''" />
          </template>
        </UInput>

        <div :class="cn(
          'flex flex-col items-start gap-y-3',
          'lg:flex-row lg:items-center lg:gap-x-4 xl:gap-y-0'
        )">
          <USeparator orientation="vertical" color="primary" class="hidden h-6 xl:inline" />

          <div :class="cn(
            'flex items-center gap-x-4',
          )">
            <!-- from -->
            <div class="flex items-center gap-x-2">
              <p class="text-xs text-gray-500 md:text-[13px] lg:text-sm">ASAL</p>

              <USelect v-model="selectedInvestorOrigin" :items="investorOrigin" class="focus:ring focus:ring-gray-300" />
            </div>

            <USeparator orientation="vertical" color="primary" class="hidden h-6 md:inline" />

            <!-- type -->
            <div class="flex items-center gap-x-2">
              <p class="text-xs text-gray-500 md:text-[13px] lg:text-sm">TIPE</p>

              <UDropdownMenu :items="investorTypeItems">
                <UButton :label="selectedInvestorType.includes('Semua') ? 'Semua' : `${selectedInvestorType.length} dipilih`" variant="outline"
                  color="neutral" trailing-icon="i-lucide-chevron-down" />
              </UDropdownMenu>
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <!-- sort button -->
          <div class="flex items-center gap-x-2">
            <p class="text-xs text-gray-500 md:text-[13px] lg:text-sm">URUTKAN</p>

            <div class="flex">
              <UButton label="Nama" :trailing-icon="sortField === 'nama' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-a-z'
                : 'i-lucide-arrow-down-z-a'
                " variant="outline" class="rounded-tr-none rounded-br-none cursor-pointer" :active="sortField === 'nama'" active-variant="solid"
                @click="toggleSort('nama')" />

              <UButton label="Jumlah Saham" :trailing-icon="sortField === 'stock-count' && sortOrder === 'asc'
                ? 'i-lucide-arrow-up-0-1'
                : 'i-lucide-arrow-down-1-0'
                " variant="outline" class="rounded-tl-none rounded-bl-none cursor-pointer" :active="sortField === 'stock-count'"
                active-variant="solid" @click="toggleSort('stock-count')" />
            </div>
          </div>

          <USeparator orientation="vertical" color="primary" class="hidden h-6 lg:inline" />

          <!-- reset filter -->
          <div :class="cn(
            'flex items-center gap-x-4'
          )">
            <div class="flex items-center gap-x-2">
              <p class="text-xs text-xs-500 text-nowrap md:text-[13px] lg:text-sm">RESET FILTER</p>

              <UButton icon="i-lucide-rotate-ccw" class="cursor-pointer" :ui="{ leadingIcon: 'size-5' }" @click="resetFilter" />
            </div>

            <USeparator class="h-6" orientation="vertical" color="primary" />

            <p v-if="investorCount != 0" class="text-sm text-gray-500 text-nowrap">{{ investorCount.toLocaleString() }} investor</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-x-2">
        <p class="text-xs text-xs-500 text-nowrap md:text-[13px] lg:text-sm">DATA PER</p>

        <USelect v-model="selectedDate" :items="dates" class="focus:ring focus:ring-gray-300" :ui="{ content: 'min-w-fit mr-6' }" />
      </div>
    </div>

    <div class="mt-4 md:mt-8">
      <UScrollArea v-if="!showInvestorsAccordion" class="h-[calc(100vh-224px)] pr-4">
        <div class="space-y-4">
          <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
        </div>
      </UScrollArea>

      <InvestorAccordion v-else />
    </div>
  </main>
</template>
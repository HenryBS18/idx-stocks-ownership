<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"
import { investorOrigin, investorType } from "~/utils/constants"

const InvestorAccordion = defineAsyncComponent(() => import("~/components/InvestorAccordion.vue"))

const store = useInvestorStore()
const { investorCount, lastUpdatedDate, search, selectedInvestorOrigin, selectedInvestorType, showInvestorsAccordion, sortField, sortOrder } = storeToRefs(store)
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

onMounted(() => {
  requestAnimationFrame(() => {
    if (investorCount.value === 0) fetchInvestors()
  })
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
    <div class="flex items-end justify-between">
      <div class="flex items-center space-x-4">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari investor..." :ui="{ trailing: 'pe-1' }">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="search = ''" />
          </template>
        </UInput>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <div class="flex items-center space-x-2">
          <p class="text-sm text-gray-500">ASAL</p>

          <USelect v-model="selectedInvestorOrigin" :items="investorOrigin" class="focus:ring focus:ring-gray-300" />
        </div>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <div class="flex items-center space-x-2">
          <p class="text-sm text-gray-500">TIPE</p>

          <UDropdownMenu :items="investorTypeItems">
            <UButton :label="selectedInvestorType.includes('Semua') ? 'Semua' : `${selectedInvestorType.length} dipilih`" color="neutral"
              variant="outline" trailing-icon="i-lucide-chevron-down" />
          </UDropdownMenu>
        </div>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <div class="flex items-center space-x-2">
          <p class="text-sm text-gray-500">URUTKAN</p>

          <div class="flex">
            <UButton label="Nama" :trailing-icon="sortField === 'nama' && sortOrder === 'asc'
              ? 'i-lucide-arrow-up-a-z'
              : 'i-lucide-arrow-down-z-a'
              " variant="outline" class="rounded-tr-none rounded-br-none cursor-pointer" :active="sortField === 'nama'" active-variant="solid"
              @click="toggleSort('nama')" />

            <UButton label="Jumlah Saham" :trailing-icon="sortField === 'stock-count' && sortOrder === 'asc'
              ? 'i-lucide-arrow-up-0-1'
              : 'i-lucide-arrow-down-1-0'
              " variant="outline" class="rounded-tl-none rounded-bl-none cursor-pointer" :active="sortField === 'stock-count'" active-variant="solid"
              @click="toggleSort('stock-count')" />
          </div>
        </div>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <div class="flex items-center space-x-2">
          <p class="text-sm text-gray-500">RESET FILTER</p>

          <UButton icon="i-lucide-rotate-ccw" class="cursor-pointer" @click="resetFilter" />
        </div>

        <USeparator class="h-6" orientation="vertical" color="primary" />

        <p v-if="investorCount != 0" class="text-sm text-gray-500">{{ investorCount.toLocaleString() }} investor</p>
      </div>

      <p v-if="lastUpdatedDate" class="text-sm text-gray-400">Data Per: {{ lastUpdatedDate }}</p>
    </div>

    <UScrollArea v-if="!showInvestorsAccordion" class="mt-8 h-[calc(100vh-224px)] pr-4">
      <div class="space-y-4">
        <USkeleton class="w-full h-16 rounded-lg" v-for="i in 20" :key="i" />
      </div>
    </UScrollArea>

    <InvestorAccordion v-else />
  </main>
</template>
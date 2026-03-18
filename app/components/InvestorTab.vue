<script setup lang="ts">
import { watchDebounced } from "@vueuse/core"
import type { InvestorSortField, InvestorStock, InvestorStockResponse } from "~/types"

const InvestorAccordion = defineAsyncComponent(() => import("~/components/InvestorAccordion.vue"))

const investors = ref<InvestorStock[]>([])
const lastUpdatedDate = ref<string>('')
const showInvestorsAccordion = ref<boolean>(false)
const search = ref<string>("")
const searchDebounced = ref("")
const sortField = ref<InvestorSortField>('nama')
const sortOrder = ref<'asc' | 'desc'>('asc')

const filteredInvestors = computed<InvestorStock[]>(() => {
  let result = [...investors.value]

  if (searchDebounced.value) {
    const q = searchDebounced.value.toLowerCase()

    result = result.filter(investor =>
      investor.investorName.toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => {
    let compare = 0

    if (sortField.value === 'nama') {
      compare = a.investorName.localeCompare(b.investorName)
    }

    if (sortField.value === 'stock-count') {
      compare = Number(a.stockCount) - Number(b.stockCount)
    }

    return sortOrder.value === 'asc' ? compare : -compare
  })

  return result
})

const toggleSort = (field: InvestorSortField) => {
  sortField.value = field
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

watchDebounced(search, (v) => {
  searchDebounced.value = v
}, { debounce: 500 })

onMounted(() => {
  requestAnimationFrame(async () => {
    const { data, lastUpdated } = await $fetch<InvestorStockResponse>('/api/investor')
    investors.value = data
    lastUpdatedDate.value = lastUpdated
    showInvestorsAccordion.value = true
  })
})
</script>

<template>
  <div class="py-2">
    <div class="flex items-end justify-between">
      <div class="flex space-x-10">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari investor..." :ui="{ trailing: 'pe-1' }">
          <template v-if="search?.length" #trailing>
            <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="search = ''" />
          </template>
        </UInput>

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

      <p class="text-sm text-gray-600">Last Updated: {{ lastUpdatedDate }}</p>
    </div>

    <div v-if="!showInvestorsAccordion && filteredInvestors.length === 0" class="mt-6 space-y-3">
      <USkeleton class="w-full h-16 rounded-lg" v-for="i in 8" :key="i" />
    </div>

    <InvestorAccordion v-else :investors="filteredInvestors" />
  </div>
</template>
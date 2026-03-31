<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { useInfiniteScroll } from "@vueuse/core"

const store = useInvestorStore()
const { filteredInvestors } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleInvestors = computed(() =>
  filteredInvestors.value.slice(0, visibleCount.value)
)

const stockColumns: TableColumn<unknown, unknown>[] = [
  {
    header: '#',
    cell: ({ row }) => row.index + 1,
  },
  {
    header: 'Kode Saham',
    accessorKey: 'ticker',
  },
  {
    header: 'Nama Saham',
    accessorKey: 'name',
  },
  {
    header: 'Total Lembar Saham',
    accessorKey: 'totalHoldingShare',
    cell: ({ row }: any) =>
      Number(row.original.totalHoldingShare).toLocaleString()
  },
  {
    header: 'Kepemilikan (%)',
    accessorKey: 'percentage',
    cell: ({ row }: any) => row.original.percentage + '%',
  }
]

const toggle = (i: number) => {
  open.value = open.value.includes(i) ? [] : [i]
}

onMounted(() => {
  useInfiniteScroll(
    el,
    () => {
      if (visibleCount.value < filteredInvestors.value.length) {
        visibleCount.value += pageSize
      }
    },
    {
      distance: 100,
      behavior: "smooth",
    }
  )
})
</script>

<template>
  <UScrollArea class="mt-8 h-[calc(100vh-224px)] pr-4" ref="el">
    <div class="space-y-4">
      <div v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div class="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100" @click="toggle(i)">

          <span class="font-semibold text-gray-600">{{ investor.investorName }}</span>

          <UBadge :label="`${investor.stockCount} saham`" color="secondary" variant="soft" />
          <UBadge :label="investor.investorType" color="error" variant="soft" v-if="investor.investorType" />
          <UBadge :label="investor.localForeign" color="primary" variant="soft" v-if="investor.localForeign" />

          <div class="ml-auto flex items-center space-x-3">
            <p class="text-xs text-gray-500">{{ investor.domicile }}</p>

            <UIcon name="i-lucide-chevron-down" class="transition-transform" :class="{ 'rotate-180': open.includes(i) }" />
          </div>
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="investor.stocks" :columns="stockColumns" :ui="{
            thead: 'bg-gray-100',
            tr: 'hover:bg-gray-100'
          }" />
        </div>
      </div>
    </div>
  </UScrollArea>
</template>
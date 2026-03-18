<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { useInfiniteScroll } from "@vueuse/core"
import type { Stock } from "~/types"

const props = defineProps<{
  stocks: Stock[]
}>()

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleStocks = computed(() =>
  props.stocks.slice(0, visibleCount.value)
)

const investorColumns: TableColumn<unknown, unknown>[] = [
  {
    header: '#',
    cell: ({ row }) => row.index + 1,
  },
  {
    header: 'Nama Investor',
    accessorKey: 'investorName',
  },
  {
    header: 'Tipe',
    accessorKey: 'investorType',
  },
  {
    header: 'Lokal/Foreign',
    accessorKey: 'localForeign',
  },
  {
    header: 'Domisili',
    accessorKey: 'domicile',
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
    footer: ({ table }) => table.getRowModel().rows.reduce((acc, curr: any) => acc += Number(curr.original.percentage), 0).toFixed(2) + '%'
  }
]

const toggle = (i: number) => {
  open.value = open.value.includes(i) ? [] : [i]
}

onMounted(() => {
  useInfiniteScroll(
    el,
    () => {
      if (visibleCount.value < props.stocks.length) {
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
      <div v-for="(stock, i) in visibleStocks" :key="stock.ticker" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div class="flex items-center gap-3 p-4 cursor-pointer" @click="toggle(i)">
          <UBadge :label="stock.ticker" size="lg" />

          <span class="text-sm font-semibold text-gray-600">{{ stock.name }}</span>

          <UBadge :label="`Free Float (${stock.freeFloat}%)`" color="secondary" variant="soft" />
          <UBadge :label="`${stock.investorCount} Investor >1%`" color="error" variant="soft" />

          <div class="ml-auto">
            <UIcon name="i-lucide-chevron-down" class="transition-transform" :class="{ 'rotate-180': open.includes(i) }" />
          </div>
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="stock.investors" :columns="investorColumns" />
        </div>
      </div>
    </div>
  </UScrollArea>
</template>
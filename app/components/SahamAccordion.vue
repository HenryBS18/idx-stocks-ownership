<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { useInfiniteScroll } from "@vueuse/core"

const store = useStockStore()
const { filteredStocks } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleStocks = computed(() =>
  filteredStocks.value.slice(0, visibleCount.value)
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
    header: 'Asal',
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
      if (visibleCount.value < filteredStocks.value.length) {
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
  <UScrollArea ref="el" :class="cn(
    'h-[calc(100vh-224px)] pr-2',
    'sm:pr-3',
    'md:pr-4'
  )">
    <div class="space-y-4">
      <div v-for="(stock, i) in visibleStocks" :key="stock.ticker" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div :class="cn(
          'w-full flex items-center justify-between gap-x-3 px-2.5 py-3 cursor-pointer hover:bg-gray-100',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-x-3 gap-y-2 min-w-0',
            'sm:flex-row'
          )">
            <div :class="cn(
              'flex items-center gap-x-1.5',
              'sm:gap-x-3'
            )">
              <UBadge :label="stock.ticker" />

              <span :class="cn(
                'text-[11px] font-semibold text-gray-600 truncate',
                'sm:text-xs',
                'xl:text-sm'
              )">
                {{ stock.name }}
              </span>
            </div>

            <div :class="cn(
              'flex gap-x-2 gap-y-1.5',
              'sm:gap-x-3 sm:gap-y-0'
            )">
              <UBadge :label="`Free Float (${stock.freeFloat}%)`" color="secondary" variant="soft"
                class="w-fit text-[10px] sm:text-[11px] xl:text-xs" />
              <UBadge :label="`${stock.investorCount} Investor >1%`" color="error" variant="soft"
                class="w-fit text-[10px] sm:text-[11px] xl:text-xs" />
            </div>
          </div>

          <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="stock.investors" :columns="investorColumns" :ui="{
            thead: 'bg-gray-100',
            tr: 'hover:bg-gray-100'
          }" />
        </div>
      </div>
    </div>
  </UScrollArea>
</template>
<script setup lang="ts">
import { UBadge } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { useInfiniteScroll } from "@vueuse/core"
import { h } from "vue"

const store = useStockStore()
const { filteredStocks } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleStocks = computed(() =>
  filteredStocks.value.slice(0, visibleCount.value)
)

const formatChange = (change: number) =>
  `${change > 0 ? '+' : ''}${Math.round(change * 100) / 100}`

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
    cell: ({ row }: any) => row.original.investorType || '-',
  },
  {
    header: 'Asal',
    accessorKey: 'origin',
    cell: ({ row }: any) => row.original.origin || '-',
  },
  {
    header: 'Lembar Saham',
    accessorKey: 'totalHoldingShare',
    cell: ({ row }: any) =>
      Number(row.original.totalHoldingShare).toLocaleString()
  },
  {
    header: 'Kepemilikan (%)',
    accessorKey: 'percentage',
    cell: ({ row }: any) => {
      const { change, percentage, hasPrevData } = row.original
      let badge = null
      if (change !== null && change !== 0) {
        badge = h(UBadge, {
          label: formatChange(change),
          color: change > 0 ? 'success' : 'error',
          variant: 'soft',
        })
      } else if (change === null && hasPrevData) {
        badge = h(UBadge, { label: 'baru', color: 'success', variant: 'soft' })
      }
      return h('div', { class: 'flex items-center gap-2' }, [
        percentage + '%',
        badge,
      ])
    },
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
  <UScrollArea ref="el" class="h-[calc(100vh-224px)] pb-4 pr-4 lg:pr-6">
    <div class="space-y-4 ml-4 lg:ml-8">
      <article v-for="(stock, i) in visibleStocks" :key="stock.ticker" class="bg-white border border-gray-200 shadow-md rounded-xl">
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

              <h2 :class="cn(
                'text-xs font-semibold text-gray-800 truncate',
                'sm:text-sm',
                'xl:text-base'
              )">
                {{ stock.name }}
              </h2>
            </div>

            <div :class="cn(
              'flex gap-x-2 gap-y-1.5',
              'sm:gap-x-3 sm:gap-y-0'
            )">
              <UBadge :label="`Free Float (${stock.freeFloat}%)`" color="secondary" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge :label="`${stock.investorCount} Investor >1%`" color="error" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
            </div>
          </div>

          <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="stock.investors" :columns="investorColumns" />
        </div>
      </article>
    </div>
  </UScrollArea>
</template>
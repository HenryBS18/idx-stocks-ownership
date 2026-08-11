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

const visibleStocks = computed(() => filteredStocks.value.slice(0, visibleCount.value))

const investorColumns: TableColumn<unknown, unknown>[] = [
  {
    header: '#',
    meta: {
      class: {
        th: 'text-center px-2 sm:px-3',
        td: 'text-center px-2 sm:px-3',
      }
    },
    cell: ({ row }) => row.index + 1,
  },
  {
    header: 'Nama Investor',
    accessorKey: 'investorName',
    meta: {
      class: {
        th: 'max-sm:max-w-48 max-sm:pl-2 max-sm:pr-0',
        td: 'max-sm:max-w-48 max-sm:pl-2 max-sm:pr-0',
      }
    },
    cell: ({ row }: any) => {
      const { investorName, investorType, localForeign } = row.original
      const normalizedLocalForeign = localForeign?.trim()
      const badges = []

      if (investorType) {
        badges.push(h(UBadge, { color: 'secondary', variant: 'soft', class: 'text-[9px] h-auto py-1' },
          h('span', investorType)
        ))
      }

      if (normalizedLocalForeign) {
        badges.push(h(UBadge, { label: normalizedLocalForeign, color: normalizedLocalForeign === 'D' ? 'primary' : 'error', variant: 'soft', class: 'text-[9px] h-fit font-bold' }))
      }

      return h('div', { class: 'flex flex-col gap-0.5' }, [
        h('span', { class: 'line-clamp-2 whitespace-normal wrap-break-word text-[10px] font-bold sm:text-xs xl:text-sm xl:line-clamp-none', }, investorName),
        badges.length ? h('div', { class: 'flex gap-1 sm:hidden' }, badges) : null,
      ])
    },
  },
  {
    header: 'Tipe',
    accessorKey: 'investorType',
    meta: {
      class: {
        th: 'hidden sm:table-cell lg:max-w-64 max-xl:px-0',
        td: 'hidden sm:table-cell lg:max-w-64 max-xl:px-0',
      },
    },
    cell: ({ row }: any) => {
      return h('span', { class: 'line-clamp-3 whitespace-normal wrap-break-word sm:text-xs lg:text-sm' }, row.original.investorType || '-')
    },
  },
  {
    header: 'Asal',
    accessorKey: 'localForeign',
    meta: {
      class: {
        th: 'hidden sm:table-cell lg:table-cell',
        td: 'hidden sm:table-cell',
      },
    },
    cell: ({ row }: any) => {
      const { localForeign, domicile } = row.original

      if (!localForeign) return h('span', { class: 'sm:text-xs lg:text-sm' }, '-')

      if (localForeign === 'D') {
        return h(UBadge, { label: localForeign, color: 'primary', variant: 'soft', class: 'hidden h-fit sm:inline font-bold' }, 'D')
      }

      return h('div', { class: 'flex items-center gap-1.5' }, [
        h(UBadge, { label: localForeign, color: 'error', variant: 'soft', class: 'hidden h-fit sm:inline font-bold' }, 'F'),
        domicile ? h('span', { class: 'line-clamp-2 whitespace-normal wrap-break-word sm:text-xs lg:text-sm' }, domicile) : null
      ])
    },
  },
  {
    header: 'Saham',
    accessorKey: 'totalHoldingShare',
    meta: {
      class: {
        th: 'max-sm:text-end max-sm:px-2',
        td: 'max-sm:text-end max-sm:px-2',
      }
    },
    cell: ({ row }: any) => {
      const value = Number(row.original.totalHoldingShare)

      return h('span', [
        h('span', { class: 'hidden lg:inline' }, value.toLocaleString()),
        h('span', { class: 'lg:hidden' }, formatShareCompact(value)),
      ])
    }
  },
  {
    header: '%',
    accessorKey: 'percentage',
    meta: {
      class: {
        th: 'max-sm:text-end max-sm:pl-1',
        td: 'max-sm:text-end max-sm:pl-1',
      }
    },
    cell: ({ row }: any) => {
      const { change, percentage, hasPrevData } = row.original
      let changesText = null

      if (change !== null && change !== 0) {
        changesText = h('span', { class: change > 0 ? 'font-semibold text-success' : 'font-semibold text-error' }, `(${formatChange(change)})`)
      } else if (change === null && hasPrevData) {
        changesText = h('span', { class: 'font-semibold text-success' }, '(Baru)')
      }

      return h('div', { class: 'flex items-center gap-1.5 max-sm:gap-0 max-sm:flex-col max-sm:items-end' }, [
        h('span', { class: 'font-bold' }, `${percentage}%`),
        changesText,
      ])
    },
    footer: ({ table }) => h(
      'span',
      { class: 'font-bold text-black' },
      table.getRowModel().rows.reduce((acc, curr: any) => acc += Number(curr.original.percentage), 0).toFixed(2) + '%'
    )
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
      <article v-for="(stock, i) in visibleStocks" :key="stock.ticker" class="bg-default border border-accented shadow-md rounded-xl">
        <div :class="cn(
          'w-full flex items-center justify-between gap-x-3 px-2.5 py-3 cursor-pointer hover:bg-elevated',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-x-3 gap-y-2 min-w-0',
            'sm:flex-1 sm:flex-row sm:min-w-0'
          )">
            <div :class="cn(
              'flex items-center gap-x-1.5 min-w-0',
              'sm:gap-x-3'
            )">
              <UBadge :label="stock.ticker" />

              <h2 :class="cn(
                'min-w-0 flex-1 text-xs font-semibold text-highlighted truncate',
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
              <UBadge :label="`${stock.investorCount} Investor`" color="neutral" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge :label="`Free Float (${stock.freeFloat}%)`" color="secondary" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
            </div>
          </div>

          <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
        </div>

        <div v-if="open.includes(i)" class="border-t border-accented">
          <UTable :data="stock.investors" :columns="investorColumns" />
        </div>
      </article>
    </div>
  </UScrollArea>
</template>

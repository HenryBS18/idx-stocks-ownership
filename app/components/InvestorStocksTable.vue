<script setup lang="ts">
import { UBadge, NuxtLink } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { InvestorStockTableRow } from '~/types/holdings-table'
import { h } from 'vue'

defineProps<{ rows: InvestorStockTableRow[] }>()

const stockColumns: TableColumn<InvestorStockTableRow>[] = [
  {
    header: '#',
    meta: {
      class: {
        th: 'text-center px-2 sm:px-3 sm:w-16',
        td: 'text-center px-2 sm:px-3 sm:w-16',
      }
    },
    cell: ({ row }) => row.index + 1,
  },
  {
    header: () => h('div', [
      h('span', { class: 'hidden lg:inline' }, 'Kode Saham'),
      h('span', { class: 'inline lg:hidden' }, 'Kode'),
    ]),
    accessorKey: 'ticker',
    meta: {
      class: {
        th: 'px-0 w-10 lg:w-20',
        td: 'px-0 w-10 lg:w-20',
      }
    },
    cell: ({ row }) => h(NuxtLink, { to: `/saham/${row.original.ticker}`, class: 'hover:underline' }, () => h(UBadge, { label: row.original.ticker }))
  },
  {
    header: 'Nama Saham',
    accessorKey: 'name',
    meta: {
      class: {
        th: 'w-64 max-sm:pl-2 max-sm:pr-0.5 sm:w-92 md:w-96 xl:w-110',
        td: 'w-64 max-sm:pl-2 max-sm:pr-0.5 sm:w-92 md:w-96 xl:w-110',
      }
    },
    cell: ({ row }) => h('span', { class: 'whitespace-normal wrap-break-word line-clamp-2 font-bold text-[10px] sm:text-xs xl:text-sm xl:line-clamp-none' }, row.original.name)
  },
  {
    header: 'Sektor',
    accessorKey: 'sector',
    meta: {
      class: {
        th: 'hidden sm:table-cell w-32',
        td: 'hidden sm:table-cell w-32',
      }
    },
    cell: ({ row }) => {
      const sector = row.original.sector
      if (!sector) return h('span', { class: 'sm:text-xs lg:text-sm' }, '-')
      return h(UBadge, { label: sector, color: 'sector', variant: 'soft', class: 'w-fit text-[11px] sm:text-xs' })
    }
  },
  {
    header: () => h('div', [
      h('span', { class: 'hidden lg:inline' }, 'Lembar Saham'),
      h('span', { class: 'inline lg:hidden' }, 'Saham'),
    ]),
    accessorKey: 'totalHoldingShare',
    meta: {
      class: {
        th: 'max-sm:text-end max-sm:px-2 sm:w-33',
        td: 'max-sm:text-end max-sm:px-2 sm:w-33',
      }
    },
    cell: ({ row }) => {
      const value = row.original.totalHoldingShare
      return h('span', [
        h('span', { class: 'hidden sm:inline' }, formatTableShares(value)),
        h('span', { class: 'inline sm:hidden' }, formatShareCompact(value)),
      ])
    }
  },
  {
    header: () => h('div', [
      h('span', { class: 'hidden sm:inline' }, 'Kepemilikan (%)'),
      h('span', { class: 'inline sm:hidden' }, '%'),
    ]),
    accessorKey: 'percentage',
    meta: {
      class: {
        th: 'max-sm:text-end max-sm:pl-1',
        td: 'max-sm:text-end max-sm:pl-1',
      }
    },
    cell: ({ row }) => {
      const { change, percentage, hasPrevData } = row.original
      let badge = null

      if (change !== null && change !== 0) {
        badge = h('span', { class: change > 0 ? 'text-success' : 'text-error' }, `(${formatChange(change)})`)
      } else if (change === null && hasPrevData) {
        badge = h('span', { class: 'text-success' }, '(Baru)')
      }

      return h('div', { class: 'flex items-center gap-1.5 font-bold max-sm:gap-0 max-sm:flex-col max-sm:items-end' }, [
        percentage + '%',
        badge,
      ])
    },
  }
]
</script>

<template>
  <UTable :data="rows" :columns="stockColumns" />
</template>

<script setup lang="ts">
import { UBadge, NuxtLink, HoldingRelationshipBadge } from '#components'
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
    cell: ({ row }) => h('div', { class: 'flex min-w-0 flex-col items-start gap-x-1.5 gap-y-1 sm:flex-row sm:flex-wrap sm:items-center' }, [
      h('span', { title: row.original.name, class: 'min-w-0 max-w-full line-clamp-2 whitespace-normal wrap-break-word font-bold text-[10px] sm:text-xs xl:text-sm xl:line-clamp-none' }, row.original.name),
      h(HoldingRelationshipBadge, { value: row.original.controllerOrAffiliate }),
    ])
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
  <div>
    <UTable :data="rows" :columns="stockColumns" />
    <p class="px-3 py-2 text-[10px] text-muted sm:px-4 sm:text-xs">
      Label Pengendali/Afiliasi mengikuti data periode yang dipilih. Tanpa label berarti informasi belum tersedia atau tidak disebutkan.
    </p>
  </div>
</template>

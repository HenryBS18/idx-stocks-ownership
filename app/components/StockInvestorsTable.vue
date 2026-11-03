<script setup lang="ts">
import { UBadge, NuxtLink, HoldingRelationshipBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { StockInvestorTableRow } from '~/types/holdings-table'
import { h } from 'vue'

defineProps<{ rows: StockInvestorTableRow[] }>()

const investorColumns: TableColumn<StockInvestorTableRow>[] = [
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
    cell: ({ row }) => {
      const { investorName, investorSlug, investorType, localForeign, controllerOrAffiliate } = row.original
      const normalizedLocalForeign = localForeign?.trim()
      const badges = []

      if (investorType) {
        badges.push(h(UBadge, { color: 'secondary', variant: 'soft', class: 'max-w-full whitespace-normal text-[9px] h-auto py-1' },
          h('span', { class: 'wrap-anywhere' }, investorType)
        ))
      }

      if (normalizedLocalForeign === 'D' || normalizedLocalForeign === 'F') {
        badges.push(h(UBadge, { label: normalizedLocalForeign, color: normalizedLocalForeign === 'D' ? 'primary' : 'error', variant: 'soft', class: 'text-[9px] h-fit font-bold' }))
      }

      if (controllerOrAffiliate === 'CONTROLLER' || controllerOrAffiliate === 'AFFILIATE') {
        badges.push(h(HoldingRelationshipBadge, { value: controllerOrAffiliate }))
      }

      return h('div', { class: 'flex flex-col gap-0.5' }, [
        h('div', { class: 'flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1' }, [
          investorSlug
            ? h(NuxtLink, { to: `/investor/${investorSlug}`, title: investorName, class: 'min-w-0 max-w-full line-clamp-2 whitespace-normal wrap-break-word text-[10px] font-bold ownership-link sm:text-xs xl:text-sm xl:line-clamp-none' }, () => investorName)
            : h('span', { title: investorName, class: 'min-w-0 max-w-full line-clamp-2 whitespace-normal wrap-break-word text-[10px] font-bold sm:text-xs xl:text-sm xl:line-clamp-none' }, investorName),
          h(HoldingRelationshipBadge, { value: controllerOrAffiliate, class: 'hidden sm:inline-flex' }),
        ]),
        badges.length ? h('div', { class: 'flex flex-wrap items-center gap-1 sm:hidden' }, badges) : null,
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
    cell: ({ row }) => {
      return h('span', { class: 'line-clamp-3 whitespace-normal wrap-anywhere sm:text-xs lg:text-sm' }, row.original.investorType || '-')
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
    cell: ({ row }) => {
      const { localForeign, domicile } = row.original
      const trimmed = localForeign?.trim()

      if (!trimmed || (trimmed !== 'D' && trimmed !== 'F')) {
        return h('span', { class: 'sm:text-xs lg:text-sm' }, '-')
      }

      if (trimmed === 'D') {
        return h(UBadge, { label: 'D', color: 'primary', variant: 'soft', class: 'hidden h-fit sm:inline font-bold' }, 'D')
      }

      return h('div', { class: 'flex items-center gap-1.5' }, [
        h(UBadge, { label: 'F', color: 'error', variant: 'soft', class: 'hidden h-fit sm:inline font-bold' }, 'F'),
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
    cell: ({ row }) => {
      const value = row.original.totalHoldingShare

      return h('span', [
        h('span', { class: 'hidden lg:inline' }, formatTableShares(value)),
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
    cell: ({ row }) => {
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
      { class: 'font-bold text-highlighted' },
      table.getRowModel().rows.reduce((acc, curr) => acc += Number(curr.original.percentage), 0).toFixed(2) + '%'
    )
  }
]
</script>

<template>
  <div>
    <UTable :data="rows" :columns="investorColumns" />
    <p class="px-3 py-2 text-[10px] text-muted sm:px-4 sm:text-xs">
      Label Pengendali/Afiliasi mengikuti data periode yang dipilih. Tanpa label berarti informasi belum tersedia atau tidak disebutkan.
    </p>
  </div>
</template>

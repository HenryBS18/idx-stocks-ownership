<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import type { Stock } from "~/types"

const props = defineProps<{
  stocks: Stock[]
}>()

const open = ref<number[]>([])

const toggle = (i: number) => {
  open.value = open.value.includes(i) ? [] : [i]
}

const investorColumns: TableColumn<unknown, unknown>[] = [
  {
    header: '#',
    cell: ({ row }) => row.index + 1
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
    header: '%',
    accessorKey: 'percentage',
    footer: ({ table }) => table.getRowModel().rows.reduce((acc, curr: any) => acc += Number(curr.original.percentage), 0).toFixed(2) + '%'
  }
]
</script>

<template>
  <UScrollArea class="mt-8 h-[calc(100vh-224px)]">
    <div v-for="(stock, i) in stocks" :key="stock.ticker">
      <div class="flex items-center gap-3 p-4 cursor-pointer" @click="toggle(i)">
        <UBadge :label="stock.ticker" size="lg" />

        <span class="font-semibold text-gray-600">{{ stock.name }}</span>

        <UBadge :label="`Free Float (${stock.freeFloat}%)`" color="secondary" variant="soft" />

        <div class="ml-auto">
          <UIcon name="i-lucide-chevron-down" class="transition-transform" :class="{ 'rotate-180': open.includes(i) }" />
        </div>
      </div>

      <div v-if="open.includes(i)">
        <UTable :data="stock.investors" :columns="investorColumns" />
      </div>
    </div>
  </UScrollArea>
</template>
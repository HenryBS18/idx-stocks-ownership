<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import type { InvestorStock } from "~/types"

const props = defineProps<{
  investors: InvestorStock[]
}>()

const open = ref<number[]>([])

const toggle = (i: number) => {
  open.value = open.value.includes(i) ? [] : [i]
}

const stockColumns: TableColumn<unknown, unknown>[] = [
  {
    header: '#',
    cell: ({ row }) => row.index + 1
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
    header: '%',
    accessorKey: 'percentage',
  }
]
</script>

<template>
  <UScrollArea class="mt-8 h-[calc(100vh-224px)]">
    <div v-for="(investor, i) in investors" :key="investor.investorName">
      <div class="flex items-center gap-3 p-4 cursor-pointer" @click="toggle(i)">

        <span class="font-semibold text-gray-600">{{ investor.investorName }}</span>

        <UBadge :label="`${investor.stockCount} saham`" color="secondary" variant="soft" />
        <UBadge :label="investor.investorType" color="error" variant="soft" v-if="investor.investorType" />
        <UBadge :label="investor.localForeign" color="primary" variant="soft" v-if="investor.localForeign" />

        <div class="ml-auto">
          <UIcon name="i-lucide-chevron-down" class="transition-transform" :class="{ 'rotate-180': open.includes(i) }" />
        </div>
      </div>

      <div v-if="open.includes(i)">
        <UTable :data="investor.stocks" :columns="stockColumns" />
      </div>
    </div>
  </UScrollArea>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { h } from "vue"
import { UBadge } from "#components"
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

const formatChange = (change: number) =>
  `${change > 0 ? '+' : ''}${Math.round(change * 100) / 100}`

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
  <UScrollArea :class="cn(
    'h-[calc(100vh-224px)] pr-2',
    'sm:pr-3',
    'md:pr-4'
  )" ref="el">
    <div class="space-y-4">
      <article v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div :class="cn(
          'flex items-center justify-between px-2.5 py-3 cursor-pointer hover:bg-gray-100 w-full gap-x-3',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-y-1 min-w-0',
            'sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0 sm:min-w-fit'
          )">
            <h2 :class="cn(
              'font-semibold text-xs text-gray-800 truncate',
              'sm:text-sm',
              'xl:text-base'
            )">
              {{ investor.investorName }}
            </h2>

            <div :class="cn(
              'flex gap-x-2',
              'sm:gap-x-3'
            )">
              <UBadge :label="`${investor.stockCount} saham`" color="secondary" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge v-if="investor.investorType" :label="investor.investorType" color="error" variant="soft"
                class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge v-if="investor.localForeign" :label="investor.localForeign" color="primary" variant="soft"
                class="w-fit text-[11px] sm:text-xs xl:text-sm" />
            </div>
          </div>

          <div class="flex items-center gap-x-3">
            <p :class="cn(
              'text-xs text-gray-600 text-end',
              'sm:text-sm'
            )">
              {{ investor.domicile }}
            </p>

            <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
          </div>
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="investor.stocks" :columns="stockColumns" />
        </div>
      </article>
    </div>
  </UScrollArea>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
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
    cell: ({ row }: any) => row.original.percentage + '%',
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
      <div v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div :class="cn(
          'flex items-center justify-between px-2.5 py-3 cursor-pointer hover:bg-gray-100 w-full gap-x-3',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-y-1 min-w-0',
            'sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0 sm:min-w-fit'
          )">
            <span :class="cn(
              'font-semibold text-[11px] text-gray-600 truncate',
              'sm:text-xs',
              'xl:text-sm'
            )">
              {{ investor.investorName }}
            </span>

            <div :class="cn(
              'flex gap-x-2',
              'sm:gap-x-3'
            )">
              <UBadge :label="`${investor.stockCount} saham`" color="secondary" variant="soft" class="w-fit text-[10px] sm:text-[11px] xl:text-xs" />
              <UBadge v-if="investor.investorType" :label="investor.investorType" color="error" variant="soft"
                class="w-fit text-[10px] sm:text-[11px] xl:text-xs" />
              <UBadge v-if="investor.localForeign" :label="investor.localForeign" color="primary" variant="soft"
                class="w-fit text-[10px] sm:text-[11px] xl:text-xs" />
            </div>
          </div>

          <div class="flex items-center gap-x-3">
            <p :class="cn(
              'text-[10px] text-gray-500 text-end',
              'sm:text-xs'
            )">
              {{ investor.domicile }}
            </p>

            <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
          </div>
        </div>

        <div v-if="open.includes(i)" class="border-t border-gray-200">
          <UTable :data="investor.stocks" :columns="stockColumns" />
        </div>
      </div>
    </div>
  </UScrollArea>
</template>
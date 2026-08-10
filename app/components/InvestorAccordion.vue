<script setup lang="ts">
import { UBadge } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { useInfiniteScroll } from "@vueuse/core"
import { h } from "vue"

const store = useInvestorStore()
const { filteredInvestors } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleInvestors = computed(() => filteredInvestors.value.slice(0, visibleCount.value))

const stockColumns: TableColumn<unknown, unknown>[] = [
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
    cell: ({ row }: any) => h(UBadge, { label: row.original.ticker, })
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
    cell: ({ row }: any) => h('span', { class: 'whitespace-normal wrap-break-word line-clamp-2 font-bold text-[10px] sm:text-xs xl:text-sm xl:line-clamp-none' }, row.original.name)
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
    cell: ({ row }: any) => {
      const value = Number(row.original.totalHoldingShare)
      return h('span', [
        h('span', { class: 'hidden sm:inline' }, value.toLocaleString()),
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
    cell: ({ row }: any) => {
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
  <UScrollArea ref="el" class="h-[calc(100vh-224px)] pb-4 pr-4 lg:pr-6">
    <div class="space-y-4 ml-4 lg:ml-8">
      <article v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="bg-white border border-gray-200 shadow-md rounded-xl">
        <div :class="cn(
          'flex items-center justify-between px-2.5 py-3 cursor-pointer hover:bg-gray-100 w-full gap-x-3',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-y-1 min-w-0',
            'sm:flex-1 sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0 sm:min-w-0'
          )">
            <h2 :class="cn(
              'min-w-0 font-semibold text-xs text-gray-800 truncate',
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

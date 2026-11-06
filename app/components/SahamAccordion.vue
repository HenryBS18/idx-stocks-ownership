<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core"

const store = useStockStore()
const { filteredStocks } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const route = useRoute()
const autoOpened = ref(false)

watch(filteredStocks, (stocks) => {
  if (autoOpened.value || !route.query.q || stocks.length !== 1) return

  autoOpened.value = true
  open.value = [0]
}, { immediate: true })

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleStocks = computed(() => filteredStocks.value.slice(0, visibleCount.value))

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
  <UScrollArea ref="el" class="h-[calc(100vh-266px)] sm:h-[calc(100vh-252px)] pb-4 pr-4 lg:pr-6">
    <div class="space-y-4 ml-4 lg:ml-8">
      <article v-for="(stock, i) in visibleStocks" :key="stock.ticker" class="bg-default border border-accented shadow-md rounded-xl">
        <button type="button" :aria-expanded="open.includes(i)" :aria-controls="`stock-accordion-panel-${i}`" :class="cn(
          'w-full flex items-center justify-between gap-x-3 px-2.5 py-3 cursor-pointer text-start hover:bg-elevated',
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
              <UBadge :label="`Free Float ${stock.freeFloat}%`" color="secondary" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge v-if="stock.sector" :label="stock.sector" color="sector" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
              <UBadge v-if="stock.hscConcentration !== null" :label="`HSC ${stock.hscConcentration}%`" color="error" variant="soft" class="w-fit text-[11px] sm:text-xs xl:text-sm" />
            </div>
          </div>

          <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
        </button>

        <NuxtLink :to="`/saham/${stock.ticker}`" class="flex items-center gap-2 border-t border-accented px-4 py-2 text-xs font-medium text-primary hover:bg-elevated">
          Lihat detail {{ stock.ticker }} <UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
        </NuxtLink>

        <Transition enter-active-class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="grid-rows-[0fr]" enter-to-class="grid-rows-[1fr]"
          leave-active-class="grid transition-[grid-template-rows] duration-250 ease-in motion-reduce:transition-none"
          leave-from-class="grid-rows-[1fr]" leave-to-class="grid-rows-[0fr]">
          <div v-if="open.includes(i)" :id="`stock-accordion-panel-${i}`" class="grid border-t border-accented">
            <div class="min-h-0 overflow-hidden">
              <StockInvestorsTable :rows="stock.investors" />
            </div>
          </div>
        </Transition>
      </article>
    </div>
  </UScrollArea>
</template>

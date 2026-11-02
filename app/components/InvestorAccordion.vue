<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core"

const store = useInvestorStore()
const { filteredInvestors } = storeToRefs(store)

const open = ref<number[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageSize = 20
const visibleCount = ref(pageSize)

const visibleInvestors = computed(() => filteredInvestors.value.slice(0, visibleCount.value))

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
  <UScrollArea ref="el" class="h-[calc(100vh-266px)] sm:h-[calc(100vh-252px)] pb-4 pr-4 lg:pr-6">
    <div class="space-y-4 ml-4 lg:ml-8">
      <article v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="bg-default border border-accented shadow-md rounded-xl">
        <button type="button" :aria-expanded="open.includes(i)" :aria-controls="`investor-accordion-panel-${i}`" :class="cn(
          'flex items-center justify-between px-2.5 py-3 cursor-pointer text-start hover:bg-elevated w-full gap-x-3',
          'sm:p-4'
        )" @click="toggle(i)">
          <div :class="cn(
            'flex flex-col gap-y-1 min-w-0',
            'sm:flex-1 sm:flex-row sm:items-center sm:gap-x-3 sm:gap-y-0 sm:min-w-0'
          )">
            <h2 :class="cn(
              'min-w-0 font-semibold text-xs text-highlighted truncate',
              'sm:text-sm',
              'xl:text-base'
            )">
              {{ investor.investorName }}
            </h2>

            <div :class="cn(
              'flex min-w-0 flex-nowrap gap-x-2',
              'sm:gap-x-3'
            )">
              <UBadge :label="`${investor.stockCount} saham`" color="neutral" variant="soft"
                class="w-fit shrink-0 text-[11px]  sm:text-xs xl:text-sm" />
              <UBadge v-if="investor.investorType" :label="investor.investorType" color="secondary" variant="soft"
                class="min-w-0 max-w-32 shrink truncate text-[11px]  sm:max-w-40 sm:text-xs md:max-w-56 xl:max-w-72 xl:text-sm" />
              <UBadge v-if="['D','F'].includes(investor.localForeign?.trim() ?? '')" :label="investor.localForeign.trim()"
                :color="investor.localForeign.trim() === 'D' ? 'primary' : 'error'" variant="soft"
                class="w-fit shrink-0 text-[11px] font-bold sm:text-xs xl:text-sm" />
            </div>
          </div>

          <div class="flex items-center gap-x-3">
            <p :class="cn(
              'text-[10px] text-muted text-end',
              'sm:text-xs',
              'xl:text-sm'
            )">
              {{ investor.domicile }}
            </p>

            <UIcon name="i-lucide-chevron-down" class="transition-transform shrink-0" :class="{ 'rotate-180': open.includes(i) }" />
          </div>
        </button>

        <NuxtLink v-if="investor.investorSlug" :to="`/investor/${investor.investorSlug}`" class="flex items-center gap-2 border-t border-accented px-4 py-2 text-xs font-medium text-primary hover:bg-elevated">
          Lihat portofolio investor <UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
        </NuxtLink>

        <Transition enter-active-class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="grid-rows-[0fr]" enter-to-class="grid-rows-[1fr]"
          leave-active-class="grid transition-[grid-template-rows] duration-250 ease-in motion-reduce:transition-none"
          leave-from-class="grid-rows-[1fr]" leave-to-class="grid-rows-[0fr]">
          <div v-if="open.includes(i)" :id="`investor-accordion-panel-${i}`" class="grid border-t border-accented">
            <div class="min-h-0 overflow-hidden">
              <InvestorStocksTable :rows="investor.stocks" />
            </div>
          </div>
        </Transition>
      </article>
    </div>
  </UScrollArea>
</template>

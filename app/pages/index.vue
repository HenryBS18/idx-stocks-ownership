<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui"

const tabItems: TabsItem[] = [
  { label: 'Saham', slot: 'stock', icon: 'i-lucide-chart-candlestick' },
  { label: 'Investor', slot: 'investor', icon: 'i-lucide-user' },
]
</script>

<template>
  <div class="bg-gray-50">
    <UHeader title="IDX 1% Ownership" :ui="{ container: 'max-w-none' }" />

    <div class="px-8 py-4">
      <UTabs :items="tabItems" variant="link" :ui="{
        list: 'w-full',
        trigger: 'flex-1 justify-center cursor-pointer',
        indicator: 'h-1',
      }">
        <template #stock>
          <StockTab />
        </template>

        <template #investor>
          <InvestorTab />
        </template>
      </UTabs>
    </div>
  </div>
</template>
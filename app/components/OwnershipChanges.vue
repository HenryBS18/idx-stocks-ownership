<script setup lang="ts">
import type { OwnershipDetail, DetailHolding } from '~~/shared/types/detail'
const props = defineProps<{ detail: OwnershipDetail }>()
const groups = computed(() => [
  { label: 'Meningkat', rows: props.detail.holdings.filter(row => row.changeKind === 'increased').sort((a, b) => b.change! - a.change!) },
  { label: 'Menurun', rows: props.detail.holdings.filter(row => row.changeKind === 'decreased').sort((a, b) => a.change! - b.change!) },
  { label: 'Baru tercatat', rows: props.detail.holdings.filter(row => row.changeKind === 'new') },
  { label: 'Tidak lagi tercatat', rows: props.detail.removedHoldings },
])
const label = (row: DetailHolding) => props.detail.kind === 'stock' ? row.investorName : row.ticker
const link = (row: DetailHolding) => props.detail.kind === 'stock'
  ? row.investorSlug ? `/investor/${row.investorSlug}` : null
  : `/saham/${row.ticker}`
</script>

<template>
  <section aria-labelledby="changes-heading" class="space-y-4">
    <div>
      <h2 id="changes-heading" class="text-xl font-semibold text-highlighted">Perubahan kepemilikan</h2>
      <p v-if="detail.previousPeriod" class="mt-1 text-sm text-muted">{{ detail.previousPeriod.label }} → {{ detail.period.label }}. Selisih ditampilkan dalam poin persentase.</p>
      <p v-else class="mt-2 text-sm text-muted">Belum ada periode sebelumnya untuk dibandingkan.</p>
    </div>
    <template v-if="detail.previousPeriod">
      <div class="grid gap-4 md:grid-cols-2">
        <article v-for="group in groups" :key="group.label" class="rounded-xl border border-accented p-5">
          <h3 class="flex items-center justify-between gap-2 font-medium text-highlighted">{{ group.label }} <UBadge :label="String(group.rows.length)" color="neutral" variant="soft" /></h3>
          <p v-if="!group.rows.length" class="mt-4 text-sm text-muted">Tidak ada catatan.</p>
          <ul v-else class="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            <li v-for="row in group.rows" :key="`${row.ticker}:${row.investorName}`" class="flex items-start justify-between gap-4 text-sm">
              <NuxtLink v-if="link(row)" :to="link(row)!" class="min-w-0 break-words ownership-link">{{ label(row) }}</NuxtLink>
              <span v-else class="min-w-0 break-words">{{ label(row) }}</span>
              <span v-if="row.change !== null" class="shrink-0 tabular-nums" :class="row.change > 0 ? 'text-success' : 'text-error'">{{ formatPercentagePoints(row.change) }}</span>
              <span v-else class="shrink-0 text-right text-xs text-muted">{{ row.changeKind === 'removed' ? 'Sebelumnya ' : '' }}{{ formatOwnership(row.percentage) }}%</span>
            </li>
          </ul>
        </article>
      </div>
      <p class="text-xs leading-relaxed text-muted">Baru tercatat atau tidak lagi tercatat menunjukkan perubahan keberadaan dalam dataset, bukan konfirmasi transaksi beli atau jual.</p>
    </template>
  </section>
</template>

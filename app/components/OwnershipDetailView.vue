<script setup lang="ts">
import type { OwnershipDetail } from '~~/shared/types/detail'
import type { InvestorStockTableRow, StockInvestorTableRow } from '~/types/holdings-table'
import { getLargestShareholder } from '~/utils/ownership-ranking'

const props = defineProps<{ detail: OwnershipDetail }>()
defineEmits<{ selectPeriod: [value: string] }>()
const isStock = computed(() => props.detail.kind === 'stock')
const largestShareholder = computed(() => isStock.value ? getLargestShareholder(props.detail.holdings) : undefined)
const tableRows = computed(() => props.detail.holdings.map(row => ({
  ...row,
  name: row.stockName,
  // Show "Baru" only when the detail comparison confirms a new holding.
  hasPrevData: row.changeKind === 'new',
})) satisfies (StockInvestorTableRow & InvestorStockTableRow)[])
const sectors = computed(() => {
  const counts = new Map<string, number>()
  for (const row of props.detail.holdings) {
    const sector = row.sector ?? 'Belum diklasifikasikan'
    counts.set(sector, (counts.get(sector) ?? 0) + 1)
  }
  return [...counts].sort((a, b) => b[1] - a[1])
})
const sectorCount = computed(() => new Set(props.detail.holdings.map(row => row.sector).filter(Boolean)).size)
const increases = computed(() => props.detail.holdings.filter(row => row.changeKind === 'increased').length)
const decreases = computed(() => props.detail.holdings.filter(row => row.changeKind === 'decreased').length)
</script>

<template>
  <div class="space-y-7">
    <div class="flex flex-wrap justify-between gap-2 border-b border-accented pb-4 text-sm text-muted">
      <p>Data BEI per <strong class="font-medium text-toned">{{ detail.period.idxLastUpdated }}</strong></p>
      <p v-if="detail.previousPeriod">Pembanding: {{ detail.previousPeriod.label }}</p>
    </div>

    <div v-if="!detail.holdings.length" class="rounded-xl border border-accented bg-elevated/40 px-6 py-10 text-center">
      <UIcon name="i-lucide-calendar-search" class="mb-3 size-8 text-muted" />
      <h2 class="text-lg font-semibold text-highlighted">Data tidak tersedia untuk periode ini</h2>
      <p class="mt-2 text-sm text-muted">Tidak ada kepemilikan yang tercatat untuk {{ detail.period.label }}.</p>
      <UButton v-if="detail.latestAvailablePeriod && detail.latestAvailablePeriod.value !== detail.period.value"
        class="mt-5" variant="soft" :label="`Lihat ${detail.latestAvailablePeriod.label}`"
        @click="$emit('selectPeriod', detail.latestAvailablePeriod.value)" />
    </div>

    <template v-else>
      <dl class="grid gap-4 sm:grid-cols-2" :class="isStock ? 'lg:grid-cols-3' : 'lg:grid-cols-4'">
        <div class="rounded-xl border border-accented bg-default p-5">
          <dt class="text-sm text-muted">{{ isStock ? 'Investor tercatat' : 'Saham tercatat' }}</dt>
          <dd class="mt-2 text-3xl font-semibold tabular-nums text-highlighted">{{ detail.holdings.length.toLocaleString('id-ID') }}</dd>
        </div>
        <template v-if="isStock">
          <div class="rounded-xl border border-accented bg-default p-5">
            <dt class="text-sm text-muted">Pemegang saham terbesar yang tercatat</dt>
            <dd v-if="largestShareholder" class="mt-2 space-y-1">
              <span class="text-3xl font-semibold tabular-nums text-highlighted">{{ formatOwnership(largestShareholder.percentage) }}%</span>
              <NuxtLink v-if="largestShareholder.investorSlug" :to="`/investor/${largestShareholder.investorSlug}`" class="block break-words text-sm ownership-link">{{ largestShareholder.investorName }}</NuxtLink>
              <span v-else class="block break-words text-sm text-default">{{ largestShareholder.investorName }}</span>
            </dd>
          </div>
          <div class="rounded-xl border border-accented bg-primary/5 p-5">
            <dt class="text-sm text-muted">Free float</dt>
            <dd class="mt-2 text-3xl font-semibold tabular-nums text-primary">{{ formatOwnership(detail.freeFloat!) }}%</dd>
          </div>
        </template>
        <template v-else>
          <div class="rounded-xl border border-accented p-5">
            <dt class="text-sm text-muted">Sektor teridentifikasi</dt>
            <dd class="mt-2 text-3xl font-semibold tabular-nums text-highlighted">{{ sectorCount }}</dd>
          </div>
          <div class="rounded-xl border border-accented p-5">
            <dt class="text-sm text-muted">Kepemilikan meningkat</dt>
            <dd class="mt-2 text-3xl font-semibold tabular-nums text-success">{{ detail.previousPeriod ? increases : '—' }}</dd>
          </div>
          <div class="rounded-xl border border-accented p-5">
            <dt class="text-sm text-muted">Kepemilikan menurun</dt>
            <dd class="mt-2 text-3xl font-semibold tabular-nums text-error">{{ detail.previousPeriod ? decreases : '—' }}</dd>
          </div>
        </template>
      </dl>

      <StockOwnershipChart v-if="isStock" :holdings="detail.holdings" :remainder="detail.freeFloat!" />
      <section aria-labelledby="holdings-heading" class="space-y-4">
        <h2 id="holdings-heading" class="text-xl font-semibold text-highlighted">{{ isStock ? 'Daftar pemegang saham' : 'Daftar kepemilikan saham' }}</h2>
        <div class="overflow-hidden rounded-xl border border-accented bg-default shadow-md" role="region" aria-labelledby="holdings-heading" tabindex="0">
          <StockInvestorsTable v-if="isStock" :rows="tableRows" />
          <InvestorStocksTable v-else :rows="tableRows" />
        </div>
      </section>
    </template>

    <OwnershipChanges :detail="detail" />

    <section v-if="!isStock && sectors.length" class="rounded-xl border border-accented p-5 sm:p-6" aria-labelledby="sector-heading">
      <h2 id="sector-heading" class="text-xl font-semibold text-highlighted">Sebaran sektor</h2>
      <p class="mt-1 text-sm text-muted">Jumlah saham tercatat per sektor, bukan proporsi nilai portofolio.</p>
      <dl class="mt-5 grid gap-4 sm:grid-cols-2">
        <div v-for="[sector, count] in sectors" :key="sector" class="space-y-2">
          <div class="flex justify-between gap-3 text-sm"><dt>{{ sector }}</dt><dd class="shrink-0 font-medium">{{ count }} saham</dd></div>
          <div class="h-2 overflow-hidden rounded-full bg-elevated" aria-hidden="true"><div class="h-full rounded-full bg-primary" :style="{ width: `${count / detail.holdings.length * 100}%` }" /></div>
        </div>
      </dl>
    </section>

    <section class="space-y-3 border-t border-accented pt-6 text-sm leading-relaxed text-muted" aria-labelledby="method-heading">
      <h2 id="method-heading" class="font-semibold text-highlighted">Sumber dan cakupan data</h2>
      <p>Catatan mengikuti pengumuman BEI pada periode yang dipilih. Jumlah {{ isStock ? 'investor' : 'saham' }} mencakup entri yang tersedia dalam dataset ini.</p>
      <p v-if="isStock">Free float dihitung dari 100% dikurangi total persentase kepemilikan yang tercatat. Angka ini bukan penetapan free float resmi BEI.</p>
      <p v-else>Halaman ini menampilkan kepemilikan atas nama investor yang tercatat dalam dataset, sehingga belum tentu mencakup seluruh portofolionya.</p>
      <DataSourceNote />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DetailHolding } from '~~/shared/types/detail'
const props = defineProps<{ holdings: DetailHolding[]; remainder: number }>()
const colors = ['#15803d', '#0d9488', '#0284c7', '#7c3aed', '#c2410c', '#64748b', '#d1d5db']
const segments = computed(() => {
  const largest = props.holdings.slice(0, 5).map((row, i) => ({ label: row.investorName, value: row.percentage, color: colors[i] }))
  const rest = props.holdings.slice(5).reduce((sum, row) => sum + row.percentage, 0)
  const items = [...largest, { label: 'Investor tercatat lainnya', value: rest, color: colors[5] }, { label: 'Sisa perhitungan aplikasi', value: props.remainder, color: colors[6] }]
  let offset = 0
  return items.map((item) => {
    const segment = { ...item, offset }
    offset += item.value
    return segment
  }).filter(item => item.value > 0)
})
const valid = computed(() => props.remainder >= 0 && props.remainder <= 100 && props.holdings.every(row => row.percentage >= 0))
</script>

<template>
  <section class="rounded-xl border border-accented p-5 sm:p-6" aria-labelledby="distribution-heading">
    <h2 id="distribution-heading" class="text-xl font-semibold text-highlighted">Distribusi kepemilikan</h2>
    <div v-if="valid" class="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <svg viewBox="0 0 200 200" role="img" aria-labelledby="distribution-heading distribution-desc" class="size-52 shrink-0">
        <desc id="distribution-desc">Lima pemegang saham terbesar, investor tercatat lainnya, dan sisa perhitungan aplikasi. Persentase tersedia pada legenda.</desc>
        <circle v-for="segment in segments" :key="segment.label" cx="100" cy="100" r="78" fill="none" :stroke="segment.color" stroke-width="28"
          pathLength="100" :stroke-dasharray="`${segment.value} ${100 - segment.value}`" :stroke-dashoffset="-segment.offset" transform="rotate(-90 100 100)" />
        <text x="100" y="96" text-anchor="middle" class="fill-current text-2xl font-semibold">{{ formatOwnership(remainder) }}%</text>
        <text x="100" y="117" text-anchor="middle" class="fill-current text-xs">sisa perhitungan</text>
      </svg>
      <dl class="w-full min-w-0 space-y-3 text-sm">
        <div v-for="segment in segments" :key="segment.label" class="flex items-start justify-between gap-4">
          <dt class="flex min-w-0 items-start gap-2"><span class="mt-1 size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: segment.color }" /><span class="break-words">{{ segment.label }}</span></dt>
          <dd class="shrink-0 font-medium tabular-nums">{{ formatOwnership(segment.value) }}%</dd>
        </div>
      </dl>
    </div>
    <p v-else class="mt-4 text-sm text-muted">Grafik tidak ditampilkan karena total persentase berada di luar rentang 0–100%. Periksa angka pada tabel kepemilikan.</p>
    <p class="mt-5 text-xs leading-relaxed text-muted">Sisa perhitungan adalah 100% dikurangi kepemilikan tercatat. Angka ini bukan penetapan free float resmi BEI.</p>
  </section>
</template>

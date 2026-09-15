<script setup lang="ts">
const props = defineProps<{
  ticker: string
  name: string
  float: number
  freeFloat: number
  investorCount: number
  batchLabel: string
  isLive: boolean
}>()

const arc = computed(() => Math.min(100, Math.max(0, props.float)))
</script>

<template>
  <article class="relative rounded-3xl border border-accented bg-default p-5 shadow-xl shadow-green-950/5 sm:p-7">
    <div class="flex items-center justify-between gap-3 text-xs">
      <span class="font-semibold tracking-widest text-muted uppercase">Ringkasan kepemilikan saham</span>
      <UBadge :label="isLive ? 'Cuplikan data' : 'Contoh tetap'" variant="soft" />
    </div>
    <div class="mt-6 flex items-center gap-3">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UIcon name="i-lucide-building-2" class="size-6" />
      </span>
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-highlighted">{{ ticker }}</h2>
        <p class="text-xs text-muted wrap-break-word">{{ name }}</p>
      </div>
    </div>
    <div class="relative mx-auto my-6 size-56">
      <svg viewBox="0 0 200 200" role="img" :aria-label="`${ticker}: kepemilikan tercatat ${float}%, Free float aplikasi ${freeFloat}%`"
        class="size-full -rotate-90">
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="22" class="text-green-100 dark:text-green-950" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="22" pathLength="100"
          :stroke-dasharray="`${arc} ${100 - arc}`" class="text-green-600 dark:text-green-400" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span class="text-3xl font-bold tracking-tight text-highlighted tabular-nums">{{ freeFloat }}<span class="text-lg">%</span></span>
        <span class="mt-1 text-xs text-muted">Free float aplikasi</span>
      </div>
    </div>
    <dl class="space-y-3 text-sm">
      <div class="flex items-center justify-between gap-3">
        <dt class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-green-600 dark:bg-green-400" />Kepemilikan tercatat</dt>
        <dd class="font-semibold text-highlighted tabular-nums">{{ float }}%</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-green-100 ring-1 ring-green-600/30 dark:bg-green-950" />Free float
          aplikasi</dt>
        <dd class="font-semibold text-highlighted tabular-nums">{{ freeFloat }}%</dd>
      </div>
    </dl>
    <div class="mt-5 flex flex-wrap justify-between gap-2 border-t border-accented pt-4 text-xs text-muted">
      <span>{{ investorCount }} investor tercatat</span>
      <span>Per {{ batchLabel || 'periode belum tersedia' }}</span>
    </div>
  </article>
</template>

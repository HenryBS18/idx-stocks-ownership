<script setup lang="ts">
import type { OwnershipDetail } from '~~/shared/types/detail'

const props = defineProps<{ kind: 'stock' | 'investor'; identifier: string }>()
const dateStore = useDateStore()
const { dates, selectedDate } = storeToRefs(dateStore)
const token = useVisitorToken()
const query = computed(() => {
  const [year, month] = selectedDate.value.split('-')
  return { token: token.value, ...(year && month ? { year, month } : {}) }
})
const { data, status, error, refresh } = await useFetch<OwnershipDetail>(
  () => `/api/${props.kind}/${encodeURIComponent(props.identifier)}`,
  { query, dedupe: 'cancel' },
)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: props.kind === 'stock' ? 'Saham tidak ditemukan' : 'Investor tidak ditemukan' })
}

const site = useSiteConfig()
const listingPath = props.kind === 'stock' ? '/saham' : '/investor'
const listingLabel = props.kind === 'stock' ? 'Saham' : 'Investor'
const canonical = computed(() => `${site.url}${listingPath}/${encodeURIComponent(props.identifier)}`)
const name = computed(() => data.value?.identity.name ?? props.identifier)
const title = computed(() => props.kind === 'stock'
  ? `Pemegang Saham ${props.identifier} — ${name.value}`
  : `Portofolio Saham ${name.value}`)
const description = computed(() => props.kind === 'stock'
  ? `Lihat pemegang saham ${props.identifier}, persentase kepemilikan, perubahan antarperiode, dan free float hasil perhitungan aplikasi.`
  : `Lihat saham yang tercatat atas nama ${name.value}, jumlah lembar, persentase kepemilikan, dan perubahan antarperiode.`)

useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ogUrl: canonical })
useHead(() => ({
  link: [{ rel: 'canonical', key: 'canonical', href: canonical.value }],
  script: [{
    type: 'application/ld+json',
    key: 'detail-breadcrumbs',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: site.url },
        { '@type': 'ListItem', position: 2, name: listingLabel, item: `${site.url}${listingPath}` },
        { '@type': 'ListItem', position: 3, name: name.value, item: canonical.value },
      ],
    }).replace(/</g, '\\u003c'),
  }],
}))

const retry = () => dateStore.error ? reloadNuxtApp({ force: true }) : refresh()
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-7 px-4 py-3 sm:px-6 lg:px-8 lg:py-6">
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="listingPath" class="hover:text-primary">{{ listingLabel }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page" class="break-words text-highlighted">{{ kind === 'stock' ? identifier : name }}</span>
    </nav>

    <header class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
      <div class="min-w-0 space-y-2">
        <p class="text-sm font-medium text-primary">{{ kind === 'stock' ? 'Kepemilikan saham' : 'Portofolio tercatat' }}</p>
        <h1 class="break-words text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">{{ kind === 'stock' ? identifier : name }}</h1>
        <p v-if="kind === 'stock'" class="text-lg text-toned">{{ name }}</p>
        <div v-if="data" class="flex flex-wrap items-center gap-2">
          <UBadge v-if="data.identity.sector" :label="data.identity.sector" color="sector" variant="soft" />
          <UBadge v-if="data.identity.hscConcentration !== null" :label="`HSC ${data.identity.hscConcentration}%`" color="error" variant="soft" />
          <UBadge v-if="data.identity.investorType && status !== 'pending'" :label="data.identity.investorType" color="secondary" variant="soft" />
          <UBadge v-if="data.identity.localForeign && status !== 'pending'"
            :label="data.identity.localForeign === 'D' ? 'Domestic' : data.identity.localForeign === 'F' ? 'Foreign' : data.identity.localForeign"
            :color="data.identity.localForeign === 'F' ? 'error' : 'primary'" variant="soft" />
          <span v-if="data.identity.localForeign === 'F' && data.identity.domicile && status !== 'pending'" class="text-sm text-muted">{{ data.identity.domicile }}</span>
        </div>
      </div>
      <div class="shrink-0 space-y-2">
        <label for="detail-period" class="block text-sm font-medium text-toned">Periode data</label>
        <USelect id="detail-period" v-model="selectedDate" :items="dates" :disabled="!dates.length" class="w-full sm:min-w-52" aria-label="Periode data" />
        <p class="text-xs text-muted">Pilih bulan untuk melihat catatan sebelumnya.</p>
      </div>
    </header>

    <div v-if="status === 'pending'" role="status" aria-live="polite" class="space-y-5 py-5">
      <p class="text-sm text-muted">Memuat data periode pilihan…</p>
      <div class="grid gap-4 sm:grid-cols-3"><USkeleton v-for="i in 3" :key="i" class="h-28 rounded-xl" /></div>
      <USkeleton class="h-72 rounded-xl" />
    </div>
    <ErrorCard v-else-if="error || dateStore.error" message="Gagal memuat data. Silakan coba lagi." :on-retry="retry" />
    <OwnershipDetailView v-else-if="data" :detail="data" @select-period="selectedDate = $event" />
  </main>
</template>

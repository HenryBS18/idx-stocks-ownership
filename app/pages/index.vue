<script setup lang="ts">
import { DATA_LICENSE_NAME, DATA_LICENSE_PATH, IDX_ORG_URL, IDX_SOURCE_URL } from '~/utils/constants'

type TickerName = { ticker: string, name: string }

const { data: landing, status: landingStatus } = useFetch<LandingTeaser>('/api/landing')

const latestBatch = computed(() => landing.value?.batchLabel ?? '')

const emitenCount = computed(() => landing.value?.emitenCount ?? null)

const temporalCoverage = computed(() => {
  const coverage = landing.value?.coverage

  return coverage ? `${coverage.start}/${coverage.end}` : null
})

const { data: tickers, status: tickerStatus, execute: fetchTickers } = useFetch<TickerName[]>(
  '/api/stock/list',
  { immediate: false, lazy: true, default: () => [] }
)

const tickersRequested = ref(false)

const loadTickers = () => {
  if (tickersRequested.value && tickerStatus.value !== 'error') return
  tickersRequested.value = true
  fetchTickers()
}

const selectedTicker = ref<TickerName | undefined>()

watch(selectedTicker, (item) => {
  if (item) navigateTo({ path: '/saham', query: { q: item.ticker } })
})

const FALLBACK = {
  ticker: 'BBCA',
  name: 'BANK CENTRAL ASIA Tbk',
  sector: 'Finance' as string | null,
  investorCount: 5,
  float: 59.21,
  freeFloat: 40.79,
  batchLabel: '8 Mei 2026',
  investors: [
    { investorName: 'PT DWIMURIA INVESTAMA ANDALAN', investorType: '', localForeign: 'D', domicile: '', totalHoldingShare: 67_729_950_000, percentage: 54.94, change: null, hasPrevData: false },
    { investorName: 'ANTHONI SALIM', investorType: 'Individual', localForeign: 'D', domicile: '', totalHoldingShare: 1_416_306_835, percentage: 1.15, change: null, hasPrevData: false },
    { investorName: 'PT TRICIPTA MANDHALA GUMILANG', investorType: '', localForeign: 'D', domicile: '', totalHoldingShare: 1_313_250_000, percentage: 1.07, change: null, hasPrevData: false },
    { investorName: 'GOVERNMENT OF NORWAY', investorType: 'Sovereign Wealth Fund', localForeign: 'F', domicile: 'NORWAY', totalHoldingShare: 1_267_492_336, percentage: 1.03, change: null, hasPrevData: false },
    { investorName: 'PT CATURGUWIRATNA SUMAPALA', investorType: '', localForeign: 'D', domicile: '', totalHoldingShare: 1_261_750_000, percentage: 1.02, change: null, hasPrevData: false },
  ],
}

const isLive = computed(() => Boolean(landing.value?.stock?.investors?.length))

const sample = computed(() => {
  const live = landing.value?.stock

  if (!live || !live.investors.length) return FALLBACK

  return {
    ticker: live.ticker,
    name: live.name,
    sector: live.sector,
    investorCount: live.investorCount,
    float: live.float,
    freeFloat: live.freeFloat,
    batchLabel: landing.value?.batchLabel ?? '',
    investors: live.investors,
  }
})

const settling = computed(() => landingStatus.value === 'pending' && !isLive.value)

const visibleInvestors = computed(() => sample.value.investors)

const portfolioPreview = computed(() => sample.value.investors[0])
const changePreview = computed(() => sample.value.investors.find(investor =>
  investor.change !== 0 && (investor.change !== null || investor.hasPrevData)
))

const hiddenInvestorCount = computed(() =>
  Math.max(sample.value.investorCount - visibleInvestors.value.length, 0)
)

const dataStatus = computed(() => {
  if (settling.value) return 'Memuat data terbaru. Contoh tetap ditampilkan sementara.'
  if (landingStatus.value === 'error') return 'Data terbaru belum dapat dimuat. Menampilkan contoh tetap.'
  if (!isLive.value) return 'Cuplikan terbaru belum tersedia. Menampilkan contoh tetap.'
  return `Cuplikan data periode ${sample.value.batchLabel}`
})

const features = [
  { icon: 'i-lucide-users', title: 'Pemegang saham emiten', text: 'Lihat investor yang tercatat pada suatu emiten, beserta persentase kepemilikan dan asal lokal atau asing.', to: '/saham', link: 'Lihat Pemegang Saham', kind: 'owners' },
  { icon: 'i-lucide-folders', title: 'Portofolio saham investor', text: 'Cari nama investor untuk melihat saham yang dimilikinya berdasarkan catatan pada periode pilihanmu.', to: '/investor', link: 'Cari Investor', kind: 'portfolio' },
  { icon: 'i-lucide-chart-no-axes-combined', title: 'Perubahan kepemilikan saham', text: 'Bandingkan persentase kepemilikan dengan periode sebelumnya yang tersedia. Lihat kenaikan, penurunan, dan investor yang baru tercatat.', to: '/saham', link: 'Lihat Perubahan Kepemilikan', kind: 'change' },
]
const steps = [
  { title: 'Cari emiten atau investor', text: 'Buka halaman Saham untuk mencari kode atau nama perusahaan. Gunakan halaman Investor untuk mencari nama pemegang saham.' },
  { title: 'Pilih periode data', text: 'Pilih bulan dan tahun yang tersedia untuk melihat catatan kepemilikan pada periode tersebut.' },
  { title: 'Baca rincian kepemilikan', text: 'Periksa jumlah saham dan persentase kepemilikan. Jika data pembanding tersedia, kamu juga bisa melihat perubahan dari periode sebelumnya.' },
]

const siteConfig = useSiteConfig()

useSeoMeta({
  title: 'Data Kepemilikan Saham & Free Float Emiten BEI (IDX)',
  description: 'Cek kepemilikan saham emiten BEI, portofolio investor, dan perubahan antarperiode. Lihat free float hasil perhitungan aplikasi. Gratis tanpa akun.',
  ogTitle: 'Data Kepemilikan Saham & Free Float Emiten BEI (IDX)',
  ogDescription: 'Cek kepemilikan saham emiten BEI, portofolio investor, dan perubahan antarperiode. Lihat free float hasil perhitungan aplikasi. Gratis tanpa akun.',
  ogUrl: siteConfig.url,
})

useHead(() => ({
  link: [
    { rel: 'canonical', key: 'canonical', href: siteConfig.url },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteConfig.url}/#website`,
            name: siteConfig.name,
            url: siteConfig.url,
            inLanguage: 'id-ID',
          },
          {
            '@type': 'Dataset',
            '@id': `${siteConfig.url}/#dataset`,
            name: 'Data Kepemilikan Saham dan Free Float Emiten Bursa Efek Indonesia',
            description: 'Data kepemilikan saham emiten BEI berdasarkan pengumuman bulanan Bursa Efek Indonesia, mencakup nama investor, tipe, asal, jumlah saham, dan persentase kepemilikan. Free float dihitung oleh aplikasi dari kepemilikan yang tercatat.',
            url: siteConfig.url,
            inLanguage: 'id-ID',
            isAccessibleForFree: true,
            license: {
              '@type': 'CreativeWork',
              name: DATA_LICENSE_NAME,
              url: `${siteConfig.url}${DATA_LICENSE_PATH}`,
            },
            isBasedOn: IDX_SOURCE_URL,
            ...(temporalCoverage.value ? { temporalCoverage: temporalCoverage.value } : {}),
            creator: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            sourceOrganization: {
              '@type': 'Organization',
              name: 'Bursa Efek Indonesia',
              url: IDX_ORG_URL,
            },
            keywords: [
              'kepemilikan saham',
              'free float saham',
              'pemegang saham',
              'emiten',
              'Bursa Efek Indonesia',
              'IDX',
              'BEI',
            ],
          },
        ],
      }),
    },
  ],
}))
</script>

<template>
  <!-- Shared desktop sizes stay fluid in short windows without constraining content height. -->
  <main class="landing [--ui-primary:var(--color-green-700)] dark:[--ui-primary:var(--color-green-400)]
    lg:[--landing-section-space:clamp(3rem,calc(16svh_-_4rem),6rem)]
    lg:[--landing-content-gap:clamp(1.5rem,4svh,2.5rem)]
    lg:[--landing-column-gap:clamp(2rem,4vw,5rem)]
    lg:[--landing-card-padding:clamp(1.25rem,3svh,1.75rem)]
    lg:[--landing-card-gap:clamp(0.75rem,2svh,1.5rem)]
    lg:[--landing-chart-size:clamp(10rem,calc(20svh_+_1rem),14rem)]">
    <!-- Include the fixed navigation and safe area below xl in the intro height. -->
    <div class="landing-intro lg:flex lg:min-h-[calc(100dvh-var(--ui-header-height))] lg:flex-col
      lg:max-xl:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
      <section
        class="landing-hero relative overflow-hidden border-b border-accented bg-linear-to-br from-green-50/80 via-default to-default
          px-4 py-12 max-sm:py-8 sm:py-20 lg:flex lg:flex-[1_0_auto] lg:items-center lg:px-8
          lg:py-[clamp(1.5rem,calc(14svh_-_4.5rem),5rem)] dark:from-green-950/30">
        <div class="landing-hero-grid relative mx-auto grid max-w-7xl items-center gap-12 max-sm:gap-8 lg:w-full lg:gap-y-20
          lg:[@media(height>50rem)]:grid-cols-[1.15fr_1fr] lg:[@media(height>50rem)]:gap-x-(--landing-column-gap)
          lg:[@media(max-height:50rem)]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:[@media(max-height:50rem)]:gap-x-8">
          <div class="min-w-0">
            <p v-motion-rise class="landing-eyebrow motion-el mb-5 flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase
              max-sm:mb-4 lg:mb-[clamp(0.75rem,2svh,1.25rem)]"><span
                class="size-2 rounded-full bg-primary" />Data publik BEI, mudah ditelusuri</p>
            <h1 v-motion-rise-1
              class="landing-title motion-el max-w-2xl text-[clamp(2rem,4.6vw,4.5rem)] leading-[1.08] font-bold tracking-[-0.045em] text-highlighted
                lg:text-[clamp(2.5rem,min(4.6vw,6svh),4.5rem)]">Data Kepemilikan
              Saham dan <span class="text-primary">Free Float Emiten BEI</span></h1>
            <p v-motion-rise-2 class="landing-description motion-el mt-6 max-w-lg text-base leading-relaxed text-toned max-sm:mt-4 sm:text-lg
              lg:mt-[clamp(0.75rem,2svh,1.5rem)] lg:text-[clamp(1rem,2svh,1.125rem)]">Kenali pemegang saham emiten di Bursa
              Efek Indonesia (BEI) dan telusuri portofolio investornya. Lihat porsi kepemilikan serta perubahan antarperiode dari pengumuman bulanan
              BEI.</p>
            <p v-motion-rise-3 class="landing-note motion-el mt-3 max-w-lg text-sm leading-relaxed text-muted max-sm:mt-2
              lg:mt-[clamp(0.5rem,1svh,0.75rem)]">Free float dihitung oleh aplikasi dari kepemilikan yang tercatat. Gratis tanpa
              akun.</p>
            <div v-motion-rise-4 class="landing-search motion-el mt-8 max-w-xl max-sm:mt-6 lg:mt-[clamp(1rem,2.5svh,2rem)]">
              <label for="landing-search" class="mb-2 block text-sm font-medium text-highlighted">Cari saham berdasarkan kode atau nama emiten</label>
              <UInputMenu id="landing-search" v-model="selectedTicker" :items="tickers ?? []" :loading="tickerStatus === 'pending'"
                :filter-fields="['ticker', 'name']" label-key="name" :virtualize="{ estimateSize: 40 }" leading-icon="i-lucide-search" size="xl"
                class="w-full" aria-label="Cari saham berdasarkan kode atau nama emiten" placeholder="Contoh: BBCA atau Bank Central Asia"
                :ui="{ base: 'max-sm:min-h-11', trailingIcon: 'hidden' }" @focus="loadTickers">
                <template #item-leading="{ item }">
                  <UBadge :label="item.ticker" size="sm" />
                </template>
                <template #empty>{{ tickerStatus === 'pending' ? 'Memuat daftar emiten...' : tickerStatus === 'error' ? 'Daftar emiten gagal dimuat.' :
                  'Emiten tidak ditemukan.' }}</template>
              </UInputMenu>
              <UButton v-if="tickerStatus === 'error'" label="Coba muat pencarian lagi" variant="link" class="mt-2" @click="loadTickers" />
              <div class="landing-actions mt-4 flex flex-wrap gap-3 max-sm:mt-3 lg:mt-[clamp(0.75rem,2svh,1rem)]">
                <UButton to="/saham" label="Lihat Kepemilikan Saham" trailing-icon="i-lucide-arrow-right" size="lg" class="max-sm:min-h-11" />
                <UButton to="/investor" label="Telusuri Investor" color="neutral" variant="outline" size="lg" class="max-sm:min-h-11" />
              </div>
            </div>
          </div>
          <div v-motion-rise-2 class="motion-el mx-auto w-full max-w-md lg:rotate-2 motion-reduce:rotate-0">
            <LandingOwnership :ticker="sample.ticker" :name="sample.name" :float="sample.float" :free-float="sample.freeFloat"
              :investor-count="sample.investorCount" :batch-label="sample.batchLabel" :is-live="isLive" />
          </div>
        </div>
      </section>

      <section aria-label="Informasi data" class="landing-stats border-b border-accented px-4 lg:shrink-0 lg:px-8">
        <div class="mx-auto grid max-w-7xl divide-y divide-accented sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div class="py-6 max-sm:py-3 sm:pr-8 lg:py-[clamp(1rem,2svh,1.5rem)]">
            <dl v-motion-reveal class="motion-el max-sm:grid max-sm:grid-cols-2 max-sm:items-center max-sm:gap-4">
              <dt class="text-xs text-muted max-sm:min-w-0 max-sm:wrap-anywhere">Emiten dalam basis data</dt>
              <dd class="mt-1 text-xl font-semibold text-highlighted tabular-nums max-sm:mt-0 max-sm:min-w-0 max-sm:text-right max-sm:text-base max-sm:wrap-anywhere">{{ emitenCount !== null ? emitenCount.toLocaleString('id-ID') :
                landingStatus === 'pending' ? 'Memuat...' : 'Belum tersedia' }}</dd>
            </dl>
          </div>
          <div class="py-6 max-sm:py-3 sm:px-8 lg:py-[clamp(1rem,2svh,1.5rem)]">
            <dl v-motion-reveal-1 class="motion-el max-sm:grid max-sm:grid-cols-2 max-sm:items-center max-sm:gap-4">
              <dt class="text-xs text-muted max-sm:min-w-0 max-sm:wrap-anywhere">Periode terbaru</dt>
              <dd class="mt-1 text-xl font-semibold text-highlighted max-sm:mt-0 max-sm:min-w-0 max-sm:text-right max-sm:text-base max-sm:wrap-anywhere">{{ latestBatch || (landingStatus === 'pending' ? 'Memuat...' : 'Belum tersedia') }}
              </dd>
            </dl>
          </div>
          <div class="py-6 max-sm:py-3 sm:pl-8 lg:py-[clamp(1rem,2svh,1.5rem)]">
            <dl v-motion-reveal-2 class="motion-el max-sm:grid max-sm:grid-cols-2 max-sm:items-center max-sm:gap-4">
              <dt class="text-xs text-muted max-sm:min-w-0 max-sm:wrap-anywhere">Akses data</dt>
              <dd class="mt-1 text-xl font-semibold text-highlighted max-sm:mt-0 max-sm:min-w-0 max-sm:text-right max-sm:text-base max-sm:wrap-anywhere">Gratis <span class="text-sm font-normal text-muted">/ tanpa akun</span></dd>
            </dl>
          </div>
        </div>
      </section>
    </div>

    <section class="landing-section px-4 py-16 sm:py-24 lg:px-8 lg:py-(--landing-section-space)" aria-labelledby="contoh-heading">
      <div v-motion-reveal class="landing-section-heading motion-el mx-auto mb-8 max-w-7xl lg:mb-(--landing-content-gap)">
        <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Cuplikan data</p>
        <h2 id="contoh-heading" class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">Contoh Data Pemegang Saham Emiten BEI</h2>
        <p class="mt-4 max-w-2xl leading-relaxed text-toned">Lihat nama investor, jumlah lembar saham, dan persentase kepemilikannya pada periode yang
          ditampilkan.</p>
        <p role="status" class="mt-3 text-xs font-medium text-muted">{{ dataStatus }}<span v-if="!isLive"> Per {{ sample.batchLabel }}.</span></p>
      </div>
      <article v-motion-reveal class="motion-el mx-auto w-full max-w-7xl bg-default border border-accented shadow-sm rounded-2xl overflow-hidden">
        <div class="flex flex-col gap-y-2 px-3 py-3 sm:flex-row sm:items-center sm:gap-x-3 sm:p-4">
          <div class="flex items-center gap-x-2 sm:gap-x-3 min-w-0">
            <UBadge :label="sample.ticker" />
            <p class="min-w-0 flex-1 text-xs font-semibold text-highlighted truncate sm:text-sm xl:text-base">
              {{ sample.name }}
            </p>
          </div>

          <div class="flex gap-x-2 sm:gap-x-3">
            <UBadge :label="`${sample.investorCount} Investor`" color="neutral" variant="soft" class="w-fit text-xs xl:text-sm" />
            <UBadge :label="`Free float (${sample.freeFloat}%)`" color="secondary" variant="soft" class="w-fit text-xs xl:text-sm" />
            <UBadge v-if="sample.sector" :label="sample.sector" color="sector" variant="soft" class="w-fit text-xs xl:text-sm" />
          </div>
        </div>

        <div class="max-h-96 overflow-auto border-t border-accented transition-opacity duration-300 ease-out"
          :class="settling ? 'opacity-55' : 'opacity-100'">
          <table aria-label="Cuplikan investor emiten" class="w-full text-xs sm:text-sm tabular-nums">
            <thead>
              <tr class="text-muted font-semibold">
                <th scope="col" class="sticky top-0 z-10 border-b border-accented bg-muted px-2 py-2.5 text-center font-semibold sm:px-3">#</th>
                <th scope="col" class="sticky top-0 z-10 border-b border-accented bg-muted px-2 py-2.5 text-start font-semibold sm:px-3">Nama Investor
                </th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-accented bg-muted px-3 py-2.5 text-start font-semibold md:table-cell">
                  Tipe
                </th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-accented bg-muted px-3 py-2.5 text-start font-semibold sm:table-cell">
                  Asal
                </th>
                <th scope="col" class="sticky top-0 z-10 border-b border-accented bg-muted px-2 py-2.5 text-end font-semibold sm:px-3">Saham</th>
                <th scope="col" class="sticky top-0 z-10 border-b border-accented bg-muted px-2 py-2.5 text-end font-semibold sm:px-3">%</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-accented">
              <tr v-for="(investor, i) in visibleInvestors" :key="investor.investorName"
                class="relative transition-colors duration-150 ease-in-out hover:bg-elevated">
                <td class="px-2 py-2.5 text-center text-muted sm:px-3">{{ i + 1 }}</td>

                <td class="px-2 py-2.5 sm:px-3">
                  <div class="flex flex-col gap-y-0.5">
                    <span class="font-semibold text-highlighted whitespace-normal">{{ investor.investorName }}</span>
                    <span class="flex gap-x-1 sm:hidden">
                      <UBadge v-if="investor.investorType" :label="investor.investorType" color="secondary" variant="soft"
                        class="text-xs h-auto py-0.5" />
                      <UBadge v-if="['D','F'].includes(investor.localForeign?.trim() ?? '')" :label="investor.localForeign.trim()"
                        :color="investor.localForeign.trim() === 'D' ? 'primary' : 'error'" variant="soft"
                        class="text-xs h-fit font-bold" />
                      <span v-else class="text-xs text-muted">-</span>
                    </span>
                  </div>
                </td>

                <td class="hidden px-3 py-2.5 text-default md:table-cell">{{ investor.investorType || '-' }}</td>

                <td class="hidden px-3 py-2.5 sm:table-cell">
                  <span class="flex items-center gap-x-1.5">
                    <UBadge v-if="['D','F'].includes(investor.localForeign?.trim() ?? '')" :label="investor.localForeign.trim()"
                      :color="investor.localForeign.trim() === 'D' ? 'primary' : 'error'" variant="soft"
                      class="h-fit font-bold" />
                    <span v-else class="text-muted">-</span>
                    <span v-if="investor.localForeign?.trim() === 'F' && investor.domicile" class="text-default">{{ investor.domicile }}</span>
                  </span>
                </td>

                <td class="px-2 py-2.5 text-end text-default sm:px-3">
                  <span class="hidden lg:inline">{{ investor.totalHoldingShare.toLocaleString('id-ID') }}</span>
                  <span class="lg:hidden">{{ formatShareCompact(investor.totalHoldingShare) }}</span>
                </td>

                <td class="px-2 py-2.5 text-end text-default sm:px-3">
                  <span class="flex items-center justify-end gap-1.5 max-sm:flex-col max-sm:items-end max-sm:gap-0">
                    <span class="font-bold">{{ investor.percentage }}%</span>
                    <span v-if="investor.change !== null && investor.change !== 0"
                      :class="investor.change > 0 ? 'font-semibold text-success' : 'font-semibold text-error'">
                      ({{ formatChange(investor.change) }})
                    </span>
                    <span v-else-if="investor.change === null && investor.hasPrevData" class="font-semibold text-success">
                      (Baru)
                    </span>
                  </span>

                  <span v-motion-bar :delay="Math.min(i, 7) * 50" aria-hidden="true"
                    class="motion-el absolute bottom-0 right-0 h-0.5 origin-right bg-inverted/30" :style="{ width: `${investor.percentage}%` }" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-y-2 border-t border-accented px-3 py-3 sm:px-4">
          <div class="flex flex-col gap-y-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6">
            <p class="text-sm text-toned">Free float dihitung dari 100% dikurangi total persentase kepemilikan investor yang tercatat. Angka ini bukan
              penetapan free float resmi BEI. Grafik menggunakan seluruh catatan investor emiten pada periode tersebut, termasuk yang tidak tampil
              dalam
              cuplikan.</p>

            <NuxtLink :to="{ path: '/saham', query: { q: sample.ticker } }"
              class="group inline-flex w-fit shrink-0 items-center gap-x-1 rounded-sm text-[13px] font-semibold text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted">
              <span
                class="underline decoration-accented underline-offset-4 transition-[text-decoration-color] duration-150 ease-in-out group-hover:decoration-current motion-reduce:transition-none">
                Lihat kepemilikan saham {{ sample.ticker }}
              </span>
              <UIcon name="i-lucide-arrow-right"
                class="size-3.5 shrink-0 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true" />
            </NuxtLink>
          </div>

          <p class="text-[13px] text-muted">
            <template v-if="!isLive">
              Contoh tetap dari data periode {{ sample.batchLabel }}.
            </template>
            <template v-else-if="hiddenInvestorCount">
              Menampilkan {{ visibleInvestors.length }} dari {{ sample.investorCount }} investor yang tercatat untuk emiten ini pada periode {{
                sample.batchLabel }}.
            </template>
            <template v-else>
              Menampilkan {{ sample.investorCount }} investor yang tercatat untuk emiten ini pada periode {{ sample.batchLabel }}.
            </template>
          </p>
        </div>
      </article>
    </section>

    <section class="landing-section border-y border-accented bg-elevated/50 px-4 py-16 sm:py-24 lg:px-8 lg:py-(--landing-section-space)"
      aria-labelledby="fitur-heading">
      <div class="mx-auto max-w-7xl">
        <div v-motion-reveal class="motion-el">
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Jelajahi lebih jauh</p>
          <h2 id="fitur-heading" class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">Telusuri Pemegang Saham dan Portofolio Investor
          </h2>
        </div>
        <div class="landing-section-content mt-10 grid gap-5 lg:mt-(--landing-content-gap) lg:grid-cols-3">
          <article v-for="(feature, i) in features" :key="feature.kind" v-motion-reveal :delay="i * 80"
            class="landing-feature motion-el flex min-w-0 flex-col rounded-2xl border border-accented bg-default p-6
              lg:p-[clamp(1.25rem,3svh,1.5rem)] motion-safe:transition-transform motion-safe:hover:-translate-y-1">
            <UIcon :name="feature.icon" class="size-7 text-primary" />
            <h3 class="mt-5 text-lg font-semibold text-highlighted">{{ feature.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-toned lg:text-base">{{ feature.text }}</p>
            <div class="mt-6 overflow-hidden rounded-xl border border-accented bg-default text-xs">
              <template v-if="feature.kind === 'owners'">
                <div class="space-y-2 p-3">
                  <div class="flex min-w-0 items-center gap-2">
                    <UBadge :label="sample.ticker" size="sm" />
                    <span class="truncate font-semibold text-highlighted">{{ sample.name }}</span>
                    <UIcon name="i-lucide-chevron-up" class="ml-auto size-3 shrink-0 text-muted" aria-hidden="true" />
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <UBadge :label="`${sample.investorCount} Investor`" color="neutral" variant="soft" size="sm" />
                    <UBadge :label="`Free float (${sample.freeFloat}%)`" color="secondary" variant="soft" size="sm" />
                    <UBadge v-if="sample.sector" :label="sample.sector" color="sector" variant="soft" size="sm" />
                  </div>
                </div>
                <table class="w-full table-fixed border-t border-accented text-[11px]" aria-label="Cuplikan pemegang saham">
                  <thead class="bg-elevated/50 text-muted">
                    <tr>
                      <th scope="col" class="px-3 py-2 text-left font-medium">Nama Investor</th>
                      <th scope="col" class="w-16 px-3 py-2 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-accented">
                    <tr v-for="investor in visibleInvestors.slice(0, 2)" :key="investor.investorName">
                      <td class="truncate px-3 py-2.5 font-semibold text-highlighted" :title="investor.investorName">{{ investor.investorName }}</td>
                      <td class="px-3 py-2.5 text-right font-semibold tabular-nums">{{ investor.percentage }}%</td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else-if="feature.kind === 'portfolio' && portfolioPreview">
                <div class="space-y-2 p-3">
                  <div class="flex min-w-0 items-center gap-2">
                    <span class="truncate font-semibold text-highlighted" :title="portfolioPreview.investorName">{{ portfolioPreview.investorName
                    }}</span>
                    <UIcon name="i-lucide-chevron-up" class="ml-auto size-3 shrink-0 text-muted" aria-hidden="true" />
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <UBadge v-if="portfolioPreview.investorType" :label="portfolioPreview.investorType" color="secondary" variant="soft" size="sm" />
                    <UBadge v-if="['D','F'].includes(portfolioPreview.localForeign?.trim() ?? '')" :label="portfolioPreview.localForeign.trim()"
                      :color="portfolioPreview.localForeign.trim() === 'D' ? 'primary' : 'error'" variant="soft"
                      size="sm" />
                  </div>
                </div>
                <table class="w-full table-fixed border-t border-accented text-[11px]" aria-label="Cuplikan saham investor">
                  <thead class="bg-elevated/50 text-muted">
                    <tr>
                      <th scope="col" class="w-16 px-3 py-2 text-left font-medium">Kode</th>
                      <th scope="col" class="px-2 py-2 text-left font-medium">Nama Saham</th>
                      <th scope="col" class="w-16 px-3 py-2 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-3 py-2.5">
                        <UBadge :label="sample.ticker" size="sm" />
                      </td>
                      <td class="truncate px-2 py-2.5 font-semibold text-highlighted" :title="sample.name">{{ sample.name }}</td>
                      <td class="px-3 py-2.5 text-right font-semibold tabular-nums">{{ portfolioPreview.percentage }}%</td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <div v-else class="p-3">
                <p class="truncate font-semibold text-highlighted">{{ changePreview?.investorName || sample.ticker }}</p>
                <div v-if="changePreview" class="mt-4 flex flex-wrap items-baseline gap-2 tabular-nums">
                  <span class="text-xl font-semibold text-highlighted">{{ changePreview.percentage }}%</span>
                  <span v-if="changePreview.change !== null" :class="changePreview.change > 0 ? 'text-success' : 'text-error'"
                    class="font-semibold">({{
                      formatChange(changePreview.change) }})</span>
                  <span v-else class="font-semibold text-success">(Baru)</span>
                </div>
                <p v-else class="mt-4 text-muted">Belum ada perubahan persentase untuk ditampilkan.</p>
                <p class="mt-2 text-muted">Dibandingkan periode sebelumnya yang tersedia</p>
              </div>
              <p class="border-t border-accented px-3 py-2 text-[10px] text-muted">{{ isLive ? 'Cuplikan' : 'Data arsip' }} · {{ sample.batchLabel }}
              </p>
            </div>
            <UButton :to="feature.to" :label="feature.link" variant="link" trailing-icon="i-lucide-arrow-right"
              class="mt-auto self-start px-0 pt-6" />
          </article>
        </div>
      </div>
    </section>

    <section id="panduan" class="landing-section scroll-mt-24 px-4 py-16 sm:py-24 lg:px-8 lg:py-(--landing-section-space)"
      aria-labelledby="panduan-heading">
      <div class="mx-auto max-w-7xl">
        <div v-motion-reveal class="motion-el">
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Mulai di sini</p>
          <h2 id="panduan-heading" class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">Cara Cek Kepemilikan Saham di BEI</h2>
        </div>
        <ol class="landing-section-content mt-10 grid gap-8 md:grid-cols-3 lg:mt-(--landing-content-gap)">
          <li v-for="(step, i) in steps" :key="step.title" v-motion-reveal :delay="i * 80" class="motion-el border-t border-accented pt-6">
            <span class="text-sm font-semibold text-primary">0{{ i + 1 }}</span>
            <h3 class="mt-4 text-lg font-semibold text-highlighted">{{ step.title }}</h3>
            <p class="mt-2 max-w-sm text-sm leading-relaxed text-toned lg:text-base">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="landing-section border-t border-accented px-4 py-16 sm:py-24 lg:px-8 lg:py-(--landing-section-space)"
      aria-labelledby="faq-heading">
      <div class="landing-faq-grid mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-x-(--landing-column-gap) lg:gap-y-20">
        <div v-motion-reveal class="motion-el">
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Sumber & pertanyaan umum</p>
          <h2 id="faq-heading" class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">Sumber Data dan Perhitungan Free Float</h2>
          <p class="mt-4 text-toned leading-relaxed">Data kepemilikan bersumber dari Pengumuman Bursa ‘Semua Emiten Saham’ yang diterbitkan BEI. Buka
            pengumuman sumber untuk memeriksa catatan kepemilikannya.</p>
          <UButton :to="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer" label="Lihat Pengumuman BEI" trailing-icon="i-lucide-external-link"
            variant="outline" class="mt-6" />
        </div>
        <div v-motion-reveal-1 class="motion-el">
          <LandingFaq />
        </div>
      </div>
    </section>

    <section class="landing-closing px-4 pb-16 sm:pb-24 lg:px-8 lg:pb-(--landing-section-space)" aria-labelledby="mulai-heading">
      <div v-motion-reveal class="landing-cta motion-el relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-green-900 p-8 sm:p-14
        lg:p-[clamp(2rem,5svh,3.5rem)]">
        <div class="relative">
          <p class="text-xs font-semibold tracking-widest text-green-200 uppercase">Terbuka untuk semua</p>
          <h2 id="mulai-heading" class="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Cek Pemegang Saham Emiten Pilihanmu
          </h2>
          <p class="mt-4 max-w-xl text-green-100">Cari emiten untuk melihat porsi kepemilikan investornya, atau mulai dari nama investor untuk
            menelusuri
            saham yang tercatat dalam portofolionya.</p>
          <div class="landing-section-content mt-8 flex flex-wrap gap-3 lg:mt-(--landing-content-gap)">
            <UButton to="/saham" label="Lihat Kepemilikan Saham" trailing-icon="i-lucide-arrow-right" size="xl"
              class="bg-white text-green-950 hover:bg-green-50" />
            <UButton to="/investor" label="Telusuri Investor" size="xl" variant="outline" class="text-white ring-white/40 hover:bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

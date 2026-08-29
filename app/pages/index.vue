<script setup lang="ts">
import { IDX_SOURCE_URL } from '~/utils/constants'

type TickerName = { ticker: string, name: string }

const dateStore = useDateStore()
const { dates, error: batchError } = storeToRefs(dateStore)

const latestBatch = computed(() => dates.value[0]?.label ?? '')

const { data: landing, status: landingStatus } = useFetch<LandingTeaser>('/api/landing', { lazy: true })

const emitenCount = computed(() => landing.value?.emitenCount || null)

const { data: tickers, status: tickerStatus, execute: fetchTickers } = useFetch<TickerName[]>(
  '/api/stock/list',
  { immediate: false, lazy: true, default: () => [] }
)

const tickersRequested = ref(false)

const loadTickers = () => {
  if (tickersRequested.value) return
  tickersRequested.value = true
  fetchTickers()
}

const selectedTicker = ref<TickerName | undefined>()

watch(selectedTicker, (item) => {
  if (item) navigateTo({ path: '/saham', query: { q: item.ticker } })
})

const retrying = ref(false)

const retryBatch = async () => {
  if (retrying.value) return
  retrying.value = true

  try {
    const token = useCookie('token')
    const tokenResponse = await $fetch<{ token: string }>('/api/token')
    token.value = tokenResponse.token

    await dateStore.fetchDates(tokenResponse.token)
  } catch {
  } finally {
    retrying.value = false
  }
}

const FALLBACK = {
  ticker: 'BBCA',
  name: 'BANK CENTRAL ASIA Tbk',
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
    investorCount: live.investorCount,
    float: live.float,
    freeFloat: live.freeFloat,
    batchLabel: landing.value?.batchLabel ?? '',
    investors: live.investors,
  }
})

const settling = computed(() => landingStatus.value === 'pending' && !isLive.value)

const visibleInvestors = computed(() => sample.value.investors)

const hiddenInvestorCount = computed(() =>
  Math.max(sample.value.investorCount - visibleInvestors.value.length, 0)
)

const ownershipTotal = computed(() => (sample.value.float + sample.value.freeFloat).toFixed(2))

useSeoMeta({
  title: 'Data Kepemilikan Saham Indonesia (IDX/BEI) | IDX Stocks Ownership',
  description: 'Lihat siapa pemilik setiap saham di Bursa Efek Indonesia — data resmi bulanan IDX: setiap investor, free float, asal lokal/asing, dan perubahan antar bulan. Gratis, tanpa akun.',
  ogTitle: 'Siapa pemilik saham di Bursa? | IDX Stocks Ownership',
  ogDescription: 'Data kepemilikan resmi dari pengumuman bulanan IDX/BEI — setiap investor, setiap free float, lengkap dan terbuka.',
  ogUrl: 'https://idx-stocks-ownership.vercel.app',
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <section class="px-4 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-14 sm:pb-20">
      <div class="mx-auto w-full max-w-7xl">
        <h1
          class="motion-safe:animate-hero-rise max-w-4xl text-balance font-bold text-highlighted text-[clamp(2.125rem,5.5vw,3.75rem)] leading-[1.08] tracking-[-0.02em]">
          Siapa sebenarnya pemilik <span
            class="pb-[0.06em] bg-[linear-gradient(var(--ui-primary),var(--ui-primary))] bg-no-repeat bg-position-[0_100%] bg-size-[100%_0.12em] motion-safe:animate-hero-draw">saham
            di Bursa</span>?
        </h1>

        <p class="motion-safe:animate-hero-rise [animation-delay:100ms] mt-5 sm:mt-6 max-w-[65ch] text-base text-default leading-relaxed">
          Data kepemilikan resmi dari pengumuman bulanan Bursa Efek Indonesia —
          setiap investor, setiap free float, lengkap apa adanya. Tanpa akun, tanpa biaya.
        </p>

        <div class="motion-safe:animate-hero-rise [animation-delay:180ms] mt-7 sm:mt-8 w-full max-w-xl">
          <UInputMenu v-model="selectedTicker" :items="tickers ?? []" :loading="tickerStatus === 'pending'" :filter-fields="['ticker', 'name']"
            label-key="name" :virtualize="{ estimateSize: 40 }" leading-icon="i-lucide-search" size="xl" class="w-full" aria-label="Cari emiten"
            placeholder="Cari emiten — ketik kode atau nama" :ui="{ trailingIcon: 'hidden' }" @focus="loadTickers">
            <template #item-leading="{ item }">
              <UBadge :label="item.ticker" size="sm" />
            </template>

            <template #empty>
              {{ tickerStatus === 'pending' ? 'Memuat daftar emiten…' : 'Emiten tidak ditemukan.' }}
            </template>
          </UInputMenu>
        </div>

        <div class="motion-safe:animate-hero-rise [animation-delay:260ms] mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <UButton to="/saham" label="Lihat semua emiten" trailing-icon="i-lucide-arrow-right" color="neutral" size="lg" />
          <UButton to="/investor" label="Telusuri Investor" color="neutral" variant="ghost" size="lg" />
        </div>

        <p class="motion-safe:animate-hero-rise [animation-delay:340ms] mt-6 text-[13px] text-muted">
          <template v-if="latestBatch">
            <span class="font-medium">DATA PER</span>{{ ' ' }}
            <span class="font-semibold text-default">{{ latestBatch }}</span>{{ ' ' }}
            <span aria-hidden="true">·</span>{{ ' ' }}
          </template>
          Sumber:
          <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
            aria-label="Pengumuman Bursa — Semua Emiten Saham di situs IDX (buka di tab baru)"
            class="inline-block py-3.5 -my-3.5 rounded-sm underline decoration-accented underline-offset-4 transition-colors hover:text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Pengumuman Bursa — Semua Emiten Saham (IDX)</a>
        </p>

        <Transition enter-active-class="transition duration-200 ease-out motion-reduce:transition-none" enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition-opacity duration-150 ease-in motion-reduce:transition-none" leave-to-class="opacity-0">
          <div v-if="batchError" role="status"
            class="motion-safe:animate-hero-rise [animation-delay:340ms] mt-4 flex max-w-[65ch] flex-col gap-y-2.5 rounded-md border border-accented bg-muted px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
            <p class="flex items-start gap-x-2 text-[13px] text-default">
              <UIcon name="i-lucide-alert-circle" class="mt-px size-4 shrink-0 text-muted" aria-hidden="true" />
              <span>
                Koneksi ke server data sedang bermasalah, jadi tanggal batch terbaru belum bisa ditampilkan.
              </span>
            </p>

            <UButton label="Coba Lagi" color="neutral" variant="outline" size="xs" :loading="retrying" class="w-fit shrink-0" @click="retryBatch" />
          </div>
        </Transition>
      </div>
    </section>

    <section class="px-4 lg:px-8 pb-16 sm:pb-24" aria-labelledby="contoh-heading">
      <h2 id="contoh-heading" class="sr-only">Contoh catatan kepemilikan</h2>

      <article class="mx-auto w-full max-w-[1600px] bg-default border border-accented shadow-md rounded-xl overflow-hidden">
        <div class="flex flex-col gap-y-2 px-3 py-3 sm:flex-row sm:items-center sm:gap-x-3 sm:p-4">
          <div class="flex items-center gap-x-2 sm:gap-x-3 min-w-0">
            <UBadge :label="sample.ticker" />
            <p class="min-w-0 flex-1 text-xs font-semibold text-highlighted truncate sm:text-sm xl:text-base">
              {{ sample.name }}
            </p>
          </div>

          <div class="flex gap-x-2 sm:gap-x-3">
            <UBadge :label="`${sample.investorCount} Investor`" color="neutral" variant="soft" class="w-fit text-xs xl:text-sm" />
            <UBadge :label="`Free Float (${sample.freeFloat}%)`" color="secondary" variant="soft" class="w-fit text-xs xl:text-sm" />
          </div>
        </div>

        <div class="max-h-80 overflow-auto border-t border-accented transition-opacity duration-300 ease-out"
          :class="settling ? 'opacity-55' : 'opacity-100'">
          <table class="w-full text-xs sm:text-sm tabular-nums">
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
              <tr v-for="(investor, i) in visibleInvestors" :key="investor.investorName" class="hover:bg-elevated">
                <td class="px-2 py-2.5 text-center text-muted sm:px-3">{{ i + 1 }}</td>

                <td class="px-2 py-2.5 sm:px-3">
                  <div class="flex flex-col gap-y-0.5">
                    <span class="font-semibold text-highlighted whitespace-normal">{{ investor.investorName }}</span>
                    <span class="flex gap-x-1 sm:hidden">
                      <UBadge v-if="investor.investorType" :label="investor.investorType" color="secondary" variant="soft"
                        class="text-xs h-auto py-0.5" />
                      <UBadge :label="investor.localForeign" :color="investor.localForeign === 'D' ? 'primary' : 'error'" variant="soft"
                        class="text-xs h-fit font-bold" />
                    </span>
                  </div>
                </td>

                <td class="hidden px-3 py-2.5 text-default md:table-cell">{{ investor.investorType || '-' }}</td>

                <td class="hidden px-3 py-2.5 sm:table-cell">
                  <span class="flex items-center gap-x-1.5">
                    <UBadge :label="investor.localForeign" :color="investor.localForeign === 'D' ? 'primary' : 'error'" variant="soft"
                      class="h-fit font-bold" />
                    <span v-if="investor.domicile" class="text-default">{{ investor.domicile }}</span>
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-y-2 border-t border-accented px-3 py-3 sm:px-4">
          <div class="flex flex-col gap-y-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6">
            <p class="text-[13px] text-default tabular-nums sm:text-sm">
              <span class="font-bold text-highlighted">{{ sample.float }}%</span> tercatat atas nama pemegang
              <span aria-hidden="true">+</span><span class="sr-only">ditambah</span>
              <span class="font-bold text-highlighted">{{ sample.freeFloat }}%</span> free float
              <span aria-hidden="true">=</span><span class="sr-only">sama dengan</span>
              <span class="font-bold text-highlighted">{{ ownershipTotal }}%</span> — tidak ada sisa yang tak dijelaskan.
            </p>

            <NuxtLink to="/saham"
              class="group inline-flex w-fit shrink-0 items-center gap-x-1 rounded-sm text-[13px] font-semibold text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted">
              <span class="underline decoration-accented underline-offset-4 group-hover:decoration-current">
                Lihat semua emiten
              </span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5 shrink-0" aria-hidden="true" />
            </NuxtLink>
          </div>

          <p class="text-[13px] text-muted">
            <template v-if="!isLive">
              Contoh tetap dari Pengumuman Bursa {{ sample.batchLabel }} — tanpa diubah.
            </template>
            <template v-else-if="hiddenInvestorCount">
              {{ visibleInvestors.length }} dari {{ sample.investorCount }} investor yang diumumkan untuk emiten ini —
              cuplikan asli Pengumuman Bursa {{ sample.batchLabel }}, tanpa diubah.
            </template>
            <template v-else>
              Seluruh {{ sample.investorCount }} investor yang diumumkan untuk emiten ini —
              cuplikan asli Pengumuman Bursa {{ sample.batchLabel }}, tanpa diubah.
            </template>
          </p>
        </div>
      </article>
    </section>

    <div class="border-t border-accented px-4 lg:px-8 py-14 sm:py-20">
      <div class="mx-auto w-full max-w-7xl xl:grid xl:grid-cols-[3fr_2fr]">
        <section class="xl:pr-12" aria-labelledby="fitur-heading">
          <h2 id="fitur-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            Yang tercatat di setiap emiten
          </h2>

          <dl class="mt-6 divide-y divide-accented border-t border-accented">
            <div class="py-5">
              <dt class="text-sm sm:text-base font-semibold text-highlighted">Setiap investor, satu per satu</dt>
              <dd class="mt-1.5 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
                Semua investor yang diumumkan — institusi, dana, hingga individu — lengkap dengan tipe
                investor dan asal
                <UBadge label="D" color="primary" variant="soft" class="mx-0.5 h-fit align-middle font-bold" /> lokal atau
                <UBadge label="F" color="error" variant="soft" class="mx-0.5 h-fit align-middle font-bold" /> asing beserta domisilinya.
              </dd>
            </div>

            <div class="py-5">
              <dt class="text-sm sm:text-base font-semibold text-highlighted">Free float yang sebenarnya</dt>
              <dd class="mt-1.5 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
                Persentase saham yang beredar di publik — yaitu sisa dari seluruh kepemilikan yang diumumkan —
                terlihat langsung dari lencana
                <UBadge label="Free Float (%)" color="secondary" variant="soft" class="mx-0.5 h-fit align-middle" />
                di tiap emiten, bersama jumlah investor yang tercatat.
              </dd>
            </div>

            <div class="py-5">
              <dt class="text-sm sm:text-base font-semibold text-highlighted">Perubahan dari bulan sebelumnya</dt>
              <dd class="mt-1.5 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
                Setiap pengumuman dibandingkan dengan bulan sebelumnya, dan selisihnya muncul di samping
                persentase:
                <span class="font-semibold text-success whitespace-nowrap">(+0.42)</span> bertambah,
                <span class="font-semibold text-error whitespace-nowrap">(-0.31)</span> berkurang, dan
                <span class="font-semibold text-success whitespace-nowrap">(Baru)</span> untuk investor yang baru masuk.
                Investor yang kepemilikannya tidak berubah tidak diberi penanda.
              </dd>
            </div>
          </dl>
        </section>

        <section class="mt-12 border-t border-accented pt-10 xl:mt-0 xl:border-t-0 xl:border-l xl:pl-12 xl:pt-0" aria-labelledby="sumber-heading">
          <h2 id="sumber-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            Resmi, bulanan, terbuka
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm text-default leading-relaxed">
            Semua angka bersumber dari pengumuman resmi yang diterbitkan Bursa Efek Indonesia sebagai berkas
            bulanan — data publik yang selama ini sulit dibaca, disajikan ulang tanpa diringkas dan tanpa
            dipotong.
          </p>

          <dl class="mt-5 divide-y divide-accented border-y border-accented">
            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">SUMBER</dt>
              <dd class="text-sm font-semibold text-default">
                <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
                  aria-label="Pengumuman Bursa — Semua Emiten Saham di situs IDX (buka di tab baru)"
                  class="inline-flex items-center gap-x-1.5 py-3 -my-3 rounded-sm underline decoration-accented underline-offset-4 transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Pengumuman Bursa — "Semua Emiten Saham" (IDX/BEI)
                  <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0" aria-hidden="true" />
                </a>
              </dd>
            </div>
            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">PEMBARUAN</dt>
              <dd class="text-sm font-semibold text-default">Bulanan, mengikuti pengumuman resmi Bursa</dd>
            </div>
            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">CAKUPAN</dt>
              <dd class="text-sm font-semibold text-default tabular-nums">
                {{ emitenCount ? `${emitenCount.toLocaleString('id-ID')} emiten tercatat` : 'Seluruh emiten tercatat di BEI' }}
              </dd>
            </div>
            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">AKSES</dt>
              <dd class="text-sm font-semibold text-default">Gratis — tanpa akun, tanpa paywall</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>

    <section class="border-t border-accented px-4 lg:px-8 py-16 sm:py-24" aria-labelledby="mulai-heading">
      <div class="mx-auto w-full max-w-4xl">
        <h2 id="mulai-heading" class="max-w-2xl text-2xl sm:text-3xl font-bold text-highlighted text-balance leading-[1.15] tracking-[-0.01em]">
          Mulai dari emiten yang Anda incar — datanya sudah menunggu.
        </h2>
        <UButton to="/saham" label="Lihat Kepemilikan Saham" trailing-icon="i-lucide-arrow-right" color="neutral" size="xl" class="mt-6 w-fit" />
      </div>
    </section>
  </main>
</template>

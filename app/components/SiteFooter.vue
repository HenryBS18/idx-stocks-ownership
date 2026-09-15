<script setup lang="ts">
import { DATA_LICENSE_NAME, DATA_LICENSE_PATH, IDX_SOURCE_URL, PRIVACY_PATH, REPORT_EMAIL } from '~/utils/constants'

const route = useRoute()

const { dates } = storeToRefs(useDateStore())
const latestBatch = computed(() => dates.value[0]?.label ?? '')

const pages = [
  { label: 'Beranda', to: '/' },
  { label: 'Saham', to: '/saham' },
  { label: 'Investor', to: '/investor' },
]

const legalPages = [
  { label: 'Lisensi', to: DATA_LICENSE_PATH },
  { label: 'Privasi', to: PRIVACY_PATH },
]

const REPORT_URL = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent('Laporan data keliru — IDX Stocks Ownership')}`

const year = new Date().getFullYear()

const linkClass = 'inline-flex min-h-11 items-center gap-x-1.5 rounded-sm text-sm text-toned transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
</script>

<template>
  <footer class="border-t border-accented bg-elevated px-4 lg:px-8 pt-8 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] xl:pb-8">
    <div class="mx-auto w-full max-w-7xl">
      <div class="grid gap-6 lg:grid-cols-2 lg:gap-x-12">
        <div class="max-w-[50ch]">
          <p class="text-base font-semibold text-highlighted">IDX Stocks Ownership</p>
          <p class="mt-2 text-[13px] md:text-sm leading-relaxed text-toned">
            Telusuri data kepemilikan saham emiten BEI dari pengumuman bulanan Bursa Efek Indonesia. Gratis tanpa akun.
          </p>
        </div>

        <div class="grid min-w-0 gap-6 sm:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-8">
          <nav aria-labelledby="footer-nav-label">
            <p id="footer-nav-label" class="text-[13px] font-medium text-toned">HALAMAN</p>

            <ul class="mt-1 flex flex-wrap gap-x-4">
              <li v-for="page in pages" :key="page.to">
                <NuxtLink :to="page.to" :aria-current="route.path === page.to ? 'page' : undefined" :class="linkClass"
                  class="aria-[current=page]:font-medium aria-[current=page]:text-highlighted">
                  {{ page.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <div class="min-w-0">
            <p class="text-[13px] font-medium text-toned">TAUTAN</p>

            <ul class="mt-1 flex flex-col">
              <li>
                <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
                  aria-label="Pengumuman Bursa di situs IDX (buka di tab baru)" :class="linkClass">
                  Pengumuman Bursa
                  <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0" aria-hidden="true" />
                </a>
              </li>

              <li>
                <a :href="REPORT_URL" aria-label="Laporkan data keliru lewat email" :class="linkClass">
                  Laporkan data keliru
                  <UIcon name="i-lucide-mail" class="size-3.5 shrink-0" aria-hidden="true" />
                </a>

                <p class="-mt-2 text-[13px] text-muted wrap-break-words">{{ REPORT_EMAIL }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-6 border-t border-accented pt-6 lg:grid-cols-2 lg:gap-x-12">
        <div class="space-y-2">
          <p v-if="latestBatch" class="text-[13px] text-toned">
            <span class="font-medium">DATA PER</span>{{ ' ' }}
            <span class="font-semibold text-highlighted">{{ latestBatch }}</span>
          </p>

          <p class="text-[13px] md:text-sm leading-relaxed text-toned">
            Sumber data: Pengumuman Bursa ‘Semua Emiten Saham’ dari Bursa Efek Indonesia (IDX/BEI). Ketersediaan periode mengikuti data yang telah dimasukkan ke aplikasi.
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-[13px] md:text-sm leading-relaxed text-toned">
            Situs ini tidak berafiliasi dengan dan tidak didukung oleh Bursa Efek Indonesia.
            Data dan perhitungan aplikasi disajikan untuk informasi, bukan saran investasi.
          </p>

          <p class="text-[13px] md:text-sm leading-relaxed text-toned">
            Kompilasi dan penyajian data di situs ini bebas dipakai ulang dengan mencantumkan atribusi — lihat{{ ' ' }}
            <NuxtLink :to="DATA_LICENSE_PATH"
              class="inline-block py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{{ DATA_LICENSE_NAME }}</NuxtLink>.{{ ' ' }}
            Pengumuman aslinya tetap milik Bursa Efek Indonesia.
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <p class="text-[13px] text-toned">© {{ year }} IDX Stocks Ownership</p>

        <nav aria-label="Informasi hukum">
          <ul class="flex flex-wrap gap-x-4">
            <li v-for="page in legalPages" :key="page.to">
              <NuxtLink :to="page.to" :aria-current="route.path === page.to ? 'page' : undefined" :class="linkClass"
                class="aria-[current=page]:font-medium aria-[current=page]:text-highlighted">
                {{ page.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <p class="text-[13px] text-toned sm:ml-auto">
          Dibuat oleh Henry{{ ' ' }}
          <span aria-hidden="true">·</span>{{ ' ' }}
          <a href="https://instagram.com/henrybs18" target="_blank" rel="noopener noreferrer" aria-label="Instagram @henrybs18 (buka di tab baru)"
            class="inline-block py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            @henrybs18
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

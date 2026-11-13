<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { UBadge, UButton, NuxtLink } from '#components'
import { h } from 'vue'
import { refDebounced } from '@vueuse/core'
import { HSC_THRESHOLD, IDX_HSC_SOURCE_URL, stockSector } from '~/utils/constants'

type SortField = 'ticker' | 'hscConcentration'

const { data, status, error, refresh } = await useFetch<HscResponse>('/api/stock/hsc', { key: 'hsc-stocks' })

const search = ref('')
const searchDebounced = refDebounced(search, 200)
const selectedSectors = ref<string[]>(['Semua'])
const sortField = ref<SortField>('hscConcentration')
const sortOrder = ref<'asc' | 'desc'>('desc')

const stocks = computed(() => data.value?.stocks ?? [])

const announceFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

const announceLabel = computed(() => {
  const value = data.value?.announceAt
  return value ? announceFormatter.format(new Date(`${value}T00:00:00Z`)) : null
})

const rows = computed(() => {
  const query = searchDebounced.value.trim().toLowerCase()
  const allSectors = selectedSectors.value.includes('Semua')

  const filtered = stocks.value.filter(stock => {
    if (!allSectors && (!stock.sector || !selectedSectors.value.includes(stock.sector))) return false
    if (!query) return true
    return stock.ticker.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
  })

  const direction = sortOrder.value === 'asc' ? 1 : -1

  return filtered.toSorted((a, b) => {
    if (sortField.value === 'ticker') return a.ticker.localeCompare(b.ticker) * direction
    return (a.hscConcentration - b.hscConcentration) * direction || a.ticker.localeCompare(b.ticker)
  })
})

const stats = computed(() => {
  const list = stocks.value
  if (!list.length) return null
  const total = list.reduce((sum, stock) => sum + stock.hscConcentration, 0)
  return {
    count: list.length,
    average: Number((total / list.length).toFixed(3)),
    highest: list.reduce((top, stock) => stock.hscConcentration > top.hscConcentration ? stock : top),
  }
})

const isFiltered = computed(() => searchDebounced.value.trim() !== '' || !selectedSectors.value.includes('Semua'))

const toggleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortField.value = field
  sortOrder.value = field === 'ticker' ? 'asc' : 'desc'
}

const resetFilter = () => {
  search.value = ''
  selectedSectors.value = ['Semua']
  sortField.value = 'hscConcentration'
  sortOrder.value = 'desc'
}

const sectorItems = computed(() => {
  return stockSector.map((sector) => ({
    label: sector,
    type: 'checkbox',
    checked: selectedSectors.value.includes(sector),
    onUpdateChecked(checked: boolean) {
      if (sector === 'Semua') {
        selectedSectors.value = ['Semua']
        return
      }

      const set = new Set(selectedSectors.value)

      if (checked) {
        set.add(sector)
        set.delete('Semua')
      } else {
        set.delete(sector)
      }

      if (set.size === 0) {
        set.add('Semua')
      }

      selectedSectors.value = Array.from(set)
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }))
}) satisfies ComputedRef<DropdownMenuItem[]>

const sortIcon = (field: SortField) => {
  if (sortField.value !== field) return 'i-lucide-arrow-up-down'
  return sortOrder.value === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
}

const sortHeader = (field: SortField, label: string, align: 'start' | 'end' = 'start') => () => h(UButton, {
  label,
  color: 'neutral',
  variant: 'ghost',
  size: 'sm',
  trailingIcon: sortIcon(field),
  class: align === 'end' ? '-mr-2.5 font-semibold' : '-mx-2.5 font-semibold',
  'aria-label': `Urutkan berdasarkan ${label}`,
  onClick: () => toggleSort(field),
})

const columns: TableColumn<HscStock>[] = [
  {
    header: '#',
    meta: {
      class: {
        th: 'text-center px-2 sm:px-3 sm:w-16',
        td: 'text-center px-2 sm:px-3 sm:w-16',
      }
    },
    cell: ({ row }) => row.index + 1,
  },
  {
    header: sortHeader('ticker', 'Kode'),
    accessorKey: 'ticker',
    meta: {
      class: {
        th: 'px-0 w-16 lg:w-24',
        td: 'px-0 w-16 lg:w-24',
      }
    },
    cell: ({ row }) => h(NuxtLink, { to: `/saham/${row.original.ticker}`, class: 'hover:underline' }, () => h(UBadge, { label: row.original.ticker }))
  },
  {
    header: 'Nama Saham',
    accessorKey: 'name',
    meta: {
      class: {
        th: 'max-sm:pl-2 max-sm:pr-0.5',
        td: 'max-sm:pl-2 max-sm:pr-0.5',
      }
    },
    cell: ({ row }) => h(NuxtLink, {
      to: `/saham/${row.original.ticker}`,
      title: row.original.name,
      class: 'line-clamp-2 whitespace-normal wrap-break-word font-bold text-[10px] sm:text-xs xl:text-sm ownership-link',
    }, () => row.original.name)
  },
  {
    header: 'Sektor',
    accessorKey: 'sector',
    meta: {
      class: {
        th: 'hidden sm:table-cell w-36',
        td: 'hidden sm:table-cell w-36',
      }
    },
    cell: ({ row }) => {
      const sector = row.original.sector
      if (!sector) return h('span', { class: 'sm:text-xs lg:text-sm' }, '-')
      return h(UBadge, { label: sector, color: 'sector', variant: 'soft', class: 'w-fit text-[11px] sm:text-xs' })
    }
  },
  {
    header: sortHeader('hscConcentration', 'HSC (%)', 'end'),
    accessorKey: 'hscConcentration',
    meta: {
      class: {
        th: 'w-24 sm:w-32 text-end max-sm:pl-1',
        td: 'w-24 sm:w-32 text-end max-sm:pl-1',
      }
    },
    cell: ({ row }) => h('span', { class: 'font-bold tabular-nums text-xs sm:text-sm' }, `${row.original.hscConcentration.toFixed(3)}%`),
  },
]

const route = useRoute()
const siteConfig = useSiteConfig()

useHead({
  link: [
    { rel: 'canonical', key: 'canonical', href: `${siteConfig.url}${route.path}` },
  ],
})

useSeoMeta({
  title: 'Daftar Saham HSC (High Shareholding Concentration) di BEI | IDX Stocks Ownership',
  description: 'Daftar emiten BEI berstatus HSC (Kepemilikan Saham Terkonsentrasi Tinggi): kepemilikan kumulatif hingga 10 pemegang saham mencapai paling sedikit 92,5%. Cari dan urutkan berdasarkan kode saham atau persentase HSC.',
  ogTitle: 'Daftar Saham HSC (High Shareholding Concentration) di BEI',
  ogDescription: 'Emiten BEI berstatus HSC, dengan kepemilikan kumulatif hingga 10 pemegang saham paling sedikit 92,5%.',
  ogUrl: `${siteConfig.url}/hsc`,
})
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-6 px-4 py-3 sm:px-6 lg:px-8 lg:py-6">
    <header class="space-y-3">
      <p class="text-sm font-medium text-primary">Kepemilikan Saham Terkonsentrasi Tinggi</p>
      <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">Saham HSC</h1>
      <p class="max-w-[70ch] text-sm leading-relaxed text-toned sm:text-base">
        Saham HSC adalah emiten yang kepemilikan kumulatif hingga 10 pemegang saham tanpa warkat (scripless), ditambah kepemilikan
        dengan warkat (scrip), mencapai paling sedikit {{ HSC_THRESHOLD }}. Angka HSC ditampilkan sebagaimana dipublikasikan BEI dan tidak
        dihitung oleh aplikasi.
      </p>
    </header>

    <div v-if="status === 'pending'" class="grid gap-4 sm:grid-cols-3">
      <USkeleton v-for="i in 3" :key="i" class="h-24 rounded-xl" />
    </div>

    <dl v-else-if="stats" class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-accented bg-default p-4">
        <dt class="text-[13px] font-medium text-muted">JUMLAH EMITEN</dt>
        <dd class="mt-1 text-2xl font-bold tabular-nums text-highlighted">{{ stats.count.toLocaleString('id-ID') }}</dd>
      </div>
      <div class="rounded-xl border border-accented bg-default p-4">
        <dt class="text-[13px] font-medium text-muted">RATA-RATA HSC</dt>
        <dd class="mt-1 text-2xl font-bold tabular-nums text-highlighted">{{ stats.average }}%</dd>
      </div>
      <div class="rounded-xl border border-accented bg-default p-4">
        <dt class="text-[13px] font-medium text-muted">HSC TERTINGGI</dt>
        <dd class="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums text-highlighted">
          {{ stats.highest.hscConcentration }}%
          <NuxtLink :to="`/saham/${stats.highest.ticker}`" class="hover:underline">
            <UBadge :label="stats.highest.ticker" />
          </NuxtLink>
        </dd>
      </div>
    </dl>

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
      <UInput v-model="search" icon="i-lucide-search" placeholder="Cari kode saham, emiten..." aria-label="Cari saham HSC"
        :ui="{ trailing: 'pe-1', base: 'pr-8' }" class="w-full sm:w-72">
        <template v-if="search?.length" #trailing>
          <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="void (search = '')" />
        </template>
      </UInput>

      <div class="flex items-center gap-x-2">
        <p class="text-[13px] md:text-sm font-medium text-muted">SEKTOR</p>

        <UDropdownMenu :items="sectorItems" :ui="{ viewport: 'max-h-64 overflow-y-auto' }">
          <UButton :label="selectedSectors.includes('Semua') ? 'Semua' : `${selectedSectors.length} dipilih`" variant="outline"
            color="neutral" trailing-icon="i-lucide-chevron-down" :ui="{ label: 'font-medium' }" />
        </UDropdownMenu>
      </div>

      <div class="flex items-center gap-x-4">
        <UButton label="Reset filter" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="resetFilter" />

        <p v-if="data && isFiltered" class="text-[13px] md:text-sm text-muted text-nowrap">
          {{ rows.length.toLocaleString('id-ID') }} dari {{ stocks.length.toLocaleString('id-ID') }} emiten
        </p>
      </div>

      <div v-if="announceLabel" class="flex flex-wrap items-center gap-x-2 sm:ml-auto">
        <p class="text-[13px] md:text-sm font-medium text-muted text-nowrap">PENGUMUMAN BEI TERBARU</p>
        <p class="text-[13px] md:text-sm font-semibold text-highlighted text-nowrap">{{ announceLabel }}</p>
      </div>

      <DataSourceNote v-if="!error" :href="IDX_HSC_SOURCE_URL" label="Kepemilikan Saham Terkonsentrasi Tinggi (IDX)" class="w-full" />
    </div>

    <div v-if="status === 'pending'" class="space-y-3">
      <USkeleton v-for="i in 10" :key="i" class="h-12 w-full rounded-lg" />
    </div>

    <ErrorCard v-else-if="error" message="Gagal memuat data HSC. Silakan coba lagi." :on-retry="refresh" />

    <EmptyCard v-else-if="!stocks.length" message="Belum ada emiten yang ditandai HSC." />

    <EmptyCard v-else-if="!rows.length" message="Tidak ada emiten HSC yang cocok dengan pencarian atau filter saat ini." :on-reset="resetFilter" />

    <UTable v-else :data="rows" :columns="columns" :ui="{ tr: 'even:bg-elevated/50' }" />
  </main>
</template>

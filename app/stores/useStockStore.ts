import { watchDebounced } from "@vueuse/core"
import type { Sort, StockSortField } from "~/types"

export const useStockStore = defineStore('stock', () => {
  const dateStore = useDateStore()
  const { selectedDate } = storeToRefs(dateStore)

  const stockDetails = ref<StockDetail[]>([])
  const showStockAccordion = ref<boolean>(false)
  const search = ref<string>('')
  const searchDebounced = ref<string>('')
  const sortField = ref<StockSortField>('ticker')
  const sortOrder = ref<Sort>('asc')
  const fetchedDate = ref<string | null>(null)

  const filteredStocks = computed<StockDetail[]>(() => {
    let result = [...stockDetails.value]

    if (searchDebounced.value) {
      const q = searchDebounced.value.toLowerCase()

      result = result.filter(stock =>
        stock.ticker.toLowerCase().includes(q) ||
        stock.name.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let compare = 0

      if (sortField.value === 'ticker') {
        compare = a.ticker.localeCompare(b.ticker)
      }

      if (sortField.value === 'freeFloat') {
        compare = Number(a.freeFloat) - Number(b.freeFloat)
      }

      if (sortField.value === 'stockCount') {
        compare = Number(a.investorCount) - Number(b.investorCount)
      }

      return sortOrder.value === 'asc' ? compare : -compare
    })

    return result
  })

  const stockCount = computed<number>(() => filteredStocks.value.length)

  const toggleSort = (field: StockSortField): void => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  const error = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const fetchStocks = async (token: string): Promise<void> => {
    if (!selectedDate.value) return

    error.value = false
    showStockAccordion.value = false
    const [year, month] = selectedDate.value.split('-')

    try {
      const data = await $fetch<StockDetail[]>('/api/stock', {
        query: { token, year, month }
      })
      stockDetails.value = data
      showStockAccordion.value = true
      fetchedDate.value = selectedDate.value
    } catch (e) {
      error.value = true
      errorMessage.value = 'Gagal memuat data saham. Periksa koneksi Anda dan coba lagi.'
    }
  }

  function clearError() {
    error.value = false
    errorMessage.value = ''
  }

  const resetFilter = (): void => {
    search.value = ''
    searchDebounced.value = ''
    sortField.value = 'ticker'
    sortOrder.value = 'asc'
  }

  watchDebounced(search, (v) => {
    searchDebounced.value = v
  }, { debounce: 500 })

  return {
    showStockAccordion,
    search,
    searchDebounced,
    sortField,
    sortOrder,
    filteredStocks,
    stockCount,
    fetchedDate,
    error,
    errorMessage,
    toggleSort,
    fetchStocks,
    resetFilter,
    clearError,
  }
})
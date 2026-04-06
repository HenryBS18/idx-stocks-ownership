import { watchDebounced } from "@vueuse/core"
import type { Sort, Stock, StockResponse, StockSortField } from "~/types"

export const useStockStore = defineStore('stock', () => {
  const dateStore = useDateStore()
  const { selectedDate } = storeToRefs(dateStore)

  const stocks = ref<Stock[]>([])
  const lastUpdatedDate = ref<string>('')
  const showStockAccordion = ref<boolean>(false)
  const search = ref<string>('')
  const searchDebounced = ref<string>('')
  const sortField = ref<StockSortField>('ticker')
  const sortOrder = ref<Sort>('asc')

  const filteredStocks = computed<Stock[]>(() => {
    let result = [...stocks.value]

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

      if (sortField.value === 'investor-count') {
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

  const fetchStocks = async (): Promise<void> => {
    const token = useCookie('token').value

    if (!selectedDate.value) return

    const [year, month] = selectedDate.value.split('-')

    const { data, lastUpdated } = await $fetch<StockResponse>('/api/stock', {
      query: { token, year, month }
    })

    stocks.value = data
    lastUpdatedDate.value = lastUpdated
    showStockAccordion.value = true
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

  watch(selectedDate, async (newDate, oldDate) => {
    if (!newDate || newDate === oldDate) return

    showStockAccordion.value = false
    await fetchStocks()
  })

  return {
    lastUpdatedDate,
    showStockAccordion,
    search,
    sortField,
    sortOrder,
    filteredStocks,
    stockCount,
    toggleSort,
    fetchStocks,
    resetFilter,
  }
})
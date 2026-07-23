import { watchDebounced } from "@vueuse/core"
import type { InvestorOrigin, InvestorSortField, Sort } from "~/types"

export const useInvestorStore = defineStore('investor', () => {
  const dateStore = useDateStore()
  const { selectedDate } = storeToRefs(dateStore)

  const portfolios = ref<InvestorPortfolio[]>([])
  const showInvestorsAccordion = ref<boolean>(false)
  const search = ref<string>('')
  const searchDebounced = ref<string>('')
  const sortField = ref<InvestorSortField>('name')
  const sortOrder = ref<Sort>('asc')
  const selectedInvestorOrigin = ref<InvestorOrigin>('Semua')
  const selectedInvestorTypes = ref<string[]>(['Semua'])
  const fetchedDate = ref<string | null>(null)

  const filteredInvestors = computed<InvestorPortfolio[]>(() => {
    let result = [...portfolios.value]

    if (searchDebounced.value) {
      const q = searchDebounced.value.toLowerCase()
      result = result.filter(investor => investor.investorName.toLowerCase().includes(q))
    }

    if (selectedInvestorOrigin.value !== 'Semua') {
      result = result.filter(i => i.localForeign === selectedInvestorOrigin.value)
    }

    if (!selectedInvestorTypes.value.includes('Semua')) {
      result = result.filter(i => selectedInvestorTypes.value.includes(i.investorType))
    }

    result.sort((a, b) => {
      let compare = 0

      if (sortField.value === 'name') {
        compare = a.investorName.localeCompare(b.investorName)
      }

      if (sortField.value === 'stockCount') {
        compare = Number(a.stockCount) - Number(b.stockCount)
      }

      return sortOrder.value === 'asc' ? compare : -compare
    })

    return result
  })

  const investorCount = computed<number>(() => filteredInvestors.value.length)

  const toggleSort = (field: InvestorSortField) => {
    sortField.value = field
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const error = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const fetchInvestors = async (token: string) => {
    if (!selectedDate.value) return

    error.value = false
    showInvestorsAccordion.value = false
    const [year, month] = selectedDate.value.split('-')

    try {
      const data = await $fetch<InvestorPortfolio[]>('/api/investor', {
        query: { token, year, month }
      })
      portfolios.value = data
      showInvestorsAccordion.value = true
      fetchedDate.value = selectedDate.value
    } catch (e) {
      error.value = true
      errorMessage.value = 'Gagal memuat data investor. Periksa koneksi Anda dan coba lagi.'
    }
  }

  function clearError() {
    error.value = false
    errorMessage.value = ''
  }

  const resetFilter = () => {
    search.value = ''
    searchDebounced.value = ''
    sortField.value = 'name'
    sortOrder.value = 'asc'
    selectedInvestorOrigin.value = 'Semua'
    selectedInvestorTypes.value = ['Semua']
  }

  watchDebounced(search, (v) => {
    searchDebounced.value = v
  }, { debounce: 500 })

  return {
    showInvestorsAccordion,
    search,
    searchDebounced,
    sortField,
    sortOrder,
    selectedInvestorOrigin,
    selectedInvestorTypes,
    filteredInvestors,
    investorCount,
    fetchedDate,
    error,
    errorMessage,
    toggleSort,
    fetchInvestors,
    resetFilter,
    clearError,
  }
})
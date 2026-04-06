import { watchDebounced } from "@vueuse/core"
import type { InvestorOrigin, InvestorSortField, InvestorStock, InvestorStockResponse, Sort } from "~/types"

export const useInvestorStore = defineStore('investor', () => {
  const dateStore = useDateStore()
  const { selectedDate } = storeToRefs(dateStore)

  const investors = ref<InvestorStock[]>([])
  const lastUpdatedDate = ref<string>('')
  const showInvestorsAccordion = ref<boolean>(false)
  const search = ref<string>('')
  const searchDebounced = ref<string>('')
  const sortField = ref<InvestorSortField>('nama')
  const sortOrder = ref<Sort>('asc')
  const selectedInvestorOrigin = ref<InvestorOrigin>('Semua')
  const selectedInvestorType = ref<string[]>(['Semua'])
  const fetchedDate = ref<string | null>(null)

  const filteredInvestors = computed<InvestorStock[]>(() => {
    let result = [...investors.value]

    if (searchDebounced.value) {
      const q = searchDebounced.value.toLowerCase()
      result = result.filter(investor => investor.investorName.toLowerCase().includes(q))
    }

    if (selectedInvestorOrigin.value !== 'Semua') {
      result = result.filter(i => i.localForeign === selectedInvestorOrigin.value)
    }

    if (!selectedInvestorType.value.includes('Semua')) {
      result = result.filter(i => selectedInvestorType.value.includes(i.investorType))
    }

    result.sort((a, b) => {
      let compare = 0

      if (sortField.value === 'nama') {
        compare = a.investorName.localeCompare(b.investorName)
      }

      if (sortField.value === 'stock-count') {
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

  const fetchInvestors = async () => {
    const token = useCookie('token').value

    if (!selectedDate.value) return

    const [year, month] = selectedDate.value.split('-')

    const { data, lastUpdated } = await $fetch<InvestorStockResponse>('/api/investor', {
      query: { token, year, month }
    })

    investors.value = data
    lastUpdatedDate.value = lastUpdated
    showInvestorsAccordion.value = true
    fetchedDate.value = selectedDate.value
  }

  const resetFilter = () => {
    search.value = ''
    searchDebounced.value = ''
    sortField.value = 'nama'
    sortOrder.value = 'asc'
    selectedInvestorOrigin.value = 'Semua'
    selectedInvestorType.value = ['Semua']
  }

  watchDebounced(search, (v) => {
    searchDebounced.value = v
  }, { debounce: 500 })

  return {
    lastUpdatedDate,
    showInvestorsAccordion,
    search,
    sortField,
    sortOrder,
    selectedInvestorOrigin,
    selectedInvestorType,
    filteredInvestors,
    investorCount,
    fetchedDate,
    toggleSort,
    fetchInvestors,
    resetFilter,
  }
})
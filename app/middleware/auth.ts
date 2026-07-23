export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') return navigateTo('/saham')

  try {
    const token = useCookie('token')

    if (!token.value) {
      const tokenResponse = await $fetch<{ token: string }>('/api/token')
      token.value = tokenResponse.token
    }

    const dateStore = useDateStore()
    await dateStore.fetchDates(token.value)

    const { selectedDate } = storeToRefs(dateStore)
    if (!selectedDate.value) return

    if (to.path === '/saham') {
      const stockStore = useStockStore()
      await stockStore.fetchStocks(token.value)
    }

    if (to.path === '/investor') {
      const investorStore = useInvestorStore()
      await investorStore.fetchInvestors(token.value)
    }
  } catch (err) {
    // Token fetch failed — set date store error so page renders error card
    const dateStore = useDateStore()
    dateStore.error = true
    dateStore.errorMessage = 'Gagal terhubung ke server. Silakan muat ulang halaman.'
  }
})
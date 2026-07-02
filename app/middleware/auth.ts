export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') return navigateTo('/saham')

  const token = useCookie('token')

  if (!token.value) {
    const tokenResponse = await $fetch<{ token: string }>('/api/token')
    token.value = tokenResponse.token
  }

  const { fetchDates } = useDateStore()
  await fetchDates(token.value)

  if (to.path === '/saham') {
    const { fetchStocks } = useStockStore()
    const { selectedDate } = storeToRefs(useDateStore())
    if (selectedDate.value) await fetchStocks(token.value)
  }

  if (to.path === '/investor') {
    const { fetchInvestors } = useInvestorStore()
    const { selectedDate } = storeToRefs(useDateStore())
    if (selectedDate.value) await fetchInvestors(token.value)
  }
})
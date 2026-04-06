export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('token').value

  if (!token) await $fetch('/api/token')

  const { fetchDates } = useDateStore()
  await fetchDates()

  if (to.path === '/') return navigateTo('/saham')
})
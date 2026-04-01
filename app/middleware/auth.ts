export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('token').value

  if (!token) await $fetch('/api/token')

  if (to.path === '/') return navigateTo('/saham')
})
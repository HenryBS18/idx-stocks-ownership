export default defineNuxtRouteMiddleware(async (to, from) => {
  await $fetch('/api/token')

  if (to.path === '/') return navigateTo('/saham')
})
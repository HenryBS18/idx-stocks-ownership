export default defineNuxtRouteMiddleware(async (to, from) => {
  return await $fetch('/api/token')
})
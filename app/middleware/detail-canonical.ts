export default defineNuxtRouteMiddleware((to) => {
  if (typeof to.params.ticker === 'string' && to.params.ticker !== to.params.ticker.toUpperCase()) {
    return navigateTo({ path: `/saham/${encodeURIComponent(to.params.ticker.toUpperCase())}`, query: to.query }, { redirectCode: 301 })
  }
  if (typeof to.params.slug === 'string' && to.params.slug !== to.params.slug.toLowerCase()) {
    return navigateTo({ path: `/investor/${encodeURIComponent(to.params.slug.toLowerCase())}`, query: to.query }, { redirectCode: 301 })
  }
})

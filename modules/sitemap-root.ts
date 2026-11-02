import { defineNuxtModule } from '@nuxt/kit'

// Keep the already-submitted URL as the index without copying the XML renderer.
export default defineNuxtModule({
  meta: { name: 'sitemap-root' },
  setup(_, nuxt) {
    nuxt.hook('modules:done', () => {
      const index = nuxt.options.serverHandlers.find(entry => entry.route === '/sitemap_index.xml')
      const root = nuxt.options.serverHandlers.find(entry => entry.route === '/sitemap.xml')
      if (!index || !root) throw new Error('Sitemap module routes changed; check the sitemap-root adapter.')
      root.handler = index.handler
      const rules = nuxt.options.nitro.routeRules ??= {}
      delete rules['/sitemap.xml']?.redirect
      rules['/sitemap_index.xml'] = { redirect: { to: '/sitemap.xml', statusCode: 301 } }
    })
  },
})

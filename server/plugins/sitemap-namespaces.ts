const URLSET_OPENING_TAG = /<urlset[^>]*>/

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:output', (ctx) => {
    ctx.sitemap = ctx.sitemap.replace(URLSET_OPENING_TAG, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  })
})

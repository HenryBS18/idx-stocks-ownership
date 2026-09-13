import { execFileSync } from 'node:child_process'
import type { SitemapUrl } from '@nuxtjs/sitemap'

type RouteSource = Pick<SitemapUrl, 'loc' | 'priority'> & { sources: string[] }

const routes: RouteSource[] = [
  { loc: '/', priority: 1, sources: ['app/pages/index.vue'] },
  { loc: '/saham', priority: 0.8, sources: ['app/pages/saham.vue', 'app/components/SahamAccordion.vue'] },
  { loc: '/investor', priority: 0.8, sources: ['app/pages/investor.vue', 'app/components/InvestorAccordion.vue'] },
]

const lastCommitDate = (sources: string[]): string | null => {
  try {
    const stdout = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...sources], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    return stdout.trim() || null
  } catch {
    return null
  }
}

export const sitemapUrls = (): SitemapUrl[] => {
  const buildTime = new Date().toISOString()

  return routes.map(({ loc, priority, sources }) => ({
    loc,
    priority,
    lastmod: lastCommitDate(sources) ?? buildTime,
  }))
}

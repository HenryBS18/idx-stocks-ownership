import { execFileSync } from 'node:child_process'

const lastCommitDate = (sources: string[]): string => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', ...sources], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

export const sitemapContentDates = () => {
  const shareholderSort = 'server/utils/sort-stock-investors.ts'
  const sharedDetail = [
    'app/components/OwnershipDetailPage.vue', 'app/components/OwnershipDetailView.vue',
    // Retain historical paths so moving content does not lose its commit date.
    'app/components/DetailHoldingsTable.vue', 'app/components/OwnershipChanges.vue',
    'app/components/DataSourceNote.vue', 'app/utils/detail-format.ts', 'app/utils/format-share.ts',
    'server/services/detail.service.ts', 'server/utils/ownership-detail.ts',
  ]
  return {
    pages: {
      '/': lastCommitDate(['app/pages/index.vue', 'app/components/LandingFaq.vue', 'app/components/LandingOwnership.vue', 'app/components/LandingPreviewLink.vue', 'app/components/HoldingRelationshipBadge.vue', 'server/services/landing.service.ts', shareholderSort]),
      '/saham': lastCommitDate(['app/pages/saham/index.vue', 'app/pages/saham.vue', 'app/components/SahamAccordion.vue', 'app/components/StockInvestorsTable.vue', 'server/services/stock.service.ts', shareholderSort]),
      '/investor': lastCommitDate(['app/pages/investor/index.vue', 'app/pages/investor.vue', 'app/components/InvestorAccordion.vue', 'app/components/InvestorStocksTable.vue', 'server/services/investor.service.ts']),
      '/hsc': lastCommitDate(['app/pages/hsc.vue', 'server/api/stock/hsc/index.ts', 'server/services/stock.service.ts', 'app/components/DataSourceNote.vue', 'app/utils/constants.ts']),
      '/lisensi': lastCommitDate(['app/pages/lisensi.vue', 'app/utils/constants.ts']),
      '/privasi': lastCommitDate(['app/pages/privasi.vue', 'app/utils/constants.ts']),
    },
    stocks: lastCommitDate([...sharedDetail, 'app/pages/saham/[ticker].vue', 'app/components/StockInvestorsTable.vue', 'app/components/StockOwnershipChart.vue', 'app/utils/ownership-ranking.ts', shareholderSort]),
    investors: lastCommitDate([...sharedDetail, 'app/pages/investor/[slug].vue', 'app/components/InvestorStocksTable.vue']),
  }
}

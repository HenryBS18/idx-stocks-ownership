import type { ControllerOrAffiliate } from '../../shared/types/index.ts'

type SortableInvestor = {
  investorName: string
  percentage: number
  controllerOrAffiliate?: ControllerOrAffiliate | null
}

const relationshipRank = (value: SortableInvestor['controllerOrAffiliate']): number =>
  value === 'CONTROLLER' ? 0 : value === 'AFFILIATE' ? 1 : 2

export const sortStockInvestors = <T extends SortableInvestor>(investors: readonly T[]): T[] =>
  [...investors].sort((a, b) =>
    relationshipRank(a.controllerOrAffiliate) - relationshipRank(b.controllerOrAffiliate)
    || b.percentage - a.percentage
    || a.investorName.localeCompare(b.investorName, 'id'),
  )

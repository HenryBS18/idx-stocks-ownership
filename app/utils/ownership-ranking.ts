type OwnershipHolding = { investorName: string; percentage: number }

const comparePercentage = (a: OwnershipHolding, b: OwnershipHolding): number =>
  b.percentage - a.percentage || a.investorName.localeCompare(b.investorName, 'id')

export const sortByOwnershipPercentage = <T extends OwnershipHolding>(holdings: readonly T[]): T[] =>
  [...holdings].sort(comparePercentage)

export const getLargestShareholder = <T extends OwnershipHolding>(holdings: readonly T[]): T | undefined =>
  holdings.reduce<T | undefined>((largest, holding) =>
    !largest || comparePercentage(holding, largest) < 0 ? holding : largest,
  undefined)

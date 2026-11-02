export const formatOwnership = (value: number): string =>
  value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatPercentagePoints = (value: number): string => `${value > 0 ? '+' : ''}${formatOwnership(value)}`

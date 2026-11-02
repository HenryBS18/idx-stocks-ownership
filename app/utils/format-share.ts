export const formatTableShares = (value: string | number): string =>
  typeof value === 'string' ? BigInt(value).toLocaleString() : value.toLocaleString()

export const formatShareCompact = (value: string | number): string => {
  if (typeof value === 'string') {
    const shares = BigInt(value)
    const absolute = shares < 0n ? -shares : shares
    const units = [[1_000_000_000_000n, 'T'], [1_000_000_000n, 'B'], [1_000_000n, 'M'], [1_000n, 'K']] as const
    for (const [divisor, suffix] of units) {
      if (absolute < divisor) continue
      const hundredths = (absolute * 100n + divisor / 2n) / divisor
      const fraction = (hundredths % 100n).toString().padStart(2, '0').replace(/0+$/, '')
      return `${shares < 0n ? '-' : ''}${hundredths / 100n}${fraction ? `.${fraction}` : ''}${suffix}`
    }
    return shares.toLocaleString()
  }
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'T'
  }
  if (abs >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B'
  }
  if (abs >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'
  }
  if (abs >= 1_000) {
    return (value / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K'
  }
  return value.toLocaleString()
}

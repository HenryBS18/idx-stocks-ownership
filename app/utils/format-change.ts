export const formatChange = (change: number): string => `${change > 0 ? '+' : ''}${Math.round(change * 100) / 100}`

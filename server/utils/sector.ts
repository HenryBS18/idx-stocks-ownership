import type { Sector } from '../generated/prisma/enums'

const labels: Record<Sector, string> = {
  BASIC_MAT: 'Basic Mat',
  CYCLICAL: 'Cyclical',
  ENERGY: 'Energy',
  FINANCE: 'Finance',
  HEALTH: 'Health',
  INDUSTRIAL: 'Industrial',
  INFRASTRUCTURES: 'Infrastructures',
  NON_CYCLICAL: 'Non-Cyclical',
  PROPERTY: 'Property',
  TECHNOLOGY: 'Technology',
  TRANSPORT: 'Transport',
}

export const getSectorLabel = (sector: Sector | null | undefined): string | null => {
  return sector ? labels[sector] : null
}

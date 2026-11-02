import { createHash } from 'node:crypto'

export type InvestorSlug = { investorName: string; slug: string }

export const investorSlugBase = (name: string): string => {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 140).replace(/-$/g, '') || 'investor'
}

export const allocateInvestorSlugs = (names: string[], existing: InvestorSlug[]): InvestorSlug[] => {
  const byName = new Map(existing.map(profile => [profile.investorName, profile.slug]))
  const used = new Set(existing.map(profile => profile.slug))
  const additions: InvestorSlug[] = []

  for (const investorName of [...new Set(names)].sort()) {
    if (!investorName.trim() || byName.has(investorName)) continue
    const base = investorSlugBase(investorName)
    const hash = createHash('sha256').update(investorName).digest('hex')
    let slug = base
    let attempt = 0
    while (used.has(slug)) {
      slug = attempt < 15
        ? `${base}-${hash.slice(0, 8 + attempt * 4)}`
        : `${base}-${hash}-${attempt}`
      attempt++
    }
    used.add(slug)
    byName.set(investorName, slug)
    additions.push({ investorName, slug })
  }
  return additions
}

type ProfileStore = {
  findMany: () => Promise<InvestorSlug[]>
  createMany: (args: { data: InvestorSlug[]; skipDuplicates: true }) => Promise<unknown>
}

// ON CONFLICT DO NOTHING keeps concurrent imports from aborting the transaction.
// Re-read after writes so every name resolves to the assignment that actually won.
export const ensureInvestorProfiles = async (store: ProfileStore, names: string[]): Promise<void> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await store.findMany()
    const additions = allocateInvestorSlugs(names, existing)
    if (!additions.length) return
    for (let i = 0; i < additions.length; i += 1000) {
      await store.createMany({ data: additions.slice(i, i + 1000), skipDuplicates: true })
    }
  }
  if (allocateInvestorSlugs(names, await store.findMany()).length) {
    throw new Error('Unable to assign investor URLs after concurrent imports; retry the upload.')
  }
}

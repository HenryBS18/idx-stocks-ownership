import { getCache, setCache } from './cache'

export const getInvestorSlugMap = async (): Promise<Map<string, string>> => {
  const cacheKey = 'detail:investor-slugs'
  let profiles = await getCache<{ investorName: string; slug: string }[]>(cacheKey)
  if (!profiles) {
    profiles = await prisma.investorProfile.findMany()
    await setCache(cacheKey, profiles)
  }
  return new Map(profiles.map(profile => [profile.investorName, profile.slug]))
}

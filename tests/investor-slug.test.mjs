import test from 'node:test'
import assert from 'node:assert/strict'
import { allocateInvestorSlugs, ensureInvestorProfiles, investorSlugBase } from '../server/utils/investor-slug.ts'

test('normalizes names without changing display identities', () => {
  assert.equal(investorSlugBase('  ABDI   ANDRE  '), 'abdi-andre')
  assert.equal(investorSlugBase('PT. A/B & CO.'), 'pt-a-b-co')
  assert.equal(investorSlugBase('ÉRIC'), 'eric')
  assert.equal(investorSlugBase('---'), 'investor')
  assert.equal(allocateInvestorSlugs(['   '], []).length, 0)
})

test('distinct names with the same base get stable unique assignments', () => {
  const names = ['ABDI ANDRE', 'ABDI-ANDRE', 'ABDI  ANDRE']
  const first = allocateInvestorSlugs(names, [])
  assert.equal(new Set(first.map(row => row.slug)).size, 3)
  assert.deepEqual(allocateInvestorSlugs([...names].reverse(), []), first)
  assert.deepEqual(allocateInvestorSlugs(names, first), [])
  const extra = allocateInvestorSlugs([...names, 'abdi andre'], first)
  assert.equal(extra.length, 1)
  assert.ok(!first.some(row => row.slug === extra[0].slug))
  assert.ok(extra[0].slug.startsWith('abdi-andre-'))
})

test('backfill is idempotent and recovers from a concurrent slug claim', async () => {
  const profiles = []
  let raced = false
  const store = {
    findMany: async () => [...profiles],
    createMany: async ({ data }) => {
      if (!raced) {
        profiles.push({ investorName: 'ABDI-ANDRE', slug: 'abdi-andre' })
        raced = true
      }
      for (const row of data) {
        if (!profiles.some(profile => profile.slug === row.slug || profile.investorName === row.investorName)) profiles.push(row)
      }
    },
  }
  await ensureInvestorProfiles(store, ['ABDI ANDRE'])
  assert.equal(profiles.length, 2)
  assert.match(profiles.find(row => row.investorName === 'ABDI ANDRE').slug, /^abdi-andre-[a-f0-9]{8}$/)
  const before = structuredClone(profiles)
  await ensureInvestorProfiles(store, ['ABDI ANDRE', 'ABDI-ANDRE'])
  assert.deepEqual(profiles, before)
})

test('long and non-Latin names stay within the column limit and remain unique', () => {
  const rows = allocateInvestorSlugs(['李', '王', 'A'.repeat(150), `${'A'.repeat(140)} B`], [])
  assert.equal(new Set(rows.map(row => row.slug)).size, 4)
  assert.ok(rows.every(row => row.slug.length <= 220))
})

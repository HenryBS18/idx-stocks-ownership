import 'dotenv/config'
import pg from 'pg'
import { ensureInvestorProfiles } from '../server/utils/investor-slug.ts'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
try {
  await client.connect()
  await client.query('BEGIN')
  const { rows } = await client.query('SELECT DISTINCT "investorName" FROM "StockInvestor" ORDER BY "investorName"')
  await ensureInvestorProfiles({
    findMany: async () => (await client.query('SELECT "investorName", "slug" FROM "InvestorProfile"')).rows,
    createMany: async ({ data }) => {
      const values = data.flatMap(({ investorName, slug }) => [investorName, slug])
      const placeholders = data.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')
      return client.query(`INSERT INTO "InvestorProfile" ("investorName", "slug") VALUES ${placeholders} ON CONFLICT DO NOTHING`, values)
    },
  }, rows.map(row => row.investorName))
  await client.query('COMMIT')
  console.log(`Investor URLs ready for ${rows.length} distinct recorded names.`)
} catch (error) {
  await client.query('ROLLBACK').catch(() => {})
  console.error('Investor URL backfill failed:', error.code || error.message)
  process.exitCode = 1
} finally {
  await client.end()
}

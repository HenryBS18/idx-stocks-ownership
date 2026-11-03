import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseCsv } from '../server/utils/parse-csv.ts'

const headers = [
  'SHARE_CODE', 'ISSUER_NAME', 'INVESTOR_NAME', 'INVESTOR_CLASSIFICATION',
  'CONTROLLER_OR_AFFILIATE', 'LOCAL_FOREIGN', 'DOMICILE', 'HOLDINGS_SCRIPLESS',
  'HOLDINGS_SCRIP', 'TOTAL_HOLDING_SHARES', 'PERCENTAGE',
]
const csvRow = (classification) => [
  'BBCA', 'Bank', 'INVESTOR A', 'CP', classification, 'L', 'INDONESIA',
  '"1,000"', '50', '"1,050"', '5.25',
]

const parseRows = async (t, columns, rows) => {
  const dir = await mkdtemp(join(tmpdir(), 'idx-csv-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const path = join(dir, 'holdings.csv')
  await writeFile(path, [columns, ...rows].map(row => row.join(',')).join('\n'))
  return parseCsv(path)
}

test('normalizes controller and affiliate values without shifting neighboring columns', async (t) => {
  const rows = await parseRows(t, headers, [
    csvRow('CONTROLLER'), csvRow('AFFILIATE OF THE CONTROLLER'),
    csvRow('  controller  '), csvRow('  affiliate of the controller  '),
  ])
  assert.deepEqual(rows.map(row => row.controllerOrAffiliate), [
    'CONTROLLER', 'AFFILIATE', 'CONTROLLER', 'AFFILIATE',
  ])
  for (const { controllerOrAffiliate, ...row } of rows) {
    assert.deepEqual(row, {
      ticker: 'BBCA', name: 'Bank', investorName: 'INVESTOR A', investorType: 'CP',
      localForeign: 'L', domicile: 'INDONESIA', scripless: 1000, scrip: 50,
      totalHoldingShare: 1050, percentage: 5.25,
    })
  }
})

test('blank and unrecognized classifications become null without discarding rows', async (t) => {
  const rows = await parseRows(t, headers, [csvRow(''), csvRow('   '), csvRow('UNKNOWN')])
  assert.equal(rows.length, 3)
  assert.deepEqual(rows.map(row => row.controllerOrAffiliate), [null, null, null])
})

test('older CSVs without the classification column remain supported', async (t) => {
  const columns = headers.filter(header => header !== 'CONTROLLER_OR_AFFILIATE')
  const values = csvRow('')
  values.splice(4, 1)
  const [row] = await parseRows(t, columns, [values])
  assert.equal(row.controllerOrAffiliate, null)
  assert.equal(row.investorType, 'CP')
  assert.equal(row.localForeign, 'L')
  assert.equal(row.domicile, 'INDONESIA')
  assert.equal(row.totalHoldingShare, 1050)
})

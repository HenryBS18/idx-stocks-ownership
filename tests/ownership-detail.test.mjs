import test from 'node:test'
import assert from 'node:assert/strict'
import { aggregateHoldings, compareHoldings } from '../server/utils/ownership-detail.ts'

const row = (investorName, percentage, extra = {}) => ({
  ticker: 'BBCA', stockName: 'Bank', sector: 'Finance', investorName,
  investorSlug: null, investorType: '', localForeign: 'D', domicile: '',
  totalHoldingShare: '100', percentage, ...extra,
})

test('aggregates matching records with exact integer share counts', () => {
  const rows = aggregateHoldings([
    row('A', 0.1, { totalHoldingShare: '9007199254740993' }),
    row('A', 0.2, { totalHoldingShare: '9' }),
    row('A', 1, { ticker: 'BBRI' }),
  ])
  assert.equal(rows.length, 2)
  assert.equal(rows[0].totalHoldingShare, '9007199254741002')
  assert.equal(rows[0].percentage, 0.3)
})

test('compares percentages in percentage points and preserves missing-record semantics', () => {
  const result = compareHoldings(
    [row('A', 2.5), row('B', 1.25), row('C', 3), row('D', 0)],
    [row('A', 2), row('B', 2.5), row('D', 0), row('E', 4)],
  )
  assert.deepEqual(result.holdings.map(row => [row.changeKind, row.change]), [
    ['increased', 0.5], ['decreased', -1.25], ['new', null], ['unchanged', 0],
  ])
  assert.equal(result.removedHoldings[0].investorName, 'E')
  assert.equal(result.removedHoldings[0].previousPercentage, 4)
  assert.equal(result.removedHoldings[0].change, null)
})

test('distinguishes absent comparison data from an available empty period', () => {
  assert.equal(compareHoldings([row('A', 2)], null).holdings[0].changeKind, 'unavailable')
  assert.equal(compareHoldings([row('A', 2)], []).holdings[0].changeKind, 'new')
  assert.deepEqual(compareHoldings([], null), { holdings: [], removedHoldings: [] })
  assert.equal(compareHoldings([], [row('A', 2)]).removedHoldings.length, 1)
})

test('compares grouped holdings and distinguishes different tickers and exact names', () => {
  const result = compareHoldings([row('A', 1), row('A', 2), row('A', 5, { ticker: 'BBRI' }), row('a', 1)], [row('A', 2.5)])
  assert.equal(result.holdings[0].change, 0.5)
  assert.equal(result.holdings[1].changeKind, 'new')
  assert.equal(result.holdings[2].changeKind, 'new')
})

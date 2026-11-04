import test from 'node:test'
import assert from 'node:assert/strict'
import { sortStockInvestors } from '../server/utils/sort-stock-investors.ts'

const row = (investorName, percentage, controllerOrAffiliate = null) => ({
  investorName, percentage, controllerOrAffiliate,
})
const names = rows => rows.map(row => row.investorName)

test('prioritizes controllers then affiliates, with percentages descending within each group', () => {
  const rows = [
    row('Largest holder', 40),
    row('Small affiliate', 1, 'AFFILIATE'),
    row('Small controller', 0.5, 'CONTROLLER'),
    row('Large affiliate', 20, 'AFFILIATE'),
    row('Large controller', 2, 'CONTROLLER'),
    row('Other holder', 5),
  ]
  assert.deepEqual(names(sortStockInvestors(rows)), [
    'Large controller', 'Small controller', 'Large affiliate', 'Small affiliate', 'Largest holder', 'Other holder',
  ])
})

test('breaks percentage ties alphabetically within each relationship group', () => {
  const rows = [
    row('Z controller', 1, 'CONTROLLER'), row('A affiliate', 1, 'AFFILIATE'),
    row('Z affiliate', 1, 'AFFILIATE'), row('A controller', 1, 'CONTROLLER'),
    row('Z other', 1), row('A other', 1),
  ]
  assert.deepEqual(names(sortStockInvestors(rows)), [
    'A controller', 'Z controller', 'A affiliate', 'Z affiliate', 'A other', 'Z other',
  ])
})

test('handles missing classifications and empty arrays without inferring relationships', () => {
  assert.deepEqual(sortStockInvestors([]), [])
  const rows = [row('Null', 1), { investorName: 'Missing', percentage: 3 }, row('Undefined', 2)]
  rows[2].controllerOrAffiliate = undefined
  assert.deepEqual(names(sortStockInvestors(rows)), ['Missing', 'Undefined', 'Null'])
  assert.equal(sortStockInvestors(rows)[0].controllerOrAffiliate, undefined)
})

test('preserves source ordering and records used by ownership summaries and charts', () => {
  const rows = Object.freeze([
    Object.freeze(row('Largest holder', 40)),
    Object.freeze(row('Controller', 2, 'CONTROLLER')),
  ])
  const sorted = sortStockInvestors(rows)
  assert.notEqual(sorted, rows)
  assert.equal(sorted[0], rows[1])
  assert.equal(rows[0].investorName, 'Largest holder')
  assert.equal(rows[0].percentage, 40)
  assert.equal(sorted.reduce((sum, row) => sum + row.percentage, 0), 42)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { getLargestShareholder, sortByOwnershipPercentage } from '../app/utils/ownership-ranking.ts'

const holding = (investorName, percentage) => Object.freeze({ investorName, percentage })

test('chart and summary rank by percentage independently of the backend table order', () => {
  const rows = Object.freeze([
    holding('Controller', 2), holding('Affiliate', 3), holding('Largest', 40),
    holding('Second', 20), holding('Third', 10), holding('Fourth', 8), holding('Fifth', 5),
  ])
  const ranked = sortByOwnershipPercentage(rows)
  assert.deepEqual(ranked.slice(0, 5).map(row => row.investorName), ['Largest', 'Second', 'Third', 'Fourth', 'Fifth'])
  assert.equal(ranked.slice(5).reduce((sum, row) => sum + row.percentage, 0), 5)
  assert.equal(getLargestShareholder(rows), rows[2])
  assert.equal(rows[0].investorName, 'Controller')
  assert.notEqual(ranked, rows)
})

test('percentage ties use the same alphabetical ranking for chart and summary', () => {
  const rows = [holding('Z holder', 10), holding('A holder', 10), holding('B holder', 5)]
  for (const input of [rows, [...rows].reverse()]) {
    assert.equal(getLargestShareholder(input).investorName, 'A holder')
    assert.deepEqual(sortByOwnershipPercentage(input).map(row => row.investorName), ['A holder', 'Z holder', 'B holder'])
  }
})

test('handles empty and short datasets, including zero ownership', () => {
  assert.equal(getLargestShareholder([]), undefined)
  assert.deepEqual(sortByOwnershipPercentage([]), [])
  const rows = [holding('B holder', 0), holding('A holder', 0)]
  assert.equal(getLargestShareholder(rows), rows[1])
  const ranked = sortByOwnershipPercentage(rows)
  assert.equal(ranked.slice(0, 5).length, 2)
  assert.equal(ranked.slice(5).reduce((sum, row) => sum + row.percentage, 0), 0)
})

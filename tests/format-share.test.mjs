import test from 'node:test'
import assert from 'node:assert/strict'
import { formatShareCompact, formatTableShares } from '../app/utils/format-share.ts'

test('full table share counts preserve integers beyond Number precision', () => {
  assert.equal(formatTableShares('9007199254740993'), 9007199254740993n.toLocaleString())
  assert.equal(formatTableShares('0'), '0')
  assert.equal(formatTableShares(12500), (12500).toLocaleString())
})

test('exact share strings use the existing compact units and rounding', () => {
  for (const [value, expected] of [
    ['999', '999'], ['1000', '1K'], ['12500', '12.5K'],
    ['1255000', '1.26M'], ['1234567890', '1.23B'],
    ['1000000000000', '1T'], ['9007199254740993', '9007.2T'],
    ['-12500', '-12.5K'],
  ]) assert.equal(formatShareCompact(value), expected)
})

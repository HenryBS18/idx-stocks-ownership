import test from 'node:test'
import assert from 'node:assert/strict'
import { parseHscPayload } from '../server/utils/parse-hsc-payload.ts'

const rejects400 = (body, pattern) => assert.throws(() => parseHscPayload(body), (error) => {
  assert.equal(error.statusCode, 400)
  assert.match(error.message, pattern)
  return true
})

test('normalizes tickers and keeps concentration values, including null', () => {
  const result = parseHscPayload({
    announceAt: '2026-11-13',
    data: [{ ticker: ' ocap ', concentration: 99.998 }, { ticker: 'FILM', concentration: null }, { ticker: 'EDGE', concentration: 0 }],
  })
  assert.equal(result.announceAt.toISOString(), '2026-11-13T00:00:00.000Z')
  assert.deepEqual(result.data, [
    { ticker: 'OCAP', concentration: 99.998 },
    { ticker: 'FILM', concentration: null },
    { ticker: 'EDGE', concentration: 0 },
  ])
})

test('rejects a missing, malformed, or impossible announceAt', () => {
  const data = [{ ticker: 'OCAP', concentration: 99 }]
  rejects400({ data }, /announceAt/)
  rejects400({ announceAt: '13 Nov 2026', data }, /YYYY-MM-DD/)
  rejects400({ announceAt: '2026-02-30', data }, /tidak valid|bukan tanggal/)
})

test('rejects a non-object body and an empty or missing data array', () => {
  rejects400(null, /JSON/)
  rejects400({ announceAt: '2026-11-13' }, /data/)
  rejects400({ announceAt: '2026-11-13', data: [] }, /data/)
})

test('rejects tickers that are not four characters and duplicate tickers', () => {
  rejects400({ announceAt: '2026-11-13', data: [{ ticker: 'BBCAX', concentration: 99 }] }, /data\[0\]\.ticker/)
  rejects400({ announceAt: '2026-11-13', data: [{ ticker: 42, concentration: 99 }] }, /data\[0\]\.ticker/)
  rejects400({ announceAt: '2026-11-13', data: [{ ticker: 'OCAP', concentration: 99 }, { ticker: 'ocap', concentration: 98 }] }, /duplikat: OCAP/)
})

test('rejects concentrations outside 0 to 99.999 or of the wrong type', () => {
  for (const concentration of [-0.001, 100, 99.9991, Number.NaN, '99', undefined]) {
    rejects400({ announceAt: '2026-11-13', data: [{ ticker: 'OCAP', concentration }] }, /concentration/)
  }
})

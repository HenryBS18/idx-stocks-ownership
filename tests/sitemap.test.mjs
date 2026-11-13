import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSitemapEntries, newestSitemapDate } from '../server/utils/sitemap-data.ts'

const buildAllSitemaps = (entities, dates, batches) => Object.fromEntries(
  ['sitemap-pages', 'sitemap-stocks', 'sitemap-investors'].map(name =>
    [name, buildSitemapEntries(name, entities, dates, batches)]),
)

const content = {
  pages: { '/': null, '/saham': null, '/investor': null, '/hsc': null, '/lisensi': '2026-01-01T00:00:00Z', '/privasi': null },
  stocks: '2026-08-01T00:00:00Z', investors: null,
}

test('sitemaps contain unique canonical paths and exactly the five main pages', () => {
  const maps = buildAllSitemaps({ tickers: ['BBRI', 'bbca ', 'BBCA'], slugs: ['abdi-andre', 'abdi-andre', 'abdi-andre-12345678'] }, content, [])
  assert.deepEqual(maps['sitemap-pages'].map(entry => entry.loc), ['/', '/saham', '/investor', '/hsc', '/lisensi', '/privasi'])
  assert.deepEqual(maps['sitemap-stocks'].map(entry => entry.loc), ['/saham/BBCA', '/saham/BBRI'])
  assert.deepEqual(maps['sitemap-investors'].map(entry => entry.loc), ['/investor/abdi-andre', '/investor/abdi-andre-12345678'])
  assert.ok(Object.values(maps).flat().every(entry => !entry.loc.includes('?')))
})

test('lastmod accounts for a later comparison backfill without changing legal page dates', () => {
  const entities = { tickers: ['BBCA'], slugs: ['abdi-andre'] }
  const before = buildAllSitemaps(entities, content, ['2026-10-01T00:00:00Z', '2026-09-01T00:00:00Z'])
  const after = buildAllSitemaps(entities, content, ['2026-10-01T00:00:00Z', '2026-11-01T00:00:00Z'])
  for (const name of ['sitemap-stocks', 'sitemap-investors']) {
    assert.equal(before[name][0].lastmod, '2026-10-01T00:00:00.000Z')
    assert.equal(after[name][0].lastmod, '2026-11-01T00:00:00.000Z')
  }
  assert.equal(after['sitemap-pages'][0].lastmod, '2026-11-01T00:00:00.000Z')
  assert.deepEqual(before['sitemap-pages'].slice(3), after['sitemap-pages'].slice(3))
  assert.deepEqual(after, buildAllSitemaps(entities, content, ['2026-10-01T00:00:00Z', '2026-11-01T00:00:00Z']))
})

test('uses committed content dates when newer and omits dates without evidence', () => {
  const maps = buildAllSitemaps({ tickers: ['BBCA'], slugs: ['abdi-andre'] }, content, [])
  assert.equal(maps['sitemap-stocks'][0].lastmod, '2026-08-01T00:00:00.000Z')
  assert.equal('lastmod' in maps['sitemap-investors'][0], false)
  assert.equal('lastmod' in maps['sitemap-pages'][5], false)
  assert.equal(newestSitemapDate(null, undefined, 'invalid'), undefined)
})

test('an empty database can still publish the main pages', () => {
  const maps = buildAllSitemaps({ tickers: [], slugs: [] }, content, [])
  assert.equal(maps['sitemap-pages'].length, 6)
  assert.deepEqual(maps['sitemap-stocks'], [])
  assert.deepEqual(maps['sitemap-investors'], [])
})

test('a newer HSC update moves only the pages and stocks that show HSC data', () => {
  const entities = { tickers: ['BBCA'], slugs: ['abdi-andre'] }
  const batches = ['2026-10-01T00:00:00Z']
  const before = buildAllSitemaps(entities, content, batches)
  const after = Object.fromEntries(['sitemap-pages', 'sitemap-stocks', 'sitemap-investors'].map(name =>
    [name, buildSitemapEntries(name, entities, content, batches, '2026-11-13T05:00:00Z')]))
  const pageDate = (maps, loc) => maps['sitemap-pages'].find(entry => entry.loc === loc).lastmod
  for (const loc of ['/', '/saham', '/hsc']) assert.equal(pageDate(after, loc), '2026-11-13T05:00:00.000Z')
  for (const loc of ['/investor', '/lisensi', '/privasi']) assert.equal(pageDate(after, loc), pageDate(before, loc))
  assert.equal(after['sitemap-stocks'][0].lastmod, '2026-11-13T05:00:00.000Z')
  assert.deepEqual(after['sitemap-investors'], before['sitemap-investors'])
  assert.equal(pageDate(buildAllSitemaps(entities, content, []), '/hsc'), undefined)
})

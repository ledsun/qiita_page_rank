const PageStream = require('./lib/page-stream')
const recentItemsStream = require('./lib/recent-items-stream')
const fetchPageRankStream = require('./lib/fetch-page-rank-stream')
const templateStream = require('./lib/template-stream')
const hasPageRankStream = require('./lib/has-page-rank-stream')
const LimitStream = require('./lib/limit-stream')

const TAG = process.argv[2]
const pageStream = new PageStream(TAG)
const limitStream = new LimitStream(recentItemsStream, fetchPageRankStream)

const pageRankStream = pageStream
  .pipe(recentItemsStream)
  .pipe(fetchPageRankStream)
  .pipe(hasPageRankStream)
  .pipe(templateStream)

pageRankStream.pipe(limitStream)
pageRankStream.pipe(process.stdout)

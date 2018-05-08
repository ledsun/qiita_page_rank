const fs = require('fs')
const es = require('event-stream')
const QueryHistories = require('./query-histories')
const PageRank = require('./page-rank')

module.exports = function(file) {
  const pageRanks = new PageRank()
  const queryHistories = new QueryHistories()
  const existEntries = new Set()

  const s = fs.createReadStream(file, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const [url, title, count, content_length, tags, created_at, updated_at] = line.split('\t')
        // 稀に空行があるらしい
        if (url) {
          const tagArray = tags.split(',')

          if (Number(count)) {
            queryHistories.add(url, tagArray)
          }

          if (url) {
            pageRanks.set(url, title, count, content_length, tagArray, created_at, updated_at)
          }

          existEntries.add(`${url}`)
        }

        // resume the readstream, possibly from a callback
        s.resume()
      })
      .on('error', (err) => console.log(new Date(), 'Error while reading file.', err))
      .on('end', () => console.log(new Date(), 'Read journal file.'))
    )

  return {
    pageRanks,
    queryHistories,
    existEntries
  }
}
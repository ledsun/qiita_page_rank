const {
  Transform
} = require('stream')

// 一定数見つけたら検索をやめます
module.exports = class extends Transform {
  constructor(fetchItemListStream, fetchItemAttributesStream, max) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._fetchItemListStream = fetchItemListStream
    this._fetchItemAttributesStream = fetchItemAttributesStream
    this._count = 0
    this._max = max
  }
  _transform(chunk, encoding, callback) {
    this._count++;
    if (this._count > this._max) {
      this.stop()
    }
    callback()
  }
  stop() {
    // https://stackoverflow.com/questions/28621175/node-js-how-to-stop-a-piped-stream-conditionally
    this._fetchItemListStream.unpipe(this._fetchItemAttributesStream)
    this._fetchItemAttributesStream.end()
  }
}

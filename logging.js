const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./web/data.json')
const db = low(adapter)

db.defaults({data: {}})
  .write()

  let write = async function(data) {
    await db.get("data")
      .push(data)
      .write()
  }

module.exports = { write }
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./web/data.json')
const db = low(adapter)

db.defaults({data: {}})
  .write()

let writeData = async function(data) {
  console.log("data:", typeof data, data)
  let unixTimestamp = (Object.keys(data))[0]
  await db.set("data." + unixTimestamp, data[unixTimestamp])
    .write()
}

module.exports = { writeData }
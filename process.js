let moment = require("moment")
const datafile = require("./web/data.json")

let data = datafile.data
let keys = ["light", "temp", "humidity", "soil"]
let days = {}
// console.error(Object.keys(data).sort())
for (let unixTimestamp of Object.keys(data).sort()) {
  let unix = moment.unix(parseInt(unixTimestamp))
  let date = unix.format("DD-MM-YYYY")
  let dateTime = unix.format("DD-MM-YYYY HH:mm:ss")

  if (!days[date]) {
    days[date] = {
      unix: unixTimestamp,
      data: [
        data[unixTimestamp]
      ]
    }
    for (let sensor of keys) {
      days[date][sensor] = {}
      let daysObj = days[date][sensor]
      let dataObj = data[unixTimestamp][sensor]
      daysObj.highest = dataObj
      daysObj.highestTime = dateTime
      daysObj.lowest = dataObj
      daysObj.lowestTime = dateTime
    }
  } else {
    days[date].data.push(data[unixTimestamp])
    
    for (let sensor of keys) {
      let daysObj = days[date][sensor]
      let dataObj = data[unixTimestamp][sensor]
      if (dataObj > daysObj.highest) {
        daysObj.highest = dataObj
        daysObj.highestTime = dateTime
      }
      if (dataObj < daysObj.lowest) {
        daysObj.lowest = dataObj
        daysObj.lowestTime = dateTime
      }
    }
  }
}

// console.log(days)

let final = {}

for (let day of Object.keys(days)) {
  let data = days[day].data
  final[day] = {}
  let sensors = {}
  for (let sensor of keys) {
    sensors[sensor] = []
  }
  for (let i in data) {
    for (let sensor of keys) {
      sensors[sensor].push(data[i][sensor])
    }
  }
  // console.log(sensors)
  // console.log("=== END ===")
  // daysObj.highest = dataObj
  // daysObj.highestTime = date
  // daysObj.lowest = dataObj
  // daysObj.lowestTime = date
  for (let sensor of keys) {
    let sum = sensors[sensor].reduce((a, b) => a + b)
    let average = sum / sensors[sensor].length
    let stats = Object.assign({}, days[day])
    delete stats.data
    stats[sensor].average = average
    // console.log("stats", stats)
    final[day] = stats
  }
}

console.log(final)



for (let day of Object.keys(final)) {
  console.log("=======================")
  console.log("Day:", day)
  console.log("Temperature (Maximum)", final[day].temp.highest)
  console.log("Temperature (Minimum)", final[day].temp.lowest)
  console.log("humidity (average)", final[day].humidity.average)
  console.log("Light (average)", final[day].light.average)
}
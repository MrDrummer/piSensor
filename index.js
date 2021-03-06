let { wss,  broadcast } = require("./websocket.js")
let { writeData } = require("./logging")
let config = require("./config.json")

broadcast("A test broadcast to all listening devices!")

console.log(Date.now(), ":", "spooling up")
if (!config.dev) {
  let {PythonShell} = require('python-shell')
  let pyshell = new PythonShell('serialReader.py')

  pyshell.on('message', function (message) {
    console.log(Date.now(), ":", message)

    let converted = convertData(message)

    if (!converted) return

    console.log("Data converted:", converted)
    broadcast(converted)
    writeData(converted)
  })

  // end the input stream and allow the process to exit
  pyshell.end(function (err, code, signal) {
    if (err) throw err
    console.log('The exit code was: ' + code)
    console.log('The exit signal was: ' + signal)
    console.log('finished')
    console.log('finished')
  })
}

let convertData = function (data) {
  let split = data.split(",")
  // console.log("split:", typeof split, split)
  if (split.length !== 5) {
    console.error("failed:", split)
    return false
  }
  /*
    light
    temp
    humidity
    soil
  */

  let out = {}
  out[split[0]] = {
    "light": parseFloat(split[1]),
    "temp": parseFloat(split[2]),
    "humidity": parseFloat(split[3]),
    "soil": parseFloat(split[4])
  }
  console.log("out", out)
  return out
}
let { wss,  broadcast } = require("./websocket.js")
let { writeData } = require("./logging")

broadcast("A test broadcast to all listening devices!")

console.log(Date.now(), ":", "spooling up")
let {PythonShell} = require('python-shell');
let pyshell = new PythonShell('serialReader.py');

pyshell.on('message', function (message) {
  console.log(Date.now(), ":", message);

  let converted = convertData(message)

  if (!converted) return

  console.log("Data converted:", converted)
  broadcast(converted)
  writeData(converted)
});

// end the input stream and allow the process to exit
pyshell.end(function (err, code, signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
  console.log('finished');
});

let convertData = function (data) {
  let split = data.split(",")
  console.log("split:", typeof split, split)
  if (typeof split === "undefined") return false
  /*
    light
    temp
    moisture
    soil
  */

  let out = {}
  out[split[0]] = {
    "light": split[1],
    "temp": split[2],
    "moisture": split[3],
    "soil": split[4]
  }
  console.log("out", out)
  return out
}
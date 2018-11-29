let { wss,  broadcast } = require("./websocket.js")

let startSerial = async function() {
  let instance = new Promise((resolve, reject) => {

    // const timeout = 5000
    // let lastTimestamp = Date.now()

    // let check = setInterval(function() {
    //   if ((Date.now() - timeout) > lastTimestamp) {
    //     clearInterval(check)
    //     resolve("Open connection. No response for " + (timeout / 1000) + "s, so resolving.")
    //   }
    // },1000)

    var exec = require('child_process').exec
    // var child = spawn(command, args)
    var child = exec("python '/plantProject/serialReader.py'")

    child.stdout.on('data', function(data) {

    })
    child.stderr.on('data', function(data) {
      console.error('stderr: ' + data.toString())
      // clearInterval(check)
      reject("Error Data: " + data)
    })

    child.on('close', function(code) {
      // clearInterval(check)
      resolve(code)
    })
  })
  let promise = await instance
  console.log(promise)
  return promise
}

startSerial()
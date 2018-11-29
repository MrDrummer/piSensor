let { wss,  broadcast } = require("./websocket.js")



broadcast("A test broadcast to all listening devices!")

console.log(Date.now(), ":", "spooling up")
let {PythonShell} = require('python-shell');
let pyshell = new PythonShell('process.py');

pyshell.on('message', function (message) {
  console.log(Date.now(), ":", message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err, code, signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
  console.log('finished');
});

var http = require('http')
var express = require('express')
var WSS = require('ws').Server

var app = express().use(express.static('web'))
var server = http.createServer(app)
server.listen(8080, '0.0.0.0')

var wss = new WSS({ port: 8081 })
wss.on('connection', function(socket) {
  console.log('Connection started')

  var json = JSON.stringify({ success: true })
  socket.send(json)

  broadcast(wss.clients.length, "clients")
  console.log('Sent: ' + json)

  socket.on('message', function(message) {
    console.log('from client: ' + message)
  })

  socket.on('close', function() {
    console.log('Connection closed')
  })

})

var broadcast = function(data, key = "data") {
  console.log("Sending", data, "to all " + wss.clients.length + "clients.")
  let dataJSON = {}
  dataJSON[key] = data
  var json = JSON.stringify(dataJSON)
  wss.clients.forEach(function each(client) {
    client.send(json)
  })
}

module.exports = { wss, broadcast }
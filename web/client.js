
var socket = new WebSocket('ws://192.168.1.12:8081/')
socket.onopen = function(event) {
  var json = JSON.stringify({ message: 'ready' })
  socket.send(json)
}

socket.onerror = function(event) {
  console.log(event)
}

socket.onmessage = function (event) {
  console.log(event)
}

socket.onclose = function(event) {
  console.log(event)
}

window.addEventListener('beforeunload', function() {
  socket.close()
})

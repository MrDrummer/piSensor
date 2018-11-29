
var socket = new WebSocket('ws://localhost:8081/')
socket.onopen = function(event) {
  var json = JSON.stringify({ message: 'ready' })
  socket.send(json)
}

socket.onerror = function(event) {
}

socket.onmessage = function (event) {
}

socket.onclose = function(event) {
}

document.querySelector('#close').addEventListener('click', function(event) {
  socket.close()
})

document.querySelector('#send').addEventListener('click', function(event) {
  var json = JSON.stringify({ message: 'Hey there' })
  socket.send(json)
})


window.addEventListener('beforeunload', function() {
  socket.close()
})

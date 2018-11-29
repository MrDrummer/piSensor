
var socket = new WebSocket('ws://192.168.1.12:8081/')
socket.onopen = function(event) {
  console.log("websocket opened")
  var json = JSON.stringify({ message: 'ready' })
  socket.send(json)
}

socket.onerror = function(event) {
  console.log(event)
}

socket.onmessage = function (event) {
  console.log(event)
  let response = (JSON.parse(event.data))
  if (response.data) {
    data = response.data.split(",")
    document.getElementById("data").innerHTML = "Time: " + unixToTime(data[0]) + " Soil: " + data[1] + " Temperature: " + data[2] + " Light: " + data[3] + " Humidity: " + data[4]
  } else if (response.clients) {
    document.getElementById("clients").innerHTML = "Clients connected: " + response.clients
  } else {
    console.error("Received data I do not recognise!", event)
  }
}

socket.onclose = function(event) {
  console.log(event)
}

window.addEventListener('beforeunload', function() {
  console.log("websocket closed")
  socket.close()
})

function unixToTime(t) {
  var dt = new Date(t*1000);
  var hr = dt.getHours();
  var m = "0" + dt.getMinutes();
  var s = "0" + dt.getSeconds();
  return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);  
}
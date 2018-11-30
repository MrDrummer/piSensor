
var socket = new WebSocket('ws://' + window.location.hostname + ":8081/")
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
    updateValues(data)
  } else if (response.clients) {
    document.getElementById("clients").innerHTML = "Clients connected: " + response.clients
  } else {
    console.error("Received data I do not recognise!", event)
  }
}

socket.onclose = function(event) {
  console.log(event)
  document.getElementById("clients").innerHTML = "Disconnected from server. Try Refreshing."
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

async function populateData() {
  let response = await fetch("data.json");
  let parsed = await response.json();
  console.log("parsed", parsed)
}

function updateValues (data) {
  document.getElementById("data").innerHTML = "Time: " + unixToTime((Object.keys(data))[0]) + " Light: " + data.light + " Temperature: " + data.temp + " Humidity: " + data.humidity + " Soil: " + data.soil
}

populateData()
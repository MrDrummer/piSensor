const timeFormat = 'MM/DD/YYYY HH:mm';
let sensorData = {}
let chart = {}
var socket = new WebSocket('ws://' + window.location.hostname + ":8081/")
socket.onopen = function(event) {
  console.log("websocket opened")
  var json = JSON.stringify({ message: 'ready' })
  socket.send(json)
}

socket.onerror = function(event) {
  console.error(event)
}

socket.onmessage = function (event) {
  console.log(event)
  let response = (JSON.parse(event.data))
  if (response.data) {
    data = response.data
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
  var dt = new Date(t*1000)
  var hr = dt.getHours()
  var m = "0" + dt.getMinutes()
  var s = "0" + dt.getSeconds()
  return hr+ ':' + m.substr(-2) + ':' + s.substr(-2)  
}

async function populateData() {
  let response = await fetch("data.json")
  sensorData = await response.json()
  console.log("sensorData", sensorData)
}

function updateValues (data) {
  console.log("updateValues called", data)
  let key = (Object.keys(data))[0]
  sensorData[key] = data[key]
  updateChart(data)
  document.getElementById("data").innerHTML = "<h3>Last data received:</h3><br>Time: " + unixToTime(key) + " Light: " + data[key].light + " Temperature: " + data[key].temp + " Humidity: " + data[key].humidity + " Soil: " + data[key].soil
}

function initChart() {
  // fill: false,
  // labels: ["January", "February", "March", "April", "May", "June", "July"],
  // datasets: [{
  //   label: "My First dataset",
  //   borderColor: 'rgb(255, 99, 132)',
  //   data: [0, 10, 5, 2, 20, 30, 45],
  // }, {
  //   label: "My First dataset",
  //   borderColor: 'rgb(255, 99, 132)',
  //   data: [10, 110, 15, 12, 120, 310, 451],
  // }]

  /*
  sensorData.data = {
    "unix": {
      "light": "num",
      "temp": "num",
      "humidity": "num",
      "soil": "num"
    }
  }
  */

  let labels = []

  let datasets = {
    light: {
      key: "light",
      label: "Light Level",
      borderColor: "yellow",
      yAxisID: "y-axis-light",
      data: []
    },
    temp: {
      key: "temp",
      label: "Temperature (C)",
      borderColor: "blue",
      yAxisID: "y-axis-temp",
      data: []
    },
    humidity: {
      key: "humidity",
      label: "Humidity (%)",
      borderColor: "green",
      yAxisID: "y-axis-humidity",
      data: []
    },
    soil: {
      key: "soil",
      label: "Soil Moisture",
      borderColor: "brown",
      yAxisID: "y-axis-soil",
      data: []
    }
  }
  // console.log("sensorData.data", typeof sensorData.data, sensorData.data)
  // console.log("Object.keys(sensorData.data)", Object.keys(sensorData.data))
  for (let unix of Object.keys(sensorData.data)) {
    // console.log("unix", unix)
    let values = sensorData.data[unix]
    let unixInt = parseInt(unix)
    labels.push(dateFromUnix(unixInt))

    // "temperature": "23.04"
    for (let type of Object.keys(values)) {
      // console.log("type", type)
      datasets[type].data.push(parseFloat(values[type]))
    }
  }
  let out = {
    labels: labels,
    datasets: [
      datasets.light,
      datasets.temp,
      datasets.humidity,
      datasets.soil
    ]
  }
  return out
}

// Input format
// "1543676100": {
//   "light": "6.33",
//   "temp": "20.41",
//   "humidity": "67.66",
//   "soil": "9.0"
// }
function updateChart(data) {
  console.log("updateChart called", data)
  let unix = Object.keys(data)[0]
  let unixInt = parseInt(unix)
  let sensorData = data[unix]

  for (let sensor of Object.keys(sensorData)) {
    let foundData = chart.data.datasets.filter(sets => sets.key === sensor)
    foundData[0].data.push(sensorData[sensor])
  }
  chart.update()
}

function dateFromUnix(unix) {
  return moment(unix * 1000).format(timeFormat);
}

async function init() {
  await populateData()
  chartData = initChart()
  // document.getElementById("debugoutput").value = JSON.stringify(chartData)
  var ctx = document.getElementById('myChart').getContext('2d')
  Chart.defaults.global.elements.line.fill = false
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: chartData,

    // Configuration options go here
    options: {
      title: {
        text: 'Chart.js Combo Time Scale'
      },
      elements: {
        line: {
          tension: 0, // disables bezier curves
          animation: {
            duration: 0, // general animation time
          },
          hover: {
            animationDuration: 0, // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0, // animation duration after a resize
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          display: true,
          time: {
            format: timeFormat,
            // round: 'day'
          }
        }],
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-light",
            labelString: "Light Level"
          },
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-temp",
            labelString: "Temperature (C)"
          },
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-humidity",
            labelString: "Humidity (%)"
          },
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-soil",
            labelString: "Soil Moisture"
          }
        ]
      }
    }
  })
}

init()
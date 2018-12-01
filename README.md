# For logging and displaying sensor data

## How it works
I have 3 sensors:
- [Light cell](https://learn.adafruit.com/photocells/using-a-photocell)
- [Temperature/Humidity sensor](https://www.dfrobot.com/wiki/index.php/DHT22_Temperature_and_humidity_module_SKU:SEN0137)
- [Soil Moisture sensor](https://learn.sparkfun.com/tutorials/soil-moisture-sensor-hookup-guide/all)

To do this yourself, all you need is to mix these circuits together via a breadboard.

All 3 sensors are hooked into an Arduino Uno.

This is because a Raspberry Pi, without buying an external board, doesn't support analogue inputs (also without using a capacitor).

I used the Arduino to send the sensor data (that is taken every 5 seconds) over Serial. The Raspberry Pi then listens into the (rather unreliable) serial data, verifies it, and logs it to a text file. (csv format)

The first ping every x minutes, the collated data is read, split up, sorted out between the sensor types and then an average is taken that represents that timeframe.

This data is then printed to console (stdout).

A Node.js instance runs a web server, as well as [initialising the python script](https://npmjs.com/package/python-shell) and picking up the stdout. This data is processed into an object, then sent to connected clients via a websocket.



The end goal is to have all data logged to a JSON [lowdb](http://npmjs.com/package/lowdb) file, which is sent to the client via an AJAX request on load. The websocket will then send updates to the client. All of this data will get represented in a graph.

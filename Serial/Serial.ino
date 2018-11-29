#include <DHT22.h>
// Only used for sprintf
#include <stdio.h>

// Data wire is plugged into port 7 on the Arduino
// Connect a 4.7K resistor between VCC and the data pin (strong pullup)
#define moistureTemp_PIN 7
#define light_PIN 0
#define soil_PIN 1
#define soil_POWER 6
// Setup a DHT22 instance
DHT22 myDHT22(moistureTemp_PIN);

void setup(void)
{
  // start serial port
  Serial.begin(9600);
  digitalWrite(soil_POWER, LOW);
  Serial.println("Flower Sensor Detection Started");
}

void loop(void)
{ 
  // The sensor can only be read from every 1-2s, and requires a minimum
  // 2s warm-up after power-on.
  delay(4000);
  
  char buffer[32];
  int light, soil;
  char temp[8];
  char humid[8];
  
  DHT22_ERROR_t errorCode = myDHT22.readData();
  switch(errorCode)
  {
    case DHT_ERROR_NONE:
      light = analogRead(light_PIN);
      dtostrf(myDHT22.getTemperatureC(), 5, 2, temp);
      dtostrf(myDHT22.getHumidity(), 5, 2, humid);
      soil = readSoil();
      sprintf(buffer, "%d,%s,%s,%d", light, temp, humid, soil);
      Serial.println(buffer); 
      break;
    case DHT_ERROR_CHECKSUM:
      Serial.println("check sum error ");
//      Serial.print(myDHT22.getTemperatureC());
//      Serial.print("C ");
//      Serial.print(myDHT22.getHumidity());
//      Serial.println("%");
      break;
    case DHT_BUS_HUNG:
      Serial.println("BUS Hung ");
      break;
    case DHT_ERROR_NOT_PRESENT:
      Serial.println("Not Present ");
      break;
    case DHT_ERROR_ACK_TOO_LONG:
      Serial.println("ACK time out ");
      break;
    case DHT_ERROR_SYNC_TIMEOUT:
      Serial.println("Sync Timeout ");
      break;
    case DHT_ERROR_DATA_TIMEOUT:
      Serial.println("Data Timeout ");
      break;
    case DHT_ERROR_TOOQUICK:
      Serial.println("Polled too quick ");
      break;
  }
}

int readSoil()
{
  digitalWrite(soil_POWER, HIGH);
  delay(100);
  int val = analogRead(soil_PIN);
  digitalWrite(soil_POWER, LOW);
  return val;
}

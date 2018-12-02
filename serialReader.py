# import time, sys
# while True:
#    print(str(int(time.time())), ",8.8,20.6,68.1,9.0")
#    sys.stdout.flush()
#    time.sleep(60)
import time, string, serial, datetime, json, os, sys


sensors = ["light", "temperature", "humidity", "soil"]

# How often to average out the data
averageFreq = 1

# Will be set to the last minute value saved
lastReset = 0

'''Note to self: Need some sort of buffer so we can
   cache data while other processes are going on?'''

cache = open('data.csv', 'r+')
cache.truncate(0)
time.sleep(2)
print("I'm alive")
sys.stdout.flush()
with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
   while 1:

      # START VALIDATE
      try:
         line = ser.readline()
         if len(line) == 0:
            # print("no data")
            continue

         data = line.strip().decode('ascii')
         if len(data.split(",")) != 4:
            # print("invalid data", data)
            # sys.stdout.flush()
            continue
         # END VALIDATE

         
         timeObj = datetime.datetime.now()
         # print(str(time.minute) + ":" + str(time.second))
         cache.write(data + "||")
         # print(str(timeObj.hour) + ":" + str(timeObj.minute) + ":" + str(timeObj.second) + ",", (data.replace(",", " | ")))
         # sys.stdout.flush()
         # cache.close()
         cache.flush()

         # If the current minute is a multiple of the code frequency
         # and we are in a different minute from the last
         if (timeObj.minute % averageFreq == 0 and timeObj.minute != lastReset):
            lastReset = timeObj.minute
            # print("next segment!")

            cache.seek(0)
            cacheText = cache.read()
            # print("===== ( 0 ) =====")
            cacheList = cacheText.split("||")
            cacheList.pop()
##            print(cacheList)

            jsonDict = {}
            dictAverage = [str(int(time.time()))]
            jsonDictTime = {}

            """
cacheList = ['11,23.80,62.20,99', '...']
            """
            for index, ping in enumerate(cacheList):
               sensorData = ping.split(",")
##               print(index, 'sensorData', sensorData)
               """
sensorData = ['11', '23.80', '62.20', '99']
               """
               for sensorIndex, sensorValue in enumerate(sensorData):
##                  print('sensorIndex', sensorIndex, 'sensorValue', sensorValue)
##                  print('sensors[sensorIndex]', sensors[sensorIndex])

                  # If we have the sensor name in the dictionary,
                  # append the sensor value, otherwise add the key and value
                  try:
                     if sensors[sensorIndex] in jsonDict.keys():
                        jsonDict[sensors[sensorIndex]].append(float(sensorValue))
                     else:
                        jsonDict[sensors[sensorIndex]] = [float(sensorValue)]
                  except Exception as e:
                     print("ERROR! sensorValue type:", type(sensorValue))

##            print("jsonDict", jsonDict)
            """
jsonDict = {
   'light': [9911, ...],
   'soil': [99, ...],
   'temperature': [23.80, ...],
   'humidity': [62.20, ...]
}
            """
            
            # Getting the average of each sensor
            for index, sensor in enumerate(sensors): # jsonDict
               average = round(sum(jsonDict[sensor]) / len(jsonDict[sensor]), 2)
##               dictAverage[sensor] = average
               dictAverage.append(str(average))
               # print("sensor:", sensor)
               # soil light temp humidity
            final = ",".join(dictAverage)
            print(final)
            sys.stdout.flush()
            
            """
dictAverage = {
   'light': 10.15,
   'soil': 135.03,
   'temperature': 23.8,
   'humidity': 62.49
}
            """
##            print('dictAverage', dictAverage)

##            with open("output.json") as output:
##               data = json.load(output)
##
##
##            print("before data", data)
##            data.update(dictAverage)
##            print("after data", data)
##
##            with open("output.json", "w") as output:
##               output.dumps(data, output)

            # {"154": {"temperature": 154}}
##            output = open('output.json', 'r+')
##            allData = json.loads(output.read())
##            print("allData Before", allData)
##            
##            allData[str(int(time.time()))] = dictAverage          
##            print("allData After", allData)
            
##            output.write(json.dump(allData))
##            output.flush()
            # print("===== [ X ] =====")
            cache.close()
            cache = open('data.csv', 'r+')
            cache.truncate(0)
      except Exception as e:
         print("Whoopsie!: ", e)
         sys.stdout.flush()


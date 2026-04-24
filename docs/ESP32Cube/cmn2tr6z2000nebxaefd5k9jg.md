---
title: ESP32 Serial Output JSON data with ArduinoJson
slug: esp32-serial-output-json-data-with-arduinojson
id: cmn2tr6z2000nebxaefd5k9jg
category: tutorial
categorySlug: tutorial
tags:
  - AI
status: published
updatedAt: '2026-04-23T18:33:24.111Z'
---

To output data from an ESP32 using serial communication, you can use the ArduinoJson library to encode the data into a JSON string. The following is an example code to output an integer value from the ESP32 over serial communication:

``` arduino
#include <ArduinoJson.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // Create a JSON object
  StaticJsonDocument<200> doc;
  doc["value"] = 123;

  // Serialize the JSON object
  String output;
  serializeJson(doc, output);

  // Send the serialized data over the serial port
  Serial.println(output);

  // Wait for a short period before sending the next data
  delay(1000);
}

```

In below example, it will output time, multiple temperature values, and pressure values from ESP32.

``` arduino
#include <ArduinoJson.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // Create a JSON object
  StaticJsonDocument<200> doc;
  doc["time"] = millis();

  JsonArray temperatures = doc.createNestedArray("temperatures");
  temperatures.add(25.1);
  temperatures.add(26.2);
  temperatures.add(27.3);
  temperatures.add(28.4);

  doc["pressure"] = 1013.25;

  // Serialize the JSON object
  String output;
  serializeJson(doc, output);

  // Send the serialized data over the serial port
  Serial.println(output);

  // Wait for a short period before sending the next data
  delay(1000);
}
```


In this updated code, an array of temperatures is added to the JSON object using the createNestedArray function. The add function is then used to add the individual temperature values to the array. The rest of the code remains the same, with the JSON object being serialized and sent over the serial port as a string representation. The output data would now look like the following:

```
{"time":123456,"temperatures":[25.1,26.2,27.3,28.4],"pressure":1013.25}
```

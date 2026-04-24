---
title: ESP32 Sensor DHT11 Temperature and Humidity Sensor
slug: esp32-sensor-dht11-temperature-and-humidity-sensor
id: cmn2trkpa0013ebxakbvzu0wb
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Sensor
status: published
updatedAt: '2026-04-23T23:20:58.774Z'
---

# DHT11 Temperature and Humidity Sensor

DHT11 can measure both temperature and humidity, it is a popular, cost-effective sensor. In this article we will discuss how to read temperature and humidity with ESP32 and DHT11.

![aea7154f82a4235eb82421097f297927_MD5.jpg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488371803-aea7154f82a4235eb82421097f297927_MD5.jpg)

## Hardware Required

- ESP32 development board
- DHT11 temperature and humidity sensor
- Jumper wires

## Wire Connection

- Connect V of DHT11 to the 3.3V or 5V pin on the ESP32.
- Connect G of DHT11 to one of the GND pins on the ESP32.
- Connect S pin of DHT11 to a GPIO pin on the ESP32 (e.g., GPIO 5).

The supply voltage for the DHT11 is 3~5.5V.
![fa0f63c6db65330d1d3da64c96f08177_MD5.jpg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488373823-fa0f63c6db65330d1d3da64c96f08177_MD5.jpg)

## Installing the DHT Library

We will use the DHT library to read temperature and humidity from the DHT11 sensor.

Search for DHT library in the PlatformIO Library Manager and install it.

![a9d1d4e032ea9a1d3448904e16ed06d2_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488375683-a9d1d4e032ea9a1d3448904e16ed06d2_MD5.png)

Library installation, click on the "Add to Project" button.

![f6f0506e2756ee930071ad6f5c471eec_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488378648-f6f0506e2756ee930071ad6f5c471eec_MD5.png)

Then choose the project we defined earlier and click on the "Add" button.

![d28d7f2afd97ef65ef676956ae8dc418_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488380242-d28d7f2afd97ef65ef676956ae8dc418_MD5.png)

## Code

Here is the example code to read temperature and humidity from the DHT11 sensor and print it to the serial monitor.

```c++
#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 5     // GPIO pin the sensor is connected to
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  // Reading temperature and humidity
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print the results to the serial monitor
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print("%  Temperature: ");
  Serial.print(t);
  Serial.println("°C ");

  delay(2000); // Delay between measurements
}
```

Upload the code to the ESP32 and then open the serial monitor.

![f532c5feeca586db8e20684ccb3e8cb4_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488381951-f532c5feeca586db8e20684ccb3e8cb4_MD5.png)

We can see the temperature and humidity readings, shows as below:

![821ea0deddc5c5b387ca242aa0cae55f_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488383349-821ea0deddc5c5b387ca242aa0cae55f_MD5.png)

The project upload to github, link: [ESP32-Tutorials/01_DHT11 at main · ESP32Cubes/ESP32-Tutorials (github.com)](https://github.com/ESP32Cubes/ESP32-Tutorials/tree/main/01_DHT11)

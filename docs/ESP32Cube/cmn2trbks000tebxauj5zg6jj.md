---
title: How to Connect ESP32 to Wi-Fi?
slug: how-to-connect-esp32-to-wi-fi
id: cmn2trbks000tebxauj5zg6jj
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - WiFi
status: published
updatedAt: '2026-04-23T23:41:48.274Z'
---

There are serval ways to connect ESP32 to Wi-Fi, in this article we will intorduce it.

## Provide Wi-Fi ID and password in the code

This is the simplest way, but the disadvatage of this way is user not able to change the Wi-Fi to other routers. And this may just can be use for developer.

To connect an ESP32 to a Wi-Fi network, you will need to provide it with the credentials for the network. These credentials typically include the network name (SSID) and password. You can provide these credentials to the ESP32 through its firmware, which can be programmed using the Arduino IDE or another programming tool. Once the ESP32 has the credentials, it can use them to connect to the Wi-Fi network.

Here is an example of how to connect ESP32 to wifi:

``` Arduino
#include <WiFi.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // put your main code here, to run repeatedly:
}
```

Make sure you have the WiFi.h library installed and SSID and PASSWORD is updated with your wifi details.

In this example, the ESP32 will attempt to connect to the Wi-Fi network with the specified SSID and password. It will enter into an infinite loop until the ESP32 successfully connects to the Wi-Fi network. Once the ESP32 is connected, it will print "Connected to WiFi" to the serial monitor.

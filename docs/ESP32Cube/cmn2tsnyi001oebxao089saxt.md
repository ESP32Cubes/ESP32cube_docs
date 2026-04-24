---
title: How to Play Internet Radio Stations with ESP32
slug: how-to-play-internet-radio-stations-with-esp32
id: cmn2tsnyi001oebxao089saxt
category: tutorial
categorySlug: tutorial
tags:
  - AI
  - WiFi
  - Audio
status: published
excerpt: This post provides a step-by-step guide of play Internet radio on an ESP32-S3.
updatedAt: '2026-04-23T20:54:35.994Z'
---

## Introduction

In this tutorial, we will be using an ESP32-S3 to play internet radio stations. First, we need connect the ESP32-S3 to the internet using a WiFi module. Then, we will use the `audio` library to stream the radio station's audio to the ESP32-S3.

## Step 1: Connect the ESP32-S3 to the internet

In order to make things simple, we will configure the Wifi ID and password in code.

```c
#include "Arduino.h"
#include <WiFi.h>

String ssid =     "*****";
String password = "*****";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid.c_str(), password.c_str());
  while (WiFi.status()!= WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:
}
```

## Step 2: Install the `audio` library

The `audio` library is a powerful library that allows us to stream audio data to the ESP32-S3. We will use this library to stream the radio station's audio to the ESP32-S3.

To install the `audio` library, we need to add it to the `platformio.ini` file.

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps = audio
```

## Step 3: Stream the radio station's audio to the ESP32-S3

Now, we will use the `audio` library to stream the radio station's audio to the ESP32-S3.

```c
#include "Arduino.h"
#include <WiFi.h>
#include <audio.h>

#define I2S_DOUT            9
#define I2S_BCLK            3
#define I2S_LRC             1

String ssid =     "*****";
String password = "*****";

Audio audio;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status()!= WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");

  audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
  audio.setVolume(64);

// radio station's audio stream URL
    audio.connecttohost("http://stream.antennethueringen.de/live/aac-64/stream.antennethueringen.de/"); // aac
}

void loop() {
    audio.loop();
    vTaskDelay(1);
}
```

In the `setup()` function, we initialize the `audio` library and set the output and input devices to `AUTO`. Then, we start the radio station's audio stream using the `audio_stream_start()` function.

In the `loop()` function, we start the radio station's audio stream using the `audio_stream_start()` function and then stop it after 10 seconds using the `audio_stream_stop()` function.

## Conclusion
In this tutorial, we have learned how to use the `audio` library to stream internet radio stations to the ESP32-S3. We have also learned how to connect the ESP32-S3 to the internet using a WiFi module.

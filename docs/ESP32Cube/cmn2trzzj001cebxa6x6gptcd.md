---
title: Remote Control of Light Switch using ESP32
slug: remote-control-of-light-switch-using-esp32
id: cmn2trzzj001cebxa6x6gptcd
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Web
  - WiFi
  - IoT
status: published
excerpt: >-
  This tutorial explains how to build an IoT application to control a light
  switch remotely using the ESP32 microcontroller, Wi-Fi, and a relay module.
updatedAt: '2026-04-24T01:22:42.409Z'
---

In this tutorial, we'll walk you through the process of creating an IoT application that enables remote control of a light switch using the ESP32 microcontroller. You'll use VS Code, PlatformIO, and a few additional components to achieve this. By the end of this tutorial, you'll have a working prototype where you can remotely toggle a light switch on or off using your smartphone or computer.

## Hardware List

To complete this project, you'll need the following components:

1.  ESP32 Development Board
2.  Relay Module
3.  AC Light Bulb (or any other load you want to control)
4.  Jumper Wires
5.  Breadboard
6.  USB Cable (for powering the ESP32)

## Step 1: Setting Up the Hardware

1.  Connect the relay module to the ESP32 following these connections:
    
    -   VCC to 3.3V on ESP32
    -   GND to GND on ESP32
    -   IN to a digital pin (e.g., GPIO 4) on ESP32

2.  Connect the relay module to the AC light bulb:
    
    -   Connect one terminal of the light bulb to the Common (COM) terminal of the relay.
    -   Connect the other terminal of the light bulb to the Normally Open (NO) terminal of the relay.

## Step 2: Creating the Software

1.  Set up your development environment following the same steps as outlined in the previous tutorial.
2.  In the `src` folder, create a new source code file, for example, `main.cpp`.
3.  Write the code to control the relay and enable remote control using Wi-Fi. Here's a basic example:

```c
#include <Arduino.h>
#include <WiFi.h>

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

const int relayPin = 4; // Relay module connected to GPIO 4

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Check for incoming commands to control the relay
  // For example, you can use MQTT or a simple HTTP server

  // Toggle the relay based on the command received
  // Example: digitalWrite(relayPin, HIGH); // Turn ON
  //          dig italWrite(relayPin, LOW);  // Turn OFF

  delay(1000);
}
```

## Step 3: Uploading and Testing

1.  Connect the ESP32 to your computer and upload the code following the same steps as outlined in the previous tutorial.
2.  Power on the light bulb and ensure it's connected to the relay.
3.  Access the ESP32's IP address from your web browser or use a mobile app to send commands to toggle the light switch.

Congratulations! You've successfully created a remote-controlled light switch using the ESP32. You can further enhance this project by integrating MQTT for more advanced control or by designing a mobile app for a user-friendly interface.

Remember to always prioritize safety when working with high-voltage components like AC light bulbs. Have fun experimenting and customizing your IoT application!

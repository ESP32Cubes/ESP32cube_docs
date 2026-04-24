---
title: 'Building Application with ESP32, VS Code, and PlatformIO'
slug: building-application-with-esp32-vs-code-and-platformio
id: cmn2ts3s7001debxa16dsirmh
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Sensor
  - WiFi
  - IoT
status: published
excerpt: >-
  This tutorial shows how to building a simple IoT application with ESP32, VS
  Code, and PlatformIO. It covers setup, project creation, coding, uploading,
  and extending features for IoT development.
updatedAt: '2026-04-23T23:55:01.693Z'
---

In this tutorial, we will guide you through the process of creating a simple IoT application using the ESP32 microcontroller, VS Code as the code editor, and PlatformIO as the development environment. By the end of this tutorial, you will have a basic understanding of setting up an IoT project and communicating with the ESP32 over Wi-Fi.

## Prerequisites

1.  Make sure you have VS Code installed on your computer.
2.  Obtain an ESP32 development board and ensure it can be connected to your computer.

## Step 1: Setting Up the Environment

1.  Launch VS Code and install the PlatformIO extension from the VS Code Marketplace.
2.  Connect your ESP32 development board to your computer through a USB cable.

## Step 2: Creating a New Project

1.  Open VS Code, click on "File" -> "New Folder," and create a new folder for your project.
2.  In the terminal within the newly created folder, initialize a new PlatformIO project by running: `platformio init --board esp32dev`
3.  Inside the project folder, create a subfolder named `src` to store your source code files.

## Step 3: Writing the Code

1.  In the `src` folder, create a new source code file, for example, `main.cpp`.
2.  Write the IoT application code for the ESP32. This example demonstrates connecting to a Wi-Fi network. Add the following code to your `main.cpp`:

```arduino
#include <Arduino.h>
#include <WiFi.h>

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Add more initialization code here
}

void loop() {
  // Add loop code here, such as data transmission, sensor readings, etc.
}
```

## Step 4: Uploading and Running

1.  Connect the ESP32 development board to your computer via USB, and ensure you've selected the correct board port.
2.  In VS Code, click on the PlatformIO icon and select "Upload" to compile and upload the code to the ESP32.
3.  Open the Serial Monitor in VS Code to view the ESP32's output. Verify that everything is running smoothly.

## Step 5: Extending the Application

1.  Depending on your project requirements, you can add more features, such as sensor data collection, remote control, data storage, etc.
2.  Refer to the ESP32, PlatformIO, and Arduino documentation for more information about functions and libraries.

Congratulations! You've successfully created a basic IoT application using the ESP32, VS Code, and PlatformIO. This tutorial provides a foundation for further exploration and development in the world of IoT.

Feel free to customize and expand upon this tutorial based on your project's needs and your interests. For more advanced topics and features, continue exploring the ESP32 documentation and the capabilities of PlatformIO.

We hope this tutorial helps you kickstart your journey into IoT application development!

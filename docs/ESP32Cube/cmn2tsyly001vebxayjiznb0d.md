---
title: smart alarm clock with ESP32
slug: smart-alarm-clock-with-esp32
id: cmn2tsyly001vebxayjiznb0d
category: project
categorySlug: project
tags:
  - LED
  - AI
  - Sensor
  - Web
  - WiFi
  - Display
status: published
updatedAt: '2026-04-24T01:10:14.409Z'
---

## Introduction

This open-source project demonstrates how to build a multifunctional smart alarm clock using ESP8266 or ESP32 microcontrollers, featuring a network interface, sunrise wake-up light, and temperature display.

![5eaec88c80ed822e3286086a397e3f15_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488564243-5eaec88c80ed822e3286086a397e3f15_MD5.webp)

The project will guide you step by step through the development process of implementing advanced features for the alarm clock using ESP8266 or ESP32, including web interface configuration, multiple (cyclic) alarms, triggers, and information display.

![04063f9883356ddd20e1d4a539ab9236_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488565978-04063f9883356ddd20e1d4a539ab9236_MD5.png)
## Hardware Preparation

- Wemos D1 Mini or any ESP8266/ESP32 development board
  ![ac5a4d38eaa31eac457621cf5437994e_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488567865-ac5a4d38eaa31eac457621cf5437994e_MD5.png)
- MAX7219 8x8 LED matrix module
- Rotary encoder with buttons
  ![97e648fae24f766cade254d6e352e944_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488569743-97e648fae24f766cade254d6e352e944_MD5.png)
- Buzzer
- Photocell (optional)
- PIR motion sensor (optional)
- NeoPixel LED strip or ring (optional)
- BME280 sensor (optional)
  ![99663cdc44677957f2aa87b3cc806aaf_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488571662-99663cdc44677957f2aa87b3cc806aaf_MD5.png)

## Software and Tools

- Arduino IDE
- ESPUI Library
![172c899a20fa46db99b5fa8ce5e7ac0b_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488573723-172c899a20fa46db99b5fa8ce5e7ac0b_MD5.png)
- ArduinoJSON Library
- FastLED Library (for controlling NeoPixel)

## Feature Highlights

- Support for ESP8266 and ESP32 development boards
- WiFi setup and time synchronization through a web interface
![7dca639f5dcb9c3ebb81a1db5a451024_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488575911-7dca639f5dcb9c3ebb81a1db5a451024_MD5.png)
- Web interface for programming and modifying alarm settings
- Multiple alarm settings, with default support for 12
- Simulated sunrise with NeoPixel wake-up light function
- EEPROM storage that preserves settings after power loss
- Customizable message and duration for each alarm
![4eb784305b728961c9e3397d856eabf4_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488577649-4eb784305b728961c9e3397d856eabf4_MD5.png)
- GPIO control upon alarm trigger to manage external devices
- Recurring alarms: repeat weekly, on weekdays, weekends, or custom intervals
- 5 time display modes, including AM/PM mode
- Support for OTA (Over-The-Air) updates
- BME280 sensor support for displaying temperature, humidity, and pressure
- Passive Infrared (PIR) sensor for motion detection with message and sound alerts
![4357e671f56d0924bf9c766338a921ed_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488579777-4357e671f56d0924bf9c766338a921ed_MD5.png)
- Sleep mode and suspend mode for the display
- Customizable melodies, such as Big Ben, Avicii, etc.
- Photocell sensor support for adjusting LED brightness based on light levels
- Motion sensor support

## Assembly Steps

### 1. Hardware Connection

Firstly, connect all hardware components according to the provided schematic. This includes connecting the LED matrix module, rotary encoder, buzzer, and other sensors to the ESP32 development board.

![04eb8c034e3e7b84d8288d771c974038_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488581579-04eb8c034e3e7b84d8288d771c974038_MD5.webp)

![a966c744141e459eb7c87a524ec8c69c_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488582934-a966c744141e459eb7c87a524ec8c69c_MD5.webp)
### 2. Software Setup

Use the Arduino IDE to install the required library files and download the code ZIP file, ensuring all feature files and the main file are in the same folder so they can be opened as tabs in the IDE. The required open-source code addresses are:

- [Adafruit-GFX-Library](https://github.com/adafruit/Adafruit-GFX-Library)
- [arduino-Max72xxPanel](https://github.com/markruys/arduino-Max72xxPanel)
- [RotaryEncoder](https://github.com/mathertel/RotaryEncoder)
- [ESPUI](https://github.com/s00500/ESPUI)

### 3. Code Adjustment

Based on your own hardware setup, you will need to search for `@EB-setup` comments in the code to adjust the hardware pins and other settings. If you need to modify the default settings, you can search for `@EB-custom` comments.

### 4. Network Interface Configuration

Upon startup, the alarm clock will attempt to read the WiFi configuration from the EEPROM and connect to the network. If there are no stored settings, or if the network name or password has changed, it will create a hotspot for you to enter new settings, which will then be saved to the EEPROM.

![2fc27308ea8755e1e393c77a9497748a_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488584390-2fc27308ea8755e1e393c77a9497748a_MD5.webp)
### 5. Web Interface Usage

After connecting to the network created by the ESP32, you can access the web interface to configure the alarm clock, including setting the time, alarms, display modes, etc.

![9f3a0b1f1b23f5c91879a0a32c8d809e_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488585734-9f3a0b1f1b23f5c91879a0a32c8d809e_MD5.png)
## Debugging and Testing

Once your hardware and software are ready, ensure thorough testing to verify all functions of the alarm clock. Check the network connection, responsiveness of the web interface, accuracy of sensor readings, and reliability of the alarm functions.

## Conclusion

Through this tutorial, you will not only be able to create a multifunctional smart alarm clock but also learn the basics of ESP32, including hardware interfaces, network programming, and sensor integration. This project is not only an interesting DIY activity but also brings convenience and fun to your daily life.

Project code: [Baidu Pan Link](https://pan.baidu.com/s/1XN6CCODmnHrjzyVo89YMaQ?pwd=1234)

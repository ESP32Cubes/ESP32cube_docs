---
title: A LED Matrix Message Board with ESP32
slug: a-led-matrix-message-board-with-esp32
id: cmn2trigb0012ebxa4cudoflj
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Sensor
  - Web
  - WiFi
  - Display
status: published
updatedAt: '2026-04-23T15:39:08.959Z'
---

# A LED Matrix Message Board with ESP32

This project is an LED matrix message board based on the ESP32 microcontroller. It is capable of connecting to the network and displaying real-time news, weather, stock, date, time, and barometric pressure data. It also supports menu and web interfaces, as well as notification functions. The LED matrix modules display information in a set format on the screen, allowing users to conveniently access various types of information.

![29694cf1941223b27283e339ec2f8351_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488359906-29694cf1941223b27283e339ec2f8351_MD5.webp)

# Hardware List

- **ESP32 Development Board**
- **MAX7219 8x8 LED Matrix Modules (x16)**
- **Barometric Pressure Sensor Module - BME280 (x1)**
- **Rotary Encoder with Button (x1)**
- **Buzzer (x1)**

![c0ec0452f6a5d1733c82b9ee7151de67_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488361289-c0ec0452f6a5d1733c82b9ee7151de67_MD5.webp)

# Construction Method

The LED matrix modules are connected in series to the ESP32, with a total of 16 MAX7219 8x8 LED matrix modules. To maintain a neat and compact setup, modules can be secured together using tape and cardboard.

![04d1cf2d06a151fef543765ac20b782c_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488362735-04d1cf2d06a151fef543765ac20b782c_MD5.webp)

Given the large number of LEDs (1024 in total), an external power supply is required to power the LED matrix, preferably one with 2A or higher power output. Additionally, the BME280 sensor and rotary encoder should be connected to the ESP32 according to the provided module schematic.

![89b15aa81780df91c6b81583de6c616a_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488364130-89b15aa81780df91c6b81583de6c616a_MD5.webp)

# Features and Characteristics

The LED matrix message board has the following features and characteristics:

- **Time and Data Display**: It connects to local WiFi networks and time servers to obtain local date and time, and can also determine if daylight saving time is in effect, ensuring users always receive accurate time information.
- **Display Areas**: The message board has three display areas for time, alternating date and barometric pressure information, and the main information display, allowing users to quickly access different types of information at a glance.
- **Interactive Control**: Users can use a rotary encoder to select menu items, such as the main rotation, various news categories, or stock data, offering a user-friendly interaction method.
- **Web Interface**: The LED matrix message board can display custom messages and perform control operations through a web interface, including sending messages and triggering the buzzer to produce notification sounds.

![cc66fab10c33e8c6552050cd8a0470a0_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488365425-cc66fab10c33e8c6552050cd8a0470a0_MD5.webp)

# Software Code

The LED matrix message board requires the following open-source software libraries:

- [Adafruit BME280 Library](https://github.com/adafruit/Adafruit_BME280_Library)
- [ArduinoJson](https://github.com/bblanchon/ArduinoJson)
- [Dusk2Dawn](https://github.com/dmkishi/Dusk2Dawn)
- [MD_MAX72XX](https://github.com/MajicDesigns/MD_MAX72XX)
- [MD_Parola](https://github.com/MajicDesigns/MD_Parola)
- [RotaryEncoder](https://github.com/mathertel/RotaryEncoder)
- [Time](https://github.com/PaulStoffregen/Time)

![707a5801ae6e839368ae41eb9f01c335_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488366787-707a5801ae6e839368ae41eb9f01c335_MD5.webp)

# Summary

The LED matrix message board integrates hardware and software to display various real-time information and provides a user-friendly interaction method. With its multiple features and characteristics, it can help users access a variety of real-time information, making it a very practical device.

Project code can be found at: [Baidu Pan Link](https://pan.baidu.com/s/1TioSl3KmoTTEJI93zJ4GVQ?pwd=1234)

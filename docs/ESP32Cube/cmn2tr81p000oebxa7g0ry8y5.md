---
title: ESP32 communicate with I2C devices
slug: esp32-communicate-with-i2c-devices
id: cmn2tr81p000oebxa7g0ry8y5
category: tutorial
categorySlug: tutorial
tags:
  - AI
status: published
updatedAt: '2026-04-23T18:13:08.731Z'
---

## Hardware connection

On the ESP32 microcontroller, there are several pairs of GPIO pins that can be used for I2C communication. The default I2C pins on the ESP32 are GPIO 21 (SDA) and GPIO 22 (SCL), but other pairs of pins can also be used as long as they are correctly configured.

Here is a list of some of the GPIO pins that can be used for I2C communication on the ESP32:

* GPIO 21 (SDA) and GPIO 22 (SCL): default I2C pins
* GPIO 16 (SDA) and GPIO 17 (SCL): alternative I2C pins
* GPIO 18 (SDA) and GPIO 19 (SCL): alternative I2C pins

To use a different pair of pins for I2C communication, you will need to pass the pin numbers as arguments to the `Wire.begin()` function. For example, to use GPIO 16 and 17 as the I2C pins, you can call `Wire.begin(16, 17)`.

It's important to note that not all GPIO pins on the ESP32 are suitable for use as I2C pins. Some of the pins are reserved for other purposes, such as serial communication, and cannot be used as I2C pins. Consult the documentation of the ESP32 and the board you are using to make sure you are using the correct pins.

## ESP32 I2C communication code

To use the I2C communication protocol with the ESP32 microcontroller, you will need to use the I2C functions provided by the Arduino Core. Here is an example of how to use the I2C functions to read data from a device:

1. First, include the necessary libraries at the beginning of your sketch:

```
#include <Wire.h>
```

2. Initialize the I2C communication by calling the `Wire.begin()` function in the `setup()` function of your sketch. You may need to pass the I2C pins (SDA and SCL) as arguments if they are not the default ones.
3. To read data from a device, you will need to send a request to the device to read a specific number of bytes. To do this, you can use the `Wire.requestFrom()` function. This function takes two arguments: the address of the device and the number of bytes to read. You can find the address of the device in the documentation of the device or by using the `scanI2CBus()` function.
4. After sending the request, you can read the data from the device using the `Wire.read()` function. This function reads one byte of data from the device and returns it as an integer. You can read multiple bytes by calling the `Wire.read()` function multiple times.
5. If the device is not responding or if there was an error in the communication, you can check the return value of the `Wire.requestFrom()` function to see if the read was successful.

Here is an example of how to use the I2C functions to read two bytes of data from a device with the address 0x68:

```
#include <Wire.h>

void setup() {
  Wire.begin(); // initialize I2C communication
}

void loop() {
  Wire.requestFrom(0x68, 2); // request 2 bytes from device with address 0x68
  if (Wire.available()) { // check if the device responded
    int data1 = Wire.read(); // read first byte
    int data2 = Wire.read(); // read second byte
    // do something with the data
  }
}
```

If you are not sure about the device's I2C address, please ref to [ESP32/Arduino Scan Device I2C Address][1] to scanning the I2C devices connected to ESP32.


  [1]: https://esp32cube.com/post/ESP32-scan-device-I2C-address/

---
title: ESP32 SPI Communication
slug: esp32-spi-communication
id: cmn2tr9mu000pebxajleis5z6
category: tutorial
categorySlug: tutorial
tags:
  - ESP32
  - Tutorial
status: published
updatedAt: '2026-04-24T00:00:20.086Z'
---

## Hardware protal

The ESP32 microcontroller has two hardware SPI (Serial Peripheral Interface) controllers, which means it can communicate with up to two SPI devices simultaneously. Each SPI controller has its own set of pins, so you can use one controller for one device and the other controller for a different device, or you can use both controllers with the same device if necessary.

Here is a list of the pins used for each of the two SPI controllers on the ESP32:

SPI controller 0:

* MISO (Master In, Slave Out): GPIO 12
* MOSI (Master Out, Slave In): GPIO 13
* SCLK (Serial Clock): GPIO 14
* SS (Slave Select): GPIO 15

SPI controller 1:

* MISO (Master In, Slave Out): GPIO 2
* MOSI (Master Out, Slave In): GPIO 4
* SCLK (Serial Clock): GPIO 18
* SS (Slave Select): GPIO 5

To use the SPI controller in your sketch, you will need to include the `SPI.h` library and call the `SPI.begin()` function to initialize the controller. You can then use the `SPI.transfer()` function to send and receive data from the device.

### MISO and MOSI pin

you can use any GPIO pin on the ESP32 microcontroller as the MOSI (Master Out, Slave In) or MISO (Master In, Slave Out) pin for the SPI controller. The MOSI pin is used to send data from the master (the ESP32) to the slave device, while the MISO pin is used to send data from the slave device to the master.

To use a different pin as the MOSI or MISO pin for the SPI controller, you will need to pass the pin numbers as arguments to the `SPI.beginTransaction()` function. For example, to use GPIO 16 as the MOSI pin and GPIO 17 as the MISO pin for the SPI controller, you can call `SPI.beginTransaction(SPISettings(8000000, MSBFIRST, SPI_MODE0, 16, 17))`.

It's important to note that not all GPIO pins on the ESP32 are suitable for use as an MOSI or MISO pin. Some of the pins are reserved for other purposes, such as serial communication, and cannot be used as an MOSI or MISO pin. Consult the documentation of the ESP32 and the board you are using to make sure you are using the correct pins.

Here is a list of the pins that cannot be used as the MISO pin on the ESP32:

* GPIO 0: used as the bootstrap pin
* GPIO 2: used as the UART0 RX pin
* GPIO 3: used as the UART0 TX pin
* GPIO 4: used as the UART1 RX pin
* GPIO 5: used as the UART1 TX pin
* GPIO 9: used as the UART2 RX pin
* GPIO 10: used as the UART2 TX pin
* GPIO 16: used as the UART3 RX pin
* GPIO 17: used as the UART3 TX pin
* GPIO 18: used as the SCLK pin for the second SPI controller
* GPIO 19: used as the MOSI pin for the second SPI controller

you can use any GPIO pin on the ESP32 microcontroller as the SS (Slave Select) pin for the SPI controller. The SS pin is used to select the slave device that the master (the ESP32) wants to communicate with. By using a different pin as the SS pin for each slave device, you can use the same MISO, MOSI, and SCLK pins to communicate with multiple slave devices.


### Devices Select pin, SS

To use a different pin as the SS pin for the SPI controller, you will need to pass the pin number as an argument to the `SPI.begin()` function. For example, to use GPIO 16 as the SS pin for the SPI controller, you can call `SPI.begin(16)`.

It's important to note that not all GPIO pins on the ESP32 are suitable for use as an SS pin. Some of the pins are reserved for other purposes, such as serial communication, and cannot be used as an SS pin. Consult the documentation of the ESP32 and the board you are using to make sure you are using the correct pins.

## ESP32 SPI Code

Here is an example of how to use the SPI communication protocol with the ESP32 microcontroller to send and receive data from a slave device:

1. Include the necessary libraries at the beginning of your sketch:

```
#include <SPI.h>
```

2. Initialize the SPI communication by calling the `SPI.begin()` function in the `setup()` function of your sketch. You can pass the SS (Slave Select) pin as an argument if you are using a different pin than the default one.
3. To send and receive data from the slave device, you will need to select the device by setting the SS pin low and then calling the `SPI.transfer()` function to send and receive data. The `SPI.transfer()` function takes one argument, which is the data to be sent to the slave device, and returns the data received from the slave device as a byte.
4. After you have finished communicating with the slave device, you should set the SS pin high to deselect the device.

Here is an example of how to send a byte of data to a slave device and read the response using the SPI communication:

```
#include <SPI.h>

const int ssPin = 15; // SS pin for the slave device

void setup() {
  SPI.begin(); // initialize SPI communication
}

void loop() {
  digitalWrite(ssPin, LOW); // select the slave device
  byte response = SPI.transfer(0x01); // send data to the slave device and read the response
  digitalWrite(ssPin, HIGH); // deselect the slave device

  // do something with the response
}

```

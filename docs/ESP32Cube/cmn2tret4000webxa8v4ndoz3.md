---
title: ESP32 Get Sound from I2S Microphone
slug: esp32-get-sound-from-i2s-microphone
id: cmn2tret4000webxa8v4ndoz3
category: tutorial
categorySlug: tutorial
tags:
  - Audio
status: published
excerpt: >-
  This tutorial explains how to build an IoT application to control a light
  switch remotely using the ESP32 microcontroller, Wi-Fi, and a relay module.
updatedAt: '2026-04-23T16:35:19.909Z'
---

ESP32 includes a built-in I2S audio peripheral, which can be used to interface with an external I2S microphone.

I2S (Inter-IC Sound) is a serial bus protocol used for transmitting audio data.

![Pasted image 20230104131805.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488342408-Pasted-image-20230104131805.png)

To use an I2S microphone with the ESP32, you will need to connect the microphone to the I2S interface on the ESP32 and configure the ESP32 to read audio data from the microphone. The exact connection and configuration will depend on the specific microphone you are using and the development platform you are using to program the ESP32.

Here is an example of how to set up an I2S microphone with the ESP32 using the Arduino development platform.

## Wire connection between I2S microphone model and ESP32

| Microphone | ESP32  |
| ---------- | ------ |
| SCK        | GPIO14 |
| SD         | GPIO32 |
| WS         | GPIO15 |
| L/R        | GND    |
| GND        | GND    |
| VDD        | 3.3V   |

## Example Code

``` c
#include "driver/i2s.h"

void setup() {
  // Initialize serial console
  Serial.begin(115200);

  // Configure I2S microphone
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ALL_RIGHT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 2,
    .dma_buf_len = 64
  };
  i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &i2s_pin_config);
  i2s_set_clk(I2S_NUM_0, 16000, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_MONO);
}

void loop() {
  // Allocate buffer to store audio data
  const int num_samples = 512;
  int16_t samples[num_samples];

  // Read audio data from I2S microphone
  size_t bytes_read = 0;
  i2s_read(I2S_NUM_0, samples, num_samples * sizeof(int16_t), &bytes_read, portMAX_DELAY);

  // Print audio data to serial console
  for (int i = 0; i < num_samples; i++) {
    Serial.println(samples[i]);
  }
}
```

This code sets up the ESP32 to read audio data from an I2S microphone at a sample rate of 16kHz with 16-bit samples. It then reads a block of audio data (512 samples) from the microphone and prints the data to the serial console.

Keep in mind that this is just a simple example to illustrate the basic steps involved in reading audio data from an I2S microphone with the ESP32. In a real application, you will likely want to do more with the audio data (e.g. perform FFT or filtering) and use the data to trigger events or actions.

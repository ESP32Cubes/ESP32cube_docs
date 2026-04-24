---
title: Flash Code to ESP32 by Arduino IDE
slug: flash-code-to-esp32-by-arduino-ide
id: cmn2tq4ko0007ebxajvuju7wk
category: tutorial
categorySlug: tutorial
tags:
  - LED
status: published
coverImage: Pasted image 20230104115007.png
updatedAt: '2026-04-23T17:26:05.506Z'
---

To flash an ESP32, it need to install the ESP32 board support package in the Arduino IDE.

Here are the steps to follow:

- Connect the ESP32 devolop board to your computer using the USB cable.
- Open the Arduino IDE and go to `File > Preferences`. In the `Additional Board Manager URLs` field, enter the URL for the ESP32 board support package

```
https://dl.espressif.com/dl/package_esp32_index.json
```

- Go to `Tools > Board > Boards Manager` and search for "ESP32". Install the ESP32 board support package.
- Go to `Tools > Board` and select the ESP32 board you are using (e.g. "ESP32 Dev Module").

![Pasted image 20230104115007.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488308123-Pasted-image-20230104115007.png)

- Select the port that the ESP32 is connected to. On above picture, it chooses `COM4`.
- Open the example sketch "Blink" by going to `File > Examples > 01. Basics > Blink`.
- Upload the code to the ESP32 by clicking the upload button (the right-facing arrow in the top left of the Arduino IDE).

If the upload is successful, the ESP32 should start blinking an LED (if it has one) at a 1-second interval.

!!! Bug

    For some kinds of ESP32 development board it's hardware design may not support auto download, while start flashing, it need pressing the ESP32's reset button before uploading the sketch.

    If you are not sure which development board has such feature, you can be the suggested board from [this link](https://www.amazon.com/dp/B0BRHTMZMF), this development board is able to auto download program to board.

If you have interesting about this "bug", can further read [[10_What_is_the_Secrete_Behind_ESP32_Auto_Flash]]

---
title: What is the Secrete Behind ESP32 Auto Flash?
slug: what-is-the-secrete-behind-esp32-auto-flash
id: cmn2tq7o60009ebxaap9hgmeh
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
status: published
updatedAt: '2026-04-24T00:41:51.708Z'
---

Are you wondering why some of ESP32 development boards are able to auto flash but some of them are not?

And if we'd like to design an ESP32 product, how to make it support auto flash?

In this article, we will explain what happened there, and how to make it work.

## How does ESP32 goes into download boot mode?

First, let's check how ESP32 goes into different model at the start time.

- If reset pin (CHIP_PU) signal level to low for more than 50us, chip will rest.
- After chip reset, it will check the status of GPIO0 and GPIO2, then make a decision to go into which Boot Mode.

| Pin   | Default   | SPI Boot | Download Boot |
| ----- | --------- | -------- | ------------- |
| GPIO0 | Pull-up   | 1        | 0             |
| GPIO2 | Pull-down | X        | 0             |

The time sequence looks like this:

![reset_time.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488313747-reset_time.png)

Does it look complex? But in operation it's simple:

Hold the GPIO0 pin, then press and release the RESET pin.

On some board or schematic:

- The Reset pin is named as `EN` or `nRST`.
- The GPIO0 is named `BOOT`.

That process is to make GPIO0 LOW, after chip reset, then it will go into `Download Boot Mode`.

!!! Note

    From the above explain, it need pay attention if we design a EPS32 board by ourselves.
    
    - DO NOT pull down GPIO0.
    - DO NOT pull up GPIO2.

If you pull down GPIO0 on the circuit, then the chip will always try to go into download mode after reset.

If you pull down the GPIO2 on the circuit, then the chip will not be able to go into download mode.

## Pin Default Status

While measured on the board, if provide power to the dev board, the default status of `EN` and` BOOT` is `HIGH`. If the `EN` or `BOOT` button pressed, this pin will become to `LOW`.

|                | EN  | BOOT |
| -------------- | --- | ---- |
| Default        | 1   | 1    |
| Button Pressed | 0   | 0    |

## What happens during software start download?

The ESP32 Firmware Download Tools like `esptool.py` by ESP officials will initiate two signals that are named as `DTR` and `RTS`. It will help us to do auto trig ESP32 to boot download mode, by transferring these commands to USB chips, to change the status of ESP32 `RST` and `GPIO0` voltage level.

![ESP32 download circuit](https://esp32cube.com/usr/uploads/images/Snipaste_2022-12-16_14-27-19.png)

The according relationship between these signals is

| DTR | RTS | EN  | IO0 |
| --- | --- | --- | --- |
| 1   | 1   | 1   | 1   |
| 0   | 0   | 1   | 1   |
| 1   | 0   | 0   | 1   |
| 0   | 1   | 1   | 0   |

Notice that `EN` and `IO0` are pulled up internally, so the default or floating status of them are `HIGH`.

## Signal During Flash Code

Below picture shows the `EN` and `BOOT` during flash code to the dev board. 

- Yellow line: EN
- Green line: BOOT

At the left the IDE send command to dev board, trig the board reset, and go to download code mode, after code download, the dev board will auto reset again.
The yellow line, EN signal goes to low, will make let the dev board reset.

![scope_5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488315633-scope_5.png)

Then let zoom in the left line, see what happen during that time.

![scope_4.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488316999-scope_4.png)

Let summary it step by step:

- EN goes down then rise up, ~71ms.
- EN goes down for a time, ~102.5ms.
- BOOT goes down, En rise up, ~55ms.

Per my understanding

- First step, trig the board to rest
- Step two, is rest stage, EN signal keeps LOW for 102.5ms.
- Step three, rest completed, board will detect BOOT (GPIO0) signal level to make decision. Yes, something let the GPIO0 to LOW, just at the board complete rest. GPIO0 is low, the board will goes to "Download Boot" mode.

**So this dev board, is able to auto flash code.**

If you want to have a board with such feature, please order it by this link:

[https://www.amazon.com/dp/B0BRHTMZMF](https://www.amazon.com/dp/B0BRHTMZMF)

Seems, it doesn't matter with the GPIO2? No, GPIO2 will impact it. If connected GPIO2 with 3V3 on the board, it will not able to download code also.

![8cc7da2b91bb6a17e09080c50cb5c69.jpg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488318479-8cc7da2b91bb6a17e09080c50cb5c69.jpg)

So, if you design a product with ESP32 please **do not pull up GPIO2**.

## NOT able to Auto flash board

Let's see another board that not able to auto flash code.

The IDE try to upload code to the board, but it tries to connecting the board like this:

```
Serial port COM4
Connecting........_____....._____....._____....._____....._____....._____....._____

A fatal error occurred: Failed to connect to ESP32: Timed out waiting for packet header
*** [upload] Error 2
==================================================== [FAILED] Took 33.61 seconds ====================================================
```

The signal level like this:
![scope_6.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488320295-scope_6.png)
Seem something repeatedly happen, let's zoom in to one pattern:

![scope_7.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488322520-scope_7.png)

EN low, then BOOT low, one time short, one time long.
So do you know why it can't go into "Download Boot" mode

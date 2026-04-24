---
title: ESP32 with LVGL Setp2 Config TFT_eSPI with PlatformIO
slug: esp32-with-lvgl-setp2-config-tft_espi-with-platformio
id: cmn2tsa4o001febxasd7w9kv5
category: tutorial
categorySlug: tutorial
tags:
  - Display
  - lvgl
status: published
excerpt: >-
  On this article, we will show you how to install and set up the lvgl library
  in the ESP32 board.
updatedAt: '2026-04-23T23:04:11.335Z'
---

On last article, [[45-esp32-with-lvgl-setp1-config-tft_espi-with-platformio]] we have introduced how to install and set up the TFT_eSPI library in the ESP32 board.

On this article, we will show you how to install and set up the lvgl library in the ESP32 board.

## Install and Setup TFT_eSPI library

The TFT_eSPI library is a hardware-specific library that is designed to be used with the ESP32 and ESP8266 boards.

To install and set up the library, follow these steps declared in the [[45-esp32-with-lvgl-setp1-config-tft_espi-with-platformio]].

## Install lvgl library

Search for the lvgl library in the PlatformIO library manager and install it.

### Create a lv_conf.h file

Create a new file `lv_conf.h` under lvgl library root folder. And copy the content from `lv_conf_template.h`. Update the file by enabling the following options.

```c
/* clang-format off */
#if 1 /*Set it to "1" to enable content*/
```

## Lighting the screen by a mini example

Although the lvgl library has provided a lot of examples, we will create a simple example to light the screen. And privde all the necessary setup to use the lvgl library in a single file. Hope it will help you to understand how the lvgl library works.

```c
#include <Arduino.h>

#include <TFT_eSPI.h> // Graphics and font library for ILI9341 driver chip
#include <lvgl.h>

/*Change to your screen resolution*/
static const uint16_t screenWidth = 320;
static const uint16_t screenHeight = 240;

static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[screenWidth * screenHeight / 10];

TFT_eSPI tft = TFT_eSPI(screenWidth, screenHeight); /* TFT instance */

/* Display flushing */
void my_disp_flush(lv_disp_drv_t *disp_drv, const lv_area_t *area, lv_color_t *color_p)
{
  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);

  tft.startWrite();
  tft.setAddrWindow(area->x1, area->y1, w, h);
  tft.pushColors((uint16_t *)&color_p->full, w * h, true);
  tft.endWrite();

  lv_disp_flush_ready(disp_drv);
}

void setup()
{
  Serial.begin(115200);

  lv_init();

  tft.init();
  tft.setRotation(3);

  lv_disp_draw_buf_init(&draw_buf, buf, NULL, screenWidth * screenHeight / 10);

  /*Initialize the display*/
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  /*Change the following line to your display resolution*/
  disp_drv.hor_res = screenWidth;
  disp_drv.ver_res = screenHeight;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  /* Create simple label */
  lv_obj_t *label = lv_label_create(lv_scr_act());
  lv_label_set_text(label, "Hello ESP32Cube!");
  lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
}

void loop()
{
  static long last_time = millis();
  if (millis() - last_time > 5)
  {
    last_time = millis();
    lv_timer_handler(); // Call lvgl's timer handler
    lv_tick_inc(5);     // Update lvgl's tick
  }
}
```

Upload the code to the board, and the screen will show a blue background with the text "Hello ESP32Cube!".

The code is simple, and it is a good start to understand how the lvgl library works. You can also modify the code to create more complex UIs.

The source code is available at https://github.com/ESP32Cubes/ESP32_UI_tutorial/tree/main/Let02_lvgl.

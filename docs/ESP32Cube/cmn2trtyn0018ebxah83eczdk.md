---
title: Bounce2 Library for Arduino Debouncing Made Easy
slug: bounce2-library-for-arduino-debouncing-made-easy
id: cmn2trtyn0018ebxah83eczdk
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
status: published
excerpt: >-
  The Bounce2 library is a easy use tool for Arduino platforms, it will help us
  to solve the problem of erroneous states caused by the tiny vibrations of
  mechanical key switches when they are closed or opened.
updatedAt: '2026-04-23T22:59:55.246Z'
---

Bounce2 library provides an efficient debouncing algorithm to filter the noise signal of the key switches, ensuring that the program only responds to valid key operations. This is critical for the projects that rely on key input, preventing program errors or unexpected behaviors.

While we push or release the button, the signal will looks as below figure, we can see that there are some small vibrations in the signal at the beginning of button state change.

![Pasted image 20241126132833.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488406101-Pasted-image-20241126132833.jpeg)

![Pasted image 20241126133004.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488407595-Pasted-image-20241126133004.jpeg)

## Introduction

The Bounce2 library is mainly composed of three classes:
- `Bounce2::Button`: This is the most commonly used class in the library and has the lots of functions. It is specifically designed for debouncing hardware buttons. Usually, only use this class is enough for the applications.
- `Debouncer`: This is the class responsible for the actual debouncing algorithm in the library. Only advanced users need to directly use this class to create their own debouncing implementation.
- `Bounce`: This class connects the Debouncer class to the hardware pin. Its naming is a bit strange because it is to maintain backward compatibility with earlier versions of the library.

## Installation

Installing the Bounce2 library is straightforward. You can search and install it via the Arduino IDE's library manager or download the source code and copy the "Bounce2" folder to the "libraries" folder of the Arduino IDE.

## Example

Here's a basic example of how to use the `Bounce2::Button` class for key debouncing:

```cpp
#include <Bounce2.h>

Bounce2::Button button = Bounce2::Button();

// Configuration in the setup() function
void setup() {
  button.attach(PIN, INPUT_PULLUP); // Connect the button to the specified pin with an internal pull-up resistor
  button.interval(5); // Set the debounce time interval to 5 milliseconds
  button.setPressedState(LOW); // Set the level state when the button is pressed to LOW
}

// Updating and detecting the button state in the loop() function
void loop() {
  button.update(); // Update the button state
  if (button.pressed()) {
    // Operations to perform when the button is pressed
  }
}
```

In the above code, the `button.attach()` function connects the `Bounce2::Button` object to the specified hardware pin, `button.interval()` sets the debounce time interval, and `button.setPressedState()` sets the level state when the button is pressed.

The Bounce2 library offers advanced functions like `released()` to detect button release, `isPressed()` to check if the button is currently pressed, and `changed()` to detect if the button state has changed.

It also provides three different debouncing algorithms: Stable Interval (default), Lock-out Interval (enabled by defining `#define BOUNCE_LOCK_OUT` in "Bounce.h"), and Prompt Detection (enabled by defining `#define BOUNCE_WITH_PROMPT_DETECTION` in "Bounce.h").

## Summary

The Bounce2 library is a powerful and easy-to-use debouncing library for Arduino. Its clear documentation and rich example codes make it accessible for developers to quickly apply in practical projects, whether for simple key control or applications requiring precise time measurement.

Project address: https://github.com/thomasfredericks/Bounce2

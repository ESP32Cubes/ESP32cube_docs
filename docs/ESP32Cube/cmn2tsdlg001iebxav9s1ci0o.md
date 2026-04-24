---
title: ESP32 and human body infrared module
slug: esp32-and-human-body-infrared-module
id: cmn2tsdlg001iebxav9s1ci0o
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
  - Sensor
status: published
excerpt: >-
  Usage of ESP32 to control the human body infrared module, covering its
  components, control principle, applications, circuit connection, and code.
coverImage: 827bf2a06b6f5d7e89fbcd6cef98f227_MD5.png
updatedAt: '2026-04-23T14:44:37.391Z'
---

## Introduction

Dear friends, have you ever thought that your room can be as full of mystery and surprises as the castle in fairy tales? Today, we will work with you to use ESP32 to control the human body infrared module to add a bit of unique charm to your room!

## Human body infrared module

First, let’s take a look at this mysterious device.

Human body infrared module: This is a special sensor that can detect human activity and is usually used in smart homes, security monitoring and other fields. It emits infrared signals, and when someone approaches, the receiver detects these signals and triggers an alarm.

![827bf2a06b6f5d7e89fbcd6cef98f227_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488431493-827bf2a06b6f5d7e89fbcd6cef98f227_MD5.png)

- **VCC**  is the power supply pin for the IR sensor, which we connect to the 5V pin on the Arduino.
- **OUT** pin is a 5V TTL logic output. LOW indicates no motion is detected; HIGH means motion is detected.
- **GND** Should be connected to the ground of the Arduino.

This sensor can detect the presence of an obstacle in front of it.  
The discovery distance can be adjusted using the onboard trimmer.  

Returned values: digital '1' or '0'.

## Control principle

Human body induction sensors are very common in indoor security applications. The principle is that the detection element converts the infrared radiation detected by the human body into a weak voltage signal, which is amplified and then output. In order to improve the detection sensitivity of the detector and increase the detection distance, a plastic Fresnel lens is usually installed in front of the detector. It cooperates with the amplification circuit to amplify the signal, so that people within a certain range can be detected.

## Common applications

Intelligent induction sanitary ware, home security, robot obstacle recognition, intelligent detection, intelligent control, faucet induction, automatic toilet flushing, automatic hand dryer, anti-theft device, automatic doorbell, stair aisle induction, proximity reminder, automatic door, automatic trash cans (buckets) etc.

## Connect circuit

Just three wires, VCC, GND and a signal wire can be connected to the corresponding GPIO.

The resistances on below figure is optional.

![e4061ca3852e22205ec19b6960f5bd4e_MD5.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488433192-e4061ca3852e22205ec19b6960f5bd4e_MD5.png)

## Code

```c
#include <IRremote.h>

int IRSensor = 9; // connect IR sensor module to ESP32

void setup(){
  Serial.begin(115200); // Init Serial at 115200 Baud Rate.
  pinMode(IRSensor, INPUT); // IR Sensor pin INPUT
}

void loop(){
  int sensorStatus = digitalRead(IRSensor); // Set the GPIO as Input
  if (sensorStatus == 1) // Check if the pin high or not
  {
    Serial.println("Motion Detected!");
  }
}
```

In this example, the IRremote library is used, and you can install it using the "Library Manager" in the Arduino IDE.

This code prints the hexadecimal value of the received IR signal to the serial monitor. You can modify the code according to your specific requirements. Keep in mind that signals from different IR remotes may vary, so you need to adapt the code based on the signals from your particular remote.

## Summarize

This section implements the detection of human body induction sensors through a simple interrupt method. Human body induction sensors are widely used, especially in the security field. Combined with other hardware modules, when an intrusion is detected, an alarm and remote reminder can be issued. and other functions. You can give full play to your imagination and use the OLED and buzzer on the front to make the alarm function better.

Dear friends, I hope you enjoyed today's tutorial. By learning how to use ESP32 to control the human body infrared module, you can not only create an interesting smart alarm system, but also exercise your hands-on and programming abilities. I hope everyone can find fun in the world of programming and become future technology experts!

If you are interested in other creative projects, please continue to follow and star our official account for more interesting content and tutorials. Don’t forget to forward and share with friends in need!

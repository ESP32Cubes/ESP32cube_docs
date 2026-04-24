---
title: ESP32-P4-EYE A Development Kit for AI Vision Applications
slug: esp32-p4-eye-a-development-kit-for-ai-vision-applications
id: cmn2twlta003febxacm0fm1ay
category: project
categorySlug: project
tags:
  - LED
  - AI
  - Video
  - Web
  - Audio
  - Bluetooth
  - Display
  - IoT
status: published
excerpt: >-
  The ESP32-P4-EYE is a development kit based on the ESP32-P4 chip, designed for
  AI vision applications. It offers various features including a 2MP camera, USB
  connectivity, and a rich set of peripherals.
updatedAt: '2026-04-23T22:57:29.330Z'
---

## ESP32-P4-EYE: A Development Kit for AI Vision Applications

The **ESP32-P4-EYE** is a development kit based on the ESP32-P4 chip, designed specifically for AI vision applications. It looks similar to a standard camera and offers a rich set of peripherals, including a camera, microphone, LCD, USB ports, and more.

![14e9b12b90b2fbccc2c08fd0bbab4c7c_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488651844-14e9b12b90b2fbccc2c08fd0bbab4c7c_MD5.webp)

### GitHub Repository:
[ESP32-P4-EYE GitHub](https://github.com/espressif/esp-dev-kits/tree/0b833fe32cc46f48ce4499d1b602628f3660eba7/examples/esp32-p4-eye)

The documentation is quite comprehensive, including schematics, PCB layouts, and a code example for a mini camera application. This application supports photo capture, timed photo capture, video recording, gallery preview, SD card installation, and a settings interface with adjustable resolution, saturation, contrast, brightness, and hue.

### Key Features:
- **Dual-core 400 MHz RISC-V Processor** with support for up to 32MB PSRAM.
- **Supports USB 2.0**, MIPI-CSI/DSI, and H264 Encoder.
- **ESP32-C6-MINI-1U** module for Wi-Fi (Wi-Fi 6), Bluetooth, Zigbee, and Thread communication.
- **Camera Interface** (MIPI-CSI) and **USB 2.0 High-Speed Slave Mode**.
- **Onboard Camera**, Display, Microphone, and MicroSD Card support.
- **Rotary Encoder** for controlling LCD menus and adjusting zoom.
- **USB or Battery-powered**.

### Functional Block Diagram:

![Pasted image 20250624195147.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488653813-Pasted-image-20250624195147.jpeg)
### Component Descriptions:

![Pasted image 20250624195359.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488655852-Pasted-image-20250624195359.png)

#### ESP32-P4-EYE PCB Overview:

![Pasted image 20250624195405.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488658418-Pasted-image-20250624195405.png)

#### Key Components:

| **Component**             | **Description** |
|---------------------------|-----------------|
| **MicroSD Card Slot**      | Supports 4-wire SDIO and SPI mode for MicroSD cards. |
| **Test Points**            | Provides access points for programming and testing the ESP32-C6-MINI-1U, which can be connected via Dupont wires. |
| **USB 2.0 Device Port**    | Connects to the ESP32-P4's USB 2.0 OTG high-speed interface, adhering to USB 2.0 specifications. This port can also be used to power the development board. |
| **USB Debugging Port**     | For board power, firmware flashing, and connecting to the ESP32-P4 via USB-Serial-JTAG interface. |
| **Power Switch**           | Toggle to "I" to power on with a 5V input, and "O" to power off. |
| **User-Defined Button**    | Can be customized by the user for specific functions. |
| **LCD FPC Connector**      | Connects to a 1.54-inch LCD screen. |
| **LCD Screen**             | A 1.54-inch LCD with a 240×240 resolution and SPI interface, capable of displaying real-time camera images. |
| **Charging Indicator**     | Red when charging, green when charging is complete. |

#### ESP32-P4-EYE Back View:
![Back View](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

| **Component**             | **Description** |
|---------------------------|-----------------|
| **Rotary Encoder**         | Customizable for controlling the LCD interface or adjusting camera zoom. |
| **ESP32-C6-MINI-1U**       | Serves as the Wi-Fi and Bluetooth communication module. |
| **Fill/Flashlight**        | Provides illumination for image capture and video recording. |
| **Digital Microphone**     | Used for voice recognition or audio recording. |
| **MIPI CSI Connector**     | Connects to the camera module. |
| **Female Header**          | 2 x 10P header, customizable for your application. |
| **SPI Flash**              | 16MB flash memory connected via SPI interface. |
| **ESP32-P4 Series**        | A high-performance MCU with large memory, supporting advanced image and audio processing. |
| **Battery Connector**      | Connects to a lithium battery. |
| **Reset Button**           | Resets the board. |
| **Boot Button**            | Used for entering boot mode. Press while holding down the **Boot Button** to reset the ESP32-P4 and enter firmware download mode. |
| **Camera**                 | 2 MP resolution with manually adjustable focus. |

### Application Scenarios:
This development board can be used in various AI vision applications such as:

- **Smart Surveillance**: With the camera and microphone, it can be used to capture images and audio for monitoring and security.
- **Edge AI for Vision**: Perform real-time image detection and AI processing directly on the device.
- **IoT Integration**: Ideal for integrating into an IoT system for remote monitoring, control, and data collection.

### Innovation and Ecosystem:
Espressif has truly excelled in making the ESP32-P4-EYE an open and innovative development platform. The ecosystem around the ESP32 series is thriving with plenty of support for new applications.

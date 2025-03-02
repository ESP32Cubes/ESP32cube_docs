# ESP32-S3 Development Board Introduction

The ESP32 S3 AI Voice Assistant Kit is a development board based on the ESP32-S3 chip, which is a high-performance, low-power, 32-bit microcontroller with integrated speech recognition, wake-word detection, and voice recognition capabilities. It is designed to be used in a wide range of applications, including voice-controlled home assistants, smart speakers, and smart watches.

The ESP32-S3 development boards are designed to resemble real-world products more closely than traditional dev boards. They can be used both as full-featured development platforms and deployed directly in practical applications.

![[images/aa9613bcb9b8c42c6d5c36ef408ced6e_MD5.png]] 

ESP32-S3 Development Board

This board maximizes the capabilities of the ESP32-S3, integrating:
- **Color display**: 2-inch IPS screen (320x240 resolution, SPI interface)  
- **Audio I/O**: Dual microphones (ZTS6216) + 1W speaker (DB1811AB50)  
- **Sensors**: Built-in QMI8658 6-axis IMU (accelerometer + gyroscope)  
- **Connectivity**: Wi-Fi 802.11 b/g/n, Bluetooth 5.0 LE/Mesh  
- **AI capabilities**: Hardware-accelerated vector instructions for neural networks  
- **Expandability**: Two GH1.25 interfaces for external sensors/actuators (supports GPIO, CAN, I2C, UART, PWM)  

Compact dimensions (69×41×14 mm) and a tool-free enclosure design enable effortless hardware/structural exploration. The screw-less casing allows manual disassembly without tools.

## Board Resource Diagram

![[images/b2db18fe0de6662544d18fd3f19b9937_MD5.png]]  

![[images/31302b6b6ec0ad80276e73fa62c75e1d_MD5.png]]  

## Hardware Specifications
| Category         | Model               | Parameters                                                                                   |
|------------------|---------------------|---------------------------------------------------------------------------------------------|
| Module           | ESP32-S3-WROOM-1-N16R8 | Dual-core Xtensa® LX7 @ 240 MHz, 512KB SRAM, 8MB PSRAM, 16MB Flash, 2.4GHz Wi-Fi (802.11 b/g/n), Bluetooth 5.0 LE/Mesh, AI vector acceleration |
| Display          | ST7789             | 2.0" IPS, 320×240 resolution, SPI interface                                                 |
| Touchscreen      | FT6336             | Capacitive touch, I2C interface                                                             |
| Motion Sensor    | QMI8658            | 3-axis accelerometer + 3-axis gyroscope, I2C interface                                      |
| Audio DAC        | ES8311             | Single-channel, I2C interface                                                               |
| Audio ADC        | ES7210             | Quad-channel (3 used), I2C interface                                                        |
| Audio Amplifier  | NS4150B            | Mono Class-D amplifier                                                                      |
| Microphone       | ZTS6216            | Dual analog MEMS microphones                                                                |
| Speaker          | DB1811AB50         | 1811 cavity speaker, 1W output                                                              |
| USB Hub          | CH334F             | USB 2.0 hub controller                                                                      |
| USB-UART         | CH340K             | Up to 2Mbps baud rate                                                                       |
| Power IC         | SY8088AAC          | Dual-channel 1A output                                                                      |
| GH1.25 Interface | –                  | Two expandable interfaces (5V/3.3V power, GPIO, CAN, I2C, UART, PWM)                        |
| TF Card Slot     | –                  | 1-SD mode connection                                                                        |
| Type-C Port      | –                  | Power supply, programming, debugging, USB communication                                     |
| Buttons          | –                  | Reset button + user-defined button                                                          |

## Mechanical Dimensions

![[images/af71c9766cb978726f2bdcd12880a03c_MD5.png]]  
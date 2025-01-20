# Board Introduction

The ESP32 S3 AI Voice Assistant Kit is a development board based on the ESP32-S3 chip, which is a high-performance, low-power, 32-bit microcontroller with integrated speech recognition, wake-word detection, and voice recognition capabilities. It is designed to be used in a wide range of applications, including voice-controlled home assistants, smart speakers, and smart watches.

The Practical Board is more similar to the appearance of actual products compared to traditional development boards. It can not only be used as a full-featured development board but also as an actual product for use in real work and daily life. Currently, there are two versions of the Practical Board.

![alt text](https://wiki.lckfb.com/storage/images/zh-hans/szpi-esp32c3/index/index_20241023_092634.png)

硬件参数
类别	型号	参数
模组	ESP32-S3-WROOM-1-N16R8	搭载 Xtensa® 32 位 LX7 双核处理器，主频高达 240 MHz，内置SRAM 512kB，外置PSRAM 8MB，外置FLASH 16MB，2.4 GHz Wi-Fi (802.11 b/g/n) 40MHz带宽，Bluetooth 5 (LE) 和 Bluetooth Mesh，集成AI向量指令，加速神经网络计算和信号处理
显示屏	ST7789	2.0寸、IPS全视角、分辨率320*240、SPI接口
触摸屏	FT6336	电容触摸、I2C接口
姿态传感器	QMI8658	三轴加速度+三轴陀螺仪、I2C接口
音频DAC	ES8311	单通道、I2C接口
音频ADC	ES7210	四通道(开发板用三个通道)、I2C接口
音频功放	NS4150B	单声道D类音频放大器
麦克风	ZTS6216	配套双路麦克风、模拟输出
喇叭	DB1811AB50	1811音腔喇叭、1W
USB HUB	CH334F	USB2.0 HUB
USB转串口	CH340K	波特率最大2Mbps
电源芯片	SY8088AAC	提供双路、每路1A
GH1.25接口		两路外拓传感器接口，可以给外部传感器供电5V和3.3V，可以作为GPIO、CAN、I2C、UART、PWM等接口
TF卡接口		采用1-SD模式与ESP32连接
Type-C接口		用于供电、程序下载、程序调试，以及USB数据通信
按键		一个复位按键、一个用户自定义按键
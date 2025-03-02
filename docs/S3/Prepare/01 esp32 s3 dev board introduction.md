# Development Board Overview 

![[images/3c5f42745830c7f6e3483ee552979229_MD5.png]]

![[images/f07d88204eabc9141b63f05bc6b47b48_MD5.png]]

## 1.1 Key Features

- **Core Module**: ESP32-S3-WROOM-1-N16R8 with 16MB Flash and 8MB PSRAM
- **Display**:  
  - 2.0" IPS LCD (320x240) with capacitive touch
  - GC0308 0.3MP camera module
- **Audio**:  
  - ES7210 audio ADC with dual MEMS microphones
  - ES8311 audio DAC + NS4150B 1W Class-D amplifier
- **Sensors**:  
  - QMI8658 6-axis IMU (accelerometer + gyroscope)
- **Connectivity**:  
  - Dual expansion ports: I2C interface + multifunctional GPIO (UART/I2C/CAN/PWM)
  - TF card slot (1-SD mode)
  - USB 2.0 Hub (CH334F) with Type-C interface
- **Power**: Dual independent power rails (3.3V for MCU, AU_3V3 for audio)
- **AI Capabilities**: Supports voice/image recognition via ESP32-S3's AI vector instructions

## 1.2 Circuit Design Details

### Core Module Interface

![[images/47a90a9e7fa3cb8140a1a0d2af276922_MD5.png]]

- **Critical Pins**:  
  - IO46: Pulled low for stable bootloader entry
  - IO35-37: Dedicated to 8-line PSRAM (unavailable for GPIO)

### USB Subsystem
- **USB Hub (CH334F)**:  

  ![[images/a20e56f44917323d1cd59b0df0a872f5_MD5.png]]

  - Upstream: Type-C connector
  - Downstream: 
    - D4: CH340K USB-UART bridge
    - D3: ESP32-S3 USB-OTG

- **USB-UART (CH340K)**:  
  ![[images/efa4bcb58741267e2097940313d8604d_MD5.png]]  
  Driver: [WCH CH340/CH341 Drivers](https://www.wch.cn/downloads/CH341SER_EXE.html)

### Input/Output Interfaces

- **Buttons**:  
  ![[images/368c3d9c81d426070d94977ddf9b1504_MD5.png]]
  - RESET: Full system reset
  - BOOT: User-programmable (default download mode override)

- **Display & Touch**:  
  ![[images/2a6c7d13359d0c574d0a6aad3c2b6ea1_MD5.png]]
  - LCD: SPI interface with PWM backlight control
  - Touch: I2C capacitive controller

### Peripheral Circuits

- **Camera Interface (GC0308)**:  
  ![[images/0b5b654e04f63af95722ea7b99fc84ba_MD5.png]]
  - 2.8V power supply
  - BTB connector interface

- **Audio Pipeline**:  
  ![[images/1739c796f5e0bae39148cf9c1227d5d8_MD5.png]]  
  ![[images/8c7dcbf9d91115e10e726f61dc23a991_MD5.png]]
  - ES7210 ADC: 3-channel input (2 mics + echo cancellation)
  - ES8310 DAC: Audio output to speaker/headphone

- **Power Management**:  
  ![[images/2b29ac404b8caa9211a7f6cebe2460df_MD5.png]]  
  - SY8088AAC dual-channel regulator
  - Independent audio power domain

- **Expansion Ports**:  
  ![[images/40fe0ae44713b79d12a2cbd9db84c88e_MD5.png]]
  - I2C Port: Shared with onboard sensors
  - Multi-function Port: GPIO10/11 (configurable as UART/I2C/CAN/PWM)

### Specialized Circuits
- **TF Card Interface**:  
  ![[images/a2d5eca2f19399fc7a44cc932c955403_MD5.png]]
  - 1-SD mode operation
  - DAT3 pull-up for SD mode enforcement

- **IO Expander (For Peripheral Enable)**:  
  ![[images/b0ecf48c09eeaf3b7feb51b4fb68de0f_MD5.png]]
  - Controls: LCD_CS, PA_EN, DVP_PWDN
  - I2C address: 0x20

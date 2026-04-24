---
title: Audio Playback with HSC001 and ESP32
slug: audio-playback-with-hsc001-and-esp32
id: cmn2tsphe001pebxa1cu5792y
category: tutorial
categorySlug: tutorial
tags:
  - Audio
status: published
excerpt: >-
  This post is an introduction to using the HSC001 module for audio playback. It
  details the necessary components, module features, pin distribution, hardware
  connections, and code implementation for setting up and playing audio files.
updatedAt: '2026-04-23T16:42:55.966Z'
---

## Introduction

Curious about audio playback in electronics? Let’s start with the **HSC001 module**—a compact, cost-effective 24-bit audio player with versatile applications like elevator music, device sound effects, and more. In this guide, we’ll explore how to configure and play audio files using the HSC001 with an **ESP32 development board**.  


## Components Needed  
- **HSC001 Serial Voice Module**  
- **ESP32 Development Board**  
- **Micro USB OTG Cable**  
- **Jumper Wires**  

## HSC001 Module Overview  
The HSC001 is a playback chip supporting **MP3/WAV formats**, **USB/SPI FLASH storage**, and **FAT16/FAT32 file systems**. Key features:  
- Simple serial command control  
- Direct USB-to-SPI FLASH audio uploading  
- 3W speaker output  
- Low-voltage operation (3.3–5.4V)  
- Reliable and user-friendly  

![Pasted image 20250415194607.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488471320-Pasted-image-20250415194607.jpeg)

## Pin Configuration  
The HSC001 has 10 pins:  
1. **SP+**: Amplifier positive (3W max)  
2. **GND**: Ground  
3. **VDD**: Power input (3.3–5.4V)  
4. **SP-**: Amplifier negative  
5. **MUTE**: Mute control  
6. **DP**: USB-DP  
7. **DM**: USB-DM  
8. **ADK**: ADK button  
9. **TX**: UART output (3.3V TTL)  
10. **RX**: UART input (3.3V TTL)  

![Pasted image 20250415194629.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488473139-Pasted-image-20250415194629.jpeg)
## Audio Playback with ESP32  
#### **Hardware Setup**  
1. Power the HSC001 via ESP32’s 3.3V output.  
2. Connect ESP32’s **TX** to HSC001’s **RX** (3.3V logic compatible).  
3. Attach a speaker to **SP+/SP-**.  
4. Insert a USB drive with audio files (named `0001.mp3`, `0002.wav`, etc.) into the HSC001.  


## Command Protocol  
Commands follow this structure:  
`[0x7E] + [Len] + [CMD] + [Param1] + [Param2] + [0xEF]`  
- **Len**: Total bytes after Len (excluding start/end bytes).  
- **CMD**: Play, pause, volume, etc.  
- **Params**: Command-specific arguments.  

**Example**: Play file `0001` → `7E 04 41 00 01 EF`  


## ESP32 Code  
Upload this code to cycle through audio files every 10 seconds:  
```cpp
byte currentSound = 0x01;  // Start with file 0001

void setup() {
  Serial.begin(9600);      // ESP32 UART1 (adjust pins if needed)
}

void loop() {
  // Send play command
  Serial.write(0x7E);
  Serial.write(0x04);      // Len = 4 (CMD + 2 params)
  Serial.write(0x41);      // CMD: Play by index
  Serial.write(0x00);      // Param1: High byte (00)
  Serial.write(currentSound); // Param2: Low byte (file number)
  Serial.write(0xEF);      // End byte

  delay(10000);            // Play for 10 seconds
  currentSound++;          // Next file
  if (currentSound > 10) currentSound = 1; // Reset after file 10
}
```


## Code Breakdown  
1. **UART Initialization**: ESP32 communicates at 9600 baud.  
2. **Command Structure**:  
   - `0x7E` and `0xEF` mark start/end.  
   - `0x41` triggers playback by file index.  
3. **File Cycling**: Increments `currentSound` every 10 seconds (adjust delay as needed).  


## Troubleshooting Tips  
- Ensure audio files are named `0001`, `0002`, etc., and formatted as FAT32.  
- Confirm wiring matches ESP32’s 3.3V logic (no level shifter needed).  
- Check serial port configuration (e.g., use `Serial1` if ESP32’s default UART is busy).

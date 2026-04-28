---
title: 'ESP32 + WS2812B LED Strip + 18650 Battery: Rechargeable RGB Lighting Device'
slug: esp32-ws2812b-18650-project
id: cmoi6mfne00000ai9vmehgu5z
category: tutorial
categorySlug: tutorial
tags:
  - ESP32
  - ws2812b
  - LED
  - battery
status: draft
excerpt: >-
  A practical guide to building a rechargeable RGB lighting device using ESP32,
  WS2812B LED strip, and dual 18650 batteries. Covers hardware design, power
  calculation, and advanced lighting effects for real-world applications.
coverImage: >-
  [https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/b20490775df31920a022109e009b6274d11473c7c12611139e0859bf80ed9f63.jpg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/b20490775df31920a022109e009b6274d11473c7c12611139e0859bf80ed9f63.jpg)
updatedAt: '2026-04-28T06:08:26.011Z'
---
# ESP32 + WS2812B LED Strip + 18650 Battery

## A Rechargeable Portable RGB Lighting Device

This article presents a **rechargeable portable RGB lighting device based on ESP32**, using a **WS2812B addressable LED strip** and powered by **two parallel 18650 lithium-ion cells**. 

The system supports **USB charging**, delivers stable 5V power for both logic and LEDs, and is suitable for **ambient lighting, desktop light effects, interactive installations, or embedded product prototypes**.

![Finished Device Prototype](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/b20490775df31920a022109e009b6274d11473c7c12611139e0859bf80ed9f63.jpg)

## Project Goals and Key Features

### Design Goals
* **Portability:** Fully rechargeable and wire-free.
* **Precision Control:** Individual RGB pixel control via MCU.
* **Modularity:** Simple circuit architecture for easy customization.
* **Efficiency:** Balanced brightness and long battery life.

### Core Features
* **ESP32 MCU:** High-performance controller with Wi-Fi and BLE capabilities.
* **WS2812B LEDs:** Smart, single-wire programmable RGB pixels.
* **Parallel 18650 Power:** 2× cells for high capacity and current capability.
* **Integrated Power Management:** USB charging (TP4056) + 5V Boost (MT3608).
* **Safety First:** Software-based brightness limiting and hardware protection.

## System Architecture Overview

### Power Flow
```text
USB 5V Input
      │
      ▼
TP4056 Li-ion Charger (with overcharge/discharge protection)
      │
      ▼
2 × 18650 Battery (Parallel, 3.0V – 4.2V)
      │
      ▼
MT3608 Boost Converter (Stepped up to 5V)
      │
      ├── ESP32 DevKit (VIN / 5V Pin)
      └── WS2812B LED Strip (5V VCC Pin)
```

![System Schematic Diagram](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/eedc4ea97f93019191c17b5324fc2db8da6db096d34c71bcb51e8c964b52cb1b.png)

## Bill of Materials (BOM)

### 1. Main Controller and LED Strip
| Item | Model | Specification |
| :--- | :--- | :--- |
| **MCU** | ESP32 DevKit V1 | Dual-core, 240 MHz, 3.3V GPIO |
| **LED Strip** | WS2812B | 5V, Individually addressable |
| **LED Count** | 12–15 LEDs | Approximately 20 cm strip |
### 2. Power and Management
| Item | Model | Description |
| :--- | :--- | :--- |
| **Battery** | 18650 Cells (x2) | Lithium-ion, connected in parallel |
| **Charger** | TP4056 Module | Micro-USB/Type-C with DW01 protection |
| **Boost Converter**| MT3608 | DC-DC Step-up, ≥2A output |
| **Bulk Capacitor** | 1000 µF / 10V | Electrolytic, for LED power stabilization |
### 3. Passive Components
| Item | Value | Purpose |
| :--- | :--- | :--- |
| **Resistor** | 330 Ω | Placed on LED data line to prevent signal spikes |
| **Capacitors** | 100 nF / 10 µF | Decoupling for ESP32 stability |
| **Switch** | SPST | Main physical power toggle (optional) |

## Power Consumption and Battery Life

### Consumption Calculations
* **WS2812B LEDs:** Single LED (Full White) ≈ 60 mA @ 5V. 
    * *Total (15 LEDs):* 15 × 60 mA = **900 mA (4.5 W)**.
* **ESP32 MCU:** * *Idle:* ~80–120 mA.
    * *Wi-Fi/BLE Active:* 200–300 mA.

**Peak System Current:** 

$I_{total} \approx 0.9A (LEDs) + 0.3A (ESP32) \approx 1.2A @ 5V$.

### Runtime Estimation
* **Total Capacity:** 2500 mAh × 2 = **5000 mAh**.
* **Total Energy:** $5Ah \times 3.7V = 18.5 Wh$.
* **Efficiency Factor:** Considering Boost Converter at ~85% efficiency.
* **Usable Energy:** $18.5 Wh \times 0.85 \approx 15.7 Wh$.
* **Max Runtime:** $15.7 Wh / 4.5 W \approx 3.5 \text{ hours (Full Brightness)}$.
* **Mixed Use:** With software brightness limiting (e.g., 30%), runtime extends to **6–10 hours**.

## Key Circuit Design Considerations

### 1. Parallel 18650 Cells
Connecting cells in parallel increases capacity and current overhead while reducing heat. 
* ⚠️ **Important:** Ensure both cells are the same model, same voltage, and same health/age before connecting.

### 2. Signal Integrity and Stability
* **1000 µF Bulk Capacitor:** Essential across the LED power rails to handle "inrush" current during color changes, preventing ESP32 brown-out resets.
* **Logic Levels:** While WS2812B expects 5V logic, most strips recognize the 3.3V signal from ESP32 GPIOs. For professional reliability, a **74AHCT125 level shifter** is recommended.

## ESP32 Arduino Control Code Example

**Required Library:** `FastLED` by Daniel Garcia.

```cpp
#include <FastLED.h>

#define LED_PIN     18      // Data pin connected to ESP32
#define NUM_LEDS    15      // Number of LEDs in strip
#define BRIGHTNESS  80      // 0-255 scale (80 is approx 30% brightness)
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

void setup() {
  // Setup FastLED
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
  FastLED.clear();
  FastLED.show();
}

void loop() {
  // Simple Breathing Blue Effect
  for (int b = 10; b < BRIGHTNESS; b++) {
    FastLED.setBrightness(b);
    fill_solid(leds, NUM_LEDS, CRGB::Blue);
    FastLED.show();
    delay(15);
  }
  
  for (int b = BRIGHTNESS; b > 10; b--) {
    FastLED.setBrightness(b);
    FastLED.show();
    delay(15);
  }
}
```

## Advanced Application: Smart Ambient Light Bar
This prototype can be housed in a slim aluminum extrusion to create a professional-grade light bar.
### Potential Enhancements:
* **Connectivity:** BLE connection to sync with PC system load or phone notifications.
* **Interactivity:** Capacitive touch sensors for mode switching.
* **Automation:** LDR (Light Dependent Resistor) for auto-brightness based on room lighting.
* **Power Optimization:** Utilize ESP32 **Deep Sleep** mode and battery monitoring via ADC to protect against cell depletion.
## Conclusion
This ESP32-based architecture offers a robust foundation for portable lighting. By combining reliable power management (TP4056 + MT3608) with flexible software control, this design bridges the gap between a DIY hobbyist project and a viable commercial product prototype.

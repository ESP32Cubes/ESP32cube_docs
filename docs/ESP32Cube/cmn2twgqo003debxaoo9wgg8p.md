---
title: TRMNL A Wireless E-Ink Display Powered by ESP32-C3
slug: trmnl-a-wireless-e-ink-display-powered-by-esp32-c3
id: cmn2twgqo003debxaoo9wgg8p
category: project
categorySlug: project
tags:
  - LED
  - AI
  - Web
  - Bluetooth
  - Display
status: published
excerpt: >-
  TRMNL is a wireless 7.5-inch black-and-white E-Ink display based on the
  ESP32-C3 RISC-V SoC, offering customizable features, open-source firmware, and
  API access. It's perfect for DIYers and makers.
updatedAt: '2026-04-23T18:42:30.699Z'
---

TRMNL is a 7.5-inch wireless black-and-white E-Ink display powered by the ESP32-C3 RISC-V Wi-Fi and Bluetooth SoC. It features a customizable design that allows users to disassemble the device, modify its open-source firmware, and access API keys.

![06b44103db4591d34b00532b91b9ac77_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488634058-06b44103db4591d34b00532b91b9ac77_MD5.webp)

The device comes with a default 1,800mAh battery that lasts over 3 months on a single charge. Alternatively, a 2,500mAh battery is available, extending the usage time to over 6 months. TRMNL can be placed on a desk or mounted on a wall or refrigerator. The device includes a case opener, with optional accessories like a USB-C cable, screen protector, and microfiber cloth.

### TRMNL Specifications:
- **Wireless MCU**: Espressif ESP32-C3
- **Display**: 7.5-inch black-and-white E-Ink display with a resolution of 800 x 480
- **Battery**: 1,800mAh rechargeable lithium battery (upgradeable to 2,500mAh for 6+ months of usage)
- **Dimensions**: 171 x 116 x 10mm
- **Weight**: 165g
- **Case**: Soft-touch ABS (black only), chrome-plated steel bracket

![06b44103db4591d34b00532b91b9ac77_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488634058-06b44103db4591d34b00532b91b9ac77_MD5.webp)

#### GitHub Repository:
[TRMNL Firmware on GitHub](https://github.com/usetrmnl/trmnl-firmware)

#### API Documentation:
[TRMNL API Docs](https://docs.usetrmnl.com/go/how-it-works)

The firmware, API documentation, and power consumption measurement details are all open-sourced. The API documentation site provides more detailed explanations of the firmware and software design. Essentially, the system works by implementing communication between the client and server, where the TRMNL firmware sends requests to the server for content, plugins, or firmware updates.

### Plugins and Customization
The server hosts a collection of native and custom plugins. TRMNL plugins can display RSS feeds, show photo slideshows, weather updates, Bitcoin or Ethereum wallet balances, Outlook or Google calendars, Hacker News feeds, shopping lists, and more. Currently, there are 82 plugins available (as shown below).

![06b44103db4591d34b00532b91b9ac77_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488634058-06b44103db4591d34b00532b91b9ac77_MD5.webp)

For DIY enthusiasts, TRMNL also supports the inclusion of third-party libraries like Highcharts, allowing you to create data visualizations such as line graphs and charts.

![06b44103db4591d34b00532b91b9ac77_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488634058-06b44103db4591d34b00532b91b9ac77_MD5.webp)

---

This content is ideal for makers, engineers, and anyone interested in wireless display technologies, offering easy customization and a wide range of use cases through open-source hardware and software.

---
title: ESPUI
slug: espui
id: cmn2tt1z0001xebxav65w1xr5
category: project
categorySlug: project
tags:
  - LED
  - AI
  - Web
  - IoT
status: published
updatedAt: '2026-04-23T16:27:09.377Z'
---

## What is ESPUI

ESPUI is a simple web user interface library designed for ESP32 and ESP8266 devices. It enables users to easily create and manage the web interface of their devices without any HTML, CSS, or JavaScript front-end development knowledge. The ESPUI library allows users to easily communicate and control their devices through a web browser, providing a convenient and intuitive operation interface.

![fb0011b0003fbd680b585efc171c07f7_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488610408-fb0011b0003fbd680b585efc171c07f7_MD5.webp)

**Features of ESPUI**

1. **Easy to use**: ESPUI provides simple and easy-to-understand APIs that users can easily use to create their own web interfaces without mastering professional front-end development knowledge.

2. **Flexible customization**: The ESPUI library allows users to customize the web interface according to their needs, including style, layout, and functionality.

3. **Lightweight**: The ESPUI library is small in size and has high running efficiency, which can run on resource-constrained microcontrollers.

4. **Support for various controls**: The ESPUI library provides a rich set of controls, including text boxes, buttons, sliders, etc., to meet users' various needs for web interfaces.

![69f600b465480ea03601be26535d41c7_MD5.gif](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488611748-69f600b465480ea03601be26535d41c7_MD5.gif)

**Installation**

ESPUI can be found on GitHub or installed using the Arduino Library Manager. To install ESPUI using the Arduino Library Manager, follow these steps:

1. Open the Arduino IDE.
2. Click the "Sketch" menu, then select "Include Library" -> "Manage Libraries".
3. Enter "ESPUI" in the search box and click "Install".

![52285ba114328c6055e8b82812f0bf07_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488613874-52285ba114328c6055e8b82812f0bf07_MD5.webp)

## Usage

### 1. Create a Web Server

First, we need to create a web server. You can use the following code:

```cpp
#include <ESPUI.h>

ESPUI ui;

void setup() {
  ui.begin();
}

void loop() {
  ui.loop();
}
```

This code creates a web server and stores it in the variable `ui`.

### 2. Add Web Pages

Next, we need to add web pages to the web server. You can use the following code:

```cpp
#include <ESPUI.h>

ESPUI ui;

void setup() {
  ui.begin();

  // Create a web page named "index"
  ESPUI_Page page = ui.addPage("index");

  // Add a text element to the web page
  ESPUI_Text text = page.addText("Hello, world!");
}

void loop() {
  ui.loop();
}
```

This code adds a web page named `"index"` to the web server and adds a text element `"Hello, world!"` to the page.

### 3. Handle HTTP Requests

When the client sends an HTTP request to the web server, ESPUI will call the `handleHTTPRequest` function. We can use this function to handle HTTP requests. You can use the following code:

```cpp
#include <ESPUI.h>  
  
ESPUI ui;  
  
void setup() {  
  ui.begin();  
  
  // Create a web page named "index"
  ESPUI_Page page = ui.addPage("index");  
  
  // Add a text element to the web page
  ESPUI_Text text = page.addText("Hello, world!");  
}  
  
void handleHTTPRequest(ESPUI_HttpRequest request) {  
  // Check the URI of the request
  if (request.getURI() == "/hello") {  
    // Send "Hello, world!" response
    request.sendResponse(200, "text/plain", "Hello, world!");  
  } else {  
    // Send 404 error response
    request.send404();  
  }  
}  
  
void loop() {  
  ui.loop();  
}
```

The code defines a function `handleHTTPRequest`, which is called when a client sends an HTTP request to the web server. The function checks the URI of the request; if the requested URI is `"/hello"`, it sends a `"Hello, world!"` response; otherwise, it sends a 404 error response.

![02b0d0e3b7840f72210312dfa782fccf_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488615218-02b0d0e3b7840f72210312dfa782fccf_MD5.webp)

**ESPUI Application Scenarios**

1. **Internet of Things (IoT) Device Control**: The ESPUI library is suitable for remote control of IoT devices, allowing users to manipulate various functions of devices through a web interface.

2. **Smart Home Systems**: The ESPUI library can be used for control panels in smart home systems, enabling users to remotely control various devices in the home from mobile phones, computers, and other devices.

3. **Embedded System Management**: The ESPUI library can also be used for remote management of embedded systems, allowing users to configure and monitor embedded devices through a web interface.

![20796d191b4e8a8a104f6aaa95e67a14_MD5.webp](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488616588-20796d191b4e8a8a104f6aaa95e67a14_MD5.webp)

**Conclusion**

ESPUI is a simple yet powerful network user interface library, providing convenient web interface control capabilities for ESP32 and ESP8266 devices. It can help users quickly create and customize their own web interfaces, making device operations more convenient and intuitive. The emergence of the ESPUI library will undoubtedly bring greater convenience and possibilities to the development and application of IoT devices.

Project Address: [https://github.com/s00500/ESPUI](https://github.com/s00500/ESPUI)

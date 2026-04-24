---
title: Develop ESP32 in VScode with PlatformIO
slug: develop-esp32-in-vscode-with-platformio
id: cmn2tqb7z000bebxai2fd3jiw
category: tutorial
categorySlug: tutorial
tags:
  - AI
  - Video
  - Web
status: published
updatedAt: '2026-04-23T18:05:36.262Z'
---

With the aid of VScode and PlatformIO we can create and edit ESP32 projects to improve the efficiency quite a lot. It includes:

- Code highlight.
- Find the reference function with right click on it.
- Build code time is much shorter then Arduino IDE.
- Build and flash the code to the ESP32 development board.
- Debug the code by plotting the output of the serial port.

And PlatformIO supports developing ESP32 with Arduino platform or native ESP32 platform.

To develop an ESP32 project using PlatformIO and Visual Studio Code (VS Code), you will need to install both PlatformIO and VS Code on your computer.

![1671544888249](1671544888249.png)

## Install VS Code:

Download and install VS Code from the official website: https://code.visualstudio.com/

## Install PlatformIO:

- Open VS Code and click on the "Extensions" icon in the sidebar on the left.
- In the search bar, type "PlatformIO" and press Enter.
- Click on the "Install" button to install the PlatformIO extension.
- Once the installation is complete, you may be prompted to reload VS Code. Click on the "Reload" button to apply the changes.

You should now see the PlatformIO icon in the sidebar on the left. You can use this icon to access the PlatformIO Home screen, where you can create new projects, build and upload code, and access other PlatformIO features.

## Create a project

To create a new PlatformIO project for the ESP32.

- Open VS Code and click on the PlatformIO icon in the sidebar on the left.
- On the opened panel, click **Open**. It will open the PlatformIO main windows as below.

  ![1672116208773](1672116208773.png)
- Click the "**New Project**" button in the PlatformIO Home screen.

It will open a Project Wizard window shows as below

![1672115312485](1672115312485.png)

- In the field **Name**, set the name of the project as you like.
- **Board** select "**DOIT ESP32 DEVKIT V1**" from the dropdown lists.
- **Framework** select "**Arduino**"
- Click on the "**Finish**" button to create the project.

It will need some times to dowload related file from internet. Depenends on your network condition, usually 1~2 minutes.

## Develop the code

In the VS Code Explorer, you will see the directory structure of your PlatformIO project.

The main source code file is located in the `src` directory and is named `main.cpp` by default.

You can edit this file and add your code to it.

## Build and upload code to ESP32

To build your code, click on the PlatformIO icon in the bottom toolbar and then click on the `Build` button.

To upload your code to the ESP32, click on the `Upload` button.

For more information on using PlatformIO with VS Code, you can refer to the PlatformIO documentation at https://docs.platformio.org/.

<div class="video-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/hDr9EEE94UM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

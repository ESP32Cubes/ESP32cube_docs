
将这个网页的内容翻译为英文，并使用markdown源码输出，删除标题的链接，标题以2级标题开始

idf新建项目
使用模板ES8311
设置设备目标
修改GPIO

## Hardware

![[images/Pasted image 20250215222436.png]]

The development board comes with a microphone, a speaker, and the audio codec chip uses the **ES8311**. 

The ES8311 chip not only uses the I2S interface to connect with the ESP32, but also the I2C interface to connect with the ESP32. The I2C interface is used for configuration, and the I2S interface is used for audio transmission.

The ES8311 is connected to the ESP32-C3 via the I2S interface. Between the ES8311 and the speaker, there is an audio driver amplifier NS4150B. The audio amplifier is used to amplify the audio signal from the ES8311, and it is controlled by the `PA_EN` pin, which is controlled by the PCA9557 IO expander.

The only different is that on ESP32Cube S3 Box, the audio power amplifier can be controlled to turn on off by the `PA_EN`. While the `PA_EN` is set by IO Expansion device PCA9557. In order to simplify the code process, we has defined PCA9557 initialization and control functions in the `s3_box_config.h` file. You just need to include the header file `s3_box_config.h` in your code and call the initialization function `pca9557_init()`, then call the `pa_en(1)` function to enable the audio amplifier.

```cpp
#include "s3_box_config.h"
pca9557_init(); //Initialize PCA9557
pa_en(1); // Open the audio amplifier
```

![[images/Pasted image 20250216112055.png]]

![[images/Pasted image 20250216112526.png]]

The development board uses ES8311 as the audio output codec chip. The output of ES8311 is connected to MIC3 of ES7210 and the audio power amplifier.

This example demonstrates playing a short PCM format audio. Later examples will cover MP3 format playback.


idf编辑器中库的安装
激活idf工具
然后，运行从网站https://components.espressif.com/拷贝的命令

```cmd
idf.py add-dependency "lvgl/lvgl^9.2.2"
```


![[images/Pasted image 20250216175759.png]]


网络收音机地址

```
#define STATIONS_URL    "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_01"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL1   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_02"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL2   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_03"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL3   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_04"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL4   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_05"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL5   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_06"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL6   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_07"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL7   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_08"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL8   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_09"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL9   "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_10"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL10  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_11"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL11  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_12"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL12  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_13"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL13  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_14"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL14  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_15"      // Adres URL do pliku z listą stacji radiowych
#define STATIONS_URL15  "https://raw.githubusercontent.com/sarunia/ESP32_stream/main/radio_v2_bank_16"      // Adres URL do pliku z listą stacji radiowych

```
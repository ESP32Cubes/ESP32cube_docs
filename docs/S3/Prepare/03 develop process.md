
# Detailed Development Workflow

This chapter guides beginners through ESP32 development using VSCode and the Hello World example from ESP-IDF. It covers code writing, compilation, and flashing procedures, with explanations of ESP-IDF plugin functions in VSCode.

## 3.1 Preparing the Hello World Example

1. **Create Workspace**:  
   Create an English-only folder without spaces (e.g., `D:\esp32s3`).

2. **Copy Example**:  
   Locate the official `hello_world` example in `IDF/examples/get-started/` and copy to your workspace (`D:\esp32s3\hello_world`).

3. **Open Project**:  
   Two methods:
   - **Method 1**: Right-click the folder → "Open with Code"  
     ![[images/436198af51e8441dac997be4b780bebe_MD5.png]]
   - **Method 2**: VSCode → File → Open Folder  
     ![[images/842c4ba5e60a809ff4be6e228366257d_MD5.png]]

4. **Project Structure**:  
   - Delete non-essential files: `sdkconfig.ci`, `pytest_hello_world.py`
   - Key files:
     ```cmake
     # Root CMakeLists.txt
     cmake_minimum_required(VERSION 3.16)
     include($ENV{IDF_PATH}/tools/cmake/project.cmake)
     project(hello_world)
     ```
     ```cmake
     # main/CMakeLists.txt
     idf_component_register(SRCS "hello_world_main.c" INCLUDE_DIRS "")
     ```

## 3.2 Compilation and Flashing

### Configuration Steps:
1. **VSCode Bottom Bar Setup**:
   ![[images/a981367ba562a62e2a9e5cca082b98be_MD5.png]]

   | Icon | Function | 
   |---|---|
   | 1 | Select ESP-IDF version |
   | 2 | Choose COM port (e.g., COM19) |
   | 3 | Set target chip to ESP32-S3 |
   | 4 | Select flashing method: `via ESP USB Bridge` |
   | 5 | Run `menuconfig` → Set Flash size to 16MB |

2. **One-Click Operation**:  
   Click the "Three-in-One" button (compilation + flashing + terminal):
   ![[images/18a3314eb06191e4f87bc09dcd2c4388_MD5.png]]

3. **Terminal Output**:  
   Successful execution shows:
   ```shell
   Hello world!
   This is esp32s3 chip with 2 CPU core(s), WiFi/BLE, silicon revision v0.2, 16MB external flash
   Restarting in 10 seconds...
   ```

### Alternative Flashing Tool: `flash_download_tool`
1. Download from [Espressif](https://www.espressif.com.cn/zh-hans/support/download/other-tools)
2. Configuration:
   ![[images/cdc653625a03fef17acd1f16e3c791c1_MD5.png]]
   - Load three BIN files:
     - `bootloader.bin` @ 0x0
     - `hello_world.bin` @ 0x10000
     - `partition-table.bin` @ 0x8000
   - Set SPI Flash parameters: DIO mode, 80MHz

## 3.3 Source Code Analysis

**Key Code Snippets**:
```c
// Without newline (buffered output)
printf("Hello world!");
vTaskDelay(1000 / portTICK_PERIOD_MS);

// With buffer flush
printf("Hello world!");
fflush(stdout);
vTaskDelay(1000 / portTICK_PERIOD_MS);

// Proper implementation
printf("Hello world!\n");
vTaskDelay(1000 / portTICK_PERIOD_MS);
```

**Note**: Use `Ctrl + ]` to close the terminal. Code comments can be toggled with `Ctrl + /`.

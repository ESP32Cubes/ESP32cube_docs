### BOOT-KEY Button

The ESP32-S3 is packaged in QFN56, with a total of 45 GPIO pins, ranging from GPIO0 to GPIO21, and then from GPIO26 to GPIO48. Theoretically, all IOs can be used as ordinary GPIOs or multiplexed for any peripheral function. However, some pins cannot be used for other purposes after being connected to FLASH and PSRAM.

The module model used on our development board is ESP32-S3-WROOM-1-N16R8. Its FLASH is 16MB and is connected to the ESP32 via 4-wire SPI. Its PSRAM is 8MB and is connected to the ESP32 via 8-wire SPI. The FLASH and PSRAM together occupy 12 IO pins. After excluding these pins, there are 33 IOs left.

By referring to the schematic diagram of the development board, we can see the connection status of the ESP32 pins on the development board.

On the development board, there are actually 3 user-customizable IOs. One is the IO connected to the BOOT button, and the other two are GPIO10 and GPIO11 led out by the external expansion interface.

Here we use the BOOT button to learn about the GPIO function.

The GPIO of ESP32 can be used for input and output, and can be configured with internal pull-up and pull-down, and can be configured as an interrupt pin.

Here we set the IO0 pin connected to the BOOT button as a GPIO interrupt to receive button requests.

### Using the Example

Copy the 【01-boot_key】 example provided by the development board to your experiment folder and open the project with VSCode.

![[images/7ad038ffab85d72a5ef1c3bff664d588_MD5.png]]

> Note: There are red wavy lines under the header files at the top of the main.c file in the example. This is because VSCode cannot find these header files in this project. Most of these header files are located in the IDF folder. You don't need to worry about these errors, and they will not affect the compilation of the program.

Connect the development board to the computer, select the serial port number in VSCode, select the target chip as esp32s3, and choose the serial port download method. Then click the "One-click Triple Link" button and wait for compilation, download, and the terminal to open. After the terminal is opened, press the BOOT button, and you can detect the button press in the terminal and output the button's level. The following shows the last few lines:

```shell
I (305) main_task: Calling app_main()
I (305) gpio: GPIO[0]| InputEn: 1| OutputEn: 0| OpenDrain: 0| Pullup: 1| Pulldown: 0| Intr:2
I (315) main_task: Returned from app_main()
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
```

### 4.2 Example Explanation

This example is relatively simple, with only one C file. We can click to open the main.c file and see that there are only about 40 lines of code in this file.

Let's start from the app_main function. (When you look at the code written by others for a microcontroller, first find the main function, and then look at the statements in the main function from top to bottom. In this way, you can quickly understand the program written by others.)

The content of the app_main function is as follows:

```c
void app_main(void)
{
    gpio_config_t io0_conf = {
        .intr_type = GPIO_INTR_NEGEDGE, // Falling edge interrupt
        .mode = GPIO_MODE_INPUT, // Input mode
        .pin_bit_mask = 1<<GPIO_NUM_0, // Select GPIO0
        .pull_down_en = 0, // Disable internal pull-down
        .pull_up_en = 1 // Enable internal pull-up
    };
    // Configure GPIO0 according to the above settings
    gpio_config(&io0_conf);

    // Create a queue to handle GPIO events
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    // Start the GPIO task
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);
    // Create a GPIO interrupt service
    gpio_install_isr_service(0);
    // Add an interrupt handler to GPIO0
    gpio_isr_handler_add(GPIO_NUM_0, gpio_isr_handler, (void*) GPIO_NUM_0);
}
```

From line 3 to line 9, we define a GPIO structure variable and assign values to its members.

On line 11, we configure GPIO0.

On line 14, we create a queue to handle GPIO events.

On line 16, we create a GPIO task function.

On line 18, we create a GPIO interrupt service.

On line 20, we add an interrupt handler to GPIO0. Here, the first parameter indicates which pin you want to add the interrupt function to. The second parameter, gpio_isr_handler, is the name of the interrupt service function. The third parameter is the parameter passed to this interrupt service function when the pin specified by the first parameter has an interrupt.

In the above code, we create a queue, a task function, and an interrupt service function. The queue handle and the two functions are located before the app_main function in the main.c file, as shown below:

```c
static QueueHandle_t gpio_evt_queue = NULL;  // Define the queue handle

// GPIO interrupt service function
static void IRAM_ATTR gpio_isr_handler(void* arg)
{
    uint32_t gpio_num = (uint32_t) arg;  // Get the input parameter
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL); // Send the value of the input parameter to the queue
}

// GPIO task function
static void gpio_task_example(void* arg)
{
    uint32_t io_num; // Define a variable to indicate which GPIO
    for(;;) {
        if(xQueueReceive(gpio_evt_queue, &io_num, portMAX_DELAY)) {  // Wait indefinitely for a queue message
            printf("GPIO[%"PRIu32"] intr, val: %d\n", io_num, gpio_get_level(io_num)); // Print relevant information
        }
    }
}
```

After the task function is created in the main function, the task function starts to execute. After entering the task function, we first define a variable and then enter the following for loop. The for loop is written as an infinite loop, indicating that the task will be executed continuously here. Inside the if conditional statement, we use xQueueReceive to receive queue messages. Since the last parameter is portMAX_DELAY, it will wait here until there is data in the queue.

When we press the BOOT button, the program will enter the interrupt service function. From the code in the main function above, we know that for the interrupt caused by GPIO0, the input parameter is GPIO_NUM_0. Essentially, this is a macro definition, and the value is 0. So the input parameter when entering the interrupt service function is 0, that is, gpio_num is assigned the value of 0. Then the next statement is executed to send the data 0 to the queue. Since this is in the interrupt service function, we need to use xQueueSendFromISR instead of xQueueSend.

After the queue message is sent, xQueueReceive in the task function will immediately receive the queue message, and then the printf statement inside the if block will be executed to print the message. Here, in the printf statement, there are two variables to be printed, one is io_num, and the other is the return value of the gpio_get_level function.

We just learned that the data in the queue message is 0, so io_num here is 0.

gpio_get_level(io_num) is actually gpio_get_level(0), which means getting the level state of GPIO0. The final printed result is what you saw in the terminal just now.

Here, there is a symbol `%"PRIu32"`. It is a macro used for formatted output in the C language and is used to print 32-bit unsigned integers. It was introduced by the C99 standard and is located in the inttypes.h header file. When using this macro, you need to include the inttypes.h header file.

If we don't use the `%"PRIu32"` symbol here and use `%d` instead, a compilation error will occur because `%d` represents an int type data, while we want to print a uint32_t type data.

Next, let's take a look at its header files:

```c
#include <stdio.h>
#include <inttypes.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"
```

To use printf, we need to include the stdio.h header file.

To use the `%"PRIu32"` symbol, we need to include the inttypes.h header file.

The code uses FreeRTOS tasks and FreeRTOS queues, so we include the relevant header files.

The code uses the GPIO peripheral, so we include the driver/gpio.h header file, which is located in the IDF folder.

That's all for the introduction of this example program.

### 4.3 例程制作过程[​](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/key.html#_4-3-%E4%BE%8B%E7%A8%8B%E5%88%B6%E4%BD%9C%E8%BF%87%E7%A8%8B)

总的来说，该例程是使用 IDF 例程中的 sample_project 工程（看工程名字就可以知道，这是一个“样例工程”）作为模板，参考例程是 IDF 例程中的 generic_gpio 例程，都是从这个例程中复制粘贴修改而来。

我们复制官方例程中的 sample_project 工程，工程路径为 examples\get-started\sample_project。把这个文件夹的名称修改为 01-boot_key，或者 boot_key。01 表示这是第 1 个例程，加 01 是为了工程例程多了以后看起来整洁，加不加都可以。修改后我的工程路径为 D:\esp32s3\01-boot_key。

使用 VSCode 打开 boot_key 这个文件夹。单击打开工程一级目录下的 CMakeLists.txt 文件（注意不是 main 目录下的），然后我们把工程名字修改为 gpio_key，保存后关闭此文件。

```c
project(boot_key)
```

点击打开 main.c 文件，发现里面只写了这么几行代码：

```c
#include <stdio.h>

void app_main(void)
{

}
```

我们现在需要实现按键中断，比较简单，所以在这个工程上写就可以了。

现在再打开一个 VSCode 软件，然后打开 esp-idf 整个工程文件夹，然后我们依次找到 examples\peripherals\gpio\generic_gpio 这个工程作为参考，注意不要修改这个工程中的内容和配置，只是作为参考。

我们单击 gpio_example_main.c 打开这个文件，找到 app_main 函数。

复制它的前几行语句（第 80~93 行）到我们自己的 gpio_key 工程中，这几行语句如下所示：

```c
#include <stdio.h>

void app_main(void)
{
    //zero-initialize the config structure.
    gpio_config_t io_conf = {};
    //disable interrupt
    io_conf.intr_type = GPIO_INTR_DISABLE;
    //set as output mode
    io_conf.mode = GPIO_MODE_OUTPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    io_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL;
    //disable pull-down mode
    io_conf.pull_down_en = 0;
    //disable pull-up mode
    io_conf.pull_up_en = 0;
    //configure GPIO with the given settings
    gpio_config(&io_conf);
}
```

然后按照开发板上 BOOT 按键连接的是 GPIO0 进行修改。

第 1 条语句，定义了一个 gpio_config_t 结构体变量。

第 2 条语句，定义引脚中断类型。开发板上的按键没有按下的时候是高电平，按下去以后是低电平，我们定义成下降沿中断。这里原来是 GPIO_INTR_DISABLE，表示中断关闭，这里我们修改为 GPIO_INTR_NEGEDGE，即下降沿中断。这些宏定义在 gpio_types.h 文件中被定义，我们在 gpio_example_main.c 文件中的 GPIO_INTR_DISABLE 上单击右键，然后选择“转到定义”，就可以找到这几个宏定义，如下所示：

> 注意：这里是在 esp-idf 整个工程的这个 VSCode 里面单击右键“转到定义”，而不是在 boot_key 工程里面。

```c
typedef enum {
    GPIO_INTR_DISABLE = 0,     /*!< Disable GPIO interrupt                             */
    GPIO_INTR_POSEDGE = 1,     /*!< GPIO interrupt type : rising edge                  */
    GPIO_INTR_NEGEDGE = 2,     /*!< GPIO interrupt type : falling edge                 */
    GPIO_INTR_ANYEDGE = 3,     /*!< GPIO interrupt type : both rising and falling edge */
    GPIO_INTR_LOW_LEVEL = 4,   /*!< GPIO interrupt type : input low level trigger      */
    GPIO_INTR_HIGH_LEVEL = 5,  /*!< GPIO interrupt type : input high level trigger     */
    GPIO_INTR_MAX,
} gpio_int_type_t;
```

第 3 条语句是配置模式，这里的模式是 GPIO_MODE_OUTPUT，我们修改为 GPIO_MODE_INPUT 输入模式。

第 4 条语句是配置选择哪个引脚，这里我们把 GPIO_OUTPUT_PIN_SEL 修改为 1<<GPIO_NUM_0，因为 BOOT 按键连接到了 GPIO0。

第 5、6 条语句配置是否打开上下拉电阻，0 是关闭，1 是打开，我们把上拉打开。

前面都是给结构体成员变量赋值，最后一句使用 gpio_config 函数进行配置。

改完以后的代码如下：

```c
void app_main(void)
{
    //zero-initialize the config structure.
    gpio_config_t io_conf = {};
    //falling edge interrupt
    io_conf.intr_type = GPIO_INTR_NEGEDGE;
    //set as input mode
    io_conf.mode = GPIO_MODE_INPUT;
    //bit mask of the pins GPIO0
    io_conf.pin_bit_mask = 1<<GPIO_NUM_0;
    //disable pull-down mode
    io_conf.pull_down_en = 0;
    //enable pull-up mode
    io_conf.pull_up_en = 1;
    //configure GPIO with the given settings
    gpio_config(&io_conf);
}
```

上面的代码，总结来说一下，就是先定义一个 GPIO 结构体，然后给 GPIO 结构体成员变量赋值，然后使用 GPIO 配置函数配置 GPIO。给结构体成员变量赋值，也可以在定义的时候直接赋值，也就是可以把前面的代码改成如下所示代码。

```c
void app_main(void)
{
    gpio_config_t io_conf = {
        .intr_type = GPIO_INTR_NEGEDGE, //falling edge interrupt
        .mode = GPIO_MODE_INPUT, //set as input mode
        .pin_bit_mask = 1<<GPIO_NUM_0, //bit mask of the pins GPIO0
        .pull_down_en = 0, //disable pull-down mode
        .pull_up_en = 1 //enable pull-up mode
    };
    //configure GPIO with the given settings
    gpio_config(&io_conf);
}
```

接下来，我们再复制 gpio_example_main.c 文件中的第 108~116 行代码到我们的 main.c 文件中，放到刚才复制的代码后面就行。

c

```
//create a queue to handle gpio event from isr
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    //start gpio task
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);

    //install gpio isr service
    gpio_install_isr_service(ESP_INTR_FLAG_DEFAULT);
    //hook isr handler for specific gpio pin
    gpio_isr_handler_add(GPIO_INPUT_IO_0, gpio_isr_handler, (void*) GPIO_INPUT_IO_0);
```

接下来我们修改这几行语句。

第 1 条代码，创建了一个队列，队列消息数量为 10，gpio_evt_queue 是队列句柄，一会儿需要我们在 main 函数外面定义。

第 2 条代码，创建了一个任务，任务名称为 gpio_task_example。

第 3 条代码，启动 GPIO 中断服务，其中 ESP_INTR_FLAG_DEFAULT 的值是 0，这个宏定义是在 gpio_example_main.c 文件中定义的，我们可以直接把这里改成 0，也可以把这个宏定义复制到我们的 main.c 文件中。

第 4 条代码，添加某个 GPIO 的中断，这里我们添加 GPIO0，第 1 个和第 3 个参数，都修改为 GPIO_NUM_0。第 1 个参数指定哪个 GPIO 产生中断。第 2 个参数是中断服务函数的名称，我们之后会以这个名称定义函数。第 3 个参数是中断服务函数的参数，我们定义了 GPIO_NUM_0，发生中断时，这个值将作为参数进入中断服务函数。

修改后的代码如下：

```c
void app_main(void)
{
    gpio_config_t io_conf = {
        .intr_type = GPIO_INTR_NEGEDGE, //falling edge interrupt
        .mode = GPIO_MODE_INPUT, //set as input mode
        .pin_bit_mask = 1<<GPIO_NUM_0, //bit mask of the pins GPIO0
        .pull_down_en = 0, //disable pull-down mode
        .pull_up_en = 1 //enable pull-up mode
    };
    //configure GPIO with the given settings
    gpio_config(&io_conf);

    //create a queue to handle gpio event from isr
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    //start gpio task
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);

    //install gpio isr service
    gpio_install_isr_service(0);
    //hook isr handler for specific gpio pin
    gpio_isr_handler_add(GPIO_NUM_0, gpio_isr_handler, (void*) GPIO_NUM_0);
}
```

接下来，我们在 app_main 函数的上方添加队列、中断等相关的代码。复制 gpio_example_main.c 中的第 60~76 行到我们的 main.c 文件中，放到 app_main 函数的上方。

```c
static QueueHandle_t gpio_evt_queue = NULL;

static void IRAM_ATTR gpio_isr_handler(void* arg)
{
    uint32_t gpio_num = (uint32_t) arg;
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
}

static void gpio_task_example(void* arg)
{
    uint32_t io_num;
    for(;;) {
        if(xQueueReceive(gpio_evt_queue, &io_num, portMAX_DELAY)) {
            printf("GPIO[%"PRIu32"] intr, val: %d\n", io_num, gpio_get_level(io_num));
        }
    }
}
```

这些内容，不需要做修改。

接下来，我们再把需要的头文件添加到我们的 main.c 文件就可以了。

我们复制 gpio_example_main.c 中的第 9~16 行到我们的 main.c 文件中，放到 main.c 文件的最上方。

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <inttypes.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"
```

使用 printf 函数，需要添加 stdio.h 头文件。string.h 和 stdlib.h 我们这里用不着，可以去掉。接下来是 3 个 freeRTOS 的头文件，最后一个头文件是用于 gpio 的配置。

操作完上面的代码，就可以编译下载看结果了。

这里需要注意的是，menuconfig 里面，需要把 FLASH 大小设置为 16MB，默认是 2MB，其它不用修改。

编译下载后，结果没有问题的话，使用 idf.py save-defconfig 命令生成 sdkconfig.defaults 文件。这个命令要打开“命令终端”执行，看结果的“串口终端”不行。打开“命令终端”的按钮如下所示：

![[images/b60594b143792d5c4d1911f4a7389ca2_MD5.png]]

打开终端后，输入 idf.py save-defconfig 命令。

![[images/64f9d9a01c27658438c6266d32b59271_MD5.png]]

回车执行命令后，会看到工程中多了一个 sdkconfig.defaults 文件。

![[images/0bbd185a5a09eb4929ba5660bbe39bf0_MD5.png]]

点击打开 sdkconfig.defaults 文件，会看到里面的内容。这个文件里面包含了你对 menuconfig 的修改。

这时候，你可以把工程中配置和编译生成的文件夹全部去掉，最后的文件如下所示：

![[images/c22cea6d041b3a69d72ea985c9cec83c_MD5.png]]

使用 VSCode 重新打开工程，在选择目标芯片后，sdkconfig.defaults 文件里面的配置就配置到 menuconfig 里面了，省去了手动配置 menucofig。本例程只配置了 FLASH 大小，后面的例程中，menuconfig 里面配置的内容会越来越多，到那时，这个文件就显得很有必要了。
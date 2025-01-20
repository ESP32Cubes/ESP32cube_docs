## BOOT-KEY 按键

ESP32-S3 是 QFN56 封装，GPIO 引脚一共有 45 个，从 GPIO0 到 GPIO21，再从 GPIO26 到 GPIO48。理论上，所有的 IO 都可以作为普通 GPIO 使用，或者复用为任何外设功能使用，但有些引脚用作连接 FLASH 和 PSRAM 后，就不能再做其它用途了。

我们开发板上使用的模组型号是 ESP32-S3-WROOM-1-N16R8，它的 FLASH 为 16MB，与 ESP32 采用 4 线制 SPI 连接，它的 PSRAM 为 8MB，与 ESP32 采用 8 线制 SPI 连接。FLASH 与 PSRAM 一共占用了 12 个 IO 引脚。除去这些引脚，IO 就剩下 33 个了。

通过开发板的原理图，可以看到开发板上的 ESP32 引脚连接情况。

在开发板上，实际上引出了 3 个我们可以用户自定义的 IO，一个是 BOOT 按键连接的 IO，另外两个是外扩接口引出的 GPIO10 和 11。

这里我们使用 BOOT 按键，来学习一下 GPIO 功能。

ESP32 的 GPIO，可以用作输入、输出，可以配置内部上拉、下拉，可以配置为中断引脚。

这里我们把连接 BOOT 按键的 IO0 引脚，设置为 GPIO 中断，接收按键请求。

### 使用例程

把开发板提供的【01-boot_key】例程复制到你的实验文件夹当中，并使用 VSCode 打开工程。

![[images/7ad038ffab85d72a5ef1c3bff664d588_MD5.png]]

> 注意：例程中 main.c 文件最上方的头文件底部，都有红色波浪线报错，这是因为 VSCode 没有在这个工程中发现这些头文件，这些头文件大部分位于 IDF 文件夹里面，这里的错误不必理会，不会影响程序的编译。

连接开发板到电脑，在 VSCode 上选择串口号，选择目标芯片为 esp32s3，串口下载方式，然后点击“一键三联”按钮，等待编译下载打开终端。终端打开后，按 BOOT 按键，就可以在终端检测到按键按下，并输出按键的电平，如下所示，截取了最后几行。

```shell
I (305) main_task: Calling app_main()
I (305) gpio: GPIO[0]| InputEn: 1| OutputEn: 0| OpenDrain: 0| Pullup: 1| Pulldown: 0| Intr:2
I (315) main_task: Returned from app_main()
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
GPIO[0] intr, val: 0
```

### 4.2 例程讲解[​](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/key.html#_4-2-%E4%BE%8B%E7%A8%8B%E8%AE%B2%E8%A7%A3)

该例程比较简单，只有一个 c 文件。我们点击打开 main.c 文件，可以看到在这个文件中也只有 40 多行代码。

我们从 app_main 函数开始看起。（当你看别人写的单片机代码时，先找到主函数，然后按照从上到下的顺序，看主函数中的语句，就能快速的读懂别人写的程序。）

app_main 函数内容如下所示：

```c
void app_main(void)
{
    gpio_config_t io0_conf = {
        .intr_type = GPIO_INTR_NEGEDGE, // 下降沿中断
        .mode = GPIO_MODE_INPUT, // 输入模式
        .pin_bit_mask = 1<<GPIO_NUM_0, // 选择GPIO0
        .pull_down_en = 0, // 禁能内部下拉
        .pull_up_en = 1 // 使能内部上拉
    };
    // 根据上面的配置 设置GPIO
    gpio_config(&io0_conf);

    // 创建一个队列处理GPIO事件
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    // 开启GPIO任务
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);
    // 创建GPIO中断服务
    gpio_install_isr_service(0);
    // 给GPIO0添加中断处理
    gpio_isr_handler_add(GPIO_NUM_0, gpio_isr_handler, (void*) GPIO_NUM_0);
}
```

第 3 行~第 9 行，定义一个 gpio 结构体变量，并给该结构体变量成员赋值。

第 11 行，配置好 GPIO0。

第 14 行，创建一个队列处理 GPIO 事件。

第 16 行，创建一个 GPIO 任务函数。

第 18 行，创建 GPIO 中断服务。

第 20 行，给 GPIO0 添加中断处理。其中，第 1 个参数，表示你要给哪个引脚添加中断功能。第 2 个参数 gpio_isr_handler 是中断服务函数名称。第 3 个参数是当第 1 个参数指定的引脚发生中断时，输送给此中断服务函数的参数。

以上代码中，创建了一个队列，一个任务函数，一个中断服务函数。队列句柄，以及两个函数都位于 main.c 文件中 app_main 函数的前面。如下所示：

```c
static QueueHandle_t gpio_evt_queue = NULL;  // 定义队列句柄

// GPIO中断服务函数
static void IRAM_ATTR gpio_isr_handler(void* arg)
{
    uint32_t gpio_num = (uint32_t) arg;  // 获取入口参数
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL); // 把入口参数值发送到队列
}

// GPIO任务函数
static void gpio_task_example(void* arg)
{
    uint32_t io_num; // 定义变量 表示哪个GPIO
    for(;;) {
        if(xQueueReceive(gpio_evt_queue, &io_num, portMAX_DELAY)) {  // 死等队列消息
            printf("GPIO[%"PRIu32"] intr, val: %d\n", io_num, gpio_get_level(io_num)); // 打印相关内容
        }
    }
}
```

主函数中创建任务函数后，任务函数就开始执行了。进入任务函数后，先定义了一个变量，然后就进入下面的 for 循环了。for 循环被写成了死循环，表示一直到这里执行任务。进入 if 条件语句里面，这里使用 xQueueReceive 接收队列消息，因为最后一个参数是 portMAX_DELAY，在队列中没有数据时，会一直在这里等待。

当我们按下 BOOT 按键后，程序会进入中断服务函数中运行。从前面主函数中的代码得知，GPIO0 引起的中断，入口参数是 GPIO_NUM_0，这个本质是一个宏定义，数字是 0，所以进入中断服务函数的入口参数就是 0，即给 gpio_num 赋值为 0。然后执行下一条语句，给队列中发送数据 0，因为这里是在中断服务函数，所以要使用 xQueueSendFromISR，而不是 xQueueSend。

发送完队列消息后，任务函数中的 xQueueReceive 会立即收到队列消息，然后就开始执行 if 里面的 printf 语句，打印消息。这里的 printf 里面，有两个变量需要打印出来，一个是 io_num，另外一个是 gpio_get_level 函数的返回值。

刚才我们知道了队列消息中的数据是 0，所以这里的 io_num 就是 0。

gpio_get_level(io_num)，就是 gpio_get_level(0)，即获取 GPIO0 的电平状态。最后打印的结果，就是你刚才在终端看到的结果。

这里有一个 `%"PRIu32"` 符号，是 C 语言中用于格式化输出的宏，用于打印 32 位无符号整数。它是由 C99 标准引入的，位于 inttypes.h 头文件中。在使用该宏时，需要包含 inttypes.h 头文件。

如果这里不使用 `%"PRIu32"` 符号，而是使用 `%d`，编译的时候就会报错，因为 `%d` 表示的是 int 型数据，而我们要打印的是 uint32_t 型数据。

接下来看一下它的头文件：

```c
#include <stdio.h>
#include <inttypes.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"
```

使用 printf，需要包含 stdio.h 头文件。

使用 `%"PRIu32"` 符号，需要包含 inttypes.h 头文件。

代码中使用了 freeRTOS 任务，freeRTOS 队列，包含相关头文件。

代码中使用了 GPIO 外设，包含 driver/gpio.h 头文件，该头文件位于 IDF 文件夹中。

以上就是本例程程序的全部介绍了。

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
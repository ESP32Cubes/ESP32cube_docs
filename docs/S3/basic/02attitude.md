# 第 5 章 姿态传感器 [](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/attitude-sensor.html#%E7%AC%AC-5-%E7%AB%A0-%E5%A7%BF%E6%80%81%E4%BC%A0%E6%84%9F%E5%99%A8)

利用姿态传感器可以感知开发板是否被拿起，可以感受是否受到震动，以及感受到开发板是立起来还是平躺、以及是否在静放还是运动过程中等等。有了它，就可以做一些智能化的项目。

开发板上的姿态传感器型号是 QMI8658，内部集成 3 轴加速度传感器和 3 轴陀螺仪传感器，支持 SPI 和 I2C 通信，在我们的开发板上使用的是 I2C 通信，ESP32-S3 只有 1 个 I2C 外设，我们开发板上的所有 I2C 设备，都使用同一个 I2C 通信接口，通过 I2C 设备的地址，来决定和谁通信，QMI8658 的 7 位 I2C 地址是 0x6A。

本例程，我们将最终完成测量 XYZ 三个轴的倾角检测，并把倾角数据通过串口传输到终端打印显示。

### 5.1 使用例程 [](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/attitude-sensor.html#_5-1-%E4%BD%BF%E7%94%A8%E4%BE%8B%E7%A8%8B)

把开发板提供的【02-attitude】例程复制到你的实验文件夹当中，并使用 VSCode 打开工程。

![[images/966ea7bd0e142004557c0120b0bd79f7_MD5.png]]

连接开发板到电脑，在 VSCode 上选择串口号，选择目标芯片为 esp32s3，串口下载方式，然后点击“一键三联”按钮，等待编译下载打开终端。

终端自动打开后，每隔一秒自动输出 XYZ 三个轴的倾角角度，如下所示：

shell

```
I (309) main_task: Calling app_main()
I (309) main: I2C initialized successfully
I (319) esp32_s3_szp: QMI8658 OK!
I (1329) main: angle_x = 3.3  angle_y = 0.2 angle_z = 3.3
I (2329) main: angle_x = 3.4  angle_y = 0.1 angle_z = 3.4
I (3329) main: angle_x = 3.2  angle_y = 0.2 angle_z = 3.3
I (4329) main: angle_x = 3.4  angle_y = 0.1 angle_z = 3.4
I (5329) main: angle_x = 3.2  angle_y = 0.0 angle_z = 3.2
```

调整开发板方向，可以看到数值在变化，理论上，每个轴的数字会从-90° 到 +90° 变化。

姿态传感器 QMI8658 在电路板上的位置如下图所示，小圆点位于芯片左下角。

![[images/3920ab9595cbf1709d999d2c4011eb92_MD5.png]]

下图是芯片各个轴的坐标方向图。

![[images/454dd799faa4de3001d7c129e251c303_MD5.png]]

X 和 Y 方向的倾角数据，分别是 X 和 Y 轴相对于 XY 平面的夹角大小，也就是相对于水平面的倾角大小。

Z 方向的倾角数据，并不是相对于水平面的夹角，而是重力矢量与 Z 轴的夹角。

### 5.2 例程讲解 [](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/attitude-sensor.html#_5-2-%E4%BE%8B%E7%A8%8B%E8%AE%B2%E8%A7%A3)

在 main 文件夹下，除了 main.c 文件以外，还有两个文件，分别是 esp32\_s3\_szp.c 和 esp32\_s3\_szp.h 文件。esp32\_s3\_szp 中的 szp，是“实战派”的拼音首字母，表示这个文件是开发板的支持文件。

传感器芯片 qmi8658 与 esp32 之间使用 I2C 通信，esp32\_s3\_szp 文件中有两部分内容，一个是 I2C 驱动部分，一个是 QMI8658 驱动部分。

点击打开 main.c 文件，文件中的代码如下所示：


```c
#include "esp32_s3_szp.h"

static const char *TAG = "main"; // 在终端看到main表示这条信息是从main.c文件中输出的

t_sQMI8658 QMI8658; // 定义QMI8658结构体变量

void app_main(void)
{
    ESP_ERROR_CHECK(bsp_i2c_init());  // 初始化I2C总线
    ESP_LOGI(TAG, "I2C initialized successfully"); // 输出I2C初始化成功的信息

    qmi8658_init(); // 初始化qmi8658芯片

    while (1)
    {
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // 延时1000ms
        qmi8658_fetch_angleFromAcc(&QMI8658);   // 获取XYZ轴的倾角
        // 输出XYZ轴的倾角
        ESP_LOGI(TAG, "angle_x = %.1f  angle_y = %.1f angle_z = %.1f",QMI8658.AngleX, QMI8658.AngleY, QMI8658.AngleZ);
    }
}
```

找到 app\_main 主函数，从上往下浏览。

bsp\_i2c\_init()函数用来初始化 I2C 总线，函数定义位于 esp32\_s3\_szp.c 文件中。把鼠标放到 bsp\_i2c\_init()语句上方单击右键，在弹出的菜单中选择“转到定义”可以快速的找到函数的定义。（或者点击 F12）



```c
esp_err_t bsp_i2c_init(void)
{
    i2c_config_t i2c_conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = BSP_I2C_SDA,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = BSP_I2C_SCL,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = BSP_I2C_FREQ_HZ
    };
    i2c_param_config(BSP_I2C_NUM, &i2c_conf);

    return i2c_driver_install(BSP_I2C_NUM, i2c_conf.mode, 0, 0, 0);
}
```

在 I2C 的初始化代码中，定义了 I2C 使用的引脚，I2C 主机模式，I2C 引脚是否开启上拉电阻，I2C 的时钟频率。如果硬件 PCB 上的 I2C 总线没有接上拉电阻，这个地方必须打开上拉电阻，如果硬件 PCB 上的 I2C 总线接了上拉电阻，这里开不开上拉电阻，都行。

先执行 i2c\_param\_config 函数，再执行 i2c\_driver\_install 函数，I2C 就配置好了，这两个函数位于 IDF 工程文件夹中，在这里右键“转到定义”是打不开的，你要看原函数定义，需要使用另外一个 VSCode 打开 esp-idf 工程文件夹。

回到主函数中，我们看到在 bsp\_i2c\_init 函数是作为 ESP\_ERROR\_CHECK 的参数运行的。

ESP\_ERROR\_CHECK 是一个宏函数，位于 esp-idf 文件中，用于检测执行函数的返回结果，如果没有错误，什么事情都不会发生，如果有错误，会引起单片机重启。使用这个宏函数，需要包含 esp\_err.h 头文件。

主函数中的第 2 条语句使用 ESP\_LOGI 打印日志，作用相当于我们熟悉的 printf。ESP\_LOGI 的第 1 个参数可以用于表示这个日志是哪个文件打印出来的，例如我们这里把第一个参数定义成了 main，表示从 main.c 文件中输出的日志。第 2 个参数是要打印的字符串内容。除了 ESP\_LOGI 还有 ESP\_LOGE 等，I 表示输出一般信息，E 表示输出错误，在终端中显示的颜色也不一样，I 显示的是绿色，E 显示的是红色。

回到主函数继续往下，使用 qmi8658\_init()函数初始化传感器 qmi8658。



```c
// 初始化qmi8658
void qmi8658_init(void)
{
    uint8_t id = 0; // 芯片的ID号

    qmi8658_register_read(QMI8658_WHO_AM_I, &id ,1); // 读芯片的ID号
    while (id != 0x05)  // 判断读到的ID号是否是0x05
    {
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // 延时1秒
        qmi8658_register_read(QMI8658_WHO_AM_I, &id ,1); // 读取ID号
    }
    ESP_LOGI(TAG, "QMI8658 OK!");  // 打印信息

    qmi8658_register_write_byte(QMI8658_RESET, 0xb0);  // 复位
    vTaskDelay(10 / portTICK_PERIOD_MS);  // 延时10ms
    qmi8658_register_write_byte(QMI8658_CTRL1, 0x40); // CTRL1 设置地址自动增加
    qmi8658_register_write_byte(QMI8658_CTRL7, 0x03); // CTRL7 允许加速度和陀螺仪
    qmi8658_register_write_byte(QMI8658_CTRL2, 0x95); // CTRL2 设置ACC 4g 250Hz
    qmi8658_register_write_byte(QMI8658_CTRL3, 0xd5); // CTRL3 设置GRY 512dps 250Hz
}
```

首先读取 ID 号判断芯片是否存在，如果存在，说明硬件没有问题。

然后配置传感器的相关内容，具体配置了哪些内容，看函数中语句的注释就可以，结果 qmi8658 的 datasheet，就可以知道的更具体了。

在这个 qmi8658 初始化函数中，又出现了两个函数，分别是 qmi8658 写寄存器和读寄存器函数。这两个函数位于初始化函数的上方，调用 esp-idf 提供的 I2C 读写函数实现。



```c
// 读取QMI8658寄存器的值
esp_err_t qmi8658_register_read(uint8_t reg_addr, uint8_t *data, size_t len)
{
    return i2c_master_write_read_device(BSP_I2C_NUM, QMI8658_SENSOR_ADDR,  &reg_addr, 1, data, len, 1000 / portTICK_PERIOD_MS);
}

// 给QMI8658的寄存器写值
esp_err_t qmi8658_register_write_byte(uint8_t reg_addr, uint8_t data)
{
    uint8_t write_buf[2] = {reg_addr, data};

    return i2c_master_write_to_device(BSP_I2C_NUM, QMI8658_SENSOR_ADDR, write_buf, sizeof(write_buf), 1000 / portTICK_PERIOD_MS);
}
```

再回到主函数，继续往下看，进入 while 死循环。间隔 1 秒钟，读取一次 XYZ 轴的倾角值，并打印到终端。

qmi8658\_fetch\_angleFromAcc 函数用于获取 XYZ 三轴的倾角值，倾角值并不是直接从芯片的寄存器中读出来的，读出来寄存器值以后，还需要通过公式计算和转换才能得到倾角值。读寄存器和转换的函数定义如下：



```c
// 读取加速度和陀螺仪寄存器值
void qmi8658_Read_AccAndGry(t_sQMI8658 *p)
{
    uint8_t status, data_ready=0;
    int16_t buf[6];

    qmi8658_register_read(QMI8658_STATUS0, &status, 1); // 读状态寄存器
    if (status & 0x03) // 判断加速度和陀螺仪数据是否可读
        data_ready = 1;
    if (data_ready == 1){  // 如果数据可读
        data_ready = 0;
        qmi8658_register_read(QMI8658_AX_L, (uint8_t *)buf, 12); // 读加速度和陀螺仪值
        p->acc_x = buf[0];
        p->acc_y = buf[1];
        p->acc_z = buf[2];
        p->gyr_x = buf[3];
        p->gyr_y = buf[4];
        p->gyr_z = buf[5];
    }
}

// 获取XYZ轴的倾角值
void qmi8658_fetch_angleFromAcc(t_sQMI8658 *p)
{
    float temp;

    qmi8658_Read_AccAndGry(p); // 读取加速度和陀螺仪的寄存器值
    // 根据寄存器值 计算倾角值 并把弧度转换成角度
    temp = (float)p->acc_x / sqrt( ((float)p->acc_y * (float)p->acc_y + (float)p->acc_z * (float)p->acc_z) );
    p->AngleX = atan(temp)*57.29578f; // 180/π=57.29578
    temp = (float)p->acc_y / sqrt( ((float)p->acc_x * (float)p->acc_x + (float)p->acc_z * (float)p->acc_z) );
    p->AngleY = atan(temp)*57.29578f; // 180/π=57.29578
    temp = sqrt( ((float)p->acc_x * (float)p->acc_x + (float)p->acc_y * (float)p->acc_y) ) / (float)p->acc_z;
    p->AngleZ = atan(temp)*57.29578f; // 180/π=57.29578
}
```

先看 qmi8658\_Read\_AccAndGry 函数，读取加速度和陀螺仪的寄存器值。这里运用了一个技巧，一开始定义的数组 buf，它有 6 个 16 位的元素（`int16_t buf[6];`）。在后面读取寄存器的时候，给 buf 里面读取了 12 个 8 位的寄存器值（`qmi8658_register_read(QMI8658_AX_L, (uint8_t *)buf, 12);`）。再分别给加速度和陀螺仪赋值的时候，又是以 16 位值赋值的（`p->acc_x = buf[0];`）。

在读取寄存器值的时候，只给了一个首地址 `QMI8658_AX_L`，然后连续读了 12 个字节。我们看一下寄存器定义，位于 esp32\_s3\_szp.h 文件中，在 `QMI8658_AX_L` 上单击右键转到定义（或者按 F12）就可以找到。如下所示：



```c
.......
    QMI8658_AX_L,
    QMI8658_AX_H,
    QMI8658_AY_L,
    QMI8658_AY_H,
    QMI8658_AZ_L,
    QMI8658_AZ_H,
    QMI8658_GX_L,
    QMI8658_GX_H,
    QMI8658_GY_L,
    QMI8658_GY_H,
    QMI8658_GZ_L,
    QMI8658_GZ_H,
    ......
```

A 轴的 X 值，是一个 16 位数，先读低字节，后读高字节。其它也一样。

接着再看一下 qmi8658\_fetch\_angleFromAcc 函数。在这个函数中，先调用了读取寄存器值的函数，然后再带入公式计算并转换。

计算公式如下图所示：

![[images/6859951dcf35d4bc596d8ceb87d60687_MD5.png]]

函数中计算倾角的语句，就是根据这个公式写的。公式计算出的结果，单位是弧度。弧度乘以 180/π 就是角度。在函数中，我们已经把 180/π 计算出来了带进去了，给单片机节省一点点计算时间。

这里只使用了加速度值计算倾角，适合传感器处于静止、低速、匀速场合下看结果，如果是震动情况下，这里的值会有很大误差，需要融合陀螺仪值计算才可以。

回到主函数中，计算好倾角后，使用 ESP\_LOGI 打印日志。这里的 ESP\_LOGI 与最开始那个 ESP\_LOGI 相比，加了格式化输出。

### 5.3 例程制作过程 [](https://wiki.lckfb.com/zh-hans/szpi-esp32s3/beginner/attitude-sensor.html#_5-3-%E4%BE%8B%E7%A8%8B%E5%88%B6%E4%BD%9C%E8%BF%87%E7%A8%8B)

姿态传感器例程，我们还是使用 sample project 作为模板，复制 sample\_project 这个工程到我们的实验文件夹，然后把这个文件夹的名称修改为 02-attitude，attitude 是姿态的意思。修改后我的工程路径为 D:\\esp32s3\\02-attitude。

使用 VSCcode 软件打开 02-attitude 文件夹，准备对其进行修改。

我们先点击打开一级目录下的 CMakeList.txt 文件，修改工程的名称为 attitude，然后保存关闭此文件。

我们在工程中新建 2 个文件，分别是 esp32\_s3\_szp.c 和 esp32\_s3\_szp.h，用来存放开发板相关的配置函数。名称中的 szp 是“实战派”的拼音首字母。

在 main 上单击右键，在弹出的菜单中选择“新建文件”就可以。

![[images/6c425de29cc3c55ec0b1efb6e03b8f6a_MD5.png]]

把新建好的文件命名为 esp32\_s3\_szp.c 和 esp32\_s3\_szp.h，如下图所示：

![[images/69b3b9de26ab12b028950ad138ff99d1_MD5.png]]

然后打开 main 下的 CMakeLists.txt 文件，把 esp32\_s3.c 文件写进去，正常情况下，会自动写入。

![[images/be69e1ebd76a862e0ad3d986147cd9f1_MD5.png]]

点击打开在 esp32\_s3\_szp.h 文件，在它的最上边写入 `#pragma once`，表示本头文件只可以包含一次，相当于 `#ifndef #define #endif`

QMI8658 需要用到 I2C 通信，所以我们把 I2C 通信相关代码写到 esp32\_s3\_szp 的.c 和.h 文件中，参考 IDF 官方例程中的相关 I2C 代码就可以，参考文件路径为：examples\\peripherals\\i2c\\i2c\_simple

写好后的 esp32\_s3\_szp.c 文件内容如下所示：



```c
#include <stdio.h>
#include "esp32_s3_szp.h"
#include "esp_err.h"
#include "driver/i2c.h"

esp_err_t bsp_i2c_init(void)
{
    i2c_config_t i2c_conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = BSP_I2C_SDA,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = BSP_I2C_SCL,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = BSP_I2C_FREQ_HZ
    };
    i2c_param_config(BSP_I2C_NUM, &i2c_conf);

    return i2c_driver_install(BSP_I2C_NUM, i2c_conf.mode, 0, 0, 0);
}
```

写好后的 esp32\_s3\_szp.h 文件的内容如下：



```c
#pragma once

#include "esp_err.h"

#define BSP_I2C_SDA           (GPIO_NUM_1)
#define BSP_I2C_SCL           (GPIO_NUM_2)

#define BSP_I2C_NUM           (0)
#define BSP_I2C_FREQ_HZ       100000

esp_err_t bsp_i2c_init(void);
```

点击打开 main.c 文件，添加 esp32\_s3\_szp.h 头文件。



```c
#include "esp32_s3_szp.h"
#include "qmi8658.h"
```

在 app\_main 函数中，先调用 I2C 初始化函数。



```c
void app_main(void)
{
    ESP_ERROR_CHECK(bsp_i2c_init());
    ESP_LOGI(TAG, "I2C initialized successfully");
}
```

函数里使用到了 ESP\_LOGI，需要包含 esp\_log.h 头文件，写到 esp32\_s3\_szp.h 文件中就可以。

还需要给 ESP\_LOGI 里面的 TAG 定义一下，这个定义放到 app\_main 函数的前面。



```c
#include "esp_log.h"
```

接下来，开始写 qmi8658 的驱动函数。

我们先写两个读取 qmi8658 寄存器的函数和写入 qmi8658 寄存器的函数。写入函数用于配置传感器的参数，读取函数用于读取传感器的寄存器数据，例如 ID 号，状态等。这两个函数放入 esp32\_s3\_szp.c 文件中。这两个函数，也是参考官方 i2c\_simple 例程中的修改的。

c

```
<span><span>esp_err_t</span><span> qmi8658_register_read</span><span>(</span><span>uint8_t</span><span> reg_addr</span><span>, </span><span>uint8_t</span><span> *</span><span>data</span><span>, </span><span>size_t</span><span> len</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    return</span><span> i2c_master_write_read_device</span><span>(BSP_I2C_NUM, QMI8658_SENSOR_ADDR,  </span><span>&amp;</span><span>reg_addr, </span><span>1</span><span>, data, len, </span><span>1000</span><span> /</span><span> portTICK_PERIOD_MS);</span></span>
<span><span>}</span></span>
<span></span>
<span><span>esp_err_t</span><span> qmi8658_register_write_byte</span><span>(</span><span>uint8_t</span><span> reg_addr</span><span>, </span><span>uint8_t</span><span> data</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    uint8_t</span><span> write_buf</span><span>[</span><span>2</span><span>] </span><span>=</span><span> {reg_addr, data};</span></span>
<span></span>
<span><span>    return</span><span> i2c_master_write_to_device</span><span>(BSP_I2C_NUM, QMI8658_SENSOR_ADDR, write_buf, </span><span>sizeof</span><span>(write_buf), </span><span>1000</span><span> /</span><span> portTICK_PERIOD_MS);</span></span>
<span><span>}</span></span>
```

函数里面用到了 QMI8658C\_SENSOR\_ADD，我们在 esp32\_s3\_szp.h 文件中定义一下。

c

```
<span><span>#define</span><span>  QMI8658_SENSOR_ADDR</span><span>       0x</span><span>6A</span></span>
```

接下来，我们需要写一个 qmi8658c 初始化函数，用于读取 ID 号，配置加速度、陀螺仪范围等参数。这个函数涉及到了 qmi8658 的寄存器，所以我们先用枚举类型定义寄存器，放到 esp32\_s3\_szp.h 文件中。

c

```
<span><span>enum</span><span> qmi8658_reg</span></span>
<span><span>{</span></span>
<span><span>    QMI8658_WHO_AM_I,</span></span>
<span><span>    QMI8658_REVISION_ID,</span></span>
<span><span>    QMI8658_CTRL1,</span></span>
<span><span>    QMI8658_CTRL2,</span></span>
<span><span>    QMI8658_CTRL3,</span></span>
<span><span>    QMI8658_CTRL4,</span></span>
<span><span>    QMI8658_CTRL5,</span></span>
<span><span>    QMI8658_CTRL6,</span></span>
<span><span>    QMI8658_CTRL7,</span></span>
<span><span>    QMI8658_CTRL8,</span></span>
<span><span>    QMI8658_CTRL9,</span></span>
<span><span>    QMI8658_CATL1_L,</span></span>
<span><span>    QMI8658_CATL1_H,</span></span>
<span><span>    QMI8658_CATL2_L,</span></span>
<span><span>    QMI8658_CATL2_H,</span></span>
<span><span>    QMI8658_CATL3_L,</span></span>
<span><span>    QMI8658_CATL3_H,</span></span>
<span><span>    QMI8658_CATL4_L,</span></span>
<span><span>    QMI8658_CATL4_H,</span></span>
<span><span>    QMI8658_FIFO_WTM_TH,</span></span>
<span><span>    QMI8658_FIFO_CTRL,</span></span>
<span><span>    QMI8658_FIFO_SMPL_CNT,</span></span>
<span><span>    QMI8658_FIFO_STATUS,</span></span>
<span><span>    QMI8658_FIFO_DATA,</span></span>
<span><span>    QMI8658_I2CM_STATUS </span><span>=</span><span> 44</span><span>,</span></span>
<span><span>    QMI8658_STATUSINT,</span></span>
<span><span>    QMI8658_STATUS0,</span></span>
<span><span>    QMI8658_STATUS1,</span></span>
<span><span>    QMI8658_TIMESTAMP_LOW,</span></span>
<span><span>    QMI8658_TIMESTAMP_MID,</span></span>
<span><span>    QMI8658_TIMESTAMP_HIGH,</span></span>
<span><span>    QMI8658_TEMP_L,</span></span>
<span><span>    QMI8658_TEMP_H,</span></span>
<span><span>    QMI8658_AX_L,</span></span>
<span><span>    QMI8658_AX_H,</span></span>
<span><span>    QMI8658_AY_L,</span></span>
<span><span>    QMI8658_AY_H,</span></span>
<span><span>    QMI8658_AZ_L,</span></span>
<span><span>    QMI8658_AZ_H,</span></span>
<span><span>    QMI8658_GX_L,</span></span>
<span><span>    QMI8658_GX_H,</span></span>
<span><span>    QMI8658_GY_L,</span></span>
<span><span>    QMI8658_GY_H,</span></span>
<span><span>    QMI8658_GZ_L,</span></span>
<span><span>    QMI8658_GZ_H,</span></span>
<span><span>    QMI8658_MX_L,</span></span>
<span><span>    QMI8658_MX_H,</span></span>
<span><span>    QMI8658_MY_L,</span></span>
<span><span>    QMI8658_MY_H,</span></span>
<span><span>    QMI8658_MZ_L,</span></span>
<span><span>    QMI8658_MZ_H,</span></span>
<span><span>    QMI8658_dQW_L </span><span>=</span><span> 73</span><span>,</span></span>
<span><span>    QMI8658_dQW_H,</span></span>
<span><span>    QMI8658_dQX_L,</span></span>
<span><span>    QMI8658_dQX_H,</span></span>
<span><span>    QMI8658_dQY_L,</span></span>
<span><span>    QMI8658_dQY_H,</span></span>
<span><span>    QMI8658_dQZ_L,</span></span>
<span><span>    QMI8658_dQZ_H,</span></span>
<span><span>    QMI8658_dVX_L,</span></span>
<span><span>    QMI8658_dVX_H,</span></span>
<span><span>    QMI8658_dVY_L,</span></span>
<span><span>    QMI8658_dVY_H,</span></span>
<span><span>    QMI8658_dVZ_L,</span></span>
<span><span>    QMI8658_dVZ_H,</span></span>
<span><span>    QMI8658_AE_REG1,</span></span>
<span><span>    QMI8658_AE_REG2,</span></span>
<span><span>    QMI8658_RESET </span><span>=</span><span> 96</span></span>
<span><span>};</span></span>
```

结合 QMI8658 的数据手册中的寄存器定义表格，写出这个枚举定义。枚举类型的第一个值默认是 0，和寄存器 WHO\_AM\_I 的地址一样，所以不用标出，然后依次递增，遇到地址不连续的寄存器地址时，单独标出，最后的结果如上代码所示。

接下来写 qmi8658 初始化函数到 esp32\_s3\_szp.c 文件。

c

```
<span><span>void</span><span> qmi8658_init</span><span>(</span><span>void</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    uint8_t</span><span> id </span><span>=</span><span> 0</span><span>;</span></span>
<span></span>
<span><span>    qmi8658_register_read</span><span>(QMI8658_WHO_AM_I, </span><span>&amp;</span><span>id ,</span><span>1</span><span>);</span></span>
<span><span>    while</span><span> (id </span><span>!=</span><span> 0x</span><span>05</span><span>)</span></span>
<span><span>    {</span></span>
<span><span>        vTaskDelay</span><span>(</span><span>1000</span><span> /</span><span> portTICK_PERIOD_MS);</span></span>
<span><span>        qmi8658_register_read</span><span>(QMI8658_WHO_AM_I, </span><span>&amp;</span><span>id ,</span><span>1</span><span>);</span></span>
<span><span>    }</span></span>
<span><span>    ESP_LOGI</span><span>(TAG, </span><span>"QMI8658 OK!"</span><span>);</span></span>
<span></span>
<span><span>    qmi8658_register_write_byte</span><span>(QMI8658_RESET, </span><span>0x</span><span>b0</span><span>);</span><span>  // 复位</span></span>
<span><span>    vTaskDelay</span><span>(</span><span>10</span><span> /</span><span> portTICK_PERIOD_MS);</span></span>
<span><span>    qmi8658_register_write_byte</span><span>(QMI8658_CTRL1, </span><span>0x</span><span>40</span><span>);</span><span> // CTRL1 设置地址自动增加</span></span>
<span><span>    qmi8658_register_write_byte</span><span>(QMI8658_CTRL7, </span><span>0x</span><span>03</span><span>);</span><span> // CTRL7 允许加速度和陀螺仪</span></span>
<span><span>    qmi8658_register_write_byte</span><span>(QMI8658_CTRL2, </span><span>0x</span><span>95</span><span>);</span><span> // CTRL2 设置ACC 4g 250Hz</span></span>
<span><span>    qmi8658_register_write_byte</span><span>(QMI8658_CTRL3, </span><span>0x</span><span>d5</span><span>);</span><span> // CTRL3 设置GRY 512dps 250Hz</span></span>
<span><span>}</span></span>
```

函数里面用到了 ESP\_LOGI，这里的 TAG，需要定义。我们把这个 TAG 定义，放到 esp32\_s3\_szp.c 文件中。

c

```
<span><span>static</span><span> const</span><span> char</span><span> *</span><span>TAG </span><span>=</span><span> "esp32_s3_szp"</span><span>;</span></span>
```

函数里面使用了 freeRTOS 的延时函数，所以需要包含 freeRTOS 头文件，放到 esp32\_s3\_szp.h 文件中。

c

```
<span><span>#include</span><span> "freertos/FreeRTOS.h"</span></span>
<span><span>#include</span><span> "freertos/task.h"</span></span>
```

现在我们把这个函数的声明写到 esp32\_s3\_szp.h 文件。

c

```
<span><span>void</span><span> qmi8658_init</span><span>(</span><span>void</span><span>);</span></span>
```

接下来我们在 main.c 文件中的 app\_main 函数中调用这个初始化函数。

c

```
<span><span>void</span><span> app_main</span><span>(</span><span>void</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    ESP_ERROR_CHECK</span><span>(</span><span>i2c_master_init</span><span>());</span></span>
<span><span>    ESP_LOGI</span><span>(TAG, </span><span>"I2C initialized successfully"</span><span>);</span></span>
<span></span>
<span><span>    qmi8658_init</span><span>();</span></span>
<span><span>}</span></span>
```

接下来，就可以编译下载看一下结果了。

依次配置 VSCode 左下角的配置选项，串口号、目标芯片、下载方式、menuconfig 里面，把 FLASH 大小修改为 16MB，其它不做修改。

然后编译下载，并打开终端查看。

c

```
<span><span>I</span><span> (</span><span>305</span><span>) main: I2C initialized successfully</span></span>
<span><span>I</span><span> (</span><span>315</span><span>) esp32_s3_szp: QMI8658 OK</span><span>!</span></span>
<span><span>I</span><span> (</span><span>325</span><span>) main_task: Returned from </span><span>app_main</span><span>()</span></span>
```

上面终端显示，我截图了倒数 3 条。

`main: I2C initialized successfully`，这个输出，是 main.c 文件中主函数中的 ESP\_LOGI 输出的。

`esp32_s3_szp: QMI8658C OK!`，这个输出，是 esp32\_s3\_szp.c 文件中的初始化函数中的 ESP\_LOGI 输出的。

配置好传感器以后，我们就可以读取加速度值和陀螺仪值了，我们先定义一个结构体类型，用来存放加速度值、陀螺仪值以及姿态值。这个结构体，放到 esp32\_s3\_szp.h 文件中。

c

```
<span><span>typedef</span><span> struct</span><span>{</span></span>
<span><span>    int16_t</span><span> acc_y;</span></span>
<span><span>    int16_t</span><span> acc_x;</span></span>
<span><span>    int16_t</span><span> acc_z;</span></span>
<span><span>    int16_t</span><span> gyr_y;</span></span>
<span><span>    int16_t</span><span> gyr_x;</span></span>
<span><span>    int16_t</span><span> gyr_z;</span></span>
<span><span>    float</span><span> AngleX;</span></span>
<span><span>    float</span><span> AngleY;</span></span>
<span><span>    float</span><span> AngleZ;</span></span>
<span><span>}t_sQMI8658;</span></span>
```

结构体成员，前 3 个，放 xyz 方向的加速度值，再接下来 3 个，放 xyz 方向陀螺仪值，这 6 个值都是从传感器读出来的原始值，最后 3 个，放 XYZ 的角度值，这 3 个值，需要我们通过计算得到。

这个结构体中用到了 int16\_t，需要包含 stdint.h 头文件，放到 esp32\_s3\_szp.h 文件中。

接下来，写读取加速度值和陀螺仪值的函数，放到 esp32\_s3\_szp.c 文件中。

c

```
<span><span>// 读取加速度和陀螺仪寄存器值</span></span>
<span><span>void</span><span> qmi8658_Read_AccAndGry</span><span>(t_sQMI8658 </span><span>*</span><span>p</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    uint8_t</span><span> status, data_ready</span><span>=</span><span>0</span><span>;</span></span>
<span><span>    int16_t</span><span> buf</span><span>[</span><span>6</span><span>];</span></span>
<span></span>
<span><span>    qmi8658_register_read</span><span>(QMI8658_STATUS0, </span><span>&amp;</span><span>status, </span><span>1</span><span>);</span><span> // 读状态寄存器</span></span>
<span><span>    if</span><span> (status </span><span>&amp;</span><span> 0x</span><span>03</span><span>)</span><span> // 判断加速度和陀螺仪数据是否可读</span></span>
<span><span>        data_ready </span><span>=</span><span> 1</span><span>;</span></span>
<span><span>    if</span><span> (data_ready </span><span>==</span><span> 1</span><span>){</span><span>  // 如果数据可读</span></span>
<span><span>        data_ready </span><span>=</span><span> 0</span><span>;</span></span>
<span><span>        qmi8658_register_read</span><span>(QMI8658_AX_L, (</span><span>uint8_t</span><span> *</span><span>)buf, </span><span>12</span><span>);</span><span> // 读加速度和陀螺仪值</span></span>
<span><span>        p-&gt;acc_x </span><span>=</span><span> buf</span><span>[</span><span>0</span><span>];</span></span>
<span><span>        p-&gt;acc_y </span><span>=</span><span> buf</span><span>[</span><span>1</span><span>];</span></span>
<span><span>        p-&gt;acc_z </span><span>=</span><span> buf</span><span>[</span><span>2</span><span>];</span></span>
<span><span>        p-&gt;gyr_x </span><span>=</span><span> buf</span><span>[</span><span>3</span><span>];</span></span>
<span><span>        p-&gt;gyr_y </span><span>=</span><span> buf</span><span>[</span><span>4</span><span>];</span></span>
<span><span>        p-&gt;gyr_z </span><span>=</span><span> buf</span><span>[</span><span>5</span><span>];</span></span>
<span><span>    }</span></span>
<span><span>}</span></span>
```

然后我们再写一个计算姿态的函数，计算姿态，可以单独使用加速度值，可以单独使用陀螺仪值，也可以融合使用，它们各自有优缺点，下面，我们写一个只使用加速度值计算姿态的函数。



```c
<span><span>// 获取XYZ轴的倾角值</span></span>
<span><span>void</span><span> qmi8658_fetch_angleFromAcc</span><span>(t_sQMI8658 </span><span>*</span><span>p</span><span>)</span></span>
<span><span>{</span></span>
<span><span>    float</span><span> temp;</span></span>
<span></span>
<span><span>    qmi8658_Read_AccAndGry</span><span>(p);</span><span> // 读取加速度和陀螺仪的寄存器值</span></span>
<span><span>    // 根据寄存器值 计算倾角值 并把弧度转换成角度</span></span>
<span><span>    temp </span><span>=</span><span> (</span><span>float</span><span>)p-&gt;acc_x </span><span>/</span><span> sqrt</span><span>( ((</span><span>float</span><span>)p-&gt;acc_y </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_y </span><span>+</span><span> (</span><span>float</span><span>)p-&gt;acc_z </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_z) );</span></span>
<span><span>    p-&gt;AngleX </span><span>=</span><span> atan</span><span>(temp)</span><span>*</span><span>57.29578</span><span>f</span><span>;</span><span> // 180/π=57.29578</span></span>
<span><span>    temp </span><span>=</span><span> (</span><span>float</span><span>)p-&gt;acc_y </span><span>/</span><span> sqrt</span><span>( ((</span><span>float</span><span>)p-&gt;acc_x </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_x </span><span>+</span><span> (</span><span>float</span><span>)p-&gt;acc_z </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_z) );</span></span>
<span><span>    p-&gt;AngleY </span><span>=</span><span> atan</span><span>(temp)</span><span>*</span><span>57.29578</span><span>f</span><span>;</span><span> // 180/π=57.29578</span></span>
<span><span>    temp </span><span>=</span><span> sqrt</span><span>( ((</span><span>float</span><span>)p-&gt;acc_x </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_x </span><span>+</span><span> (</span><span>float</span><span>)p-&gt;acc_y </span><span>*</span><span> (</span><span>float</span><span>)p-&gt;acc_y) ) </span><span>/</span><span> (</span><span>float</span><span>)p-&gt;acc_z;</span></span>
<span><span>    p-&gt;AngleZ </span><span>=</span><span> atan</span><span>(temp)</span><span>*</span><span>57.29578</span><span>f</span><span>;</span><span> // 180/π=57.29578</span></span>
<span><span>}</span></span>
```

这个函数中用到了 atan 函数，需要在文件中包含头文件 math.h，放到 esp32\_s3\_szp.h 文件中。

```c
#include <math.h>
```

在 esp32\_s3\_szp.h 文件中声明获取倾角的函数。

```c
void qmi8658_fetch_angleFromAcc(t_sQMI8658 *p);
```

然后我们在 app\_main 函数中调用它。

```c
void app_main(void)
{
    ESP_ERROR_CHECK(bsp_i2c_init());
    ESP_LOGI(TAG, "I2C initialized successfully");

    qmi8658_init();

    while (1)
    {
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        qmi8658_fetch_angleFromAcc(&QMI8658);
        ESP_LOGI(TAG, "angle_x = %.1f  angle_y = %.1f angle_z = %.1f",QMI8658.AngleX, QMI8658.AngleY, QMI8658.AngleZ);
    }
}
```

在主函数中，qmi8658 初始化以后，每间隔 1 秒钟计算 1 次角度值，然后通过串口发送到终端。

这里面把读取到的值给了 QMI8658 这个变量，需要在主函数前面定义一下。

```
t_sQMI8658 QMI8658;
```

现在程序就全部写好了，我们就可以编译下载看结果了。

没有问题的话，使用 idf.py save-defconfig 命令生成 sdkconfig.defaults 文件，此文件保存了你在 menuconfig 中做的所有改动配置，不包含默认的配置。
---
title: Introduction to the Powerful MultiButton Key Driver Module
slug: introduction-to-the-powerful-multibutton-key-driver-module
id: cmn2tryqs001bebxa4kguagk3
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
status: published
excerpt: >-
  MultiButton a powerful and easy-to-use key driver module. It explains its core
  advantages, usage steps, data structure, supported events, and provides
  example code.
updatedAt: '2026-04-23T22:44:08.214Z'
---

## Introduction

MultiButton is a simple, easy-to-use, and powerful key driver module. It is based on the event-driven mechanism and adopts the object-oriented design concept, which can help you manage multiple keys easily and handle key events in an asynchronous callback manner. Thus, it simplifies your code structure and makes the key logic clearer and more flexible!

The core advantages of MultiButton

- Unlimited key expansion: Supports any number of keys without modifying the core code for easy expansion.
- Event-driven mechanism: Based on the event-driven mechanism, various key events such as press, release, single click, double click, long press, etc., can be easily defined and handled.
- Asynchronous callback mechanism: The processing function of key events adopts an asynchronous callback method to avoid blocking the main program and make your code structure clearer.
- Object-oriented design: Each key object has an independent data structure and state management, which are independent of each other for easy management.
- Code simplification: Using MultiButton can simplify the key processing code, reduce duplicate code, and improve code readability and maintainability.

## Steps to use MultiButton

1. Apply for the key structure:

```c
struct Button button1;
```

2. **Initialize the key object**: Bind the GPIO level reading interface of the key and the valid trigger level.

```c
button_init(&button1, read_button_pin, 0, 0);
```

3. **Register key events**: Bind the callback function for each key event.

```c
button_attach(&button1, SINGLE_CLICK, Callback_SINGLE_CLICK_Handler);
button_attach(&button1, DOUBLE_CLICK, Callback_DOUBLE_Click_Handler);
```

4. **Start the key**:

```
button_start(&button1);
```

5. **Set the timer**: Call the `button_ticks()` function regularly for key state update.

```c
while(1) {
    ...
    if(timer_ticks == 5) {
        timer_ticks = 0;

        button_ticks();
    }
}
```

## The data structure of MultiButton

MultiButton is implemented in C language, and each key object is managed using an independent data structure:

```c
struct Button {
    uint16_t ticks;                     // Timer
    uint8_t  repeat : 4;                // Repeat press count
    uint8_t  event  : 4;                // Event identifier
    uint8_t  state  : 3;                // Current state
    uint8_t  debounce_cnt : 3;          // Debounce counter
    uint8_t  active_level : 1;          // Active level (high/low)
    uint8_t  button_level : 1;          // Current button level (high/low)
    uint8_t  button_id;                 // Button ID
    uint8_t (*hal_button_Level)(uint8_t button_id_); // Pointer to hardware button level function
    BtnCallback cb[number_of_event];    // Array of callback functions for button events
    struct Button* next;                 // Pointer to the next button in the linked list
};

```

Each key object is connected through a singly linked list and enters the `button_handler(struct Button* handle)` state machine for processing in sequence to ensure that the state of each key is independent.

## The key events supported by MultiButton

| Event              | Description                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `PRESS_DOWN`       | Key press, triggered each time the key is pressed.                                               |
| `PRESS_UP`         | Key release, triggered each time the key is released.                                            |
| `PRESS_REPEAT`     | Triggered when the key is repeatedly pressed, `repeat` counts the number of consecutive presses. |
| `SINGLE_CLICK`     | Single-click key event.                                                                          |
| `DOUBLE_CLICK`     | Double-click key event.                                                                          |
| `LONG_PRESS_START` | Triggered once when the long press time threshold is reached.                                    |
| `LONG_PRESS_HOLD`  | Triggered continuously during the long press.                                                    |

## Example code

```c
#include "button.h"

unit8_t btn1_id =0;

struct Button btn1;

uint8_tread_button_GPIO(uint8_t button_id)
{
// you can share the GPIO read function with multiple Buttons
switch(button_id)
{
case btn1_id:
return HAL_GPIO_ReadPin(B1_GPIO_Port, B1_Pin);
break;

default:
return0;
break;
}
}

voidBTN1_PRESS_DOWN_Handler(void* btn)
{
//do something...
}

voidBTN1_PRESS_UP_Handler(void* btn)
{
//do something...
}

...

intmain()
{
    button_init(&btn1, read_button_GPIO,0, btn1_id);
    button_attach(&btn1, PRESS_DOWN,       BTN1_PRESS_DOWN_Handler);
    button_attach(&btn1, PRESS_UP,         BTN1_PRESS_UP_Handler);
    button_attach(&btn1, PRESS_REPEAT,     BTN1_PRESS_REPEAT_Handler);
    button_attach(&btn1, SINGLE_CLICK,     BTN1_SINGLE_Click_Handler);
    button_attach(&btn1, DOUBLE_CLICK,     BTN1_DOUBLE_Click_Handler);
    button_attach(&btn1, LONG_PRESS_START, BTN1_LONG_PRESS_START_Handler);
    button_attach(&btn1, LONG_PRESS_HOLD,  BTN1_LONG_PRESS_HOLD_Handler);
    button_start(&btn1);

//make the timer invoking the button_ticks() interval 5ms.
//This function is implemented by yourself.
    __timer_start(button_ticks,0,5);

while(1)
{}
}
```

## Conclusion

MultiButton is a simple, easy-to-use, and powerful key driver module that can help you manage multiple keys easily and handle key events in an asynchronous callback manner. Using MultiButton can simplify the key processing code, improve code readability and maintainability, and make your key logic clearer and more flexible!

Project address: https://github.com/0x1abin/MultiButton

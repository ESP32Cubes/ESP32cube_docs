---
title: How to use millis() instead of delay()
slug: how-to-use-millis-instead-of-delay
id: cmn2tr5fn000mebxa3ea1nxsz
category: tutorial
categorySlug: tutorial
tags:
  - LED
  - AI
status: published
updatedAt: '2026-04-24T00:38:44.228Z'
---

In order to make a pause or wait for the task in Arduino, the most widely used function is `delay()`, but sometimes it was cause some problem, in this article it will discuss it, and shows how to use function `millis()` to replace it.

## Example code

For example, we'd like the board to flash the LED **precisely every 0.5 second**.

It will be very easy to write the code with delay function:

```Arduino
int ledPin=2;

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);
}
 
void loop() {
	digitalWrite(ledPin, HIGH); // Turn the LED on
	delay(500); // Wait for 0.5 seconds 
	digitalWrite(ledPin, LOW); // Turn the LED off 
	delay(500); // Wait for another 0.5 seconds
}
```

Now, if we insert some codes, let the board send some unused message to the serial port.

```Arduino
int ledPin=2;

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);
}
 
void loop() {
	digitalWrite(ledPin, HIGH); // Turn the LED on
	Serial.println("LED is ON");	
	Serial.println("LED is ON");
	Serial.println("LED is ON");
	delay(500); // Wait for 0.5 seconds 
	digitalWrite(ledPin, LOW); // Turn the LED off 
	Serial.println("LED is OFF");	
	Serial.println("LED is OFF");
	Serial.println("LED is OFF");
	delay(500); // Wait for another 0.5 seconds
}
```

You will find the LED flash time is more than 0.5 seconds. That is because it needs some time to execute the Serial.println() function. But we don't know how long it will take.

Then, we will use `millis()` function to implement it:

```Arduino
int ledPin = 2; 
unsigned long previousMillis = 0; // Store the time of the last LED toggle

void setup() {
  pinMode(ledPin, OUTPUT); // Set the LED pin as an output
}

void loop() {
  unsigned long currentMillis = millis(); // Get the current time
  if (currentMillis - previousMillis < 500) {    
    digitalWrite(ledPin, HIGH);
    Serial.println("LED is ON");
    Serial.println("LED is ON");
    Serial.println("LED is ON");
  } else if (currentMillis - previousMillis < 1000) {
    digitalWrite(ledPin, LOW);
    Serial.println("LED is OFF");
    Serial.println("LED is OFF");
    Serial.println("LED is OFF");
} else{
    previousMillis = currentMillis;
}
}

```

In above code, it will compare current CPU time to saved previousMillis to get the delta time. While the delta time:

- 0~0.5S, turn on the LED
- 0.5~1S, turn off the LED
- At time >= 1S, it will reset the previousMillis.

## Different between delay() and millis()

- `delay()` Specifies program pauses a number of milliseconds.
- `millis()` On the other hand, it returns the number of milliseconds elapsed since the program started.

So we know that `delay()` is a relative time clock. While `millis()` is an absolute time clock. And the most important things that delay() will pause the execution of other codes.

There are two main advantage to use millis other than delay:

### Get the exact time

The first advantage we will discuss is **accurate timing**. With `millis()`us, we can ensure that the loop executes as many times as needed, regardless of the execution time. With `delay()`this it's impossible because we don't know how long one loop takes to execute.

Such precise timing is useful when sampling or running filters at a certain frequency.

### No blocking

Another benefit `millis()`is that it doesn't prevent us from running code while "waiting".

`delay()` would pause the entire code until the time is reached.

## micros() and overflow

Just like `delay()`there is a microsecond version called `delayMicroseconds()`, `millis()` has `micros()`. If you need better resolution, you can use `micros()`.

But, be aware that `micros()` will overflow about every **70 minutes**, and `millis()` about **50 days**. This means that the function's return value will start at zero again.

## Summary

`millis()` and `micros()` is a very convenient function, which can be used when processing timed tasks. If you don't know these things, you'll probably end up just using them `delay()`, which may also works well.

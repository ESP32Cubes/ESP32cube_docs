---
title: ADC Signal Conditioning Circuits
slug: adc-signal-conditioning-circuits
id: cmnx9sho60000f1ztx7vwm5i4
category: project
categorySlug: project
tags:
  - Circuit
status: published
updatedAt: '2026-04-23T21:57:07.613Z'
---
**Author:** southcreek | **Source:** Breadboard Community

### 1. Low-Speed Signal Conditioning (Slowly Varying Signals)

When measuring slow-changing signals such as **NTC temperature sensors** or **power supply voltages** using an MCU's internal ADC, cost-effective methods are usually sufficient.

* **Resistive Voltage Dividers:** A simple resistor divider can often meet basic requirements.
* **Impedance Consideration:** The output impedance of the divider is approximately the parallel resistance of the two resistors. For example, a divider using $100\text{k}\Omega$ and $20\text{k}\Omega$ resistors has an output impedance of roughly $16.7\text{k}\Omega$.
* **Accuracy Tip:** Since the ADC's input impedance is finite, you may need to reduce the sampling rate to increase the effective input impedance and maintain accuracy.
* **Buffer Amplifiers:** For higher precision, an Operational Amplifier (Op-Amp) can be used as a buffer (Voltage Follower) to provide low output impedance.* **Key Parameter:** Pay attention to the **Input Offset Voltage ($V_{OS}$)**. In a follower configuration, the output is $V_{in} \pm V_{OS}$. While standard Op-Amps like the LM358 or LM324 have a $V_{OS}$ around $4\text{mV}$, high-precision Op-Amps should be used if tighter accuracy is required.

![image.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/eea971ff06085dbeeeb6472d760264dadd5f77689cf48acb7308dd243486fa01.png)

### 2. High-Speed Signal Conditioning (Fast Varying Signals)

Most MCU ADCs have sampling rates between **1 to 2 MSPS**, meaning they can effectively process signals in the **500kHz to 1MHz** range according to the Nyquist sampling theorem.

* **Case Study: Motor Current Sensing:**
  When measuring current across a shunt resistor ($R_2$), the resulting voltage may be negative. An amplifier is used to offset the signal to a center-point (bias) for the ADC to read.
* **Critical Op-Amp Parameters:** For fast signals, $V_{OS}$ is less critical (as it can be calibrated out by measuring the zero-input offset), but two other factors become vital:
  1. **Gain Bandwidth Product (GBWP):** If an Op-Amp has a GBWP of $1.0\text{MHz}$ and a gain of 10 is applied, the effective bandwidth drops to only **100kHz**.
  2. **Slew Rate (SR):** This determines how fast the output can change.

![image.png](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/148b88f57952af71dd23f170f0f31669a06a43f4cf30a46d3fc3063d66818d23.png)

### 3. Analysis of Signal Distortion

The author highlights that weak, millivolt-level signals with steep edges suffer significant distortion when amplified by a factor of 10 using a standard Op-Amp (like the LM321).

* **The Problem:** Due to limited GBWP and SR (e.g., $1\text{V}/\mu\text{s}$), the rising and falling edges of the amplified signal become "sluggish" or rounded.
* **Observation:** If the gain is halved, the edges become noticeably faster, confirming that the amplifier's limits are being reached.

![640.jpg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/6291639576408bb90a9750e002ebf0b8bce3ce3dccd0bf73dbe631f6a01aa8e7.jpg)

### 4. Component Selection

To resolve waveform distortion in high-speed applications, specialized Op-Amps are required:

* **Recommended Specs:** Low-noise Op-Amps (e.g., **RS821** or **RS721**) featuring:
  * **GBWP:** $> 10\text{MHz}$
  * **Slew Rate:** $> 20\text{V}/\mu\text{s}$

### Conclusion

Different signal types demand different Op-Amp specifications. While the **LM358** is a versatile classic, it is not a "one-size-fits-all" solution for high-speed or high-precision sensing.

---
title: Markdown format support testing
slug: markdown-format-support-testing
id: cmn2tsqe7001qebxandhvfvqg
category: tutorial
categorySlug: tutorial
tags:
  - AI
  - Display
status: published
excerpt: This post to show the support of Markdown format in the ESP32cube website.
updatedAt: '2026-04-24T00:43:02.811Z'
---

***
___

## Inline

`inline block`

<cite>citation</cite>

This is a ==mark (with **bold** *italic* `code`)== tag.

~~strike~~

**bold 1** and __bold 2__

*italic 1*  and _italic 2_

***bold 1 and italic 1***

## Links
Footnote and reference sources are at the bottom of the page.

Footnotes[^1] have a label[^@#$%] and the footnote's content.

[^1]: This is a footnote content.
[^@#$%]: A footnote on the label: "@#$%".

![A Picture](/uploads "A Picture")

[Link to Picture](/uploads "Link")

www.google.com

isaacmuse@gmail.com

https://github.com/facelessuser/pymdown

This is a link https://github.com/facelessuser/pymdown.

This is a link "https://github.com/facelessuser/pymdown".

With this link (https://github.com/facelessuser/pymdown), it still works.


## Unordered List


Unordered List

- item 1
    * item A
    * item B
        more text
        + item a
        + item b
        + item c
    * item C
- item 2
- item 3


## Ordered List

Ordered List

1. item 1
    1. item A
    2. item B
        more text
        1. item a
        2. item b
        3. item c
    3. item C
2. item 2
3. item 3

## Task List


Task List

- [X] item 1
    * [X] item A
    * [ ] item B
        more text
        + [x] item a
        + [ ] item b
        + [x] item c
    * [X] item C
- [ ] item 2
- [ ] item 3

## Mixed Lists
Mixed Lists

- item 1
    * [X] item A
    * [ ] item B
        more text
        1. item a
        2. item b
        3. item c
    * [X] item C
- item 2
- item 3


## Blocks

Normal raw block

    This is a block.

    This is more of a block.

Highlighted code block

    :::javascript
    // Fenced **with** highlighting
    function doIt() {
        for (var i = 1; i <= slen ; i^^) {
            setTimeout("document.z.textdisplay.value = newMake()", i*300);
            setTimeout("window.status = newMake()", i*300);
        }
    }


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

## Block Quotes


> This is a block quote.

> > How does it look?
> > <cite>--I said this too</cite>

> I think it looks good.
> <cite>--I said this</cite>

## Fenced Block

```javascript
// Fenced **with** highlighting
function doIt() {
    for (var i = 1; i <= slen ; i^^) {
        setTimeout("document.z.textdisplay.value = newMake()", i*300);
        setTimeout("window.status = newMake()", i*300);
    }
}
```

## Tables



| _Colors_      | Fruits          | Vegetable         |
| ------------- |:---------------:| -----------------:|
| Red           | *Apple*         | [Pepper](#Tables) |
| ~~Orange~~    | `Oranges`       | **Carrot**        |
| Green         | ~~***Pears***~~ | Spinach           |


## Admonition

/// note | Some title
Some content
///


///  Caution "Warning!"
    - [X] Make sure you turn off the stove
    - [X] Don't run with scissors
/// 

## Github Emoji


This is a test for emoji :smile:.  The emojis are images linked to github assets :octocat:.

# Math

Some Equations:

$$
E(\mathbf{v}, \mathbf{h}) = -\sum_{i,j}w_{ij}v_i h_j - \sum_i b_i v_i - \sum_j c_j h_j
$$

- Here are some more equations:

    $$
        \begin{align}
            p(v_i=1|\mathbf{h}) & = \sigma\left(\sum_j w_{ij}h_j + b_i\right) \\
            p(h_j=1|\mathbf{v}) & = \sigma\left(\sum_i w_{ij}v_i + c_j\right)
        \end{align}
    $$

- Inline equations: $p(x|y) = \frac{p(y|x)p(x)}{p(y)}$.

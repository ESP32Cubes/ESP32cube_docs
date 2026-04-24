---
title: Obsidian remove strikethrough on completed tasks
slug: obsidian-remove-strikethrough-on-completed-tasks
id: cmn2tshet001kebxaijzanau2
category: tutorial
categorySlug: tutorial
tags:
  - ESP32
  - Tutorial
status: published
excerpt: This post shows how to remove strikethrough on completed tasks in Obsidian.
updatedAt: '2026-04-23T20:37:33.607Z'
---

The default task style in obsidian like this, there is a strikethrough for the done task. That will effect the reading. If we want to remove the strikethrough, it can be done by provide a customer .css file.

```
1. [x] Do first step. There are some task need to do in first step. For example, testing with bad samples. ✅ 2024-12-20
2. [ ] Do next step
3. [ ] Do following step
```

Default style
![Pasted image 20241220092046.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488441113-Pasted-image-20241220092046.jpeg)

We can remove the strikethrough style by add below css style.

**create a .css file under folder .obsidian\snippets**

```css
.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task="x"],
.markdown-source-view.mod-cm6 .HyperMD-task-line[data-task="X"] {
    text-decoration: none;
    color: inherit;
}
```

and in the setting --> Appearance --> CSS snippets, active the css file. Here is the ceckboxes.css

![Pasted image 20241220141348.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488445091-Pasted-image-20241220141348.jpeg)

Then the to do list will looks like:

![Pasted image 20241220092350.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488447148-Pasted-image-20241220092350.jpeg)

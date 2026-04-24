---
title: Set Proxy for Ollma on Windows
slug: set-proxy-for-ollma-on-windows
id: cmn2tsmwy001nebxa7bgrlk09
category: tutorial
categorySlug: tutorial
tags:
  - Web
status: published
excerpt: Set proxy for ollama on Windows
updatedAt: '2026-04-24T00:17:58.814Z'
---

If you are work behind a proxy, Ollama will unable to pull models behind the proxy on windows. Here is the solution for it.

Actually, it's very simple to set proxy for Ollama on windows. Just need to add a new environment variable named `HTTPS_PROXY` with your proxy address.

Show as below figure

![Pasted image 20250208165154.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488462870-Pasted-image-20250208165154.jpeg)

Then open PowerShell and type: 

```
ollama run deepseek-r1:7b
```

It will pull the model from the proxy.

![Pasted image 20250208165718.jpeg](https://pub-0b21780d5b2240ccb42d7b387bbbe8e4.r2.dev/uploads/1774488464543-Pasted-image-20250208165718.jpeg)

That all.

There are several discussions about this issue on the web, but no one can provide a clear solution. And please note that no need to add environment variable `HTTP_PROXY`, it may interrupt client connections to the server.

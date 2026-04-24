# ESP32Cube 文章写作指导

目标：英文正文、结构清晰、元信息完整、格式统一、可读性高。

## 1. 输出语言与风格

- 正文必须使用英文（English only）。
- 语气专业、清晰、可执行，避免空话。
- 优先使用短段落与步骤化说明。
- 面向工程实践，给出可复现的操作与代码。

## 2. 输出格式（必须）

- 输出必须是单个 Markdown 文档。
- 文档开头必须包含 YAML frontmatter。
- frontmatter 后空一行再开始正文。
- 不要输出额外解释（如“以下是文章”）。
- 整理输出内容，避免冗余与重复。删除多余的空行，保持格式整洁。

## 3. Frontmatter 规范

请使用以下字段（按需填写）：

```yaml
title: "<Article Title>"
slug: "<kebab-case-slug>"
id: "" # 新文章可留空；若已知则保留
categorySlug: "<existing-category-slug>"
tags:
  - tag1
  - tag2
excerpt: "<1-2 sentence summary>"
coverImage: "<https://... or empty>"
status: "published"
```

规则：

- slug 使用小写 + 连字符，如 esp32-low-power-guide。
- categorySlug 必须是站点已有分类的 slug， 有tutorial和project两种。
- tags 建议 3-6 个，避免过泛（如 tech、notes）。
- excerpt 建议 140-220 字符，准确概述价值。
- status 默认使用 draft，确认后再改为 published。

## 4. 正文结构规范


要求：

- 使用二级标题（##）作为主要分节。
- 每个分节先给结论，再给细节。
- 代码块必须标注语言，如 ```cpp、```c、```bash。
- 命令行示例可直接复制运行，避免伪代码命令。

## 5. Markdown 排版规范

- 标题层级不要跳级（## 后再 ###）。
- 列表项尽量单行表达一个要点。
- 表格仅在对比参数/方案时使用。
- 使用 fenced code blocks，不要使用缩进代码块。
- 图片使用标准 Markdown：![alt](https://...)
- 引用资料时使用简短来源列表，放在文末“References”。

## 6. 技术内容质量要求

- 示例应贴近 ESP32 实际开发场景。
- 给出版本信息（如 Arduino core、ESP-IDF、库版本）。
- 涉及性能/功耗时，尽量给出可量化指标或测试条件。
- 涉及网络/安全时，明确风险与防护建议。
- 若存在多方案，说明取舍依据（复杂度、资源占用、稳定性）。

## 7. SEO 与可读性要求

- 标题清晰，包含核心关键词。
- 开头 2 段内说明“这篇文章解决什么问题”。
- 小节标题包含语义关键词，避免“Part 1/Part 2”式命名。
- 避免过长段落（建议每段 3-6 行）。

## 8. AI 生成时的硬性约束

AI 必须遵守：

- 输出英文正文。
- 输出完整 frontmatter。
- 不编造不存在的 API/命令。
- 若信息不确定，明确写 Assumption。
- 不输出与文章无关的对话文本。

## 10. 发布前自检清单

- frontmatter 字段完整且拼写正确。
- categorySlug 合法。
- slug 为 kebab-case。
- 正文为英文。
- 代码块语言标注正确。
- 步骤可执行、命令可运行。
- 无明显事实错误与占位符未替换内容。

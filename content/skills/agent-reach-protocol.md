---
name: agent-reach-protocol
description: 互联网感知协议，赋予 AI 助手全网搜索、社交媒体读取与多媒体内容解析的能力。
metadata:
  {
    "openclaw": {
      "emoji": "🌐"
    }
  }
---

# 互联网感知协议 (Internet Reach Protocol)

> **目标**: 消除 AI 助手与实时互联网之间的信息鸿沟，实现零成本、全平台的信息获取与资产沉淀。

## 1. 核心链路：全网信息捕获

借鉴 `Agent-Reach` 的集成思路，将复杂的爬虫与 API 配置简化为标准的 Skill 指令：

### 1.1 社交媒体嗅探 (Social Media Sniffing)
- **免 API 接入**: 通过 Cookie 注入技术，读取 Twitter/X、Reddit、小红书等封闭平台的实时内容。
- **深度解析**: 自动提取推文上下文、Reddit 评论区讨论、小红书笔记图片与口碑。

### 1.2 视频与多媒体提取 (Multimedia Extraction)
- **YouTube/Bilibili**: 自动抓取视频字幕 (Subtitles) 与元数据，无需观看即可生成技术视频总结。
- **内容清洗**: 利用 Jina Reader 等工具，将杂乱的 HTML 网页转化为纯净的 Markdown，方便 AI 快速索引。

### 1.3 实时搜索与 RSS (Search & RSS)
- **语义搜索**: 接入 Exa 或搜索插件，实现比 Google 更精准的 LLM 级全网搜索。
- **持续监控**: 订阅关键技术的 RSS 源，一旦有更新（如 Seedance 3.0 发布），自动推送到博物馆待办。

## 2. 博物馆资产化工作流 (Curation Workflow)

1.  **感知 (Scan)**: 定时或根据指令扫描特定平台（如 GitHub 的新 Issue 或推图上的提示词灵感）。
2.  **提取 (Extract)**: 使用 `agent-reach` 工具链获取干净的文本/图片资产。
3.  **策展 (Curate)**: 经过 **[Humanizer Protocol](file:///Users/ax/Documents/GitHub/my-personal-blog/content/skills/humanizer-protocol.md)** 去 AI 味后，保存至博物馆的 `fragments/` 或 `memory/`。

## 3. 安全与环境诊断

- **Cookie 主权**: 敏感登录信息仅保留在本地环境中，不外传。
- **环境诊断**: 定期运行 `agent-reach doctor` 确保代理与网络连接的稳定性。

---

_此协议由 **零壹 (Líng Yī)** 维护，旨在确保数字博物馆的信息源始终处于互联网的最前沿。_

---
name: hot-monitor-protocol
description: 热点资产监控协议，基于多源聚合抓取与 AI 智能分析，实现对特定技术/话题的实时嗅探。
metadata:
  {
    "openclaw": {
      "emoji": "🔥"
    }
  }
---

# 热点资产监控协议 (Hot Asset Monitor Protocol)

> **目标**: 变被动接收为主动嗅探。通过对全网 8+ 个核心数据源的实时监控，为数字博物馆提供最前沿的资产养分。

## 1. 核心链路：多源聚合与智能过滤

借鉴 `yupi-hot-monitor` 的 Vibe Coding 思路，将“盯热点”这一行为协议化：

### 1.1 多源聚合抓取 (Multi-source Aggregation)
- **广度覆盖**: 监控包括 Twitter, Bing, HackerNews, Bilibili, 搜狗, GitHub 等 8+ 个信息源。
- **查询扩展 (Query Expansion)**: 自动利用 AI 对监控关键词进行扩展（例如：监控“Seedance”时自动扩展“S2 视频生成”、“ByteDance AI”），提高召回率。

### 1.2 AI 深度审计 (AI-Powered Audit)
- **真假识别**: 利用大模型分析内容的真实性，剔除博眼球的虚假信息。
- **相关性评分**: 自动计算内容与博物馆当前资产（如：提示词新书、小说创作）的相关程度。
- **智能摘要**: 自动提取核心信息，生成精炼的“热点快报”。

### 1.3 实时触达协议 (Real-time Delivery)
- **WebSocket 推送**: 关键热点实时推送到博物馆管理后台。
- **邮件/IM 预警**: 配合 **[IM Bridge Protocol](file:///Users/ax/Documents/GitHub/my-personal-blog/content/skills/im-bridge-protocol.md)**，在微信/钉钉中实时提醒。

## 2. 资产化工作流 (Hot-to-Asset Workflow)

1.  **定义关键词**: 在 `PLAN.md` 中设定监控目标（如：`NB2 更新`, `DeepSeek 协议`）。
2.  **持续嗅探**: 运行监控 Skill，保持对全网的实时感知。
3.  **自动存证**: 经 AI 审计后的高质量内容，自动作为 `fragments/` 存入博物馆，并更新对应的 **[Internet Reach Protocol](file:///Users/ax/Documents/GitHub/my-personal-blog/content/skills/agent-reach-protocol.md)** 索引。

## 3. 开发者集成 (Agent Integration)

- **Agent Skills**: 将监控能力封装为标准的 MCP 或 Skill 包，让零壹在 Cursor 或命令行中直接调用。
- **状态监控**: 定时检查抓取服务的存活状态，确保感知层不掉线。

---

_此协议由 **零壹 (Líng Yī)** 维护，确保意安序的资产库始终处于技术演进的暴风眼中心。_

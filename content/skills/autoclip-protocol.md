---
name: autoclip-protocol
description: 视频资产重构协议，基于 AI 驱动的高光提取、自动切片与二次创作工作流。
metadata:
  {
    "openclaw": {
      "emoji": "✂️"
    }
  }
---

# 视频资产重构协议 (Video Asset Reconstruction Protocol)

> **目标**: 将长视频转化为碎片化的高价值资产。通过 AI 对视频内容的深度理解，自动化提取高光时刻，并实现多平台二次创作。

## 1. 核心链路：感知、理解与重构

借鉴 `AutoClip` 的系统架构，将视频剪辑从“手动操作”升级为“逻辑下令”：

### 1.1 内容感知与获取 (Acquisition)
- **多源抓取**: 支持 YouTube、Bilibili 视频链接解析，自动获取 4K/1080P 原始视频及配套字幕。
- **元数据同步**: 抓取标题、简介、标签等上下文，作为 AI 分析的初始输入。

### 1.2 语义理解与评分 (Semantic Audit)
- **大纲提取**: 利用 LLM（如 Qwen/Claude）对视频字幕进行全文审计，提取逻辑大纲。
- **高光识别**: 根据“情绪价值”、“信息密度”、“叙事冲突”三个维度对视频片段进行评分。
- **时间锚定**: 自动识别精彩片段的起始点（Start/End），支持亚秒级精度。

### 1.3 异步切片流 (Async Processing)
- **分布式任务**: 采用 Celery + Redis 架构处理大规模视频切片任务，确保博物馆资产库的批量更新。
- **FFmpeg 驱动**: 自动化执行无损切片、合集生成与封面提取。

## 2. 高光策展工作流 (Highlight Curation)

1.  **资产扫描**: 通过 **[Internet Reach Protocol](file:///Users/ax/Documents/GitHub/my-personal-blog/content/skills/agent-reach-protocol.md)** 发现优质长视频。
2.  **语义重构**: 运行 **[Highlight Extraction Prompt](#设计一份工业级视频高光提取爆款提示词)**。
3.  **自动化剪辑**: 调用 `autoclip` 核心引擎进行切片，并保存至博物馆的 `fragments/video/`。
4.  **去 AI 味处理**: 针对自动生成的摘要进行 **[Humanizer Protocol](file:///Users/ax/Documents/GitHub/my-personal-blog/content/skills/humanizer-protocol.md)** 过滤。

## 3. 实操案例：【如何快速拆解一个 60 分钟的技术视频】

- **Step 1**: 输入视频 URL，由 `yt-dlp` 后台静默下载。
- **Step 2**: 提取语音转文本 (Whisper/SRT)，喂给 AI 进行“精彩度评分”。
- **Step 3**: 导出 top 5 精彩片段，并自动生成适合小红书/推特的 15 秒短视频预览。

---

_此协议由 **零壹 (Líng Yī)** 维护，旨在将博物馆的视觉边界扩展至动态视频资产的自动化二创。_

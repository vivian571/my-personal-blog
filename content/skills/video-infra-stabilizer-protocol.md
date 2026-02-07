---
name: video-infra-stabilizer-protocol
description: 视频自动化基础设施稳固协议。专门针对 macOS Silicon 架构优化 FFmpeg、ImageMagick、MoviePy 及 TTS 引擎的连通性与稳定性。
metadata:
  {
    "openclaw": {
      "emoji": "🛡️"
    }
  }
---

# Video Infra Stabilizer Protocol: 视频基础设施稳固协议

本协议沉淀了在 macOS (Apple Silicon) 环境下构建高性能视频生成的全套深度优化方案。当系统遇到渲染失败、资产损坏或发布超时时，应立即调用本协议进行诊断与自我修复。

## 1. 核心技术骨架 (Core Pillars)

### 1.1 FFmpeg & MoviePy 2.x 强力绑定
在 macOS 上，MoviePy 默认可能无法正确识别 Homebrew 安装的 FFmpeg。本协议要求通过环境变量及动态补丁强制绑定：
- **路径确认**：优先使用 `/opt/homebrew/bin/ffmpeg`。
- **动态补丁**：在 `app/config/config.py` 中直接设置 `moviepy.config.FFMPEG_BINARY`。

### 1.2 ImageMagick 安全绕过
默认安装的 ImageMagick 会因安全策略拦截 `@` 开始的路径（MPT 常用）。
- **策略修复**：修改 `/opt/homebrew/etc/ImageMagick-7/policy.xml`，将针对 `path` 的 `pattern="@*"` 权限由 `none` 改为 `read|write`。

### 1.3 语音引擎 (TTS) 适配
- **异步修复**：集成 `nest-asyncio` 以支持在已有事件循环中运行 `azure_tts`。
- **接口兼容**：在 `edge-tts` 升级后，需在本地实现 `mktimestamp` 以保持 submaker 兼容性。

## 2. 自动化诊断脚本 (scripts/)

### 2.1 `check_health.py`
检测以下组件的状态：
- FFmpeg 路径及执行权限。
- ImageMagick `policy.xml` 的读写权限。
- Python 环境中 `moviepy`, `edge-tts`, `nest-asyncio` 的安装情况。

### 2.2 `apply_patches.py`
一键应用以下修复到目标目录：
- `app/services/video.py`: 修复 `NoneType` 转换逻辑。
- `app/services/material.py`: 注入资产校验逻辑。
- `app/services/voice.py`: 注入 `nest-asyncio` 和 `mktimestamp` 补丁。

## 3. 发布稳定性增强
- **Playwright Timeout**: 针对国内网络环境，发布脚本的页面加载超时必须设置为 90000ms 以上。
- **Cookie 维护**: 定期检测 `social-auto-upload/cookies/` 下的 JSON 文件大小及有效性。

## 4. 维护者建议
本协议由 **Antigravity (AI Agent)** 在 2026 年 2 月环境修复战役中总结而成。当再次遇到 `OSError: failed to read the first frame` 时，优先检查本协议的 1.1 章节。

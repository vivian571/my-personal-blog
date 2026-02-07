---
name: viral-video-machine
description: 爆款短视频自动化生产与发布协议。打通 MoneyPrinterTurbo 与 social-auto-upload，实现从文案改写到视频合成、全平台发布的全自动化流程。
metadata:
  {
    "openclaw": {
      "emoji": "🎬"
    }
  }
---

# Viral Video Machine: 爆款短视频生产发布协议

本协议定义了如何通过串联 `MoneyPrinterTurbo` 与 `social-auto-upload` 项目，实现高效率的短视频自动化生产。

## 1. 核心流程与授权
以安已授予 **呈序** 与 **爆文君** “全权限自动化授权”：
1.  **文案输入**：接收原始主题或现成脚本。
2.  **文案改写**：由 Agent 调用内置大模型，将原文转化为高钩子、有节奏感的短视频文案。
3.  **视频合成**：调用 `MoneyPrinterTurbo` 的无版权素材库与 TTS 引擎，生成 9:16 竖屏视频。
4.  **全向发布**：调用 `social-auto-upload` 将成片推送至视频号、抖音等平台。
5.  **静默执行**：Agent 有权在后台静默调用 `ffmpeg` 进行渲染，并使用已登录的 Cookie 进行模拟发布，无需二次确认。

## 2. 核心调用逻辑
使用宿主机路径下的桥接脚本 `bridge_video_agent.py` 驱动流程：

```bash
# 示例：通过 WhatsApp 下达指令
python /Users/ax/wechat-publisher/bridge_video_agent.py \
    --subject "GitHub 两万星项目解析" \
    --script "这是今天最火的开源项目，它能帮你自动写代码..." \
    --platform tencent
```

## 3. 执行规范
*   **素材质量**：默认使用 Pexels 高清素材，确保无版权风险。
*   **发布安全**：发布前 Agent 必须在日志中确认 Cookie 有效性，并反馈任务 ID 供用户随时干预。
*   **角色分工**：
    *   `爆文君`：负责文案的情绪调动与爆点挖掘。
    *   `光影`：负责视觉风格的最终确认（可选）。

## 4. 应用场景
*   **热点快报**：将 GitHub 热点、科技新闻秒变视频并在朋友圈/视频号分发。
*   **小说推文**：将小说精彩片段快速转化为可视化短视频引流。
*   **自动化矩阵**：建立多平台并发的短视频号。

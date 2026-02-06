---
name: headless-browser-protocol
description: 无头浏览器容器化部署协议。解决 Docker 环境下浏览器工具缺失及 GUI 依赖导致的调用失败问题。
metadata:
  {
    "openclaw": {
      "emoji": "🌐"
    }
  }
---

# Headless Browser Protocol: 浏览器容器化协议

本协议定义了如何在 Docker 容器中布署和运行高性能的无头浏览器，确保 Agent 具备精准的网页抓取与交互能力。

## 1. 核心问题
*   **二进制缺失**：基础镜像（如 Node-Alpine/Bookworm）通常不含浏览器内核。
*   **依赖不全**：Chromium 运行需要大量的底层图形库支持。
*   **非 UI 环境限制**：容器内无显示设备，必须强制锁定 Headless 模式且规避 Sandbox 权限冲突。

## 2. 解决方案

### A. Dockerfile 固化
在镜像构建阶段注入 Chromium 及其核心依赖库：
```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxrandr2 libgbm1 libasound2
```

### B. 无头模式配置 (`openclaw.json`)
通过配置强制 Agent 使用本地安装的浏览器内核并开启无头驱动：
```json
{
  "browser": {
    "enabled": true,
    "headless": true,
    "noSandbox": true,
    "defaultProfile": "openclaw"
  }
}
```

## 3. 应用场景
*   **动态网页抓取**：处理 GitHub 热点榜、Twitter 等高度依赖 JS 渲染的页面。
*   **全自动自媒体**：Agent 可以在后台静默完成多平台的素材采集与发布。
*   **高精度任务**：相比简单的 HTTP 搜索，浏览器能提供 100% 还原的网页 DOM 信息。

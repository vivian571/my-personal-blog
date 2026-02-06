---
name: whatsapp-enhancement
description: WhatsApp Agent 功能增强指南，包含媒体发送、插件动作扩展以及桌面控制调研结论。
metadata:
  {
    "openclaw": {
      "emoji": "📱"
    }
  }
---

# WhatsApp Agent 功能增强技能包

本技能包记录了如何扩展 WhatsApp Agent 的能力，使其能够执行特定的桌面动作和发送本地媒体文件。

## 1. 扩展 `sendMedia` 动作

### 场景
需要 Agent 能够将电脑上的文件发送给手机用户。

### 实现步骤

1.  **修改插件导出 (`extensions/whatsapp/src/channel.ts`)**：
    在 `actions` 部分添加 `sendMedia` 到 `listActions` 和 `supportsAction`。
    ```typescript
    if (gate("media")) {
      actions.add("sendMedia");
    }
    ```

2.  **处理动作逻辑**：
    在 `handleAction` 中捕获 `sendMedia` 并调用运行时方法：
    ```typescript
    if (action === "sendMedia") {
      return await getWhatsAppRuntime().channel.whatsapp.handleWhatsAppAction({
        action: "sendMedia",
        chatJid: params.chatJid || params.to,
        mediaUrl: params.mediaUrl,
        text: params.text,
      }, cfg);
    }
    ```

3.  **核心工具层适配 (`src/agents/tools/whatsapp-actions.ts`)**：
    在 `handleWhatsAppAction` 中实现具体逻辑，调用 `sendMessageWhatsApp`。

## 2. 桌面控制与截图 (Desktop Control)

### 现状与限制
- **Docker 隔离**：Moltbot 运行在 Docker 容器中，无法直接访问宿主机的屏幕或执行 UI 自动化脚本。
- **Desktop Node 方案**：需要在宿主机单独启动 `moltbot-node` 并连接到网关。
- **构建障碍**：目前 Desktop Node 在本地构建（macOS）存在 `A2UI` 依赖冲突。

### 替代方案 (Workaround)
- **手动截图同步**：用户手动通过 `Cmd+Shift+4` 截图并发送给 WhatsApp Agent，Agent 利用 Vision 模型分析。
- **Puppeteer 网页截图**：Agent 可以通过 `browser-tool` 截取网页内容，无需物理桌面权限。

## 3. 常见故障排查

- **媒体发送失败**：检查文件路径是否在 Docker 挂载范围内。建议将需要发送的文件放在映射的卷（如 `/app/content`）中。
- **动作未显示**：确保 `openclaw.json` 中的 `channels.whatsapp.actions.media` 设置为 `true` 或未显式禁用。
- **本地大模型 (Ollama) 无法连接**：
  若在手机端提示模型不可用，需确保 `docker-compose.yml` 中设置了正确的 API 地址：
  ```yaml
  environment:
    OLLAMA_API_BASE_URL: "http://host.docker.internal:11434"
  ```
  并确保已在宿主机上设置 `OLLAMA_HOST=0.0.0.0` 以允许外部连接。

---

**维护者：** 以安的首席内臣  
**最后更新：** 2026-02-04

---
name: maintenance-guide
description: Moltbot (OpenClaw) 的运维与故障排查知识库，包含启动、调试、避坑等经验。
metadata:
  {
    "openclaw": {
      "emoji": "🔧"
    }
  }
---

# Moltbot (OpenClaw) 运维指南

本技能包记录了在以安的 MacBook 上运行 Moltbot 的所有成功调试经验与避坑指南，供后续故障排查参考。

## 1. 启动与重启 (Startup)

- **服务重启**：修改配置后需运行 `docker-compose up -d --force-recreate moltbot-gateway`。
- **本地 Ollama 启动**：需确保环境变量 `OLLAMA_HOST=0.0.0.0` 已设置并生效（通过 `launchctl` 或启动命令），否则容器无法连接。

## 2. 核心网络配置 (Networking)

- **容器访问宿主机**：使用 `host.docker.internal` 代替 `127.0.0.1`。
- **Docker 配置**：`docker-compose.yml` 必须包含 `extra_hosts: ["host.docker.internal:host-gateway"]`。
- **1008 Pairing 错误解决方案**：
  若 Dashboard 无法连接网关并报 1008 错误，在 `openclaw.json` 中配置：
  ```json
  "gateway": {
    "bind": "lan",
    "dangerouslyDisableDeviceAuth": true
  }
  ```
  这允许局域网设备无需配对直接访问。

## 3. 模型与配额管理 (LLM & Quota)

- **跳过冷却期**：若模型报错 `billing` 或 `rate_limit` 被禁用 5 小时，可手动清空 `config/agents/main/agent/auth-profiles.json` 中的 `usageStats` 字段，然后重启。
- **Google Antigravity**：若报错 “version no longer supported”，说明需要更新仓库（`git pull origin main`）并重新构建镜像。
- **备选链逻辑**：当主模型（如 Antigravity）失效时，通过 `fallbacks` 指定备选模型。
  ```json
  "agents": {
    "defaults": {
      "model": "google-antigravity/gemini-2.0-flash-exp",
      "fallbacks": ["groq/llama-3.1-70b-versatile", "ollama/deepseek-v2"]
    }
  }
  ```
- **配置优先级**：Google Antigravity (OAuth) -> Groq (API Key) -> Ollama (Local)。

## 4. 故障排查命令 (Troubleshooting)

- **查看实时日志**：`docker-compose logs -f moltbot-gateway`
- **连通性测试**：`docker-compose exec moltbot-gateway curl -v http://host.docker.internal:11434/api/tags`
- **查看认证状态**：检查 `config/agents/main/agent/auth-profiles.json` 中的 `expires` 和 `errorCount`。

## 5. 自动写稿挂载 (Output Mapping)

- **挂载逻辑**：输出文件夹必须挂载在 `moltbot-gateway` 服务下。
- **路径对应**：
  - 本地：`/Users/ax/wechat-publisher/wechat/wechat_publisher/documents/AI流习社`
  - 容器：`/app/ai_flow_club`
- **提示词目录**：挂载至 `/app/prompts`，使各技能包可直接调用。

## 6. 版本迁移记录

- **项目更名**：2026年2月，项目从 `moltbot` 更名为 `openclaw`。
- **配置迁移**：`moltbot.json` 会自动迁移为 `openclaw.json`。

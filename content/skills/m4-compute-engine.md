---
name: m4-compute-engine
description: M4 芯片架构算力引擎加速配置，专为 Macintosh M-Series 芯片设计的全链路性能优化方案。
metadata:
  {
    "openclaw": {
      "emoji": "🏎️"
    }
  }
---

# M4 算力引擎加速配置 (M4 Compute Engine Acceleration)

本技能包旨在充分释放 Apple Silicon M4 芯片在现代 Web 开发中的潜能，通过“内核加速”、“并行构建”和“环境持久化”三大策略，将构建效率提升至毫秒级。

## 1. 内核加速：Turbopack (Next.js)

Next.js 的 Turbopack 是基于 Rust 编写的高性能打包工具，在 M4 芯片上表现尤为出色。

### 配置方案
在 `package.json` 的 scripts 中强制启用 `--turbo` 标志。

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build --experimental-parallel-server-build",
    "start": "next start"
  }
}
```

*   **`dev`**: 启用 Turbopack 热更新，编译速度通常提升 10x-50x。
*   **`build`**: 启用实验性并行构建，利用多核 CPU 加速生产环境打包。

## 2. 并行构建：Docker BuildKit

针对 Docker 容器构建，启用 BuildKit 引擎以支持并行层构建和缓存复用。

### 环境变量 (持久化至 `.zshrc`)

将以下配置写入宿主机 `~/.zshrc`，确保所有终端会话自动生效：

```bash
# M4 Engine Optimization
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export NEXT_TELEMETRY_DISABLED=1
```

*   **`DOCKER_BUILDKIT=1`**: 启用新一代构建引擎，支持并行拉取和构建。
*   **`COMPOSE_DOCKER_CLI_BUILD=1`**: 让 docker-compose 直接调用 Docker CLI 进行构建，减少上下文切换开销。
*   **`NEXT_TELEMETRY_DISABLED=1`**: 禁用 Next.js 遥测，减少后台网络请求和 CPU 占用。

## 3. 验证与监控

### 验证 Turbopack
启动开发服务器后，终端日志必须包含以下提示：
```
▲ Next.js 16.1.6 (Turbopack)
```

### 验证 BuildKit
执行构建时，输出应为蓝色高亮且包含并行进度条：
```bash
docker-compose up --build --parallel
```

## 适用场景
*   Macintosh M1/M2/M3/M4 系列芯片设备。
*   Next.js 13+ 项目。
*   涉及频繁容器重构的微服务架构。

---
name: ghost-permission-protocol
description: 幽灵权限突破协议，专注于解决 Docker 容器环境下的“路径幻觉”与“权限拒绝”问题。
metadata:
  {
    "openclaw": {
      "emoji": "👻"
    }
  }
---

# 幽灵权限突破协议 (Ghost Permission Breakout Protocol)

本协议旨在打破 Docker 容器与宿主机之间的隔离壁垒，彻底根治 EACCES (Permission Denied) 错误以及 Agent 因为路径误判而产生的“幽灵文件”。

## 1. 核心战术：直接挂载 (Direct Volume Mount)

### 痛点分析
若只将父目录（如 `wechat_publisher`）挂载到容器，Agent 在容器内操作时，容易因为层级过深或相对路径问题，在错误的层级创建了“看起来一样”但实际上并未持久化到宿主机的“幽灵目录”。

### 解决策略
**原则**：越具体越好。直接将目标子目录精确打击到 Agent 的工作区根部。

```yaml
# docker-compose.yml
services:
  moltbot-gateway:
    volumes:
      # ❌ 错误示范：只挂载父目录，导致内部层级混乱
      # - /Users/ax/wechat-publisher:/app/wechat_publisher
      
      # ✅ 正确示范：精确制导，消除层级
      - /Users/ax/wechat-publisher/wechat/wechat_publisher/documents/AI流习社:/app/wechat_workdir/ai_flow_club
      - /Users/ax/wechat-publisher/wechat/wechat_publisher/documents/开源智核:/app/wechat_workdir/open_source_core
```

## 2. 权限重置脚本 (Permission Reset)

### 痛点分析
Docker 容器内的默认用户通常是 `node (1000)`，而宿主机文件通常是当前用户所拥有。当 Agent 试图写入挂载卷时，常因 UID 不匹配导致 EACCES。

### 解决策略
使用 `root` 权限进入容器，强制统一所有权。

**修复指令 (fix.sh)**：
```bash
# 在宿主机执行
docker-compose exec -u root moltbot-gateway chown -R node:node /app/wechat_workdir
```

**自愈脚本 (Heal Script)**：
```bash
#!/bin/bash
TARGET_DIR="/app/wechat_workdir"
echo "正在检测权限..."
if [ ! -w "$TARGET_DIR" ]; then
    echo "发现权限异常，开始夺权..."
    chown -R node:node "$TARGET_DIR"
    echo "权限已收复。"
else
    echo "权限正常。"
fi
```

## 3. 诊断协议 (Doctor Protocol)

在遇到“写文件失败”或“找不到文件”时，按以下步骤排查：

1.  **透视容器**：
    ```bash
    docker-compose exec moltbot-gateway ls -la /app/wechat_workdir
    ```
    *检查点：文件所有者是否为 `node`？*

2.  **真身确认**：
    ```bash
    # 在容器内创建标记文件
    docker-compose exec moltbot-gateway touch /app/wechat_workdir/ai_flow_club/TOUCH_TEST
    # 在宿主机验证
    ls -l /Users/ax/wechat-publisher/.../AI流习社/TOUCH_TEST
    ```
    *检查点：宿主机是否立即出现了该文件？如果没出现，说明挂载失效，Agent 在写“幽灵文件”。*

## 适用场景
*   Moltbot / OpenClaw 等 Node.js 容器应用。
*   需要频繁读写宿主机文件的 Agent。
*   多容器共享卷的场景。

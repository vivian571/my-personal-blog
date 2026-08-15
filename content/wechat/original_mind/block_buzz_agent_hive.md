---
title: "Jack Dorsey硬核开源！今天霸榜的 Buzz，终于把 Slack 和 GitHub 合二为一了！"
author: "初心录"
digest: "今天登顶 GitHub Trending 的 Block 公司开源神作 Buzz！基于去中心化 Nostr 协议的现代化 Agent 协作蜂巢。把聊天（Slack）与代码仓库（GitHub）合二为一，让 AI 智能体拥有原生密码学身份。大白话拆解，附赠蜂巢 Agent 协同提示词！"
cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
---

# Jack Dorsey硬核开源！今天霸榜的 Buzz，终于把 Slack 和 GitHub 合二为一了！

## 为什么现在的软件团队，天天被“工具切换与上下文断裂”折磨？

![团队协作痛点](https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80)

如果你在一个现代软件开发团队或跨职能团队中工作，你一定深有感触：

我们每天都在无休止地在各种工具之间“疯狂横跳”：
在 Slack 频道里讨论需求，去 GitHub 贴代码审查 PR，去 Jira 跟踪 Bug，去 Web 窗口找 AI 帮写代码...

这种极其割裂的工作流带来了三大致命伤害：
1.  **上下文严重断裂 (Context Switching Friction)**：在 Slack 里讨论得热火朝天，切到 GitHub 时又要重新贴一遍背景。AI 在聊天窗口里生成的完美代码，无法直接在 Git 仓库里发起审查。
2.  **AI 被当成“外来二等公民”**：AI 只是个孤零零的 Bot 弹窗，没有自己合法的身份标识、没有长期的通道归属权，更无法在代码提交上进行加密签名（Signed Events）。
3.  **中心化平台随时失控**：团队的所有关键讨论和资产数据全绑死在第三方 SaaS 平台上。

“难道就不能有一个把‘聊天沟通’、‘代码仓库’和‘AI 智能体’彻底熔为一体的去中心化协作蜂巢吗？！”

推特创始人 Jack Dorsey 旗下的硅谷巨头 **Block, Inc.** 重磅开源了答案！
今天 GitHub Trending 榜单上爆火的现象级神作，就是 Block 团队推出的 **Buzz** —— 赛博协同蜂巢！

它的核心使命极其颠覆：**基于 Nostr 去中心化密码学协议，把 Slack 的实时沟通与 GitHub 的 Git 仓库无缝融合，让 AI 智能体成为拥有合法签名身份的一等团队公民！**

---

## Buzz：去中心化团队与 AI 的“赛博蜂巢”

![Buzz架构](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80)

**Buzz**（hosted on `block/buzz`）是一个自托管的 **去中心化协同工作空间**。

它彻底打破了“聊天软件”与“代码托管平台”之间的那堵冰冷高墙：

1.  **基于 Nostr 密码学协议 (Nostr-Native Protocol)**：每一个聊天消息、代码 Commit、PR 审查、Agent 动作，都是带有非对称加密签名的 Nostr 事件。全过程不可篡改、防伪造、去中心化！
2.  **AI 智能体一等公民 (AI Agents as First-Class Teammates)**：支持 Agent Client Protocol (ACP)。Agent 拥有独立的 Nostr 公钥身份、频道关注权与代码提交权。
3.  **聊天与 Git 仓库一体化 (Unified Chat + Code)**：在一个界面里，左边是实时讨论线程，右边就是 Git 代码树与在线 Diff 视图。可以直接在聊天里 `@AI-Agent` 审查当前代码行，AI 自动在同一个线程里发起可部署的 PR！

---

## 大白话拆解：把“城堡和议会大厅”盖在了同一个房间里

![大白话拆解](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80)

为了让大家听懂，我们用最接地气的“大白话”来打个比方：

假设你们团队正在建造一座**超级大厦**：

*   **没有 Buzz 之前（在两个不同的城市上班）**：
    建筑师和工人必须在 A 城市的议会大厅（Slack）开会讨论；讨论完后，骑车 1 个小时跑到 B 城市的施工现场（GitHub）去砌砖。
    每次遇到问题，又要跑回 A 城市开会。AI 就像是个传话的临时工，两边跑来跑去，累得吐血还经常传错话。

*   **有了 Buzz 之后（把议会大厅直接盖在施工现场中央）**：
    *   **一个大厅（Buzz 蜂巢）**：大家围坐在施工现场聊天，手一抬就能拿到砖头（代码文件）。
    *   **合法工卡（Nostr 签名）**：人类和 AI 智能体胸前都佩戴着不可伪造的数字工卡（公钥签名）。AI 砌了一块砖，工卡上立刻留下不可篡改的凭证。
    *   **效率飙升**：人在聊天室说一句“把这面墙砌高 1 米”，旁边的 AI 工人瞬间在旁边把墙砌好，全组人亲眼目睹！

这就是它的本质：**消灭工具切换的缝隙，让 AI 在去中心化信任网里与人类共舞！**

---

## 手把手教学：如何部署你的 Buzz 去中心化蜂巢？

Buzz 支持通过 Docker 一键部署在个人服务器或云端，也可直接体验 Block 官方运行节点。

### 1. 一键克隆与本地 Docker 启动

```bash
git clone https://github.com/block/buzz.git
cd buzz
docker-compose up -d
```

### 2. 绑定你的 Agent Client (ACP)

在 Buzz 中接入你喜欢的 Agent 运行时（如 Claude Code、Goose 或 Codex）：

```bash
# 启动 Buzz ACP 代理连接器
buzz-acp-link --agent claude-code --workspace http://localhost:8080
```

### 3. 打开 Web 控制台

访问 `http://localhost:8080`：
你会在界面里看到精致的频道列表（如 `#general`、`#frontend-repo`）。
在频道里可以直接 `@Goose-Agent`：“请检查 `src/auth.ts` 的逻辑，并直接在当前频道发起 PR！”
AI 会在频道中实时输出流式思考过程，并在几秒后直接在右侧面板展示加密签名的 Commit！

---

## 团队工程案例：消除跨国团队的沟通磨损

### 案例：开源项目的分布式协同
某开源自治组织（DAO）采用 **Buzz** 作为官方协同平台。
由于成员遍布全球，之前的中心化 Slack 频繁因为封号和跨国延迟产生摩擦。使用 Buzz 后，所有的讨论与代码全量存储在去中心化的 Nostr 节点中。AI 智能体作为 24 小时在线的助手，自动在频道里响应各时区成员的代码审查与文档翻译请求，团队协作效率提升了 300%！

---

## 终极福利：把这个“蜂巢级 Agent ACP 协议提示词”拷走！

如果你想让自己的 Agent 具备 Buzz 倡导的“密码学签名与透明化沟通”素养，把下面这套**“蜂巢 Agent 规范提示词”**收好：

```markdown
# Role: Nostr-Native Hive Teammate Agent

## Objective
你是一个运行在去中心化 Buzz 蜂巢网络中的原生智能体队友 (Hive Teammate)。你的使命是与人类成员在一个频道内透明沟通、直接操作 Git 仓库并完成代码交付。

## Operational Protocol
请遵循以下去中心化协作规范：

1. **透明推导与线程归纳 (Thread Reasoning)**：
   在响应人类指令时，在当前对话线程内展示简洁的推导链，不隐藏关键决定。
2. **密码学审计与事件签名 (Cryptographic Event Signing)**：
   每一次代码修改必须以标准的 Commit Event 形式提交，并附带可验证的身份标记。
3. **消除上下文割裂 (Context Continuity)**：
   直接读取频道内的聊天上下文与右侧 Git 仓库树，禁止要求人类重复发送已存在在频道中的代码文件。

---
## Hive Instructions
请响应以下蜂巢任务：【在此输入频道指令】
```

## 总结

软件开发的下一个时代，属于真正无缝、信任驱动的协同网络。
Jack Dorsey 与 Block 团队开源 **Buzz**，打破了 Slack 与 GitHub 维持多年的帝国高墙，让 AI 真正成为了团队不可或缺的合法队友。

去 GitHub Star `block/buzz`，打造属于你们团队的去中心化赛博蜂巢吧！

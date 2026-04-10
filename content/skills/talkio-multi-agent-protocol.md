---
name: talkio-multi-agent-protocol
description: 多智能体协同协议，支持多模型群聊、角色辩论与共识达成工作流。
metadata:
  {
    "openclaw": {
      "emoji": "🎭"
    }
  }
---

# 多智能体协同协议 (Multi-Agent Collaboration Protocol)

> **目标**: 打破单模型思考的局限，通过编排多个具有不同偏好的 AI 模型，实现高质量的辩论、内容审查与接龙创作。

## 1. 核心链路：智能体议会 (Agent Parliament)

借鉴 `Talkio` 的多模型群聊架构，将 AI 协作从“一对一问答”升级为“多对多博弈”：

### 1.1 身份系统设定 (Persona System)
- **差异化模型**: 引入不同厂商的模型（如 Claude 擅长叙事，DeepSeek 擅长推理，GPT 擅长逻辑），赋予其独立的 **Persona**。
- **独立参数控制**: 为每个角色设定不同的温度 (Temperature) 和推理力度 (Reasoning Effort)，确保观点多样性。

### 1.2 交互逻辑编排 (Interaction Logic)
- **自由讨论模式**: 模型之间可以观察彼此发言，独立思考并展开辩论。
- **托管讨论模式**: 由人类或一个“主控 AI”设定话题（如：成语接龙、代码审查），指定模型轮流发言。
- **提及唤醒 (@Mention)**: 支持通过 @ 指定某个模型针对特定观点进行回应。

### 1.3 深度推理展示 (Reasoning Content)
- **<think> 标签渲染**: 实时展示模型的思考过程，增强决策的可追溯性。
- **上下文压缩**: 自动管理长对话历史，确保核心论点在多轮博弈中不丢失。

## 2. 协同工作流示例

1.  **代码审查流**:
    - `Agent A (Coder)`: 生成初步代码。
    - `Agent B (Security Specialist)`: 专门审计安全漏洞。
    - `Agent C (Optimizer)`: 提出性能优化建议。
2.  **创意策划流**:
    - `Agent A (Creative Director)`: 抛出爆款创意。
    - `Agent B (Critic)`: 扮演杠精，指出逻辑漏洞。
    - `Agent C (Execution Lead)`: 将创意转化为可执行的步骤。

## 3. 博物馆集成策略

- **决策资产化**: 将重大项目（如商业化路径）的 AI 辩论过程记录为 `session-logs/`，作为博物馆的决策资产。
- **角色实验室**: 在 `/skills` 中维护一套标准化的角色库，随时调用进入群聊场景。

---

_此协议由 **零壹 (Líng Yī)** 维护，旨在通过群体智能提升数字博物馆资产的生产质量与决策深度。_

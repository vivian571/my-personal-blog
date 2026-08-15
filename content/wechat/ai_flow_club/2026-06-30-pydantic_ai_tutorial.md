---
title: "大模型怎么也“听话”了？用 Pydantic AI 打造绝对听话的结构化 Agent"
date: "2026-08-15"
category: "AI 流习社"
tags: ["AI Tech", "WeChat Matrix"]
premium: false
---

# 大模型怎么也“听话”了？用 Pydantic AI 打造绝对听话的结构化 Agent

在大模型（LLM）开发里，最让人头疼的是什么？不是它不会写诗，而是它**不听话**！你让它回传一个 JSON，它非要加句“好的，这是你要的格式：”。大型项目里这差错一次，后台直接崩溃。

这时候，今天 GitHub Trending 上的超级红人 —— **Pydantic AI** 诞生了。它由大名鼎鼎的 Python 数据校验库 Pydantic 团队亲手打造，核心目的只有一个：**像用代码定义数据结构一样，死死约束大模型的输出。**

---

### 一、 大白话拆解：底层逻辑本质是什么？

*   **大白话翻译**：大模型本质上是一个“胡言乱语生成器”，它只管猜下一个词概率最大是什么。而 **Pydantic AI** 就像是给这个话痨配了一个**“模具”**。大模型吐出来的一堆废话，必须经过模具的挤压，塑造成完美的“方形”或“圆形”（即强类型数据），塑形失败（格式不对）就当场打回去重写。
*   **核心逻辑本质**：**类型驱动开发（Type-Driven Development）与自动纠错重试机制**。它通过生成 JSON Schema 传给 LLM 限制其输出，若 LLM 吐出的数据不符合 Pydantic 定义的校验规则（比如年龄少于0岁），框架会自动将错误信息丢回给 LLM 重新生成，直到完全符合规范为止。

---

### 二、 保姆级实操步骤

1.  **环境安装**
    ```bash
    pip install pydantic-ai
    # 配置你的大模型 API 密钥（以 OpenAI 为例）
    export OPENAI_API_KEY="your-api-key"
    ```

2.  **定义你想要的结构（模具）**
    ```python
    from pydantic import BaseModel, Field
    from pydantic_ai import Agent

    # 定义我们想要的输出格式：必须包含城市和气温，且气温有限制
    class WeatherResponse(BaseModel):
        city: str = Field(description="城市名称")
        temperature: int = Field(description="摄氏度气温，必须是数字")
        reason: str = Field(description="为什么是这个天气的一句话解释")
    ```

3.  **创建 Agent 并运行**
    ```python
    # 声明一个使用 gpt-4o 的智能体，约束其返回格式为 WeatherResponse
    agent = Agent('openai:gpt-4o', result_type=WeatherResponse)

    # 运行并打印
    result = agent.run_sync("帮我查一下今天东京的天气")
    print(result.data)
    # 输出：city='Tokyo' temperature=22 reason='Cloudy with occasional sunshine.'
    ```

---

### 三、 实战案例大放送

*   **案例 1：智能客服分发**。输入用户的吐槽，让大模型输出结构化的 `{"category": "投诉/建议/咨询", "urgency": 1-5, "summary": "简短摘要"}`，后端直接秒级路由给对应部门。
*   **案例 2：PDF 简历解析**。把一堆非结构化的简历扔进去，强行吐出符合 `{"name": str, "skills": list, "experience_years": int}` 的标准格式，入库极其丝滑。

---

### 四、 核心逻辑本质：价值提示词（Prompt 模板）

如果你不用 Pydantic AI 的代码库，你可以直接用这段**“强类型规约提示词”**在大模型对话里体验相似的逻辑：

```markdown
# Role: 严格的数据结构化器

# Task: 
请分析用户的输入，并严格按照以下 JSON Schema 输出数据。不要包含任何 Markdown 格式标识，不要包含“好的，这是你的JSON”等任何多余的废话。如果解析失败或信息缺失，请在对应字段填写 null。

# Schema:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "category": { "type": "string", "enum": ["投诉", "建议", "常规咨询"] },
    "urgency_score": { "type": "integer", "minimum": 1, "maximum": 5 },
    "resolved": { "type": "boolean" }
  },
  "required": ["category", "urgency_score", "resolved"]
}

# Input:
[在此输入你要解析的文本内容]
```

---

### 五、 多角度避坑指南

*   **优势**：开发大型 AI 工程时，类型安全有保障，减少前端/后端因为 JSON 格式错乱报 500 错误；自动重试机制很省心。
*   **劣势**：LLM 必须支持 Functional Calling（工具调用）或 JSON Mode 才能发挥最大威力；多次校验重试会额外消耗 Token 费用。
*   **适用人群**：写 Python 接口、做 Agents 落地的后端开发人员。如果是写纯文本的创作型任务，千万别用它，会直接锁死 AI 的灵感。

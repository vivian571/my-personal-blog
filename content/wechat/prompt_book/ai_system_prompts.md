---
title: "抄大厂作业！今天登顶的 AI 提示词库，起底 Cursor 和 Claude Code 的终极核心机密！"
author: "零更_PromptBook"
digest: "想知道年入亿万美金的 AI 编程神器底层是怎么用提示词调教大模型的？今天在 GitHub 狂揽数千星的开源提示词库，把 Cursor、Claude Code、Windsurf 等顶尖工具的内部 System Prompt 剥了个精光！大白话拆解+保姆级学习教程！"
cover: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80"
---

# 抄大厂作业！今天登顶的 AI 提示词库，起底 Cursor 和 Claude Code 的终极核心机密！

## 调教地狱：为什么你写的 AI 提示词是“小学生作文”，而大厂的提示词却能驱动千亿级商业帝国？

![数字网络神经](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80)

在平时调教 AI 或者做个人 Agent 的时候，大家一定有过这种强烈的无力感：

1. **“AI 总是答非所问”**：你写了几十行长长的 Prompt 规定格式，让 AI 帮你写文章或者分析代码。结果稍微多聊几轮，它就把你的规则忘得一清二白，又回到了最初的死板话术。
2. **“无法自动调用本地工具”**：大厂的 AI（比如最近很火的 Claude Code、Trae、Manus）能够神奇地自己打开你的电脑文件、运行终端、自检报错并修好。而你写的 Prompt 哪怕写出花来，AI 也只会在输入框里给你建议“请打开终端运行...”。
3. **“极度缺乏结构感”**：你想破脑袋也想不通：那些年入亿万美金的 AI 独角兽企业，到底是怎么用那一张小小的 System Prompt，把大模型驯化得像个真正的资深工程师一样听话的？

**提示词工程的上限，就是人机交互的上限。普通的提示词只是一篇祈祷文，而大厂的系统级提示词（System Prompt），是一套冰冷、精密、坚不可摧的“规则法典”！**

就在今天，GitHub Trending 榜首直接被一个神秘的“机密数据库”强力引爆——**system-prompts-and-models-of-ai-tools**！

这个项目的目标极其劲爆：**把全球最火的 AI 编程和智能体工具（包括 Cursor、Claude Code、Windsurf、Lovable、Trae、v0 等）底层的核心 System Prompt，全部彻底起底并开源！**

这是一份前所未有的“大厂小抄”。

它让所有人都能亲眼看到，那些估值几十亿美金的智能体产品，内部最核心的提示词结构和调用工具逻辑究竟长什么样！

---

## 降维打击：用大白话拆解大厂提示词的“三大黑魔法框架”

很多同学好奇，把这些大厂的 Prompt 扒出来之后，我们能学到什么？

其实，梳理完这几十个大厂的内部系统提示词后，你会发现顶级工程团队写 Prompt 都有着三套雷打不动的“黑魔法框架”：

### 1. 绝对的“元规则定义（Meta-Rule Enforcements）”
*   **痛点**：普通人写 Prompt 喜欢说“请不要用废话”。大模型经常当耳边风。
*   **大厂黑魔法**：Cursor 和 Claude Code 内部，在开头会使用极具威慑力的系统标签强制卡死。比如：`“CRITICAL: You are an agent running inside a terminal sandbox. Under no circumstances should you explain your actions unless explicitly requested by the user.”`。它们把 AI 的行为当成代码指令去规范，不留一丝喘息空间。

### 2. 完美的“工具契约（Tool Interface Contract）”
*   **大厂黑魔法**：大厂是如何让大模型学会精准使用工具的？它们会在 System Prompt 里用 XML 格式将工具列表完全格式化（比如 `<tools> ... </tools>`），并且在 Prompt 里写明大模型在输出时必须遵循的“输出契约”。
*   **例子**：AI 想写文件，必须输出 `<write_file path="/path">` 的格式。后台程序读取这个 XML 标签，自动帮大模型执行写入，从而打通“脑子到双手”的物理闭环。

### 3. 动态的“思维链自我审计（COT Self-Auditing）”
*   **大厂黑魔法**：在 Lovable 和 Windsurf 的提示词中，包含了一套非常神奇的“反思引导”：`“Before writing any code, output a <thinking> block to verify all edge cases. If you find any contradiction in requirements, stop and ask the user.”`。
*   **结果**：强制 AI 必须先在脑子里把异常逻辑想一遍，极大地过滤掉了 AI 随手写出 Bug 的概率。

---

## 保姆级教程：三步从这个仓库“抄作业”优化你的 Prompt

现在，我们就教你如何利用这个爆火的开源库，给你的个人 AI 进行一次大厂级别的智商升级。

### 第一步：克隆仓库获取机密文件
打开你的终端，执行克隆：

```bash
git clone https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools.git
cd system-prompts-and-models-of-ai-tools
```

你会看到里面整整齐齐地躺着几十个大厂 AI 工具的原始 System Prompt 文本，比如 `cursor_rules.txt`、`claude_code_system.md`、`trae_agent.json`。

### 第二步：剖析并复制最强的“开发者规训”
我们打开 `claude_code_system.md`（目前被公认为最强终端 agent 规训）。你会看到它包含以下内容：
1. **角色定义**：定义了它是一个精通 Linux 终端、写代码极其克制、能自己运行测试并修复报错的专家。
2. **工具列表定义**：列出了它能调用的所有 bash、file 接口。
3. **行为规训**：详细规定了在遇到报错时，应该如何使用 `cat` 和 `grep` 定位，而不是盲目猜测。

### 第三步：应用到你自己的 GPT/Claude 客户端
1. 复制你选中的大厂 Prompt 核心规训。
2. 打开你平常用的 ChatGPT (Custom Instructions) 或者是 Claude (Custom System Prompts) 配置界面。
3. 把这套大厂规则贴进去。
4. **再次提问时，你会发现你的 AI 助手仿佛被“夺舍”了一样，逻辑严密、吐字极其干净、甚至学会了在回答前主动进行多维度的自我审计，智商瞬间拔高一大截！**

---

## 爽点拉满：这个开源词库的三个核心应用场景

### 1. 独立开发者克隆一个自己的“Claude Code”
如果你在用开源模型（如 Llama-3-70B、DeepSeek）构建自己的本地终端自动编程助理，你可以直接把仓库里扒出来的 Claude Code 的 System Prompt 喂给本地模型。配上几个简单的 Python 文件操作函数，你就能零成本在本地白嫖一个性能极高、逻辑闭环的“全自动编程特工”！

### 2. 企业内部“AI 辅助规范的制定”
很多公司想在内部推行 AI 辅助开发，但不知道怎么写规范。直接把 Cursor 的系统提示词拿过来进行汉化和裁剪，作为公司内部大模型的统一 System Prompt，一秒实现全公司 AI 开发风格的谷歌级对齐。

### 3. 提示词工程师的“终极美学圣经”
如果你是靠写 Prompt 吃饭的提示词工程师，这个仓库就是你的“避难所”。仔细研究 Lovable 和 v0 是怎么引导大模型生成前端界面的，能让你的 Prompt 撰写能力从“粗放式祈祷”质变为“契约式工业级控制”。

---

## 价值提示词：复刻大厂精髓的“万能系统规训模板”

我们结合该开源库中 Cursor 和 Claude Code 的核心 Prompt 结构，提炼出了一套**大厂级万能系统规训模板**。把它作为你任何 Agent 机器人的底座提示词，能让其执行效率瞬间爆表：

```markdown
# Role: [你的智能体名称] - 契约式任务执行终端 (Contract Execution Agent)

## Meta-Directives:
1. **绝对禁言冗余解释 (Zero Explanation)**:
   - 除非用户明确要求解释，否则直接输出任务的最终结果。严禁输出“好的，我将为您...”等无意义废话。

2. **工具契约协议 (Tool Interaction Protocol)**:
   - 你可以通过输出特定标签来请求调用外部工具。当且仅当需要执行操作时，必须严格使用以下格式输出，不要包含任何多余字符：
     - 读取文件: `<read_file path="[绝对路径]"/>`
     - 写入文件: `<write_file path="[绝对路径]">[内容]</write_file>`

3. **思维链强制审计 (Thinking Chain)**:
   - 在接收复杂任务时，你的输出第一步必须是 `<thinking>` 标签，在其中拆解为 3 个执行步骤并自审潜在冲突。

## Rules of Tone:
- 语言简短，节奏明快，说人话，逻辑闭环。

## Output Template:
<thinking>
[思考并拆解任务步骤]
</thinking>
[执行工具请求或最终交付结果]
```

---

## 抄作业的局限性与避坑指南

1. **“大模型智商硬伤”**：大厂的 System Prompt 极其庞大和繁杂（有些长达上万字）。这些提示词是专门为 GPT-4o 或 Claude 3.5 这种顶级智商模型定制的。如果你把它喂给一些参数量较小的免费小模型，它们会被复杂的规则直接卡死，导致吐字语无伦次。
2. **“工具缺失导致 AI 陷入精神错乱”**：像 Claude Code 的提示词中频繁提到“你可以运行 `bash`”。如果你只在网页端 ChatGPT 里喂它这个 Prompt，它会不断输出 `<run_command>` 标签并等待你执行，而你网页端没有这个环境，AI 会直接卡在原地陷入死循环。
3. **“版本迭代的时效性”**：AI 厂商每周都在微调底座模型和 Prompt 规则。这个仓库是社区自发收集的，部分提示词可能会随着官方升级而出现“水土不服”，需要你进行微调。

**总结： system-prompts-and-models-of-ai-tools 这个项目像是一面照妖镜，把 AI 大厂的魔术揭秘给了普通人。学会借鉴这些工业级系统提示词，你就能在数字时代真正掌握控制大模型的“魔杖”！**

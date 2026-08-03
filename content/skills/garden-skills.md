---
name: garden-skills
description: 花园老师的开源 Agent Skills 集合，包含网页视频演示、网页设计工程师、GPT Image 2 和本地知识库检索器。
homepage: https://github.com/ConardLi/garden-skills
metadata:
  {
    "openclaw":
      {
        "emoji": "🏡",
        "requires": { "bins": ["npx"] },
        "primaryEnv": "NONE",
        "install":
          [
            {
              "id": "garden-skills-cli",
              "kind": "npm",
              "formula": "skills",
              "bins": ["npx"],
              "label": "Install Garden Skills via npx",
            },
          ],
      },
  }
---

# Garden Skills: 下一代 AI 智能体技能化工程规范

> [!IMPORTANT]
> **🚀 沉浸式互动看板已开启！**
> 
> 本文关联的 **[Garden Skills 交互式展示画廊 (Interactive Showcase Gallery)](/skills/garden-skills)** 已经完美部署！在画廊中，您可以直观感受 23 套大师级视觉主题，并在深色极客仿真终端中一键复制和测试这些强大的 Agent 技能！强烈推荐您点击前往体验。

---

## 1. 核心理念：从“写 Prompt”到“工程化技能”

在传统的 AI 交互中，我们通常使用“提示词工程（Prompt Engineering）”来约束 AI 的行为。然而，大段的 Prompt 存在**极易遗忘、Token 消耗大、无法版本控制、逻辑边界模糊**等缺陷。

`garden-skills` 采用的 **Agent Skills（智能体技能）** 范式彻底改变了这一点。它遵循 [agentskills.io](https://agentskills.io) 规范，将 Prompt 升级为高度结构化、工程化的 **`SKILL.md`** 格式。一个标准的 Skill 目录由以下几部分组成：
*   **`SKILL.md` (核心元数据与声明式指令)**：定义了该技能的名称、描述、运行依赖项，以及极其精准的工作流守卫（Guardrails）。
*   **`scripts/` (辅助工具链)**：可选。供 Agent 执行时调用的自动化脚本（如 TTS 语音合成、PDF 解析、代码格式化等）。
*   **`resources/` (静态资源与模板)**：可选。内置脚手架模板和现成配方，供 Agent 一键创建工程。

这种设计使得技能拥有了**可插拔、可分发、可版本化控制**的特征，是真正面向下一代 AI 软件工程的智能体插件系统。

---

## 2. 四大核心技能深度剖析

`garden-skills` 首发内置了四个高水准的垂直领域技能包，完美覆盖了网页视频、现代前端设计、图像生成以及本地知识处理：

### 🛠️ A. `web-video-presentation`（网页视频与演示工程）
*   **定位**：将普通的口播稿、技术文章、产品 Demo 直接编译成适合高品质录屏的 16:9 交互式网页演示系统。
*   **底层原语**：
    *   构建了一个固定 `1920×1080` 物理尺寸的画布，通过 `scale()` 自适应缩放，确保在任何视口下录制出的视频比例都绝对精准、无任何边缘抖动。
    *   采用 `(chapter, step)` 双维游标设计，一个视觉步骤严密对应一个口播节拍（Narration beat）。
    *   内置 **23 套顶级设计大师主题**（如瑞士国际主义风格、Blueprint 蓝图风格、Creative Voltage 创意电流等），并提供可插拔的 **TTS 语音合成** 接口（支持 MiniMax、OpenAI TTS、ElevenLabs 等）。

### 🎨 B. `web-design-engineer`（网页设计工程师）
*   **定位**：将 AI 写的“能用但简陋”的网页，推向具备资深设计审美、克制美学的高端前端级产物。
*   **反 AI 俗套设计守卫（Anti-Cliché Guardrails）**：
    *   显式列出了“AI 俗套 UI 黑名单”（如无脑的亮蓝色渐变、千篇一律的卡片圆角阴影、毫无个性的矢量插画等），逼迫 Agent 跳出思维定势。
    *   要求使用符合人类视觉感知的 `oklch()` 颜色空间进行配色，保证现代质感与无障碍对比度。
*   **风格配方库**：
    *   内置 25 套经典设计学派配方（Stripe Press 科技极简、Aesop 雅致文学、Bloomberg 信息高密等），包含现成的 Palette、Typography 与招牌动效代码，让 Agent 能够做出极具品牌感的设计。

### 🖼️ C. `gpt-image-2`（图像生成与 Prompt 顾问）
*   **定位**：基于 DALL-E 3 或兼容 API，可预测、工业化地批量生成海报、架构拓扑图、微缩模型等极美配图。
*   **核心特性**：
    *   内置 18 个视觉分类与 80+ 套高度结构化的 Prompt 模板，消除 AI 生成的不确定性。
    *   **三维自适应运行模式 (Tri-Mode)**：自动探测环境，支持本地直接生成（Mode A）、调用宿主 Tool 托管（Mode B）、以及降级为“Prompt 顾问”提供一键复制代码（Mode C）。
    *   将生成的图片文件与其完整的元数据 JSON 自动归档至同一 `.archive/` 目录，方便版本溯源。

### 📂 D. `kb-retriever`（本地知识库检索器）
*   **定位**：在不撑爆 Agent 上下文（Context Window）的前提下，极低成本、高精准地跨 PDF、Excel 和 Markdown 进行多源检索与提炼。
*   **智能检索流程**：
    *   强制 Agent 优先定位 `data_structure.md` 文件（类似于索引地图），而不是盲目全局 `grep`。
    *   **“先学后做”原则**：在解析复杂 PDF（使用 `pdfplumber`）或分析 Excel（使用 `pandas`）前，强制 Agent 先阅读参考文档，确保脚本运行零差错。
    *   设置 **5 轮最大检索上限** 防盗刷，防止 AI 在未知领域陷入死循环。

---

## 3. 为什么这个仓库极具前沿示范价值？

1.  **终结了“一键生成”的粗糙习惯**：
    传统的 Prompt 期望一步到位，往往产生低劣代码。该项目引入了 **硬 Checkpoint 确认制**。在生成代码前，Agent 必须把口播稿、设计系统 Token 等核心节点输出出来，等待人类在终端回复 `Y/N` 确认，再进行下一步，这种“人类在环中（Human-in-the-loop）”的设计是开发安全系统的必由之路。
2.  **树立了现代 CSS 架构的标杆**：
    技能包完全拥抱现代浏览器原生 API，大量采用 Cascade Layers (`@layer`)、原生 Nesting、`:has()` 选择器以及 `@scope` 局部作用域，彻底摆脱了复杂的 JS 库和重型的 UI 库负担，性能逼近极限。

---

## 🚀 快速上手与集成

您可以通过以下几种方式快速将这些优秀的技能加入您的 AI 编程助手：

### 方式 1：使用 `skills` CLI 一键导入（推荐）
在终端中运行：
```bash
# 导入设计工程师技能
npx skills add ConardLi/garden-skills/tree/web-design-engineer-v1.2.1/skills/web-design-engineer

# 导入网页录屏演示技能
npx skills add ConardLi/garden-skills/tree/web-video-presentation-v1.2.1/skills/web-video-presentation
```

### 方式 2：手动解压拷贝
前往 [GitHub Release 页面](https://github.com/ConardLi/garden-skills/releases) 下载对应版本的 `.zip` 包，解压后将文件夹拷贝至您项目根目录的 `.agents/skills/` 文件夹下。当您在与编程助手聊天时提到“制作 16:9 网页演示”或“设计个极简的落地页”时，助手便会自动加载该技能，并严格按照工作流规范引导您协作！

---

快来尝试将这套规范融入您的日常开发流程中，感受工程化智能体技能带来的效率狂飙吧！🚀

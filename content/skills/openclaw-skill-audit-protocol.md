---
name: openclaw-skill-audit-protocol
description: 技能资产审计协议，用于从海量社区技能中筛选、清洗并安全集成高质量的 OpenClaw 技能资产。
metadata:
  {
    "openclaw": {
      "emoji": "🛡️"
    }
  }
---

# 技能资产审计协议 (Skill Audit & Curation Protocol)

> **目标**: 确保数字博物馆集成的每一个技能都是“精选且安全”的。从 13,000+ 的海量数据中提炼出真正具有生产力价值的主权资产。

## 1. 核心过滤逻辑：从噪声到信号

借鉴 `awesome-openclaw-skills` 的筛选机制，我们将技能审计拆解为五个维度：

### 1.1 垃圾与冗余清理 (Noise Reduction)
- **排除低质资产**: 自动过滤掉批量创建的测试账号、垃圾内容或非英语/中文描述的技能（约占原始数据的 30%）。
- **去重审计**: 针对同名或功能高度相似的技能进行合并，仅保留维护频率最高、文档最全的版本。

### 1.2 领域聚焦 (Domain Focus)
根据“数字博物馆”的资产属性，优先集成以下领域：
- **Coding Agents & IDEs**: 提升自动化编程能力。
- **Browser & Automation**: 增强互联网感知边界。
- **Media & Generation**: 视频、音频与图像的自动化策展。
- **Notes & PKM**: 知识管理与持久化记忆。

### 1.3 安全合规审计 (Security Audit)
- **静态代码扫描**: 使用 Snyk 等工具检查技能是否存在恶意 Payload 或不安全的数据处理。
- **权限边界检查**: 严格审计技能所需的 OAuth 权限，优先选择最小权限原则 (Least Privilege) 的技能。
- **VirusTotal 集成**: 利用官方合作伙伴的扫描结果，标记任何具有安全隐患的资产。

## 2. 策展重构流 (Curation Workflow)

1.  **发现 (Discovery)**: 实时同步 [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills) 的精选列表。
2.  **本地化适配**: 将外部技能转化为符合博物馆 **[USD Whitepaper]** 风格的文档，并添加专属 Emoji 标识。
3.  **安装分级**:
    - **Global**: 存放在 `~/.openclaw/skills/`，作为全局基础能力。
    - **Workspace**: 存放在 `./skills/`，作为当前博物馆项目的专项能力。

## 3. 示例：如何评估一个新技能？

- **❌ 排除**: 描述模糊、只有一行代码、需要过多敏感权限。
- **✅ 集成**: 具有清晰的 `README.md`、完善的错误处理逻辑、来自知名开发者或经过社区高赞验证。

---

_此协议由 **零壹 (Líng Yī)** 维护，旨在为主权资产库构建一道坚固且高效的能力护城河。_

---
name: xhs-agent
description: 小红书自动化助手，用于启动小红书登录服务和发布内容。使用 xhs-login 启动登录界面，使用 xhs-publish 上传图片或 markdown 文件。
---

# 小红书自动化助手 (xhs-agent)

此技能用于自动化小红书的登录和内容发布流程。

## 功能

### 1. 登录小红书 (xhs-login)

**描述:** 启动小红书的登录服务，该服务会通过一个 Web 界面提供二维码供您扫码登录。我将负责成功启动服务并输出本地访问链接。您将亲自完成扫码和浏览器交互。我会在后台持续监控 `~/xhs_factory/data/cookies.json` 文件的生成，一旦生成，即表示登录成功。

**用法:**

```bash
xhs-login
```

**执行命令:** `cd ~/xhs_factory && source venv/bin/activate && streamlit run Autoxhs.py`

**预期输出:**
服务启动后的本地访问链接，例如：`http://localhost:8501`。
随后，我会提示您进行扫码操作，并告知我正在监控 `cookies.json` 文件。

### 2. 发布小红书内容 (xhs-publish)

**描述:** 发布图片或 Markdown 文件到小红书。此功能接受一个文件路径作为参数。当您拖拽图片或 `.md` 文件给我时，我将自动提取其绝对路径并用于发布。

**用法:**

```bash
xhs-publish --file <文件绝对路径>
```

**参数:**
*   `--file`: 要发布的文件（图片或 `.md` 文件）的绝对路径。

**默认文案生成:**
如果您在调用 `xhs-publish` 时没有提供特定的文案，我将自动调用我的本地模型或 GLM 接口，根据您提供的图片内容生成一段极具“小红书感”的文案，并随文件一同发布。

**执行命令:** `cd ~/xhs_factory && source venv/bin/activate && python publish_tool.py --file {{file_path}}`

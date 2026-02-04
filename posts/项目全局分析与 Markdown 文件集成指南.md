---
title: 项目全局分析与 Markdown 文件集成指南
date: 2025-08-10
slug: project-analysis-markdown-integration-guide
tags: [项目文档, Markdown, 集成指南]
status: published
---

### 一、 数据流动全景分析

要理解如何集成您的内容，首先要清楚整个系统是如何运作的。当一个用户想要阅读一篇文章时，数据会像下面这样流动：

1.  **用户请求 (前端)**: 用户在浏览器中打开 `post.html?id=1` 页面。
2.  **JS 发起 API 调用 (前端)**: 页面中的 `js/script.js` 文件会获取 URL 中的 `id=1`，然后向后端发起一个 `fetch` 请求，访问地址：`http://127.0.0.1:5000/api/posts/1`。
3.  **Flask 处理请求 (后端)**: `app.py` 中的 `get_post(post_id)` 函数被触发。
4.  **查询数据库 (后端)**: Flask 连接到 `blog.db` 数据库，在 `posts` 表中查找 `id` 为 1 的记录。它找到了对应的标题、摘要以及最重要的信息——`md_file` 字段的值，比如 `posts/my-first-article.md`。
5.  **读取文件 (后端)**: Flask 根据上一步获取的文件路径，从服务器的硬盘上读取 `posts/my-first-article.md` 文件的**全部文本内容**。
6.  **返回数据 (后端 -> 前端)**: Flask 将文章的标题、摘要、创建时间以及刚刚读取到的 Markdown 文本内容打包成一个 JSON 对象，返回给前端的 `js/script.js`。
7.  **渲染页面 (前端)**: `js/script.js` 接收到 JSON 数据。它会做两件事：
    * 将标题、发布日期等信息填入 `post.html` 的相应位置。
    * **【核心步骤】** 使用一个专门的 JavaScript 库，将返回的 Markdown 纯文本实时转换成带格式的 HTML。
    * 最后，将生成好的 HTML 插入到页面的正文区域。

### 二、 如何将您的 MD 文件展示在项目中 (分步指南)

现在，让我们来替换掉原来的示例内容，换上您自己的文章。

#### **第一步：放置您的 `.md` 文件**

将您所有想要作为博客文章的 `.md` 文件，全部放入项目根目录下的 `posts` 文件夹中。如果这个文件夹不存在，请创建一个。

例如，您放入了两个文件：

* `posts/how-to-use-ai.md`
* `posts/my-trip-to-the-mountains.md`

#### **第二步：在数据库中“注册”您的文章**

光有文件还不够，我们需要在数据库中为它们建立索引。

**基础方案 (手动)**：对于快速原型验证，最直接的方法是手动编辑 `database.py` 脚本来添加文章信息，然后重新运行脚本。

**进阶方案 (自动同步)**：为了提高效率和减少错误，我建议创建一个能自动同步的Python脚本。该脚本可以：1. 扫描 `posts` 文件夹下的所有 `.md` 文件。 2. 从每个文件的顶部（使用像---这样的分隔符，即Front Matter）读取元数据（如标题、摘要）。3. 自动将这些信息更新或插入到数据库中。这样，您未来只需在 `posts` 文件夹中增删文章，然后运行一次同步脚本即可，无需改动代码。

打开 `database.py` 文件，找到 `posts_to_insert` 这个列表，将其修改为您的文章信息：

```python
# ... (前面的代码保持不变) ...

# --- 插入指向 MD 文件的示例数据 ---
# 将这里的内容替换为您自己的文章信息
posts_to_insert = [
    (
        '如何与AI高效协作',  # 文章标题
        '本文探讨了作为项目总监，如何指挥AI完成复杂的软件开发任务。', # 文章摘要
        'posts/how-to-use-ai.md'  # 指向您文件的正确路径
    ),
    (
        '我的登山之旅',
        '一次难忘的登山经历，记录了沿途的风景和挑战。',
        'posts/my-trip-to-the-mountains.md'
    )
]

# ... (后面的代码保持不变) ...
```

**修改完成后，在命令行中重新运行此脚本（重要提示：该脚本会清空并重建整个`posts`表，仅适用于开发环境初始化，切勿在含有重要数据的生产环境数据库上执行！）：**

```bash
python database.py
```

这样，数据库就知道您的新文章了。

#### **第三步：实现前端的 Markdown 渲染**

这是连接一切的最后一步。我们需要修改 `js/script.js`，并引入一个能将 Markdown 转换为 HTML 的库。我推荐使用 `marked.js`，它非常轻量且强大。

**安全警告**：为了防止恶意脚本通过Markdown文件注入页面（XSS攻击），绝不能直接将 `marked.js` 的输出插入到HTML中。我们必须先对其进行清理。推荐将 `marked.js` 与 `DOMPurify` 这个库结合使用。您的前端处理流程应该是：

1.  `fetch` 获取Markdown原文。
2.  `marked.parse()` 将其转换为HTML字符串。
3.  `DOMPurify.sanitize()` 清理该HTML字符串。
4.  最后才将清理过的、安全的HTML插入页面。

##### **在 HTML 中引入 `marked.js`**

请在 `index.html` 和 `post.html` 两个文件的 `<head>` 标签底部，加入以下这行代码，通过 CDN 引入 `marked.js` 库。

```html
<script src="[https://cdn.jsdelivr.net/npm/marked/marked.min.js](https://cdn.jsdelivr.net/npm/marked/marked.min.js)"></script>
```

##### **更新 `js/script.js`**

用下面这个完整版本的代码，替换掉您 `js/script.js` 文件中的所有内容。这段代码负责了我们“数据流动”分析中的所有前端逻辑。

我为您生成了全新的 `script.js` 文件。

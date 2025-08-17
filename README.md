# My Personal Blog

这是一个基于 Next.js 构建的现代化、高性能个人博客项目。内容通过简单的 Markdown 文件进行管理，旨在提供一个优雅的写作和阅读平台。

## ✨ 项目理念

遵循从“静态页面”到“动态应用”的演进策略，首先建立一个稳定、快速的静态博客，并为其未来扩展为全栈应用打下坚实的基础。

## 🚀 技术栈

*   **框架**: [Next.js](https://nextjs.org/) (React 框架)
*   **UI**: [React](https://react.dev/) & [Bootstrap](https://getbootstrap.com/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **Markdown处理**: [gray-matter](https://github.com/jonschlinkert/gray-matter), [remark](https://github.com/remarkjs/remark), [remark-html](https://github.com/remarkjs/remark-html)

## ✍️ 如何发表一篇新文章

发表一篇新文章非常简单：

1.  在项目根目录的 `posts` 文件夹中，创建一个新的 `.md` 文件（例如 `my-new-post.md`）。
2.  在文件顶部，按照以下格式添加元数据 (frontmatter)：

    ```markdown
    ---
    title: '这是我的新文章标题'
    date: '2024-08-18'
    ---

    这里是你的文章正文，使用 Markdown 语法书写...
    ```

3.  保存文件，然后重新启动开发服务器或部署项目即可看到新文章。

## 🛠️ 本地开发

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

3.  在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 部署

本项目配置了通过 GitHub Actions 自动部署到 GitHub Pages 的流程。您只需要将代码推送到 `main` 分支，部署就会自动触发。

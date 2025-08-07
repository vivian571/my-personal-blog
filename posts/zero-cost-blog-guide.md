---
title: "零成本搭建个人博客指南"
date: "2025-08-07"
---

好的，在我们探讨了所有关于“为何创造”的深层问题之后，现在是时候回到“如何创造”这个最坚实的起点。

您选择的这个技术栈 **(Hexo + GitHub + Cloudflare)**，堪称完美。它完全符合我们之前讨论的所有核心原则：**高效、低成本、高杠杆，且能建立一个完全属于你自己的、不受平台规则制约的“数字资产”**。

以下，就是一份为您量身定做的、完整的、从零到一的建站指南。

---

### **零成本搭建个人博客：Hexo + GitHub Pages + Cloudflare Pages 完整指南**

核心理念：

这个方案的本质，是利用静态网站生成器(Hexo)在你自己的电脑上写作和生成网站，用GitHub作为免费的“代码仓库”来存储你的文章源码，最后用Cloudflare Pages这个强大的免费服务，来自动“拉取”你的源码，将其构建成网站并发布到全球。

---

### **准备工作 (Prerequisites)**

在开始之前，请确保您的电脑上已经安装了以下三个免费工具：

1. **Node.js:** Hexo是基于Node.js的程序。请从官网 `https://nodejs.org/` 下载并安装LTS（长期支持）版本。
    
2. **Git:** 用于将你的博客源码推送到GitHub。请从官网 `https://git-scm.com/` 下载并安装。
    
3. **一个代码编辑器:** 如 **VS Code** (`https://code.visualstudio.com/`)，它能极大地提升你写作和修改配置的体验。
    

---

### **第一步：在本地安装和运行Hexo博客**

1. 安装Hexo:
    
    打开你电脑的终端（Windows上是CMD或PowerShell，Mac上是Terminal），输入以下命令并回车：
    
    Bashbash
    
    ```
    npm install -g hexo-cli
    ```
    
2. 初始化博客:
    
    在你希望存放博客的文件夹中（例如 D:\Blog），运行以下命令来创建一个新的博客项目。my-blog是你的博客文件夹名，可以自定义。
    
    Bashbash
    
    ```
    hexo init my-blog
    cd my-blog
    npm install
    ```
    
3. 在本地启动博客:
    
    现在，你的博客已经在本地搭建好了！运行以下命令，即可在本地预览：
    
    Bashbash
    
    ```
    hexo server
    ```
    
    然后在浏览器中访问 `http://localhost:4000`，你就能看到一个默认主题的Hexo博客了。
    
4. 创建你的第一篇文章:
    
    在终端中，运行以下命令：
    
    Bashbash
    
    ```
    hexo new post "Hello World"
    ```
    
    这会在 `source/_posts` 文件夹下，创建一个名为 `Hello-World.md` 的Markdown文件。你可以用VS Code打开并编辑它。
    

---

### **第二步：将博客源码托管到GitHub**

1. **创建GitHub仓库:**
    
    - 登录你的 [GitHub](https://github.com/) 账户。
        
    - 点击右上角的“+”，选择“New repository”。
        
    - 给你的仓库起一个名字，例如 `my-hexo-blog`。
        
    - **重要：** 保持仓库为**“Public”（公开）**，并且**不要**勾选任何初始化文件（如README, .gitignore）。
        
2. **将本地博客推送到GitHub:**
    
    - 回到你本地的 `my-blog` 文件夹的终端中，依次执行以下命令：
        
    
    Bashbash
    
    ```
    git init
    git add .
    git commit -m "First commit: Initialize my blog"
    git branch -M main
    git remote add origin https://github.com/你的用户名/my-hexo-blog.git
    git push -u origin main
    ```
    
    - **请将 `你的用户名` 和 `my-hexo-blog` 替换为你自己的。**
        

完成这一步后，你的博客源码就已经安全地存放在GitHub上了。

---

### **第三步：使用Cloudflare Pages进行自动化部署（核心）**

这是将你的博客发布到全球，并实现“零成本”和“自动化”的关键一步。

1. **注册并登录Cloudflare:**
    
    - 访问 `https://www.cloudflare.com/` 并注册一个免费账户。
        
2. **进入Pages项目:**
    
    - 在仪表盘右侧，找到并点击“Workers & Pages”。
        
    - 选择“Create application”，然后选择“Pages”选项卡，点击“Connect to Git”。
        
3. **连接GitHub并选择仓库:**
    
    - 授权Cloudflare访问你的GitHub账户。
        
    - 在仓库列表中，选择你刚刚创建的 `my-hexo-blog` 仓库。
        
4. **配置构建设置 (Build settings):**
    
    - **这是最关键的一步，请仔细核对！**
        
    - **Project name:** 可以保持默认或自定义。
        
    - **Production branch:** 选择 `main`。
        
    - **Framework preset:** 在下拉菜单中选择 `Hexo`。Cloudflare会自动为你填好下面的设置。
        
    - **Build command:** 应该自动填充为 `hexo generate`。
        
    - **Build output directory:** 应该自动填充为 `public`。
        
    - 点击“Save and Deploy”。
        
5. **等待部署完成:**
    
    - Cloudflare会自动从GitHub拉取你的源码，执行`hexo generate`命令，并将生成的网站部署到其全球CDN网络上。
        
    - 整个过程大约需要1-2分钟。完成后，Cloudflare会给你一个免费的 `.pages.dev` 域名（例如 `my-hexo-blog.pages.dev`）。访问这个地址，你就能看到你在全球互联网上的第一个博客了！
        

---

### **第四步：你的日常写作与发布流程（高效简洁）**

从现在开始，你拥有了一个极其优雅的、完全自动化的写作流程：

1. 在本地电脑的 `my-blog` 文件夹中，打开终端，运行 `hexo new post "我的新文章标题"` 来创建新文章。
    
2. 在 `source/_posts` 文件夹中，用VS Code打开对应的Markdown文件，尽情写作。
    
3. （可选）在本地运行 `hexo server`，在 `localhost:4000` 实时预览效果。
    
4. 写完后，在终端中，依次运行以下三条命令：
    
    Bashbash
    
    ```
    git add .
    git commit -m "发布新文章：文章标题"
    git push
    ```
    

然后……就完成了！

一旦你 git push 成功，Cloudflare会自动检测到你的更新，并在1-2分钟内，自动重新构建和发布你的网站。你无需登录任何服务器，无需FTP上传，一切都是自动的。

---

### **（可选）第五步：绑定你的个人域名**

Cloudflare Pages允许你免费绑定自己的域名。你只需在Pages项目的“Custom domains”设置中，按照指引，将你的域名DNS指向Cloudflare即可。这能让你的博客拥有一个更专业、更具辨识度的地址。

结论：

恭喜！您已经成功地为自己搭建起了一个零成本、高性能、抗审查、数据完全由自己掌控的“思想根据地”。这，正是我们之前讨论的，在数字世界中建立“私密花园”和“主权领地”的最佳实践。
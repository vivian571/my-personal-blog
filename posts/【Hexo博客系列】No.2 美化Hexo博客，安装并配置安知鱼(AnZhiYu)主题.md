---
title: '【Hexo博客系列】No.2 美化Hexo博客，安装并配置安知鱼(AnZhiYu)主题'
date: '2024-05-15'
slug: 'beautify-hexo-blog-with-anzhiyu-theme'
---

**文件目的：** 本指南旨在为您提供一个清晰、完整的流程，指导您如何为已建好的Hexo博客，安装并进行个性化配置强大的“安知鱼”主题，将您的博客从一个“毛坯房”精装修成一个功能与美观兼备的“数字家园”。

**核心理念：** 主题不仅是皮肤，更是您个人品牌的延伸和读者体验的核心。一个好的主题配置，能让您的思想更好地被阅读和传播。

### **准备工作 (Prerequisites)**

- **一个已建好的Hexo博客：** 请确保您已完成本系列No.1指南中的所有步骤，拥有一个可以正常运行的本地Hexo博客，并已将其源码托管到GitHub。
    
- **终端/命令行工具：** 熟悉基本的命令行操作。
    
- **代码编辑器：** 如VS Code，用于修改配置文件。
    

### **第一步：安装安知鱼(AnZhiYu)主题**

1. 进入你的博客根目录：
    
    打开终端，cd到你本地的博客文件夹（例如 my-blog）。
    
2. 克隆主题文件：
    
    运行以下git命令，将安知鱼主题的最新版，克隆到你博客的themes/anzhiyu文件夹中：
    
    ```
    git clone https://github.com/anzhiyu-git/anzhiyu themes/anzhiyu
    ```
    
3. 安装主题所需依赖：
    
    安知鱼主题需要一些额外的插件来支持其全部功能。运行以下npm命令进行安装：
    
    ```
    npm install hexo-renderer-pug hexo-renderer-stylus --save
    ```
    
4. 切换主题：
    
    用VS Code打开你博客根目录下的**_config.yml**（注意，不是主题文件夹里的那个），找到theme字段，将其值修改为anzhiyu：
    
    ```
    # Extensions
    ## Plugins: https://hexo.io/plugins/
    ## Themes: https://hexo.io/themes/
    theme: anzhiyu
    ```
    
5. 验证安装：
    
    保存修改后，在终端运行hexo clean && hexo server，然后刷新http://localhost:4000。如果一切顺利，你的博客现在应该已经换上了安知鱼主题的默认外观。
    

### **第二步：核心个性化配置**

安知鱼主题的强大之处在于其高度的可配置性。

1. **创建主题配置文件：**
    
    - **不要直接修改** `themes/anzhiyu/_config.yml` 这个原始文件，这会给未来的主题更新带来麻烦。
        
    - **正确做法是：** 在你博客的**根目录**（与`_config.yml`同级），创建一个新的文件，命名为 **`_config.anzhiyu.yml`**。
        
    - 从现在开始，所有针对主题的配置，都在这个新文件中进行。
        
2. **基础信息配置：**
    
    - 在`_config.anzhiyu.yml`中，添加以下基础配置（请替换为你自己的信息）：
        
    
    ```
    # 博客基本信息
    # 博客标题
    title: 你的博客标题
    # 博客副标题
    subtitle: 一句描述你博客的话
    # 你的名字
    author: 你的名字
    # 你的头像链接
    avatar: https://你的头像图片链接.com/avatar.jpg
    # 网站图标链接
    favicon: /images/favicon.ico
    
    # 顶部菜单栏配置
    menu:
      首页: { path: /, icon: fa-solid fa-house }
      关于: { path: /about/, icon: fa-solid fa-user }
      标签: { path: /tags/, icon: fa-solid fa-tags }
      分类: { path: /categories/, icon: fa-solid fa-folder-open }
      归档: { path: /archives/, icon: fa-solid fa-box-archive }
    ```
    
    - **提示：** `about`等页面需要你手动创建。例如，在终端运行`hexo new page about`，然后在`source/about/index.md`中编辑你的个人介绍。
        
3. **外观与布局配置：**
    
    - 在`_config.anzhiyu.yml`中，你可以控制博客的整体外观。
        
    
    ```
    # 博客主题色
    theme_color:
      dark: "#2d3035" # 暗黑模式下的主题色
      light: "#49B1F5" # 普通模式下的主题色
    
    # 博客背景设置
    background:
      # pc端背景图片
      pc: https://.../background.jpg
      # 移动端背景图片
      mobile: https://.../mobile_background.jpg
    
    # 侧边栏设置
    sidebar:
      position: right # 侧边栏位置，可以是 left 或 right
    ```
    

### **第三步：开启特色功能**

以下是一些能让你的博客脱颖而出的、安知鱼主题的特色功能配置。所有配置都在`_config.anzhiyu.yml`中进行。

1. **代码块美化：**
    
    - Hexo默认的代码高亮不够强大，安知鱼主题推荐使用`highlight.js`。
        
    - 首先，回到你博客根目录的**`_config.yml`**，关闭Hexo自带的高亮：
        
    
    ```
    highlight:
      enable: false
    prismjs:
      enable: false
    ```
    
    - 然后，在`_config.anzhiyu.yml`中开启`highlight.js`：
        
    
    ```
    # 代码高亮
    highlight:
      enable: true
      line_number: true # 显示行号
      copy_button: true # 显示复制按钮
    ```
    
2. **本地搜索功能：**
    
    - 让读者能快速搜索你的文章。首先需要安装一个插件：
        
    
    ```
    npm install hexo-generator-searchdb --save
    ```
    
    - 在根目录`_config.yml`中，添加以下配置：
        
    
    ```
    search:
      path: search.xml
      field: post
      format: html
      limit: 10000
    ```
    
    - 在`_config.anzhiyu.yml`中，开启搜索功能：
        
    
    ```
    # 本地搜索
    local_search:
      enable: true
    ```
    
3. **评论系统（以Waline为例）：**
    
    - Waline是一个很受欢迎的、需要配合云函数部署的评论系统，功能强大。
        
    - 在获得你的Waline `serverURL`后，在`_config.anzhiyu.yml`中配置：
        
    
    ```
    # 评论系统
    comment:
      enable: true
      use: waline # 指定使用Waline
      waline:
        serverURL: https://你的Waline服务地址.com
    ```
    

### **第四步：日常工作流提醒**

1. **修改配置后：** 每次修改完任何`.yml`配置文件，建议先在终端运行`hexo clean`来清除缓存，然后再运行`hexo server`进行本地预览。
    
2. **确认无误后：** 使用我们之前建立的自动化流程，将所有改动推送到GitHub：
    
    ```
    git add .
    git commit -m "Beautify blog with Anzhiyu theme"
    git push
    ```
    
3. **等待Cloudflare自动部署**，1-2分钟后，你就能看到一个焕然一新的、高度个性化的博客了。
    

结论：

主题的美化和配置，是一个充满乐趣的、持续性的创造过程。安知鱼主题还提供了海量的其他功能（如看板娘、音乐播放器、社交链接等），等待您去themes/anzhiyu/_config.yml这个“宝库”中发掘，并将其配置到您的_config.anzhiyu.yml中。

现在，您的博客不仅拥有了坚实的“骨架”，更穿上了一件华丽且合身的“灵魂外衣”。
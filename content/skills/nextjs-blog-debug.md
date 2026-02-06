---
name: nextjs-blog-debug
description: Next.js 博客常见问题排查与修复指南，涵盖 React 渲染错误、动态路由、中文 URL 编码等问题。
metadata:
  {
    "openclaw": {
      "emoji": "🐛"
    }
  }
---

# Next.js 博客调试技能包

本技能包记录了在 Docker 环境中部署和调试 Next.js 博客时遇到的所有常见问题及其解决方案。

## 1. 环境配置 (Docker Setup)

### 问题：博客需要在 Docker 中运行
**解决方案：** 在 `docker-compose.yml` 中添加专用服务：

```yaml
my-blog:
  image: node:20-alpine
  working_dir: /app
  volumes:
    - /path/to/blog:/app
    - /app/node_modules  # 匿名卷，避免宿主机覆盖
  ports:
    - "3000:3000"
  command: sh -c "npm install && npm run dev"
  environment:
    TERM: xterm-256color
```

**关键点：**
- 使用匿名卷 `/app/node_modules` 防止宿主机的空目录覆盖容器内的依赖
- `npm install` 确保每次启动时依赖都是最新的

### 多目录内容挂载 (Multiple Content Mounting)
若需要展示多个不相关的 Markdown 目录（如博客文章和小说），可采用如下方式挂载：
```yaml
volumes:
  - ./content:/app/content/01_Essence
  - ./novels:/app/content/01_Essence/novels # 直接挂载到主目录下
```
**关键点**：确保挂载路径在 Next.js 的扫描范围内。

---

## 2. React 渲染错误 (Objects are not valid as a React child)

### 问题：日期对象直接渲染导致崩溃
**错误信息：** `Objects are not valid as a React child (found: [object Date])`

**原因：** Markdown frontmatter 中的 `date` 字段被 `gray-matter` 解析为 JavaScript `Date` 对象，但 React 不允许直接渲染对象。

**解决方案：**
```typescript
// ❌ 错误写法
date: data.date || 'No date',

// ✅ 正确写法
date: data.date ? data.date.toString() : 'No date',
```

**适用文件：**
- `src/app/page.tsx` (首页文章列表)
- `src/app/posts/[slug]/page.tsx` (文章详情页)

---

## 3. 静态导出与动态路由冲突

### 问题：开发模式下动态路由报错
**错误信息：** `Page "/posts/[slug]/page" is missing param "/posts/%E5%..." in "generateStaticParams()", which is required with "output: export" config.`

**原因：** `next.config.ts` 中设置了 `output: 'export'`，这要求所有动态路由必须在构建时预生成。但在开发模式下，这会导致严格的路径检查。

**解决方案：**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // output: 'export',  // 注释掉，仅在生产构建时启用
  images: {
    unoptimized: true,
  },
  basePath: '/my-personal-blog',
};
```

**最佳实践：**
- 开发时关闭 `output: 'export'`
- 部署到 GitHub Pages 等静态托管时再启用

---

## 4. Markdown 文件缺少 Frontmatter

### 问题：部分文章无法显示
**错误信息：** `Post with slug "xxx" not found`

**原因：** 某些 Markdown 文件缺少 YAML frontmatter，导致 `gray-matter` 无法提取 `title`、`date`、`slug` 等元数据。

**检查命令：**
```bash
docker-compose exec my-blog sh -c 'for f in posts/*.md; do echo "=== $f ==="; head -n 10 "$f" | grep -E "^(title|slug|date):"; done'
```

**修复模板：**
```markdown
---
title: 文章标题
date: '2025-08-10'
slug: article-slug
---

正文内容...
```

**批量修复脚本：**
```bash
# 为缺少 frontmatter 的文件添加头部
FILE="posts/文章名.md"
TMPFILE="/tmp/fix.md"
cat > "$TMPFILE" << 'EOF'
---
title: 文章标题
date: '2025-08-10'
slug: article-slug
---

EOF
cat "$FILE" >> "$TMPFILE"
mv "$TMPFILE" "$FILE"
```

---

## 5. 中文 URL 编码问题 ⭐

### 问题：中文 slug 的文章无法访问
**错误信息：** `Post with slug "%E7%BB%88%E6%9E%81..." not found`

**原因：** 
1. 浏览器会自动将中文 URL 编码（如 `终极学习` → `%E7%BB%88%E6%9E%81%E5%AD%A6%E4%B9%A0`）
2. Next.js 的 `params.slug` 接收到的是编码后的字符串
3. 代码直接拿编码字符串去匹配 frontmatter 中的原始中文 slug，导致匹配失败

**解决方案：** 在 `getPostData` 函数开头解码 slug
```typescript
// src/app/posts/[slug]/page.tsx
async function getPostData(slug: string): Promise<PostData> {
  slug = decodeURIComponent(slug);  // ⭐ 关键修复
  
  const filenames = fs.readdirSync(postsDirectory);
  const filename = filenames.find(fname => {
    const filePath = path.join(postsDirectory, fname);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    return (data.slug || fname.replace(/\.md$/, '')) === slug;
  });
  
  if (!filename) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  // ...
}
```

**最佳实践：**
- 建议使用英文 slug（如 `ultimate-learning-guide`）
- 如果必须使用中文，务必添加 `decodeURIComponent`

---

## 9. 递归加载 Markdown 文件 ⭐

### 问题：子目录中的文章无法显示
**原因**：默认的 `fs.readdirSync` 只读取一级目录，无法发现嵌套文件夹（如 `posts/novels/xxx.md`）中的文章。

**解决方案**：实现递归文件搜索工具函数。

```typescript
// src/app/utils/files.ts 或直接写在页面组件中
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles.filter(file => file.endsWith('.md'));
}
```

**应用位置**：
- `generateStaticParams()`: 确保所有深层级的 slug 都能被预生成。
- `getPosts()`: 聚合所有子目录下的文章元数据。

---

## 6. 常用调试命令

### 查看容器日志
```bash
docker-compose logs -f my-blog
docker logs moltbot-my-blog-1 --tail 50
```

### 进入容器调试
```bash
docker-compose exec my-blog sh
docker-compose exec my-blog cat src/app/page.tsx
```

### 验证文章元数据
```bash
docker-compose exec my-blog sh -c 'for f in posts/*.md; do echo "=== $(basename "$f") ==="; head -n 10 "$f"; echo ""; done'
```

### 测试 URL 编码
```bash
docker-compose exec my-blog sh -c 'echo "中文标题" | node -e "console.log(encodeURIComponent(require(\"fs\").readFileSync(0, \"utf-8\").trim()))"'
```

---

## 7. 完整故障排查流程

1. **检查服务状态**
   ```bash
   docker ps -a --filter name=my-blog
   ```

2. **查看启动日志**
   ```bash
   docker logs moltbot-my-blog-1 --tail 50
   ```

3. **验证端口监听**
   ```bash
   docker-compose exec my-blog netstat -tuln | grep 3000
   ```

4. **测试本地访问**
   ```bash
   curl -I http://localhost:3000/my-personal-blog
   ```

5. **检查文章元数据**
   ```bash
   docker-compose exec my-blog sh -c 'for f in posts/*.md; do head -n 10 "$f" | grep -E "^(title|slug|date):"; done'
   ```

6. **- 验证 slug 匹配：
    - 打开浏览器开发者工具
    - 查看 Network 面板中的请求 URL
    - 对比 frontmatter 中的 slug 值

---

## 10. 内容整理脚本 (Content Organization)

### 问题：博客文件过多，难以管理
**解决方案**：使用 Bash 脚本按关键字自动归类文章到不同子目录（如 `novels`）。

```bash
#!/bin/bash
# scripts/organize_blog.sh

SOURCE_DIR="content/01_Essence"
TARGET_DIR="content/01_Essence/novels"
mkdir -p "$TARGET_DIR"

# 按文件名关键字移动
find "$SOURCE_DIR" -maxdepth 1 -name "*第*章*" -exec mv {} "$TARGET_DIR/" \;
find "$SOURCE_DIR" -maxdepth 1 -name "*卷*" -exec mv {} "$TARGET_DIR/" \;

echo "Content organization complete."
```

**关键点**：配合“递归加载”功能，目录结构的变化不会打断文章的展示。

---

## 8. 避坑清单

- ✅ 所有 Markdown 文件必须有完整的 frontmatter
- ✅ 日期字段必须转换为字符串再渲染
- ✅ 开发模式下关闭 `output: 'export'`
- ✅ 中文 slug 必须在代码中解码
- ✅ Docker 卷挂载时使用匿名卷保护 `node_modules`
- ✅ 使用 `basePath` 时，访问路径要包含前缀

---

## 使用场景

当您遇到以下情况时，请参考本技能包：
- Next.js 博客在 Docker 中无法启动
- 文章列表显示正常，但点击后报 404
- React 报错 "Objects are not valid as a React child"
- 中文标题的文章无法访问
- 动态路由在开发模式下报错

---

**维护者：** 以安的首席内臣  
**最后更新：** 2026-02-03

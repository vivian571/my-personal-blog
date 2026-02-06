---
name: recursive-library-routing
description: 递归书阁路由协议，基于 Next.js App Router 的无限层级内容加载与动态路由方案。
metadata:
  {
    "openclaw": {
      "emoji": "📚"
    }
  }
---

# 递归书阁路由协议 (Recursive Library Routing Protocol)

本协议定义了一套高效的算法，用于在 Next.js 中把多层级的文件系统（如 `content/小说/生花梦/短篇/生活/...`）映射为扁平化的 Web 路由，支持无限深度的内容展示。

## 1. 递归加载核心 (Recursive Loading Core)

### 算法逻辑
为了展示嵌套子目录中的所有文章，必须突破 `fs.readdirSync` 只能读取一级的限制。

```typescript
// src/app/utils/files.ts
import fs from 'fs';
import path from 'path';

/**
 * 递归获取目录下所有 Markdown 文件路径
 * @param dirPath 起始目录
 * @param arrayOfFiles 累加的文件列表
 */
export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, "/", file);
    if (fs.statSync(fullPath).isDirectory()) {
      // 递归进入子目录
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}
```

## 2. 动态路由适配 (Dynamic Routing)

### 静态参数生成 (`generateStaticParams`)
对于 `output: 'export'` 模式，必须告诉 Next.js 所有可能的 slug 组合。

```typescript
// src/app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const allPosts = getAllFiles(path.join(process.cwd(), 'content'));
  
  return allPosts.map((filePath) => {
     // 从 frontmatter 或文件名提取 slug
     const { data } = matter(fs.readFileSync(filePath, 'utf8'));
     return {
       slug: data.slug || path.basename(filePath, '.md') 
     };
  });
}
```

## 3. 中文 URL 编解码协议 (Encoding Protocol)

### 问题描述
浏览器会自动将中文 URL 编码（如 `生花梦` -> `%E7%94%9F%E8%8A%B1%E6%A2%A6`）。如果在代码中直接用编码后的字符串去匹配文件系统中的原始中文文件名，会导致 **404 Not Found**。

### 解决方案
在获取文章数据前，必须进行解码。

```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // 1. 等待参数解析
  const { slug: rawSlug } = await params;
  
  // 2. 核心解码步骤
  const slug = decodeURIComponent(rawSlug); 

  // 3. 使用解码后的 slug 匹配文件
  const post = getPostBySlug(slug);
  
  // ...渲染逻辑
}
```

## 适用场景
*   多级分类的知识库（如：编程/Python/基础语法）。
*   连载小说（如：长篇/卷一/第一章）。
*   需要保留文件系统原始结构的任何内容站点。

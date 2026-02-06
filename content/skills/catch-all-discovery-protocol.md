---
name: catch-all-discovery-protocol
description: 全路径索引与全站搜索协议。解决 Next.js 静态站点在深度嵌套目录下的路由 404 及多维度资产检索问题。
metadata:
  {
    "openclaw": {
      "emoji": "🗺️"
    }
  }
---

# Catch-all Discovery Protocol: 全路径索引协议

本协议定义了如何在基于 Markdown 的 Next.js 博客中实现“无限深度”的路由支持以及全站级模糊搜索。

## 1. 核心挑战
*   **路由限制**：默认的 `[slug]` 只能匹配一级路径，无法处理 `skills/category/item`。
*   **搜索孤岛**：不同类别的资产（小说、微信、技能）分散在不同目录，缺乏统一检索入口。

## 2. 解决方案

### A. 全路径路由 ([...slug])
将 `src/app/posts/[slug]/page.tsx` 重命名为 `src/app/posts/[...slug]/page.tsx`。
```tsx
// 接收数组形式的路径段
type Params = { slug: string[] };

async function getPostData(slugArray: string[]) {
  // 将数组拼接回原始路径
  const fullPathSlug = decodeURIComponent(slugArray.join('/'));
  // 基于全路径进行文件匹配...
}
```

### B. 模糊搜索索引
通过 `src/lib/search.ts` 递归扫描所有 content 目录，生成扁平化的 JSON 索引。
```ts
export function generateSearchIndex() {
  // 递归递归递归 (小説, wechat, skills, whitepapers)
  // 返回 { title, slug, type, snippet }[]
}
```

## 3. 应用场景
*   **深度书阁**：支持嵌套章节和分卷。
*   **资产可见性**：通过 `Cmd+K` 瞬间定位到深埋在工作区中的技术协议。
*   **知识库迁移**：支持从 Obsidian 等多级文件夹结构的知识库直接导入。

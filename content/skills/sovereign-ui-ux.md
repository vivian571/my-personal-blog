---
name: sovereign-ui-ux
description: 主权 UI/UX 审美集，定义了 "White & Gold" 极简主义设计语言与 Tailwind CSS 实现规范。
metadata:
  {
    "openclaw": {
      "emoji": "🎨"
    }
  }
---

# 主权 UI/UX 审美集 (Sovereign UI/UX Aesthetics)

本设计语言旨在传递“纯粹”、“尊贵”且“克制”的视觉体验。它摒弃了过度的装饰，回归内容本身，利用留白与金色高光构建秩序感。

## 1. 核心色板 (Color Palette)

基于 Tailwind config (`tailwind.config.ts`) 的核心变量：

```css
:root {
  /* 背景：极致的纯白与微弱的灰 */
  --background: #ffffff;
  --foreground: #171717;

  /* 品牌色：主权金 */
  --gold-primary: #D4AF37;
  --gold-accent: #C5A028;
  
  /* 边框：几乎不可见的边界 */
  --border: #e5e5e5;
  --card: #fafafa;
}
```

## 2. 排版系统 (Typography)

采用衬线体与无衬线体的混排，营造古典与现代的冲突美感。

*   **标题 (Heading)**: 使用 `Cinzel` 或 `Playfair Display`，强调雕塑感。
*   **正文 (Body)**: 使用 `Inter` 或 `Source Sans Pro`，确保极佳的可读性。

## 3. 组件原子 (Component Atoms)

### 玻璃拟态卡片 (Glassmorphism Card)
虽然名为“玻璃”，但我们不使用模糊，而是使用极细的边框与微弱的阴影来模拟“悬浮感”。

```tsx
<div className="
  p-6 
  bg-[var(--card)] 
  border border-[var(--border)] 
  rounded-xl 
  hover:border-[var(--gold-accent)]/30 
  transition-all duration-300
  hover:shadow-lg
">
  {content}
</div>
```

### 呼吸感交互 (Breathing Interaction)
所有可点击元素必须有微交互（Micro-interactions）。

*   **Hover**: 字体颜色变为金色 (`hover:text-[var(--gold-accent)]`)。
*   **Active**: 极其轻微的缩放 (`active:scale-95`)。

## 4. 布局哲学

*   **最大容器**: `max-w-4xl`，避免文字行过长导致视线疲劳。
*   **间距**: 遵循 `8px` 网格系统，常用 `gap-4 (16px)`, `py-12 (48px)`, `space-y-8 (32px)`。

## 5. 适用场景
*   个人品牌博客
*   深度阅读类应用
*   数字藏品展示页

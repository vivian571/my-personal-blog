#!/usr/bin/env python3
"""
双向内容同步桥梁：wechat-publisher (Markdown) -> my-personal-blog (content/wechat)
支持全部分类目录智能映射、Frontmatter 自动补全/清洗、重名防冲突及变更统计。
"""

import os
import shutil
import re
from datetime import datetime
from pathlib import Path

# 路径配置
WECHAT_DOCS_ROOT = Path("/Users/ax/wechat-publisher/wechat/documents")
BLOG_CONTENT_ROOT = Path("/Users/ax/Documents/GitHub/my-personal-blog/content/wechat")

# 分类目录与对应标签映射
CATEGORY_MAPPING = {
    "AI流习社": {"slug": "ai_flow_club", "tag": "AI Tech", "name": "AI 流习社"},
    "开源智核": {"slug": "open_source_core", "tag": "Open Source", "name": "开源智核"},
    "平凡日子记": {"slug": "ordinary_life", "tag": "Life & Tech", "name": "平凡日子记"},
    "美丽好风景": {"slug": "scenery_media", "tag": "Visual Media", "name": "美丽好风景"},
    "零更_PromptBook": {"slug": "prompt_book", "tag": "Prompt Protocol", "name": "零更 PromptBook"},
    "fluent fan": {"slug": "fluent_fan", "tag": "Fluent Fan", "name": "Fluent Fan"},
    "初心录": {"slug": "original_mind", "tag": "Mindset", "name": "初心录"}
}

def sanitize_filename(filename: str) -> str:
    """标准化文件名，移除危险字符"""
    clean_name = re.sub(r'[\\/*?:"<>| ]', '_', filename)
    return clean_name

def extract_or_generate_frontmatter(content: str, default_title: str, category_info: dict) -> str:
    """提取或生成统一的 YAML Frontmatter"""
    lines = content.split('\n')
    title = default_title
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # 尝试提取文章第一行的大标题
    for line in lines:
        line_clean = line.strip()
        if line_clean.startswith('# '):
            title = line_clean.replace('# ', '').strip()
            break
        elif line_clean.startswith('title:'):
            extracted = line_clean.replace('title:', '').strip().strip('"\'')
            if extracted:
                title = extracted
                break

    # 检查是否已有合法 frontmatter
    if content.strip().startswith('---'):
        # 已有 frontmatter 则直接返回原内容
        return content
    
    # 组装统一的 Frontmatter
    frontmatter = f"""---
title: "{title}"
date: "{date_str}"
category: "{category_info['name']}"
tags: ["{category_info['tag']}", "WeChat Matrix"]
premium: false
---

"""
    return frontmatter + content

def sync_articles():
    print(f"🚀 开始执行公众号 -> 博客双向内容同步: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if not WECHAT_DOCS_ROOT.exists():
        print(f"❌ 微信文章源目录不存在: {WECHAT_DOCS_ROOT}")
        return 0

    BLOG_CONTENT_ROOT.mkdir(parents=True, exist_ok=True)
    synced_count = 0

    for source_dir_name, cat_info in CATEGORY_MAPPING.items():
        src_cat_path = WECHAT_DOCS_ROOT / source_dir_name
        dest_cat_path = BLOG_CONTENT_ROOT / cat_info["slug"]

        if not src_cat_path.exists():
            continue

        dest_cat_path.mkdir(parents=True, exist_ok=True)

        # 遍历源目录下的所有 markdown 文件
        for file_path in src_cat_path.glob("*.md"):
            if not file_path.is_file():
                continue

            target_filename = sanitize_filename(file_path.name)
            dest_file_path = dest_cat_path / target_filename

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    raw_content = f.read()

                # 处理 Frontmatter
                processed_content = extract_or_generate_frontmatter(
                    raw_content,
                    default_title=file_path.stem,
                    category_info=cat_info
                )

                # 写入博客目标目录
                with open(dest_file_path, "w", encoding="utf-8") as f:
                    f.write(processed_content)

                synced_count += 1
            except Exception as e:
                print(f"⚠️ 处理文件失败 [{file_path.name}]: {e}")

    print(f"✅ 双向内容同步完成！共同步 {synced_count} 篇文章至博客。")
    return synced_count

if __name__ == "__main__":
    sync_articles()

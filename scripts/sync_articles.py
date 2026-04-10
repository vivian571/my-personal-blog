import os
import shutil
import re
from datetime import datetime

# 配置路径
SOURCE_ROOT = "/Users/ax/wechat-publisher/wechat/documents"
BLOG_ROOT = "/Users/ax/Documents/GitHub/my-personal-blog/content/wechat"

# 映射关系: 公众号目录名 -> 博客子目录名
CATEGORY_MAP = {
    "AI流习社": "ai_flow_club",
    "开源智核": "open_source_core",
    "平凡日子记": "ordinary_life"
}

def sanitize_filename(filename):
    """清理文件名中的空格和特殊字符"""
    return filename.replace(" ", "_")

def extract_metadata(content, default_title, category):
    """从 MD 内容中提取或生成元数据"""
    title = default_title
    # 尝试匹配第一行作为标题 (# Title)
    first_line = content.split('\n')[0]
    if first_line.startswith('# '):
        title = first_line.replace('# ', '').strip()
    
    # 获取当前日期
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    metadata = f"""---
title: "{title}"
date: "{date_str}"
category: "{category}"
premium: false
---

"""
    return metadata

def sync():
    print(f"开始同步文章: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if not os.path.exists(BLOG_ROOT):
        os.makedirs(BLOG_ROOT)

    for src_cat, dest_cat in CATEGORY_MAP.items():
        src_path = os.path.join(SOURCE_ROOT, src_cat)
        dest_path = os.path.join(BLOG_ROOT, dest_cat)
        
        if not os.path.exists(src_path):
            print(f"警告: 源目录不存在 {src_path}")
            continue
            
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)
            
        for file in os.listdir(src_path):
            if file.endswith(".md"):
                src_file_path = os.path.join(src_path, file)
                # 检查是否是合法的 MD 文件
                if os.path.isdir(src_file_path):
                    continue
                    
                target_filename = sanitize_filename(file)
                dest_file_path = os.path.join(dest_path, target_filename)
                
                # 读取内容
                with open(src_file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 如果已经有了 metadata，就不重复添加
                if not content.strip().startswith('---'):
                    metadata = extract_metadata(content, file.replace('.md', ''), src_cat)
                    new_content = metadata + content
                else:
                    new_content = content
                
                # 写入博客目录
                with open(dest_file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"已同步: {src_cat} -> {dest_cat} | {file}")

    print("同步任务完成。")

if __name__ == "__main__":
    try:
        sync()
    except Exception as e:
        print(f"同步过程中发生错误: {str(e)}")

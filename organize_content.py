#!/usr/bin/env python3
"""
自动内容归档脚本
根据文件名关键词将 Markdown 文件归档到"意安序"三层结构中
"""

import os
import shutil
import re
from pathlib import Path
from datetime import datetime

# 目标目录结构
CONTENT_STRUCTURE = {
    "01_Essence": {
        "novels": ["章节", "第", "卷", "篇章", "novel", "chapter"],
        "essays": ["散文", "随笔", "思考", "哲学", "essay", "reflection"]
    },
    "02_Peace": {
        "daily": ["今天", "日记", "碎碎念", "daily", "diary", "今日"],
        "gallery": ["摄影", "照片", "图集", "photo", "gallery", "视觉"]
    },
    "03_Order": {
        "tech-notes": ["技术", "代码", "bug", "debug", "教程", "tech", "code", "避坑"],
        "future-log": ["AI", "未来", "实验", "探索", "future", "experiment"]
    }
}

class ContentOrganizer:
    def __init__(self, source_dir, target_base="content"):
        self.source_dir = Path(source_dir)
        self.target_base = self.source_dir / target_base
        self.moved_files = []
        self.skipped_files = []
        
    def create_structure(self):
        """创建目标目录结构"""
        for category, subcats in CONTENT_STRUCTURE.items():
            for subcat in subcats.keys():
                target_path = self.target_base / category / subcat
                target_path.mkdir(parents=True, exist_ok=True)
                print(f"✓ 创建目录: {target_path}")
    
    def match_keywords(self, filename, keywords):
        """检查文件名是否包含关键词"""
        filename_lower = filename.lower()
        return any(keyword in filename_lower for keyword in keywords)
    
    def categorize_file(self, filepath):
        """根据文件名判断应归属的目录"""
        filename = filepath.name
        
        # 遍历所有分类
        for category, subcats in CONTENT_STRUCTURE.items():
            for subcat, keywords in subcats.items():
                if self.match_keywords(filename, keywords):
                    return category, subcat
        
        # 默认归类逻辑
        if filepath.suffix == '.md':
            # 如果文件名很长(>20字符)，可能是长文
            if len(filepath.stem) > 20:
                return "01_Essence", "essays"
            # 如果文件名包含日期格式 YYYY-MM-DD
            if re.search(r'\d{4}-\d{2}-\d{2}', filename):
                return "02_Peace", "daily"
        
        return None, None
    
    def organize(self, dry_run=True):
        """执行归档操作"""
        print(f"\n{'=' * 60}")
        print(f"{'🔍 预览模式' if dry_run else '🚀 执行模式'}")
        print(f"{'=' * 60}\n")
        
        # 获取所有 Markdown 文件
        md_files = list(self.source_dir.glob("posts/**/*.md"))
        
        if not md_files:
            print("⚠️  未找到任何 Markdown 文件")
            return
        
        print(f"📂 找到 {len(md_files)} 个 Markdown 文件\n")
        
        for filepath in md_files:
            # 跳过已经在 content 目录下的文件
            if "content" in filepath.parts:
                continue
                
            category, subcat = self.categorize_file(filepath)
            
            if category and subcat:
                target_dir = self.target_base / category / subcat
                target_path = target_dir / filepath.name
                
                # 如果目标文件已存在，添加时间戳
                if target_path.exists():
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    stem = filepath.stem
                    target_path = target_dir / f"{stem}_{timestamp}{filepath.suffix}"
                
                print(f"📄 {filepath.name}")
                print(f"   → {category}/{subcat}/")
                
                if not dry_run:
                    shutil.move(str(filepath), str(target_path))
                    self.moved_files.append((filepath, target_path))
                    print(f"   ✓ 已移动")
                else:
                    print(f"   (预览)")
                print()
            else:
                print(f"❓ {filepath.name}")
                print(f"   → 无法自动分类，保持原位")
                print()
                self.skipped_files.append(filepath)
        
        # 统计报告
        print(f"\n{'=' * 60}")
        print(f"📊 归档统计")
        print(f"{'=' * 60}")
        if dry_run:
            print(f"✓ 可归档文件: {len(md_files) - len(self.skipped_files)} 个")
            print(f"? 无法分类: {len(self.skipped_files)} 个")
            print(f"\n💡 运行 organize_content.py --execute 以执行实际移动")
        else:
            print(f"✓ 已移动: {len(self.moved_files)} 个")
            print(f"? 保持原位: {len(self.skipped_files)} 个")

def main():
    import sys
    
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    
    # 检查是否为执行模式
    execute = "--execute" in sys.argv or "-e" in sys.argv
    
    organizer = ContentOrganizer(script_dir)
    
    # 创建目录结构
    organizer.create_structure()
    
    # 执行归档
    organizer.organize(dry_run=not execute)

if __name__ == "__main__":
    main()

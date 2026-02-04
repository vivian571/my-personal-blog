#!/usr/bin/env python3
"""
Auto-organize content files based on filename keywords.
Maps files to the content directory tree structure.
"""

import os
import sys
import shutil
from pathlib import Path
from typing import Dict, List, Tuple

# Define keyword-to-directory mapping rules
# Format: (keywords, target_directory)
ORGANIZE_RULES = [
    # 01_Essence (意) - 核心创作
    (["章节", "小说", "novel", "story"], "content/01_Essence/novels"),
    (["project-skydiving"], "content/01_Essence/novels/project-skydiving"),
    (["project-silicon"], "content/01_Essence/novels/project-silicon"),
    (["散文", "随笔", "essay", "reflection"], "content/01_Essence/essays"),
    
    # 02_Peace (安) - 情感寄托
    (["今天", "日记", "daily", "碎碎念", "thoughts"], "content/02_Peace/daily"),
    (["摄影", "图片", "gallery", "photo"], "content/02_Peace/gallery"),
    
    # 03_Order (序) - 技术与未来
    (["技术", "代码", "bug", "tech-notes", "避坑"], "content/03_Order/tech-notes"),
    (["未来", "ai", "rentahuman", "future-log", "实验"], "content/03_Order/future-log"),
]

def get_target_dir(filename: str) -> str:
    """
    Determine target directory based on filename keywords.
    Returns the most specific matching directory.
    """
    filename_lower = filename.lower()
    matches = []
    
    for keywords, target_dir in ORGANIZE_RULES:
        for keyword in keywords:
            if keyword.lower() in filename_lower:
                matches.append((len(keyword), target_dir))  # Longer match = more specific
                break
    
    if matches:
        # Return the most specific (longest keyword) match
        matches.sort(reverse=True)
        return matches[0][1]
    
    # Default directory if no rules match
    return "content/01_Essence/essays"

def organize_files(source_dir: str = "posts", dry_run: bool = False) -> None:
    """
    Organize files from source_dir based on ORGANIZE_RULES.
    
    Args:
        source_dir: Directory containing files to organize
        dry_run: If True, only show what would be done (don't move files)
    """
    source_path = Path(source_dir)
    
    if not source_path.exists():
        print(f"Error: Source directory '{source_dir}' does not exist.")
        sys.exit(1)
    
    # Get all files (recursive)
    files_to_organize = []
    for item in source_path.rglob("*"):
        if item.is_file():
            files_to_organize.append(item)
    
    if not files_to_organize:
        print(f"No files found in '{source_dir}'.")
        return
    
    print(f"Found {len(files_to_organize)} file(s) to organize.\n")
    
    moved_count = 0
    for file_path in files_to_organize:
        filename = file_path.name
        target_dir = get_target_dir(filename)
        target_path = Path(target_dir) / filename
        
        # Skip if already in target location
        if file_path.resolve() == target_path.resolve():
            print(f"✓ Already organized: {filename} → {target_dir}/")
            continue
        
        # Create target directory if it doesn't exist
        if not dry_run:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            # Move file
            shutil.move(str(file_path), str(target_path))
        
        status = "[DRY RUN] Would move" if dry_run else "✓ Moved"
        print(f"{status}: {filename}")
        print(f"         → {target_dir}/")
        moved_count += 1
    
    print(f"\nTotal: {moved_count} file(s) organized.")
    if dry_run:
        print("(This was a dry run. Use --no-dry-run to actually move files.)")

def show_rules() -> None:
    """Display all organization rules."""
    print("Current organization rules:\n")
    for i, (keywords, target_dir) in enumerate(ORGANIZE_RULES, 1):
        keywords_str = ", ".join(keywords)
        print(f"{i}. {keywords_str}")
        print(f"   → {target_dir}\n")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Auto-organize content files based on filename keywords."
    )
    parser.add_argument(
        "--source",
        default="posts",
        help="Source directory to organize (default: posts)"
    )
    parser.add_argument(
        "--no-dry-run",
        action="store_true",
        help="Actually move files (default is dry-run mode)"
    )
    parser.add_argument(
        "--show-rules",
        action="store_true",
        help="Display all organization rules and exit"
    )
    
    args = parser.parse_args()
    
    if args.show_rules:
        show_rules()
        return
    
    dry_run = not args.no_dry_run
    organize_files(source_dir=args.source, dry_run=dry_run)

if __name__ == "__main__":
    main()

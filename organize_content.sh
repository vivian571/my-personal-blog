#!/bin/bash
# 自动内容归档脚本 - Bash 版本
# 根据文件名关键词将 Markdown 文件归档到"意安序"三层结构中

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 基础目录
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTENT_DIR="$BASE_DIR/content"

# 创建目录结构
create_structure() {
    echo -e "${BLUE}📁 创建目录结构...${NC}\n"
    
    mkdir -p "$CONTENT_DIR/01_Essence/novels"
    mkdir -p "$CONTENT_DIR/01_Essence/essays"
    mkdir -p "$CONTENT_DIR/02_Peace/daily"
    mkdir -p "$CONTENT_DIR/02_Peace/gallery"
    mkdir -p "$CONTENT_DIR/03_Order/tech-notes"
    mkdir -p "$CONTENT_DIR/03_Order/future-log"
    
    echo -e "${GREEN}✓ 目录结构创建完成${NC}\n"
}

# 判断文件应归属的目录
categorize_file() {
    local filename="$1"
    local basename=$(basename "$filename")
    local lowercase=$(echo "$basename" | tr '[:upper:]' '[:lower:]')
    
    # 01_Essence - novels
    if [[ "$lowercase" =~ (章节|第.*章|卷|篇章|novel|chapter) ]]; then
        echo "01_Essence/novels"
        return
    fi
    
    # 01_Essence - essays
    if [[ "$lowercase" =~ (散文|随笔|思考|哲学|essay|reflection) ]]; then
        echo "01_Essence/essays"
        return
    fi
    
    # 02_Peace - daily
    if [[ "$lowercase" =~ (今天|日记|碎碎念|daily|diary|今日) ]]; then
        echo "02_Peace/daily"
        return
    fi
    
    # 02_Peace - gallery
    if [[ "$lowercase" =~ (摄影|照片|图集|photo|gallery|视觉) ]]; then
        echo "02_Peace/gallery"
        return
    fi
    
    # 03_Order - tech-notes
    if [[ "$lowercase" =~ (技术|代码|bug|debug|教程|tech|code|避坑) ]]; then
        echo "03_Order/tech-notes"
        return
    fi
    
    # 03_Order - future-log
    if [[ "$lowercase" =~ (ai|未来|实验|探索|future|experiment) ]]; then
        echo "03_Order/future-log"
        return
    fi
    
    # 默认分类逻辑
    if [[ "$basename" =~ [0-9]{4}-[0-9]{2}-[0-9]{2} ]]; then
        echo "02_Peace/daily"
        return
    fi
    
    # 长文件名归入 essays
    if [[ ${#basename} -gt 25 ]]; then
        echo "01_Essence/essays"
        return
    fi
    
    echo ""
}

# 执行归档
organize_files() {
    local dry_run=$1
    local moved=0
    local skipped=0
    
    echo -e "${BLUE}============================================================${NC}"
    if [[ "$dry_run" == "true" ]]; then
        echo -e "${YELLOW}🔍 预览模式 (使用 --execute 执行实际移动)${NC}"
    else
        echo -e "${GREEN}🚀 执行模式${NC}"
    fi
    echo -e "${BLUE}============================================================${NC}\n"
    
    # 查找所有 Markdown 文件
    while IFS= read -r -d '' file; do
        # 跳过已在 content 目录下的文件
        if [[ "$file" == *"/content/"* ]]; then
            continue
        fi
        
        category=$(categorize_file "$file")
        
        if [[ -n "$category" ]]; then
            target_dir="$CONTENT_DIR/$category"
            filename=$(basename "$file")
            target_path="$target_dir/$filename"
            
            # 处理重名文件
            if [[ -f "$target_path" ]]; then
                timestamp=$(date +%Y%m%d_%H%M%S)
                name="${filename%.*}"
                ext="${filename##*.}"
                target_path="$target_dir/${name}_${timestamp}.${ext}"
            fi
            
            echo -e "${GREEN}📄 $filename${NC}"
            echo -e "   → $category/"
            
            if [[ "$dry_run" == "false" ]]; then
                mv "$file" "$target_path"
                echo -e "   ${GREEN}✓ 已移动${NC}"
                ((moved++))
            else
                echo -e "   ${YELLOW}(预览)${NC}"
            fi
            echo
        else
            echo -e "${YELLOW}❓ $(basename "$file")${NC}"
            echo -e "   → 无法自动分类，保持原位"
            echo
            ((skipped++))
        fi
    done < <(find "$BASE_DIR/posts" -name "*.md" -type f -print0 2>/dev/null)
    
    # 统计报告
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}📊 归档统计${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    if [[ "$dry_run" == "true" ]]; then
        echo -e "${GREEN}✓ 可归档文件: $moved 个${NC}"
        echo -e "${YELLOW}? 无法分类: $skipped 个${NC}"
        echo -e "\n${BLUE}💡 运行 ./organize_content.sh --execute 以执行实际移动${NC}"
    else
        echo -e "${GREEN}✓ 已移动: $moved 个${NC}"
        echo -e "${YELLOW}? 保持原位: $skipped 个${NC}"
    fi
}

# 主函数
main() {
    create_structure
    
    if [[ "$1" == "--execute" ]] || [[ "$1" == "-e" ]]; then
        organize_files "false"
    else
        organize_files "true"
    fi
}

main "$@"

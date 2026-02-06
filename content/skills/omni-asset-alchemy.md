---
name: omni-asset-alchemy
description: 万象资产炼金术，专注于 Markdown 内容资产的标准化、元数据治理与自动化组织。
metadata:
  {
    "openclaw": {
      "emoji": "🧪"
    }
  }
---

# 万象资产炼金术 (Omni-Asset Alchemy)

本技能包致力于将杂乱的文本转化为高价值的数字资产。核心关注点是 YAML Frontmatter 的规范化治理、Markdown 语法的避坑指南以及自动化内容归档。

## 1. Frontmatter 守卫协议 (YAML Guardian)

YAML 头部（Frontmatter）是连接内容与系统的桥梁，其语法的严谨性直接决定了构建的成败。

### 🚨 致命陷阱：别名误判 (Alias Misinterpretation)
在 YAML 中，以 `*` 开头的非引号字符串会被解析器误认为是“引用别名”（Alias Reference），导致解析失败。

**错误示例 (构建崩溃)**：
```yaml
核心能力:
- **逻辑清理**：能够识别...  <-- 💥 报错：unidentified alias "**逻辑清理**"
```

**正确规范 (必须加引号)**：
```yaml
核心能力:
- "**逻辑清理**：能够识别..." <-- ✅ 安全
```

### 最佳实践
1.  **由特殊字符开头的值必须加引号**：包括 `*`, `&`, `!`, `[`, `{`, `%`, `@` 等。
2.  **多行文本使用 Block Scalar**：避免隐式 Key 错误。
    ```yaml
    世界观: >
      深信世界是一个虚拟的“万象系统”。
      在这个系统中...
    ```

## 2. 资产组织策略 (Asset Organization)

为应对海量内容（博客、小说、白皮书），采用“递归挂载 + 自动化归档”策略。

### 目录结构规范
```
content/
├── 01_Essence/          # 核心思想
├── novels/              # 连载小说 (自动归档目标)
│   ├── 生花梦/
│   └── 程序赚钱/
└── whitepapers/         # 行业白皮书
```

### 自动化归档脚本 (Organize Script)
使用脚本根据文件名关键字自动分发内容，保持根目录整洁。

```bash
# 伪代码逻辑
find content/ -name "*章*" -exec mv {} content/novels/ \;
```

## 3. 故障排查清单
当构建报错或内容不显示时，按以下顺序检查：
1.  **YAML 语法**: 是否有未加引号的特殊字符？
2.  **多行格式**: 是否有缩进错误的描述字段？
3.  **文件编码**: 必须为 UTF-8 无 BOM 格式。
4.  **路径映射**: Docker 卷挂载路径是否与代码读取路径一致？

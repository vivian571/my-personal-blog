"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Video,
  Palette,
  Image as ImageIcon,
  Database,
  Cpu,
  Layers,
  Settings,
  ShieldCheck,
  ChevronRight,
  Folder,
  FileText,
  Search
} from "lucide-react";

// 定义 4 个核心技能的详细配置与互动内容
const SKILL_DETAILS = {
  "web-video-presentation": {
    id: "web-video-presentation",
    name: "web-video-presentation",
    chineseName: "网页视频 / 演示工程",
    emoji: "📹",
    category: "网页视频与演示工程",
    bestFor: "把口播稿、文章、课程、产品 Demo 做成适合 16:9 高清录屏的交互式演示系统",
    command: "npx skills add ConardLi/garden-skills/tree/web-video-presentation-v1.2.1/skills/web-video-presentation",
    highlights: [
      "固定 1920×1080 舞台，自适应缩放防止录屏边缘抖动",
      "双维游标控制 (chapter, step)，一视觉节拍对应一口播段落",
      "隐藏式微控面板，只在鼠标悬浮时显现，保证录像绝对洁净",
      "基于 CSS Tokens 内置了 23 套高质感设计主题",
      "支持本地 TTS (内置 MiniMax 客户端和 OpenAI TTS 脚本)"
    ]
  },
  "web-design-engineer": {
    id: "web-design-engineer",
    name: "web-design-engineer",
    chineseName: "网页设计工程师",
    emoji: "🎨",
    category: "设计与前端开发",
    bestFor: "快速设计高美感、高交互性、带独特设计系统的落地页与原型",
    command: "npx skills add ConardLi/garden-skills/tree/web-design-engineer-v1.2.1/skills/web-design-engineer",
    highlights: [
      "六步流：需求 → 上下文 → 声明 Token → v0原型 → 完整开发 → 验证",
      "强制采用 oklch() 配色空间，保证完美的对比度与色调感",
      "俗套黑名单：严厉禁止无脑渐变、圆角卡片阴影等 AI 模板风",
      "内置 25 套世界级网页设计配方（Stripe, Bloomberg, Aesop 等）",
      "自带响应式布局、减速动效及无障碍渲染规范"
    ]
  },
  "gpt-image-2": {
    id: "gpt-image-2",
    name: "gpt-image-2",
    chineseName: "gpt-image-2",
    emoji: "🖼️",
    category: "图像生成与 Prompt 顾问",
    bestFor: "可预测、工业级地批量生成 UI Mockup、拓扑架构图或写实海报",
    command: "npx skills add ConardLi/garden-skills/tree/gpt-image-2-v1.0.3/skills/gpt-image-2",
    highlights: [
      "内置 18 个垂直视觉分类，提供 80+ 套可组合的 Prompt 结构模版",
      "三维自适应运行：Mode A(本地直接绘图)、Mode B(宿主托管)、Mode C(Prompt 顾问)",
      "自动将生成的图像与包含 Prompt、种子等的 JSON 文件归档入同一个目录",
      "高宽比参数强制匹配：支持 1:1, 16:9, 9:16 以及特殊黄金比例",
      "防差错系统：自动检测敏感词汇并执行平滑降温替换"
    ]
  },
  "kb-retriever": {
    id: "kb-retriever",
    name: "kb-retriever",
    chineseName: "kb-retriever",
    emoji: "🔍",
    category: "本地知识库检索器",
    bestFor: "零成本、免 Token 堆叠地高精度检索和总结本地 PDF、Excel 与 Markdown 知识",
    command: "npx skills add ConardLi/garden-skills/tree/kb-retriever-v1.0.0/skills/kb-retriever",
    highlights: [
      "强制首查 data_structure.md 索引地图，极大幅度节省上下文",
      "“先学后做”规范：复杂格式处理前，强迫 Agent 阅读参考文档确保脚本零出错",
      "硬性 5 轮最大搜索限制，防止 Agent 陷入无效逻辑无限循环",
      "包含 grep、pandas、pdfplumber 等全套提取工具链指南",
      "强制输出带明确来源行号和文件路径的 Source-Attributed 格式结果"
    ]
  }
};

export default function GardenSkillsShowcase() {
  const [activeTab, setActiveTab] = useState<keyof typeof SKILL_DETAILS>("web-video-presentation");
  const [copied, setCopied] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // web-video 互动状态
  const [videoTheme, setVideoTheme] = useState("creative-voltage");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [synthesizedAudio, setSynthesizedAudio] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // web-design 互动状态
  const [designRecipe, setDesignRecipe] = useState("stripe");

  // gpt-image 互动状态
  const [imageCategory, setImageCategory] = useState("ui-mockup");
  const [imageMode, setImageMode] = useState("Mode-A");

  // kb-retriever 互动状态
  const [kbQuery, setKbQuery] = useState("");

  const currentSkill = SKILL_DETAILS[activeTab];

  // 复制命令
  const handleCopy = () => {
    navigator.clipboard.writeText(currentSkill.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 终端命令运行器模拟
  const runTerminalSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalLog([]);

    const logs = [
      `$ ${currentSkill.command}`,
      `>>> 🔍 正在从 GitHub 检索 ${currentSkill.name} 模块...`,
      `>>> 📦 解压 Skill 核心元数据包 [100%]...`,
      `>>> 📂 写入本地配置目录: .agents/skills/${currentSkill.name}/`,
      `>>> 📄 创建依赖规约: SKILL.md [已就绪]`,
      currentSkill.id === "web-video-presentation" || currentSkill.id === "kb-retriever"
        ? `>>> 🛠️ 配置本地脚本依赖项: scripts/ [已挂载]`
        : `>>> 🏡 载入静态模板文件: resources/ [已同步]`,
      `>>> 🔐 正在进行安全规范和运行沙箱审计...`,
      `>>> 🎉 集成成功！Agent 已成功掌握技能: 【${currentSkill.chineseName}】`
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setTerminalLog((prev) => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 400);
  };

  // 自动触发一次命令行载入
  useEffect(() => {
    setTerminalLog([`$ 准备就绪。点击下方“运行仿真演示”按钮模拟安装过程。`]);
  }, [activeTab]);

  return (
    <div className="space-y-12">
      {/* 顶部面包屑与标题 */}
      <header className="space-y-6 border-b border-[var(--border)] pb-8">
        <Link
          href="/skills"
          className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回智能体技能库
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center shadow-lg hover:rotate-6 transition-all duration-300">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Garden Skills 交互式展示画廊
              </h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Sovereign Agent Skill Exhibition Board — Designed for Claude Code & Cursor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 技能切换 Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(SKILL_DETAILS) as Array<keyof typeof SKILL_DETAILS>).map((key) => {
          const detail = SKILL_DETAILS[key];
          const isSelected = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                isSelected
                  ? "bg-[var(--card)] border-[var(--gold-accent)] shadow-[0_0_15px_rgba(37,99,235,0.05)] dark:shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                  : "bg-[var(--card)]/50 border-[var(--border)] hover:border-[var(--text-secondary)]/50"
              }`}
            >
              <span className="text-2xl">{detail.emoji}</span>
              <div className="overflow-hidden">
                <p className="text-xs text-[var(--text-secondary)] font-semibold truncate uppercase">
                  {detail.name}
                </p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {detail.chineseName}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 选项卡内容渲染 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：技能基本卡片与高亮亮点 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <span className="px-3 py-1 text-xs font-mono font-bold bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-full uppercase">
                {currentSkill.category}
              </span>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-3">
                {currentSkill.chineseName}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {currentSkill.bestFor}
              </p>
            </div>

            {/* 亮点卡片 */}
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--text-primary)] font-bold">
                🛠️ 核心架构亮点 (SKILL.md)
              </h3>
              <ul className="space-y-3">
                {currentSkill.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--gold-accent)] mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 仿真命令行控制台 */}
          <div className="bg-[#121214] text-slate-300 rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col h-80">
            {/* 终端头部 */}
            <div className="bg-[#1c1c1e] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--gold-accent)]" />
                <span className="text-xs font-mono font-bold text-slate-400">Agent Shell - {currentSkill.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
            </div>

            {/* 安装说明与复制命令 */}
            <div className="bg-[#18181b] px-4 py-2.5 border-b border-white/5 flex items-center justify-between gap-4">
              <code className="text-xs font-mono text-[var(--gold-accent)] truncate select-all">{currentSkill.command}</code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
                title="复制安装命令"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* 终端屏幕 */}
            <div className="p-4 font-mono text-xs space-y-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              {terminalLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    log.startsWith("$")
                      ? "text-slate-400 font-bold"
                      : log.includes("成功") || log.includes("OK")
                      ? "text-green-400 font-semibold"
                      : "text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            {/* 终端底部运行栏 */}
            <div className="bg-[#1c1c1e] px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                Ready for installation testing
              </span>
              <button
                onClick={runTerminalSimulation}
                disabled={isRunning}
                className="px-3 py-1 bg-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/80 disabled:opacity-50 text-white rounded-md text-xs font-bold font-sans flex items-center gap-1.5 transition-colors"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    正在载入...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    运行仿真演示
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：高度动态化的互动 Playground 面板 */}
        <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
            <Cpu className="w-5 h-5 text-[var(--gold-accent)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">智能沙盒互动测试区</h3>
          </div>

          {/* 技能一：web-video-presentation 交互沙盒 */}
          {activeTab === "web-video-presentation" && (
            <div className="space-y-6 flex-grow flex flex-col">
              <div className="flex flex-wrap gap-2.5 items-center justify-between">
                <div className="flex gap-2">
                  {["creative-voltage", "blueprint", "swiss-ikb", "chalk-garden"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setVideoTheme(theme)}
                      className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                        videoTheme === theme
                          ? "bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]"
                          : "bg-[var(--card)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-gray-400"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-[var(--text-secondary)]">23套内置主题已配置</span>
              </div>

              {/* 模拟 16:9 画布演示区 */}
              <div
                className={`relative flex-grow aspect-video border rounded-xl overflow-hidden shadow-md flex flex-col p-6 transition-all duration-500 ${
                  videoTheme === "creative-voltage"
                    ? "bg-[#eef2ff] border-indigo-200 text-indigo-950 font-serif"
                    : videoTheme === "blueprint"
                    ? "bg-[#0b132b] border-blue-900 text-cyan-400 font-mono"
                    : videoTheme === "swiss-ikb"
                    ? "bg-white border-zinc-200 text-zinc-900 font-sans"
                    : "bg-[#fcf8f2] border-amber-100 text-amber-950 font-sans"
                }`}
              >
                {/* 16:9 画布顶部 */}
                <div className="flex items-center justify-between text-xs opacity-60 font-mono mb-4">
                  <span>CHAPTER 01 - beat 0{currentSlide + 1}</span>
                  <span>1920 × 1080 (16:9 STAGE)</span>
                </div>

                {/* 画布核心内容切换 */}
                <div className="flex-grow flex flex-col justify-center space-y-4">
                  {currentSlide === 0 && (
                    <div className="space-y-2 animate-fade-in">
                      <h4 className="text-2xl md:text-3xl font-extrabold leading-tight">
                        {videoTheme === "blueprint" ? "SYSTEM ARCHITECTURE OVERVIEW" : "下一代 AI 编程演进"}
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                        AI 编程正在由单纯的单次问答 (One-Shot) 快速向具备严格工作流和质量防线的 **智能体技能化 (Agentic Skills)** 全速演进。
                      </p>
                    </div>
                  )}
                  {currentSlide === 1 && (
                    <div className="space-y-2 animate-fade-in">
                      <h4 className="text-2xl md:text-3xl font-extrabold leading-tight">
                        {videoTheme === "blueprint" ? "DECLARATIVE SPEC: SKILL.md" : "SKILL.md 元数据声明"}
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                        将 Prompt 升级为工程化插件规范。一个 `SKILL.md` 文件声明了此技能的安装环境、前置依赖、硬控制节点以及执行细节，像调用 npm 模块一样可插拔。
                      </p>
                    </div>
                  )}
                  {currentSlide === 2 && (
                    <div className="space-y-2 animate-fade-in">
                      <h4 className="text-2xl md:text-3xl font-extrabold leading-tight">
                        {videoTheme === "blueprint" ? "STATION: HUMAN IN THE LOOP" : "硬节点协作 (Human-in-the-loop)"}
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                        Agent 会在核心里程碑自动暂停（如稿件审核、视觉大纲审核、配乐配置），要求用户在终端输入确认才开始写代码，保证开发过程的安全可控。
                      </p>
                    </div>
                  )}
                </div>

                {/* 16:9 画布底部控制条 (录制时隐藏，此处悬浮呈现) */}
                <div className="mt-auto flex items-center justify-between border-t border-current/10 pt-4 text-xs opacity-75 font-mono">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                      disabled={currentSlide === 0}
                      className="px-2 py-0.5 border border-current rounded disabled:opacity-30 hover:bg-current/10"
                    >
                      ← PREV
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => Math.min(2, prev + 1))}
                      disabled={currentSlide === 2}
                      className="px-2 py-0.5 border border-current rounded disabled:opacity-30 hover:bg-current/10"
                    >
                      NEXT →
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span>REC READY</span>
                  </div>
                </div>
              </div>

              {/* 口播稿配音与 TTS 合成测试 */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">口播稿段落 (Narration Script Beat):</span>
                  <button
                    onClick={() => {
                      if (isSynthesizing) return;
                      setIsSynthesizing(true);
                      setSynthesizedAudio(false);
                      setTimeout(() => {
                        setIsSynthesizing(false);
                        setSynthesizedAudio(true);
                      }, 1800);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                      synthesizedAudio
                        ? "bg-green-600 text-white"
                        : "bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/20"
                    }`}
                  >
                    {isSynthesizing ? (
                      <>
                        <RotateCcw className="w-3 h-3 animate-spin" />
                        音频合成中...
                      </>
                    ) : synthesizedAudio ? (
                      <>
                        <Check className="w-3 h-3" />
                        MP3 合成成功!
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        合成当前配音 (TTS)
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] font-serif italic leading-relaxed">
                  {currentSlide === 0 && `“大家好，今天我们来深入探讨下一代 AI 辅助编程的未来。我们将摒弃传统的零散提问，迈入严格工程化、技能化的智能体全新时代……”`}
                  {currentSlide === 1 && `“技能化的核心资产是标准的 SKILL.md 文档。它定义了所有的依赖、前置要求和核心命令，让 Agent 拥有即插即用的模块化编程本领……”`}
                  {currentSlide === 2 && `“我们引入了硬协作确认机制。这是一种极其可靠的人机混合链路，Agent 会在每一项核心大纲确认无误后，才开始编写生产环境代码……”`}
                </div>
              </div>
            </div>
          )}

          {/* 技能二：web-design-engineer 交互沙盒 */}
          {activeTab === "web-design-engineer" && (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              {/* 配方选择 */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">选择设计配方 (Select School Recipe):</span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: "stripe", name: "Stripe Press" },
                    { id: "bloomberg", name: "Bloomberg" },
                    { id: "aesop", name: "Aesop 雅致" },
                    { id: "linear", name: "Linear 极客" }
                  ].map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => setDesignRecipe(recipe.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        designRecipe === recipe.id
                          ? "bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]"
                          : "bg-[var(--card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-gray-400"
                      }`}
                    >
                      {recipe.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 动态设计规范预览看板 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow items-stretch">
                {/* 样式变量面板 */}
                <div className="bg-[var(--background)] border border-[var(--border)] p-4 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      🎨 设计令牌与调色板
                    </h4>
                    <div className="flex gap-2">
                      {designRecipe === "stripe" && (
                        <>
                          <div className="w-8 h-8 rounded-md bg-[#635bff] border" title="Primary: #635bff"></div>
                          <div className="w-8 h-8 rounded-md bg-[#0a2540] border" title="Dark Ink: #0a2540"></div>
                          <div className="w-8 h-8 rounded-md bg-[#00d4b2] border" title="Cyan Accent: #00d4b2"></div>
                          <div className="w-8 h-8 rounded-md bg-[#f6f9fc] border" title="Gray BG: #f6f9fc"></div>
                        </>
                      )}
                      {designRecipe === "bloomberg" && (
                        <>
                          <div className="w-8 h-8 rounded-md bg-black border" title="Pure Dark"></div>
                          <div className="w-8 h-8 rounded-md bg-[#3b82f6] border" title="Terminal Blue"></div>
                          <div className="w-8 h-8 rounded-md bg-[#22c55e] border" title="Terminal Green"></div>
                          <div className="w-8 h-8 rounded-md bg-[#eab308] border" title="Yellow Accent"></div>
                        </>
                      )}
                      {designRecipe === "aesop" && (
                        <>
                          <div className="w-8 h-8 rounded-md bg-[#252525] border" title="Deep Charcoal"></div>
                          <div className="w-8 h-8 rounded-md bg-[#fffdf9] border" title="Warm Canvas"></div>
                          <div className="w-8 h-8 rounded-md bg-[#8e7f6d] border" title="Bronze Sand"></div>
                          <div className="w-8 h-8 rounded-md bg-[#eae5db] border" title="Light Cream"></div>
                        </>
                      )}
                      {designRecipe === "linear" && (
                        <>
                          <div className="w-8 h-8 rounded-md bg-[#121212] border" title="True Black"></div>
                          <div className="w-8 h-8 rounded-md bg-[#ffffff] border" title="Pure White"></div>
                          <div className="w-8 h-8 rounded-md bg-[#5e6ad2] border" title="Purple Accent"></div>
                          <div className="w-8 h-8 rounded-md bg-[#262626] border" title="Muted Charcoal"></div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase">
                      Typography & Fonts
                    </h4>
                    <p className={`text-base font-bold text-[var(--text-primary)] ${
                      designRecipe === "stripe" ? "font-sans tracking-tight" : designRecipe === "bloomberg" ? "font-mono" : designRecipe === "aesop" ? "font-serif italic" : "font-sans antialiased"
                    }`}>
                      {designRecipe === "stripe" && "Inter / Segment Sans - 高科技流动感"}
                      {designRecipe === "bloomberg" && "JetBrains Mono / Terminal - 高频数据风"}
                      {designRecipe === "aesop" && "Garamond / Editorial - 雅致人文文学感"}
                      {designRecipe === "linear" && "Geist Sans - 工业化冷峻极客风格"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-red-500 uppercase">
                      🚫 Anti-Clichés (AI 俗套防线)
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {designRecipe === "stripe" && "禁止使用任何圆角突兀的无脑科技配图，禁用高纯度饱和蓝色渐变大背景。"}
                      {designRecipe === "bloomberg" && "严禁多余的修饰性卡片阴影，所有边框必须为硬质像素，强调极致紧凑率。"}
                      {designRecipe === "aesop" && "全面禁用一切非衬线硬核工业体，拒绝使用带现代渐变的高亮交互徽章。"}
                      {designRecipe === "linear" && "杜绝五彩斑斓的彩色虚幻背景，仅保留微弱的单色极速射线与黑色微渐变。"}
                    </p>
                  </div>
                </div>

                {/* 动态组件效果预览 */}
                <div className={`p-6 border rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 ${
                  designRecipe === "stripe"
                    ? "bg-[#f6f9fc] border-[#e6ebf1] text-[#0a2540] font-sans"
                    : designRecipe === "bloomberg"
                    ? "bg-black border-[#222] text-[#22c55e] font-mono"
                    : designRecipe === "aesop"
                    ? "bg-[#fffdf9] border-[#eae5db] text-[#252525] font-serif"
                    : "bg-[#121212] border-[#222] text-white font-sans"
                }`}>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border mb-4 ${
                    designRecipe === "stripe"
                      ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                      : designRecipe === "bloomberg"
                      ? "bg-[#111] border-green-900 text-green-400"
                      : designRecipe === "aesop"
                      ? "bg-[#eae5db]/20 border-zinc-300 text-[#8e7f6d]"
                      : "bg-[#222] border-zinc-800 text-zinc-400"
                  }`}>
                    {designRecipe.toUpperCase()} PREVIEW
                  </span>
                  
                  <h5 className="text-xl font-extrabold leading-tight mb-2">
                    {designRecipe === "stripe" && "Sovereign Engineering"}
                    {designRecipe === "bloomberg" && "SYS.STATUS: ACTIVE"}
                    {designRecipe === "aesop" && "The Poetics of Living"}
                    {designRecipe === "linear" && "Geist-driven Speed"}
                  </h5>
                  
                  <p className="text-xs opacity-75 max-w-[200px] mb-6 leading-relaxed">
                    {designRecipe === "stripe" && "A beautiful layout crafted with CSS Grid, Container Queries and modular variables."}
                    {designRecipe === "bloomberg" && "MONITORING CPU LOAD [OK] - MEM [OK] - DISK OK. 5 ROUND exploration bounds active."}
                    {designRecipe === "aesop" && "An editorial space celebrating typography, raw earth palette, and silence."}
                    {designRecipe === "linear" && "Minimalist layout built with oklch colors and absolute high contrast elements."}
                  </p>

                  <button className={`px-5 py-2 text-xs font-bold rounded-lg border transition-all ${
                    designRecipe === "stripe"
                      ? "bg-[#635bff] border-[#635bff] text-white hover:opacity-90"
                      : designRecipe === "bloomberg"
                      ? "bg-transparent border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10"
                      : designRecipe === "aesop"
                      ? "bg-[#252525] border-[#252525] text-white hover:bg-black"
                      : "bg-white border-white text-black hover:bg-zinc-200"
                  }`}>
                    Interactive Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 技能三：gpt-image-2 交互沙盒 */}
          {activeTab === "gpt-image-2" && (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              {/* 图像类型选择 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {[
                  { id: "ui-mockup", label: "UI 样机", desc: "极简高端设备框展示" },
                  { id: "infographic", label: "数据图解", desc: "科技感极客架构图" },
                  { id: "tech-diagram", label: "技术拓扑", desc: "扁平风格系统交互" },
                  { id: "micro-world", label: "微缩景观", desc: "写实唯美的微缩3D" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setImageCategory(cat.id)}
                    className={`p-3 border rounded-xl text-left transition-all ${
                      imageCategory === cat.id
                        ? "bg-[var(--gold-accent)]/10 border-[var(--gold-accent)]"
                        : "bg-[var(--card)] border-[var(--border)] hover:border-gray-400"
                    }`}
                  >
                    <p className="text-sm font-bold text-[var(--text-primary)]">{cat.label}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>

              {/* 运行模式选择 */}
              <div className="bg-[var(--background)] border border-[var(--border)] p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">切换生成器模式 (Adaptive Mode):</span>
                  <div className="flex gap-2">
                    {["Mode-A", "Mode-B", "Mode-C"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setImageMode(m)}
                        className={`px-2.5 py-1 text-xs font-bold rounded border transition-all ${
                          imageMode === m
                            ? "bg-[var(--text-primary)] text-[var(--background)] border-[var(--text-primary)]"
                            : "bg-[var(--card)] border-[var(--border)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 动态 Prompt 模板 */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[var(--text-secondary)]">动态组合 Prompt 结果:</span>
                  <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--text-primary)] leading-relaxed select-all">
                    {imageCategory === "ui-mockup" &&
                      `"A premium mockup of a smartphone interface, 16:9 aspect ratio, showing a gorgeous glassmorphism financial dashboard, oklch primary color, clean aesthetic layout, mid-century color accents, high-contrast flat background, minimal design --style vivid"`}
                    {imageCategory === "infographic" &&
                      `"A precise infographic displaying technical dataset flows, vector line art, terminal blue and yellow highlights, flat dark background, absolutely clean, no text clichés, technical topo illustration --style natural"`}
                    {imageCategory === "tech-diagram" &&
                      `"Minimalist system topology chart showing server architecture nodes, clean paths, HSL accent circles, no generic AI shapes, Stripe Press editorial layouts, highly structured flat SVG render"`}
                    {imageCategory === "micro-world" &&
                      `"An ultra-detailed 3D tilt-shift photo of a miniature forest inside a transparent glass bottle, realistic warm lighting, subtle shadows, organic dirt layers, cinematic depth of field"`}
                  </div>
                </div>

                {/* 运行模式说明 */}
                <div className="flex gap-2 items-center text-xs text-[var(--text-secondary)] bg-[var(--card)] p-2.5 rounded-lg border border-[var(--border)]">
                  <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>
                    {imageMode === "Mode-A" && "🟢 自动检测到本地 API 通信通道：将直接下载生成图片，并自动输出伴生 JSON 元数据进行版本化归档。"}
                    {imageMode === "Mode-B" && "🟡 自动托管至宿主客户端：调用 Claude / Cursor 内置的绘图接口完成渲染。"}
                    {imageMode === "Mode-C" && "🔵 顾问模式开启：由于本地未检测到 API 及宿主接口，已自动将格式化的 Prompt 复制至剪切板供您前往 Midjourney/ChatGPT 直接使用。"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 技能四：kb-retriever 交互沙盒 */}
          {activeTab === "kb-retriever" && (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              {/* 文件结构图 */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">本地库物理文件结构 (Knowledge Tree):</span>
                <div className="bg-[var(--background)] border border-[var(--border)] p-4 rounded-xl font-mono text-xs text-[var(--text-primary)] space-y-2">
                  <div className="flex items-center gap-1.5 text-[var(--gold-accent)] font-bold">
                    <Folder className="w-4 h-4" /> content/
                  </div>
                  <div className="pl-6 flex items-center gap-1.5 text-green-600 font-bold animate-pulse">
                    <FileText className="w-4 h-4" /> data_structure.md <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">🌟 检索优先入口</span>
                  </div>
                  <div className="pl-6 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-amber-500" /> pdfs/
                  </div>
                  <div className="pl-12 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> API_Reference.pdf</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 rounded">学前阅读训练挂载</span>
                  </div>
                  <div className="pl-6 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-blue-500" /> excel/
                  </div>
                  <div className="pl-12 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Financial_Stats_Q1.xlsx
                  </div>
                </div>
              </div>

              {/* 交互搜索演示 */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      value={kbQuery}
                      onChange={(e) => setKbQuery(e.target.value)}
                      placeholder="输入需要检索的知识，模拟 5 轮高精度搜索..."
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl py-2 pl-9 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-accent)]"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!kbQuery.trim()) return;
                      setIsRunning(true);
                      setTerminalLog([]);
                      const searchLogs = [
                        `$ grep -r "${kbQuery}" ./content/skills/`,
                        `[ROUND 1/5] 🗺️ 正在扫描全局结构地图: content/data_structure.md...`,
                        `[ROUND 2/5] 📄 定位核心引用文档: pdfs/API_Reference.pdf.`,
                        `[ROUND 3/5] 🎓 遵循“学前阅读规则”，先调取 pdftotext 工具载入 reference 元数据...`,
                        `[ROUND 4/5] 🔍 执行行级 Grep 精准过滤，找到 3 处可能匹配...`,
                        `[ROUND 5/5] 🎯 匹配成功！输出带源头位置标识的知识点：`,
                        `--------------------------------------------------`,
                        `【源头：content/skills/kb-retriever.md#L45】`,
                        `检索结果：为了防止 AI 在未知领域无限自我迭代浪费 Token，在 SKILL.md 中设置了硬性 5 轮的最大循环深度阀值限制。`,
                        `--------------------------------------------------`
                      ];
                      
                      let index = 0;
                      const interval = setInterval(() => {
                        if (index < searchLogs.length) {
                          setTerminalLog((prev) => [...prev, searchLogs[index]]);
                          index++;
                        } else {
                          clearInterval(interval);
                          setIsRunning(false);
                        }
                      }, 300);
                    }}
                    disabled={isRunning || !kbQuery.trim()}
                    className="px-4 py-2 bg-[var(--gold-accent)] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    搜索模拟
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                  <span>最大检索循环数：5轮 (防止死循环)</span>
                  <span>支持 grep / pandas / pdfplumber 三大工具</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, Zap, Hammer, Lightbulb, Rocket, Target, Briefcase } from "lucide-react";

export default function Foundry() {
    return (
        <div className="space-y-16 animate-fade-in pb-20">
            {/* Grid Pattern Background Overlay */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none -z-10" />
            
            {/* Header */}
            <section className="space-y-6 pt-12">
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-accent)] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all mb-8">
                    <ArrowLeft size={16} /> 返回指挥中心
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/5 border border-[var(--gold-accent)]/10 text-[var(--gold-accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Zap size={10} className="animate-pulse" /> E-An Foundry Active
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.05]">
                    意安<span className="text-[var(--gold-accent)] italic serif">金矿</span>
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium">
                    一人公司流水线：从捕捉微小痛点到自动化发布 MVP。这里是每一个“商业切口”的孵化炉。
                </p>
            </section>

            {/* Matrix View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI 痛点挖掘机 */}
                <div className="p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-paper-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={120} />
                    </div>
                    <div className="p-4 rounded-3xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] w-fit mb-8">
                        <Lightbulb size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">AI 痛点挖掘机</h2>
                    <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                        深度扫描社交媒体评论、短视频文稿，自动化提取用户“不爽”的核心节点，并转化为商业 MVP 方案。
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-mono">
                            <span className="text-[var(--gold-accent)] text-[10px] uppercase font-bold block mb-2">Latest Insights</span>
                            "现在的短视频分发工具对于小体量创作者来说太沉重了..." 
                        </div>
                        <button className="w-full py-4 bg-[var(--gold-accent)] text-black rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform active:scale-95">
                            启动扫描任务
                        </button>
                    </div>
                </div>

                {/* 一人公司项目库 */}
                <div className="p-8 rounded-[2.5rem] bg-[var(--ink-900)] text-white border border-white/5 shadow-paper-floating relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-accent)]/10 to-transparent opacity-50" />
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-[var(--gold-accent)] w-fit mb-8">
                        <Rocket size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">一人公司项目库</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        记录所有已验证、已上线或待开发的 Micro-SaaS 项目。每一个项目都是一块可增值的数字资产。
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-[10px] text-white/40 block mb-1">已在营</span>
                            <span className="text-2xl font-black text-[var(--gold-accent)]">12</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-[10px] text-white/40 block mb-1">孵化中</span>
                            <span className="text-2xl font-black">28</span>
                        </div>
                    </div>
                    <button className="mt-8 w-full py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all active:scale-95">
                        查看项目详情
                    </button>
                </div>
            </div>

            {/* Workflow Banner */}
            <section className="p-12 rounded-[3rem] bg-[var(--card)] border border-[var(--border)] text-center space-y-8 relative overflow-hidden shadow-paper-floating">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent" />
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight uppercase flex items-center justify-center gap-3">
                        <Hammer size={24} className="text-[var(--gold-accent)]" /> 资产制造流
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto font-medium">
                        当前流水线已接入 RD-Matrix 手术刀引擎，具备通过一行指令自动生成、修改并部署 Micro-SaaS 的能力。
                    </p>
                </div>
                <div className="flex justify-center items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]/40">
                    <span>Input</span>
                    <ArrowLeft size={10} className="rotate-180" />
                    <span className="text-[var(--gold-accent)]">Miner</span>
                    <ArrowLeft size={10} className="rotate-180" />
                    <span>MetaGPT</span>
                    <ArrowLeft size={10} className="rotate-180" />
                    <span className="text-[var(--gold-accent)]">RD-Matrix</span>
                </div>
            </section>
        </div>
    );
}

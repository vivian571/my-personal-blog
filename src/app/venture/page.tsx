import Link from "next/link";
import { Rocket, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, LineChart } from "lucide-react";

export const metadata = {
    title: "Venture 商业化情报站 | 意安序",
    description: "将 AI 组织成持续创造价值的系统：主权协议、自动化二创与情报订阅。",
};

export default function VenturePage() {
    return (
        <div className="space-y-16 animate-fade-in">
            {/* Header Section */}
            <div className="space-y-4 border-b border-[var(--border)] pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] text-[10px] font-black uppercase tracking-widest border border-[var(--gold-accent)]/20">
                    <Rocket size={12} /> One-Person Company Protocol
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    Venture 商业化情报站
                </h1>
                <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                    不再把 AI 当作聊天搭子。我们将 AI 组织成结构化、自动化、可持续盈利的主权资产系统。
                </p>
            </div>

            {/* Core Architecture Matrix */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[var(--gold-accent)] rounded-full" />
                    <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">三层价值交付矩阵</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Layer 1 */}
                    <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] space-y-4 relative overflow-hidden group hover:border-[var(--gold-accent)] transition-all">
                        <div className="p-3 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-2xl w-fit">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-[var(--gold-accent)] uppercase">01 / Knowledge Assets</span>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">知识与协议溢价</h3>
                        <p className="text-sm text-[var(--text-secondary)]/70 leading-relaxed">
                            包含连续性 Prompt 协议、Nano Banana 实践手册、Seedance 深度白皮书及企业级提示词工程咨询。
                        </p>
                        <ul className="space-y-2 pt-2 text-xs font-semibold text-[var(--text-secondary)]">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> 深度白皮书 / 付费专栏</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> 角色连续性 Prompt 协议</li>
                        </ul>
                    </div>

                    {/* Layer 2 */}
                    <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] space-y-4 relative overflow-hidden group hover:border-[var(--gold-accent)] transition-all">
                        <div className="p-3 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-2xl w-fit">
                            <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-[var(--gold-accent)] uppercase">02 / Curation Services</span>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">自动化策展服务</h3>
                        <p className="text-sm text-[var(--text-secondary)]/70 leading-relaxed">
                            基于 Hot Monitor Protocol 与 AutoClip Protocol，提供长视频转短视频切片分发及行业定制情报站。
                        </p>
                        <ul className="space-y-2 pt-2 text-xs font-semibold text-[var(--text-secondary)]">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> AI 自动化短视频切片流水线</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> 实时 AI 技术早报订阅</li>
                        </ul>
                    </div>

                    {/* Layer 3 */}
                    <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] space-y-4 relative overflow-hidden group hover:border-[var(--gold-accent)] transition-all">
                        <div className="p-3 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-2xl w-fit">
                            <LineChart size={24} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-[var(--gold-accent)] uppercase">03 / Protocol SaaS</span>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">协议化 API 服务</h3>
                        <p className="text-sm text-[var(--text-secondary)]/70 leading-relaxed">
                            将底层的 Humanizer 去 AI 味协议与 IM Bridge 企业级插件封装为云端可直接调用的 API 服务。
                        </p>
                        <ul className="space-y-2 pt-2 text-xs font-semibold text-[var(--text-secondary)]">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> Humanizer 云端 API</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--gold-accent)]" /> 企微 / 钉钉 IM Bridge 助手</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Protocol Showcase / Action */}
            <section className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold-accent)]">Live Protocol Status</span>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">寻求商业合作 / 深度咨询？</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xl">
                        我们帮助个人创作者与中小型团队打造具备“主权品牌”属性的 AI 交付系统。
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                    <Link 
                        href="/guestbook" 
                        className="px-6 py-3 bg-[var(--text-primary)] text-[var(--background)] rounded-2xl font-bold text-xs hover:scale-105 transition-all flex items-center gap-2"
                    >
                        联系发起合作 <ArrowRight size={14} />
                    </Link>
                    <Link 
                        href="/posts/archive/system_configs/AGENTS" 
                        className="px-6 py-3 border border-[var(--border)] rounded-2xl font-bold text-xs hover:bg-[var(--text-secondary)]/5 transition-all"
                    >
                        查看 Agent 运行规范
                    </Link>
                </div>
            </section>
        </div>
    );
}

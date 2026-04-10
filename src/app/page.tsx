import Link from "next/link";
import { Library, MessageSquareText, Box, ArrowRight, Sparkles, MessageCircle, RefreshCw, Cpu, Hammer } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import EvolutionTimeline from "@/components/EvolutionTimeline";

export const dynamic = "force-dynamic";

// Helper function to get recent posts
function getRecentPosts() {
    const contentDirectory = path.join(process.cwd(), "content");
    if (!fs.existsSync(contentDirectory)) return [];

    const files_ = [];

    function scan(dir) {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith(".md")) {
                files_.push(fullPath);
            }
        });
    }

    scan(contentDirectory);

    const posts = files_.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const relativePath = path.relative(contentDirectory, filePath);
        const slug = relativePath.replace(/\.md$/, "");

        const value = (Math.random() * 10 + 5).toFixed(2);

        return {
            title: data.title || path.basename(filePath, ".md"),
            date: data.date || "",
            category: data.category || "General",
            slug: slug,
            value: value
        };
    })
        .sort((a, b) => (b.date > a.date ? 1 : -1))
        .slice(0, 6);

    return posts;
}

export default function Home() {
    const recentPosts = getRecentPosts();

    return (
        <div className="space-y-32 animate-fade-in relative pb-20">
            {/* Grid Pattern Background Overlay */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none -z-10" />
            <div className="fixed inset-0 noise-overlay opacity-[0.02] pointer-events-none -z-10" />

            {/* Hero Section */}
            <section className="space-y-8 relative py-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/5 border border-[var(--gold-accent)]/10 text-[var(--gold-accent)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-accent)] animate-pulse" />
                    Asset Protocol Active
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--text-primary)] leading-[1.05]">
                    打造你的<br />
                    <span className="text-[var(--gold-accent)] italic serif">数字资产</span> 帝国
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed font-medium">
                    基于 Ship-Faster 理念构建。一个存放思想碎片、深度技术教程与实用工具集的工业级知识库。
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/archive" className="px-8 py-4 bg-[var(--text-primary)] text-[var(--background)] rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-paper-lg active:scale-95">
                        进入仓库
                    </Link>
                    <Link href="/whitepapers" className="px-8 py-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl font-bold text-sm hover:bg-[var(--text-secondary)]/5 transition-all flex items-center gap-2 shadow-paper-sm active:scale-95">
                        查看白皮书 <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Evolution Timeline Section - NEW */}
            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-2xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)]">
                        <Cpu size={32} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">载体进化脉络</h2>
                    <p className="text-[var(--text-secondary)] max-w-md text-sm font-medium">
                        从原始日志到指挥官秩序，见证呈序（Chéng Xù）的自省与升维之旅。
                    </p>
                </div>
                <EvolutionTimeline />
            </section>

            {/* Stats Bar */}
            <section className="bg-[var(--ink-900)] rounded-[2.5rem] p-8 flex flex-wrap items-center justify-between text-white shadow-paper-floating relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-accent)]/10 to-transparent opacity-50" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <RefreshCw size={24} className="text-[var(--gold-accent)]" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Command Center</span>
                        <p className="text-sm font-bold">Orchestrator Active</p>
                    </div>
                </div>
                <div className="flex gap-12 relative z-10">
                    <StatItem label="Entities" value="109" />
                    <StatItem label="Phase" value="3.0" highlight />
                    <StatItem label="Logic Status" value="Arena Ready" />
                </div>
            </section>

            {/* Dashboard Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <DashboardCard
                    href="/library"
                    icon={<Library size={32} />}
                    title="书阁"
                    subtitle="Systematic Knowledge"
                    description="构建完整的技术与人文知识树。"
                />
                <DashboardCard
                    href="/fragments"
                    icon={<MessageSquareText size={32} />}
                    title="思想碎片"
                    subtitle="Inspiration Stream"
                    description="捕捉每一个稍纵即逝的灵感节点。"
                    processing
                />
                <DashboardCard
                    href="/skills"
                    icon={<Box size={32} />}
                    title="万宝箱"
                    subtitle="Toolbox & Scripts"
                    description="高效工具与自动化工作流清单。"
                />
                <DashboardCard
                    href="/foundry"
                    icon={<Hammer size={32} />}
                    title="意安金矿"
                    subtitle="Founder's Lab"
                    description="痛点挖掘与一人公司项目实验室。"
                />
            </section>

            {/* Content Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <section className="lg:col-span-1">
                    <SectionHeader title="最近流水" />
                    <div className="space-y-4">
                        {recentPosts.slice(0, 4).map((post) => (
                            <Link
                                key={post.slug}
                                href={`/posts/${post.slug}`}
                                className="group flex items-center gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold-accent)] hover:shadow-paper-lg transition-all"
                            >
                                <div className="text-xs font-bold text-[var(--text-secondary)]/30 group-hover:text-[var(--gold-accent)] transition-colors">
                                    {post.date ? post.date.toString().split('-').slice(1).join('/') : '00/00'}
                                </div>
                                <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug group-hover:translate-x-1 transition-transform line-clamp-1">
                                    {post.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="lg:col-span-1">
                    <SectionHeader title="资产增值" />
                    <div className="space-y-4">
                        {recentPosts.filter(p => parseFloat(p.value) > 5).slice(0, 3).map((post) => (
                            <div key={post.slug} className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-paper-md group relative hover:border-[var(--gold-accent)] transition-all">
                                <div className="absolute top-0 right-0 px-4 py-2 bg-[var(--gold-accent)] text-black text-[10px] font-black rounded-bl-2xl shadow-lg">
                                    MINTED
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={14} className="text-[var(--gold-accent)]" />
                                    <span className="text-[9px] font-black tracking-widest uppercase text-[var(--gold-accent)]">RAG Enhanced</span>
                                </div>
                                <h3 className="font-bold text-[var(--text-primary)] text-sm mb-4 leading-relaxed line-clamp-2">{post.title}</h3>
                                <Link href={`/posts/${post.slug}`} className="text-[10px] font-black text-[var(--gold-accent)] flex items-center gap-1 group/btn">
                                    INSPECT <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="lg:col-span-1">
                    <SectionHeader title="媒体矩阵" />
                    <div className="space-y-4">
                        <WeChatCard name="AI 流习社" category="Tech" />
                        <WeChatCard name="开源智核" category="Code" />
                        <WeChatCard name="平凡日子记" category="Life" />
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</span>
            <span className={`text-xl font-bold tracking-tight ${highlight ? 'text-[var(--gold-accent)]' : ''}`}>{value}</span>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-5 bg-[var(--gold-accent)] rounded-full" />
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
    );
}

function DashboardCard({ href, icon, title, subtitle, description, processing }: { href: string, icon: React.ReactNode, title: string, subtitle: string, description: string, processing?: boolean }) {
    return (
        <Link href={href} className="group p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-paper-sm hover:shadow-paper-floating hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="mb-8 p-4 rounded-2xl bg-[var(--background)] w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform text-[var(--text-primary)]">
                {icon}
            </div>
            <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]/40">{subtitle}</span>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]/60 leading-relaxed">{description}</p>
            </div>
            {processing && (
                <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-[var(--gold-accent)] uppercase tracking-widest bg-[var(--gold-accent)]/5 px-3 py-1.5 rounded-full w-fit border border-[var(--gold-accent)]/10">
                    <RefreshCw size={10} className="animate-spin" /> Asset Syncing...
                </div>
            )}
            <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-[var(--text-primary)] text-[var(--background)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight size={20} />
            </div>
        </Link>
    );
}

function WeChatCard({ name, category }: { name: string, category: string }) {
    return (
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between group hover:border-[var(--gold-accent)] transition-colors shadow-paper-sm">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--background)] flex items-center justify-center group-hover:bg-[var(--gold-accent)] group-hover:text-white transition-colors text-[var(--text-secondary)]">
                    <MessageCircle size={20} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{name}</h3>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]/30 border border-[var(--border)] px-2 py-1 rounded-lg">
                {category}
            </span>
        </div>
    );
}

import Link from "next/link";
import { Library, MessageSquareText, Box, ArrowRight, Sparkles, MessageCircle, RefreshCw, DollarSign } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

        // Assign random "Valuation" for visual demo
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
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--text-primary)]">
                    探索<span className="text-[var(--text-secondary)]/60">知识</span>的边界
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                    这里是意安序的数字领地。一个存放思想碎片、深度技术教程与实用工具集的万宝箱。
                </p>
            </section>

            {/* Omni-Flow Stats Bar */}
            <section className="bg-[var(--text-primary)] rounded-xl p-4 flex flex-wrap items-center justify-between text-[var(--background)] shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--gold-accent)] animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Omni-Flow Active</span>
                </div>
                <div className="flex gap-8 text-sm font-medium">
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <span className="opacity-60">Thoughts Collected:</span>
                        <span className="font-bold">102</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <span className="opacity-60">Whitepapers Minted:</span>
                        <span className="font-bold">12</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                        <span className="opacity-60">Global Reach:</span>
                        <span className="font-bold text-[var(--gold-accent)] flex items-center"><DollarSign size={12} />60.00</span>
                    </div>
                </div>
            </section>

            {/* Dashboard Grid (Toolbox Style) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                    href="/library"
                    icon={<Library className="w-8 h-8" />}
                    title="书阁"
                    subtitle="Library"
                    description="深度阅读与 system 化知识体系。"
                    color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                />
                <DashboardCard
                    href="/fragments"
                    icon={<MessageSquareText className="w-8 h-8" />}
                    title="思想碎片"
                    subtitle="Fragments"
                    description="灵感闪念与非线性的思考脉络。"
                    color="bg-amber-500/10 text-amber-500 border-amber-500/20"
                    mintingStatus={true}
                />
                <DashboardCard
                    href="/toolbox"
                    icon={<Box className="w-8 h-8" />}
                    title="万宝箱"
                    subtitle="Toolbox"
                    description="实用脚本、配置清单与提效工具。"
                    color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                />
            </section>

            {/* Latest Updates & Whitepaper & WeChat Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Latest List */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[var(--text-secondary)]/40" />
                            最新发布
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentPosts.slice(0, 4).map((post) => (
                            <Link
                                key={post.slug}
                                href={`/wechat/${post.category?.toLowerCase() || 'ai_flow_club'}/${post.slug}`}
                                className="group block p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold-accent)]/30 hover:bg-[var(--text-secondary)]/5 transition-all relative"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-sm group-hover:text-[var(--gold-accent)] transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--text-secondary)]/60 font-medium">
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Whitepaper Pipeline (New Section) */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-[var(--gold-accent)]" />
                            万象流水线
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentPosts.filter(p => parseFloat(p.value) > 5).slice(0, 4).map((post) => (
                            <div
                                key={post.slug}
                                className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] group relative overflow-hidden transition-all hover:border-[var(--gold-accent)]/30"
                            >
                                <div className="absolute top-0 right-0 p-1.5 bg-[var(--gold-accent)] text-black text-[9px] font-bold rounded-bl-lg shadow-lg">
                                    VALUE: ${post.value}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-accent)] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                                    <span className="text-[9px] font-bold text-[var(--gold-accent)] tracking-[0.2em] uppercase">USD Whitepaper Asset</span>
                                </div>

                                <h3 className="font-bold text-[var(--text-primary)] text-sm mb-3 group-hover:text-[var(--gold-accent)] transition-colors">{post.title}</h3>

                                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                                    <span className="text-[9px] text-[var(--text-secondary)]/60 font-medium italic">Sync from Mobile Agent (WhatsApp)</span>
                                    <Link href={`/posts/${post.slug}`} className="text-[var(--gold-accent)] text-[10px] font-bold hover:underline underline-offset-4 flex items-center gap-1">
                                        Inspect <ArrowRight size={10} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* WeChat Quick Access */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-[var(--text-primary)]">
                            <MessageCircle className="w-5 h-5 text-[var(--text-secondary)]/40" />
                            公众号矩阵
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <WeChatCard
                            name="AI 流习社"
                            desc="前沿 AI 技术与落地实践"
                            slug="ai_flow_club"
                            stats="Tech"
                        />
                        <WeChatCard
                            name="开源智核"
                            desc="解析开源项目与架构"
                            slug="open_source_core"
                            stats="Code"
                        />
                        <WeChatCard
                            name="平凡日子记"
                            desc="生活与副业思考"
                            slug="ordinary_life"
                            stats="Life"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function DashboardCard({ href, icon, title, subtitle, description, color, mintingStatus }) {
    return (
        <Link
            href={href}
            className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color} group ring-1 ring-transparent overflow-hidden`}
        >
            <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{subtitle}</p>
                <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            {mintingStatus && (
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--gold-accent)] bg-[var(--gold-accent)]/5 px-3 py-1.5 rounded-full w-fit animate-pulse border border-[var(--gold-accent)]/20">
                    <RefreshCw size={10} className="animate-spin" />
                    Translating to USD Whitepaper...
                </div>
            )}

            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5" />
            </div>
        </Link>
    );
}

function WeChatCard({ name, desc, slug, stats }) {
    return (
        <Link
            href={`/wechat/${slug}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-solid hover:border-[var(--gold-accent)]/30 hover:bg-[var(--text-secondary)]/5 transition-all group"
        >
            <div className="w-12 h-12 rounded-lg bg-[var(--text-secondary)]/5 flex items-center justify-center text-[var(--text-secondary)]/40 group-hover:bg-[var(--background)] group-hover:text-[var(--gold-accent)] transition-colors border border-transparent group-hover:border-[var(--border)]">
                <MessageCircle size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[var(--text-primary)]">{name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]/60 bg-[var(--text-secondary)]/5 px-2 py-1 rounded">
                        {stats}
                    </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]/80 mt-1">{desc}</p>
            </div>
        </Link>
    );
}

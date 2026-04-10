import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, Cpu, Zap, Library, Palette, ShieldCheck, Search } from "lucide-react";

interface Skill {
    slug: string;
    name: string;
    description: string;
    emoji: string;
    category: string;
}

const CATEGORIES = {
    PROTOCOLS: "核心协议 (Protocols)",
    PERSONAS: "智能体人格 (Personas)",
    INTEGRATIONS: "第三方集成 (Integrations)",
    SYSTEM: "系统工具 (Tools)",
    OTHER: "其他资产 (Others)"
};

function getCategory(slug: string): string {
    if (slug.endsWith("-protocol") || slug.includes("protocol")) return CATEGORIES.PROTOCOLS;
    if (slug.endsWith("-persona") || slug.includes("persona")) return CATEGORIES.PERSONAS;
    if (["notion", "1password", "apple-notes", "apple-reminders", "bear-notes", "github", "discord", "slack", "trello", "spotify-player", "whatsapp-enhancement", "wechat-article-persona"].includes(slug)) return CATEGORIES.INTEGRATIONS;
    if (["moltbot-ops", "maintenance-guide", "skill-creator", "healthcheck", "session-logs", "model-usage"].includes(slug)) return CATEGORIES.SYSTEM;
    return CATEGORIES.OTHER;
}

function getSkills(): Record<string, Skill[]> {
    const skillsDirectory = path.join(process.cwd(), "content/skills");
    if (!fs.existsSync(skillsDirectory)) return {};

    const files = fs.readdirSync(skillsDirectory);
    const groupedSkills: Record<string, Skill[]> = {};

    files.filter(f => f.endsWith(".md")).forEach(file => {
        const fullPath = path.join(skillsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        const slug = file.replace(/\.md$/, "");
        const category = getCategory(slug);

        if (!groupedSkills[category]) groupedSkills[category] = [];

        groupedSkills[category].push({
            slug: slug,
            name: data.name || slug,
            description: data.description || "",
            emoji: data.metadata?.openclaw?.emoji || "📦",
            category: category
        });
    });

    return groupedSkills;
}

export default function SkillsPage() {
    const groupedSkills = getSkills();
    const categoriesOrder = [CATEGORIES.PROTOCOLS, CATEGORIES.PERSONAS, CATEGORIES.INTEGRATIONS, CATEGORIES.SYSTEM, CATEGORIES.OTHER];

    return (
        <div className="space-y-16">
            {/* Header */}
            <header className="space-y-6 border-b border-[var(--border)] pb-10">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Museum Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--gold-accent)] text-black flex items-center justify-center shadow-2xl transition-all duration-500 hover:rotate-6">
                            <Cpu size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Moltbot 技能库</h1>
                            <p className="text-[var(--text-secondary)] font-medium text-lg mt-1">Moltbot Standardized Capability Vault — The Sovereign Asset Repository</p>
                        </div>
                    </div>
                </div>
            </header>

            {categoriesOrder.map((category) => (
                groupedSkills[category] && groupedSkills[category].length > 0 && (
                    <section key={category} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-[var(--gold-accent)] uppercase tracking-widest">{category}</h2>
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-[var(--gold-accent)]/30 to-transparent"></div>
                            <span className="text-[var(--text-secondary)] text-sm font-mono">{groupedSkills[category].length} Assets</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {groupedSkills[category].map((skill) => (
                                <Link
                                    key={skill.slug}
                                    href={`/posts/skills/${skill.slug}`}
                                    className="artifact-card group p-6 flex flex-col h-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold-accent)]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {skill.emoji}
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--gold-accent)] transition-colors">
                                        {skill.name}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]/80 leading-relaxed mb-8 flex-grow">
                                        {skill.description}
                                    </p>

                                    <div className="mt-auto px-5 py-2.5 border border-[var(--gold-accent)]/20 text-[var(--gold-accent)] text-xs text-center font-black uppercase tracking-tighter rounded-md group-hover:bg-[var(--gold-accent)] group-hover:text-black transition-all duration-300">
                                        Execute Protocol
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )
            ))}

            {Object.keys(groupedSkills).length === 0 && (
                <div className="py-24 text-center text-[var(--text-secondary)]/40 border-2 border-dashed border-[var(--border)] rounded-3xl">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No sovereign assets identified in the current vault.</p>
                </div>
            )}
        </div>
    );
}

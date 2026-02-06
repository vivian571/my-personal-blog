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
    content: string;
}

function getSkills(): Skill[] {
    const skillsDirectory = path.join(process.cwd(), "content/skills");
    if (!fs.existsSync(skillsDirectory)) return [];

    const files = fs.readdirSync(skillsDirectory);
    const skills = files.filter(f => f.endsWith(".md")).map(file => {
        const fullPath = path.join(skillsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: file.replace(/\.md$/, ""),
            name: data.name || file.replace(/\.md$/, ""),
            description: data.description || "",
            emoji: data.metadata?.openclaw?.emoji || "📦",
            content: content
        };
    });

    return skills;
}

export default function SkillsPage() {
    const skills = getSkills();

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--gold-accent)] text-black flex items-center justify-center shadow-lg transition-all duration-300">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Moltbot 技能包</h1>
                            <p className="text-[var(--text-secondary)] font-medium">Moltbot Skills — Standardized Capability Packages</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((skill) => (
                    <Link
                        key={skill.slug}
                        href={`/posts/skills/${skill.slug}`}
                        className="artifact-card group p-6 flex flex-col h-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold-accent)]/30 transition-all"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center mb-4 text-xl">
                            {skill.emoji}
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--gold-accent)] transition-colors">
                            {skill.name}
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)]/80 leading-relaxed mb-6 flex-grow">
                            {skill.description}
                        </p>

                        <div className="mt-auto px-4 py-2 border border-[var(--gold-accent)]/20 text-[var(--gold-accent)] text-sm text-center font-bold rounded-lg group-hover:bg-[var(--gold-accent)] group-hover:text-black transition-all">
                            View Protocol
                        </div>
                    </Link>
                ))}

                {skills.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[var(--text-secondary)]/40 border border-dashed border-[var(--border)] rounded-2xl">
                        No skill packages identified in current vault.
                    </div>
                )}
            </div>
        </div>
    );
}

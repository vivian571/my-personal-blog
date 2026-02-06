import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, MessageSquareText, Sparkles } from "lucide-react";

function getFragments() {
    const contentDir = path.join(process.cwd(), "content");
    const fragments = [];

    function scan(dir) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith(".md")) {
                // Simple heuristic: if it's in a WeChat personal folder or specific tech folders
                const isMusing = fullPath.includes("ordinary_life") || fullPath.includes("文章");
                if (isMusing) {
                    const content = fs.readFileSync(fullPath, "utf8");
                    const { data, content: text } = matter(content);
                    const relativePath = path.relative(contentDir, fullPath);
                    const slug = relativePath.replace(/\.md$/, "");

                    fragments.push({
                        slug,
                        title: data.title || item.replace(/\.md$/, ""),
                        date: data.date || "Seed",
                        snippet: text.slice(0, 100).replace(/[#*`]/g, "") + "...",
                        isAsset: true
                    });
                }
            }
        }
    }

    scan(contentDir);
    return fragments.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export default function FragmentsPage() {
    const fragments = getFragments();

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg transition-all duration-300">
                        <MessageSquareText size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">思想碎片</h1>
                        <p className="text-[var(--text-secondary)] font-medium">Fragments — Personal Musings & Asset Seeds</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fragments.map((fragment) => (
                    <Link
                        key={fragment.slug}
                        href={`/posts/${fragment.slug}`}
                        className="artifact-card group p-6 flex flex-col items-start bg-[var(--card)] border border-[var(--border)] hover:border-amber-500/30 transition-all"
                    >
                        <div className="flex items-center justify-between w-full mb-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                                <Sparkles size={12} />
                                <span>Seed Asset</span>
                            </div>
                            <span className="text-[10px] text-[var(--text-secondary)]/40 font-medium">{fragment.date}</span>
                        </div>

                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 group-hover:text-amber-600 transition-colors">
                            {fragment.title}
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)]/80 leading-relaxed mb-4">
                            {fragment.snippet}
                        </p>

                        <div className="text-[10px] font-bold text-amber-600 mt-auto flex items-center group-hover:underline underline-offset-4">
                            Inspect Logic
                            <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                        </div>
                    </Link>
                ))}

                {fragments.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[var(--text-secondary)]/40 border border-dashed border-[var(--border)] rounded-2xl">
                        No reflective seeds found in current workshop.
                    </div>
                )}
            </div>
        </div>
    );
}

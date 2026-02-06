import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Map slug to display title
const CATEGORY_MAP: Record<string, string> = {
    "ai_flow_club": "AI 流习社",
    "open_source_core": "开源智核",
    "ordinary_life": "平凡日子记",
};

const CATEGORY_DESC: Record<string, string> = {
    "ai_flow_club": "Exploring the boundaries of Artificial Intelligence.",
    "open_source_core": "Deep dive into Open Source architectures.",
    "ordinary_life": "Reflections on technology, life, and side hustles.",
};

// Function to get posts for a specific category
function getCategoryPosts(categorySlug: string) {
    // Map category slug to directory name (which is the same in our case, but good to be explicit)
    const dirName = categorySlug;
    const postsDirectory = path.join(process.cwd(), "content/wechat", dirName);

    if (!fs.existsSync(postsDirectory)) return [];

    const files = fs.readdirSync(postsDirectory);
    const posts = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
            const fullPath = path.join(postsDirectory, file);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            // Extract a snippet for preview
            const snippet = content.slice(0, 150) + "...";

            return {
                slug: file.replace(/\.md$/, ""),
                title: data.title || file.replace(/\.md$/, ""),
                date: data.date || "",
                snippet: snippet,
            };
        })
        .sort((a, b) => (b.date > a.date ? 1 : -1));

    return posts;
}

export async function generateStaticParams() {
    return [
        { category: 'ai_flow_club' },
        { category: 'open_source_core' },
        { category: 'ordinary_life' },
    ];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const title = CATEGORY_MAP[category] || category;
    const posts = getCategoryPosts(category);
    const description = CATEGORY_DESC[category] || "Digital Archive";

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--text-primary)] text-[var(--background)] flex items-center justify-center shadow-lg transition-all duration-300">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h1>
                        <p className="text-[var(--text-secondary)] font-medium">{description}</p>
                    </div>
                </div>
            </header>

            {/* Gallery Grid */}
            <div className="gallery-grid">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/wechat/${category}/${post.slug}`}
                        className="artifact-card group flex flex-col h-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold-accent)]/30 transition-all"
                    >
                        {/* Visual Header */}
                        <div className="h-32 bg-[var(--text-secondary)]/5 border-b border-[var(--border)] p-6 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] to-[var(--text-secondary)]/5 opacity-50" />
                            <div className="relative z-10 text-4xl font-serif text-[var(--text-secondary)]/20 font-bold opacity-20 group-hover:opacity-30 transition-opacity">
                                {category.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="gold-accent uppercase tracking-widest text-[10px]">{category.replace(/_/g, " ")}</span>
                                {post.date && <span className="text-[10px] text-[var(--text-secondary)]/40">• {post.date}</span>}
                            </div>

                            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 leading-snug group-hover:text-[var(--gold-accent)] transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-sm text-[var(--text-secondary)]/80 leading-relaxed line-clamp-3 mb-4 flex-1">
                                {/* Remove markdown symbols for cleaner preview */}
                                {post.snippet.replace(/[#*`]/g, "")}
                            </p>

                            <div className="text-xs font-bold text-[var(--text-primary)] mt-auto flex items-center group-hover:text-[var(--gold-accent)] transition-colors">
                                Read Whitepaper
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-[var(--border)] rounded-2xl">
                        <div className="inline-block p-4 rounded-full bg-[var(--text-secondary)]/5 text-[var(--text-secondary)]/40 mb-4">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">No Artifacts Found</h3>
                        <p className="text-[var(--text-secondary)]/60">This gallery is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

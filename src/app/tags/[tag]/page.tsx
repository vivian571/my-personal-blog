import Link from "next/link";
import { getPostsByTag } from "@/lib/tags";
import { Tag, ArrowLeft, Calendar, Folder } from "lucide-react";

export const dynamic = "force-dynamic";

type Params = {
  tag: string;
};

export default async function TagPage(props: { params: Promise<Params> }) {
    const { tag } = await props.params;
    const decodedTag = decodeURIComponent(tag);
    const posts = getPostsByTag(decodedTag);

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            {/* Grid Pattern Background Overlay */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none -z-10" />
            
            {/* Header */}
            <section className="space-y-6 pt-12">
                <Link href="/tags" className="inline-flex items-center gap-2 text-[var(--gold-accent)] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all mb-8">
                    <ArrowLeft size={16} /> 返回标签云
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/5 border border-[var(--gold-accent)]/10 text-[var(--gold-accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Tag size={10} className="animate-pulse" /> Filter Applied: {decodedTag}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.05]">
                    标签：<span className="text-[var(--gold-accent)] italic serif">{decodedTag}</span>
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium">
                    找到 <span className="text-[var(--gold-accent)] font-bold">{posts.length}</span> 篇与此语义节点相关的资产。
                </p>
            </section>

            {/* Posts List */}
            <div className="grid grid-cols-1 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="group relative p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2rem] hover:border-[var(--gold-accent)]/30 hover:shadow-paper-floating transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Tag size={120} />
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]/40">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {post.date || "Unknown Date"}
                                </span>
                                <span className="flex items-center gap-1 border-l border-[var(--border)] pl-4">
                                    <Folder size={12} /> {post.category}
                                </span>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold group-hover:text-[var(--gold-accent)] transition-colors">
                                {post.title}
                            </h2>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                                {post.tags.map(t => (
                                    <span key={t} className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-colors ${t.toLowerCase() === decodedTag.toLowerCase() ? 'bg-[var(--gold-accent)] text-black' : 'bg-[var(--text-secondary)]/5 text-[var(--text-secondary)] group-hover:bg-[var(--gold-accent)]/10'}`}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="py-32 text-center text-[var(--text-secondary)]/40 italic border-2 border-dashed border-[var(--border)] rounded-3xl">
                    未在此标签下发现任何资产。
                </div>
            )}
        </div>
    );
}

import Link from "next/link";
import { getAllTags } from "@/lib/tags";
import { Tag, ArrowLeft, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TagsPage() {
    const tags = getAllTags();

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            {/* Grid Pattern Background Overlay */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none -z-10" />
            
            {/* Header */}
            <section className="space-y-6 pt-12">
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold-accent)] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all mb-8">
                    <ArrowLeft size={16} /> 返回主控台
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-accent)]/5 border border-[var(--gold-accent)]/10 text-[var(--gold-accent)] text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Hash size={10} className="animate-pulse" /> Semantic Indexing Active
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.05]">
                    全域<span className="text-[var(--gold-accent)] italic serif">标签</span> 云
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium">
                    基于 RAG 语义聚类的标签系统。目前已识别出 <span className="text-[var(--gold-accent)] font-bold">{tags.length}</span> 个核心知识节点。
                </p>
            </section>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-4 md:gap-6">
                {tags.map((tag) => (
                    <Link
                        key={tag.name}
                        href={`/tags/${encodeURIComponent(tag.name)}`}
                        className="group relative flex items-center gap-3 px-6 py-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[var(--gold-accent)]/30 hover:shadow-paper-lg transition-all duration-300 active:scale-95"
                    >
                        <Tag size={14} className="text-[var(--text-secondary)]/30 group-hover:text-[var(--gold-accent)] transition-colors" />
                        <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors">
                            {tag.name}
                        </span>
                        <span className="text-[10px] font-black bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] px-2 py-1 rounded-md opacity-40 group-hover:opacity-100 transition-opacity">
                            {tag.count}
                        </span>
                    </Link>
                ))}
            </div>

            {tags.length === 0 && (
                <div className="py-32 text-center text-[var(--text-secondary)]/40 italic border-2 border-dashed border-[var(--border)] rounded-3xl">
                    未发现任何语义标签。
                </div>
            )}
        </div>
    );
}

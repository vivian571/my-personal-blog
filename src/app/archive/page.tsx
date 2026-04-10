import Link from "next/link";
import fs from "fs";
import path from "path";
import React from "react";
import { FolderTree, Calendar, Tag, BookOpen } from "lucide-react";

interface Exhibit {
    title: string;
    exhibit: string;
    tags: string[];
    summary: string;
    lastUpdate: string;
    slug: string;
    path: string;
    url?: string;
}

async function getManifest(): Promise<Exhibit[]> {
    const manifestPath = path.join(process.cwd(), "src/lib/data/museum_manifest.json");
    if (!fs.existsSync(manifestPath)) return [];
    const data = fs.readFileSync(manifestPath, "utf8");
    return JSON.parse(data);
}

export default async function Archive() {
    const exhibits = await getManifest();
    
    // Group by Exhibit Room (Gallery)
    const galleryGroups = exhibits.reduce((acc, item) => {
        const room = item.exhibit || "未分类展厅";
        if (!acc[room]) acc[room] = [];
        acc[room].push(item);
        return acc;
    }, {} as Record<string, Exhibit[]>);

    const rooms = Object.keys(galleryGroups).sort();

    return (
        <div className="space-y-16 py-8 animate-in fade-in duration-700">
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <div className="flex items-center gap-3 text-[var(--gold-accent)] mb-2">
                    <FolderTree size={20} />
                    <span className="text-sm font-bold tracking-widest uppercase">Central Index</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
                    数字博物馆 · 编目归档
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                    基于 RAG 语义索引的自动化馆藏管理。目前已收录 <span className="text-[var(--gold-accent)] font-bold">{exhibits.length}</span> 件深度智力资产。
                </p>
            </header>

            <div className="space-y-20">
                {rooms.map(room => (
                    <section key={room} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] px-4 py-1 border-l-4 border-[var(--gold-accent)] bg-[var(--gold-accent)]/5">
                                {room}
                            </h2>
                            <div className="flex-grow h-px bg-gradient-to-r from-[var(--border)] to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {galleryGroups[room].map(item => (
                                <div key={item.slug} className="group relative p-6 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold-accent)]/20 transition-all duration-300 rounded-xl overflow-hidden">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-3 flex-grow">
                                            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.lastUpdate).toLocaleDateString('zh-CN')}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
                                                <span className="flex items-center gap-1 uppercase tracking-tighter">
                                                    ID: {item.slug.slice(0, 8)}
                                                </span>
                                            </div>
                                            
                                            <Link href={item.url || `/posts/${item.slug}`} className="block group-hover:text-[var(--gold-accent)] transition-colors">
                                                <h3 className="text-xl font-bold tracking-tight">
                                                    {item.title}
                                                </h3>
                                            </Link>

                                            <div className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 italic border-l-2 border-[var(--border)] pl-4 py-1">
                                                {item.summary.length > 150 ? item.summary.slice(0, 150) + '...' : item.summary}
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--border)]/30 text-[var(--text-secondary)] text-[10px] font-bold rounded uppercase tracking-tighter">
                                                        <Tag size={8} />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <Link href={item.url || `/posts/${item.slug}`} className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-[var(--border)] group-hover:bg-[var(--gold-accent)] group-hover:border-[var(--gold-accent)] group-hover:text-black transition-all duration-500">
                                            <BookOpen size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {exhibits.length === 0 && (
                <div className="py-32 text-center space-y-4 border border-dashed border-[var(--border)] rounded-3xl">
                    <div className="text-4xl opacity-20">🕳️</div>
                    <p className="text-[var(--text-secondary)] font-medium">索引尚未同步。请触发展厅扫描脚本。</p>
                </div>
            )}
        </div>
    );
}

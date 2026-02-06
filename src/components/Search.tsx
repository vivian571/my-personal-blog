"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, FileText, Book, Cpu, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SearchResult } from '@/lib/search';

export function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [allData, setAllData] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch data once on mount or when opened
    useEffect(() => {
        if (isOpen && allData.length === 0) {
            setIsLoading(true);
            fetch('/api/search')
                .then(res => res.json())
                .then(data => {
                    setAllData(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch search index:', err);
                    setIsLoading(false);
                });
        }
    }, [isOpen, allData.length]);

    // Handle search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const filtered = allData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.snippet.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        setResults(filtered);
        setSelectedIndex(0);
    }, [query, allData]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle result navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            const result = results[selectedIndex];
            window.location.href = getHref(result);
            setIsOpen(false);
        }
    };

    const getHref = (result: SearchResult) => {
        switch (result.type) {
            case 'book': return `/library/${result.slug}`;
            case 'skill': return `/posts/skills/${result.slug}`;
            case 'whitepaper': return `/whitepapers/${result.slug}`;
            default: return `/posts/${result.slug}`;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'book': return <Book size={16} />;
            case 'skill': return <Cpu size={16} />;
            case 'whitepaper': return <Globe size={16} />;
            default: return <FileText size={16} />;
        }
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--text-secondary)]/60 bg-[var(--text-secondary)]/5 border border-[var(--border)] rounded-lg hover:border-[var(--gold-accent)]/30 hover:text-[var(--text-primary)] transition-all group"
        >
            <SearchIcon size={16} className="group-hover:text-[var(--gold-accent)] transition-colors" />
            <span>搜索内容...</span>
            <span className="ml-auto text-[10px] font-bold opacity-40 px-1.5 py-0.5 border rounded">⌘K</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-black/20">
            <div
                ref={searchRef}
                className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                <div className="p-4 flex items-center gap-4 border-b border-[var(--border)]">
                    <SearchIcon size={20} className="text-[var(--gold-accent)]" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="模糊查询：作者、书籍、技能..."
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-medium placeholder:text-[var(--text-secondary)]/40"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[var(--text-secondary)]/10 rounded-lg text-[var(--text-secondary)]/40 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-[var(--text-secondary)]/40 italic">
                            正在建立万象索引...
                        </div>
                    ) : query.trim() === '' ? (
                        <div className="py-8 px-4 text-center">
                            <p className="text-xs font-bold text-[var(--text-secondary)]/40 uppercase tracking-[0.2em] mb-2">Popular Categories</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['书阁', '技能', 'AI 流习社', '开源智核'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setQuery(cat)}
                                        className="text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--gold-accent)]/40 hover:text-[var(--gold-accent)] transition-all"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((result, idx) => (
                                <Link
                                    key={result.slug}
                                    href={getHref(result)}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-start gap-4 p-3 rounded-xl transition-all ${idx === selectedIndex ? 'bg-[var(--gold-accent)]/10 border border-[var(--gold-accent)]/20' : 'hover:bg-[var(--text-secondary)]/5 border border-transparent'}`}
                                >
                                    <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center ${result.type === 'skill' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {getIcon(result.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold-accent)] opacity-60">{result.category}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)]/40">•</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{result.type}</span>
                                        </div>
                                        <h3 className="font-bold text-[var(--text-primary)] truncate">{result.title}</h3>
                                        <p className="text-xs text-[var(--text-secondary)]/60 line-clamp-1">{result.snippet}</p>
                                    </div>
                                    <ArrowRight size={14} className={`mt-4 transition-transform ${idx === selectedIndex ? 'translate-x-0' : '-translate-x-2'}`} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-[var(--text-secondary)]/40">
                            未在此象限内发现相关资产...
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[var(--text-secondary)]/5 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-secondary)]/30">
                        <span className="flex items-center gap-1"><span className="px-1 border rounded capitalize">↑↓</span> 移动</span>
                        <span className="flex items-center gap-1"><span className="px-1 border rounded capitalize">↵</span> 选择</span>
                        <span className="flex items-center gap-1"><span className="px-1 border rounded capitalize">esc</span> 关闭</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

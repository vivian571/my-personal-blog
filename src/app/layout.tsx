import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";
import { Library, MessageSquareText, Box, Home, Archive, Tag, User, Menu, MessageCircle, Cpu, Search as SearchIcon, Sparkles, LogIn, Rss } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/Search";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "意安序",
    description: "存放思想碎片、深度教程与实用工具的数字领地。",
    alternates: {
        types: {
            'application/rss+xml': [{ url: '/api/rss', title: '意安序 RSS Feed' }],
        },
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--text-secondary)] transition-colors duration-300`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex min-h-screen">
                        {/* Sidebar */}
                        <aside className="w-72 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto transition-all duration-500 z-50">
                            <div className="p-10 flex flex-col gap-8">
                                <div className="flex items-center justify-between">
                                    <Link href="/" className="group flex flex-col">
                                        <span className="font-black text-3xl tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors">
                                            意安序
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]/40 mt-1">
                                            Protocol 1001
                                        </span>
                                    </Link>
                                    <ThemeToggle />
                                </div>
                                
                                <Search />
                            </div>

                            <nav className="flex-1 px-6 space-y-12">
                                <div>
                                    <p className="px-4 text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-4">Core</p>
                                    <div className="space-y-1">
                                        <NavItem href="/" icon={<Home size={18} />} label="首页" />
                                        <NavItem href="/archive" icon={<Archive size={18} />} label="归档" />
                                        <NavItem href="/whitepapers" icon={<Sparkles size={18} className="text-[var(--gold-accent)]" />} label="Whitepapers" className="bg-[var(--gold-accent)]/5 text-[var(--gold-accent)] border border-[var(--gold-accent)]/10" />
                                    </div>
                                </div>

                                <div>
                                    <p className="px-4 text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-4">Discovery</p>
                                    <div className="space-y-1">
                                        <NavItem href="/library" icon={<Library size={18} />} label="书阁" />
                                        <NavItem href="/fragments" icon={<MessageSquareText size={18} />} label="思想碎片" />
                                        <NavItem href="/tags" icon={<Tag size={18} />} label="全域标签" />
                                        <NavItem href="/toolbox" icon={<Box size={18} />} label="万宝箱" />
                                        <NavItem href="/skills" icon={<Cpu size={18} />} label="Agent 技能" />
                                    </div>
                                </div>

                                <div>
                                    <p className="px-4 text-[10px] font-black text-[var(--text-primary)]/30 uppercase tracking-[0.2em] mb-4">Connect</p>
                                    <div className="space-y-1">
                                        <NavItem href="/wechat/ai_flow_club" icon={<MessageCircle size={18} />} label="AI 流习社" />
                                        <NavItem href="/wechat/open_source_core" icon={<MessageCircle size={18} />} label="开源智核" />
                                    </div>
                                </div>
                            </nav>

                            <div className="p-8 border-t border-[var(--sidebar-border)] bg-[var(--background)]/50 backdrop-blur-xl">
                                <Link href="/login" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-2xl bg-[var(--text-primary)] text-[var(--background)] flex items-center justify-center font-black shadow-lg group-hover:bg-[var(--gold-accent)] transition-colors">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-primary)]">登录系统</p>
                                        <p className="text-[9px] font-bold text-[var(--text-secondary)]/40 uppercase tracking-tighter group-hover:text-[var(--gold-accent)] transition-colors">Login / Register</p>
                                    </div>
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 overflow-auto bg-[var(--background)]">
                            <header className="lg:hidden p-6 border-b border-[var(--sidebar-border)] flex flex-col gap-6 bg-[var(--sidebar)] sticky top-0 z-50">
                                <div className="flex justify-between items-center">
                                    <Link href="/" className="font-black text-2xl tracking-tighter text-[var(--text-primary)]">意安序</Link>
                                    <div className="flex items-center gap-4">
                                        <ThemeToggle />
                                        <button className="p-2 hover:bg-[var(--text-secondary)]/5 rounded-xl text-[var(--text-secondary)]">
                                            <Menu size={24} />
                                        </button>
                                    </div>
                                </div>
                                <Search />
                            </header>
                            
                            <div className="container max-w-5xl py-20 px-8 md:px-16">
                                {children}
                            </div>
                            
                            <footer className="border-t border-[var(--sidebar-border)] bg-[var(--sidebar)]/30">
                                <div className="container max-w-5xl py-12 px-8 md:px-16">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Protocol</h3>
                                            <p className="text-xs text-[var(--text-secondary)]/60 leading-relaxed max-w-xs">
                                                意安序数字资产协议 V1.0。所有内容均由 AI 协同生成的数字资产。
                                            </p>
                                        </div>
                                        <div className="flex gap-12">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Links</h3>
                                                <div className="flex flex-col gap-2">
                                                    <Link href="/guestbook" className="text-xs text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors font-bold">留言板</Link>
                                                    <Link href="/archive" className="text-xs text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors font-bold">内容归档</Link>
                                                    <a href="/api/rss" target="_blank" className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors font-bold">
                                                        <Rss size={12} /> RSS 订阅
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-16 pt-8 border-t border-[var(--sidebar-border)] flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.3em]">
                                            © {new Date().getFullYear()} Yian.Studio
                                        </span>
                                        <div className="flex gap-4">
                                            <div className="w-2 h-2 rounded-full bg-[var(--gold-accent)] animate-pulse" />
                                            <span className="text-[9px] font-black text-[var(--gold-accent)] uppercase tracking-widest">Global Node Active</span>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}

function NavItem({ href, icon, label, className = "" }: { href: string; icon: React.ReactNode; label: string; className?: string }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3 text-sm font-bold text-[var(--text-secondary)] rounded-2xl hover:text-[var(--text-primary)] hover:bg-[var(--text-secondary)]/5 group transition-all duration-300 ${className}`}
        >
            <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform">
                {icon}
            </div>
            {label}
        </Link>
    );
}
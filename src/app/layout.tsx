import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";
import { Library, MessageSquareText, Box, Home, Archive, Tag, User, Menu, MessageCircle, Cpu, Search as SearchIcon } from "lucide-react";
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
};

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    const files = fs.readdirSync(dirPath);
    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith(".md")) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

async function getSidebarTags() {
    const contentDirectory = path.join(process.cwd(), "content");
    if (!fs.existsSync(contentDirectory)) return [];
    const filePaths = getAllFiles(contentDirectory);
    const tagSet = new Set<string>();
    filePaths.slice(0, 10).forEach((filePath) => {
        const fileContents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
        const { data } = matter(fileContents);
        const tags = data.tags || (data.category ? [data.category] : []);
        tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).slice(0, 5);
}

async function getWhitepapers() {
    const whitepaperDir = "/app/dist/whitepapers";
    if (!fs.existsSync(whitepaperDir)) return [];
    const files = fs.readdirSync(whitepaperDir);
    return files.filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""));
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tags = await getSidebarTags();
    const whitepapers = await getWhitepapers();

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
                        <aside className="w-64 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto transition-colors duration-300">
                            <div className="p-8 flex items-center justify-between">
                                <div>
                                    <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--text-primary)]">
                                        意安序
                                    </Link>
                                    <p className="text-xs text-[var(--text-secondary)]/60 mt-1 uppercase tracking-widest font-medium italic">Protocol 1001</p>
                                </div>
                                <ThemeToggle />
                            </div>

                            <div className="px-4 mb-4">
                                <Search />
                            </div>

                            <nav className="flex-1 px-4 space-y-1">
                                <NavItem href="/" icon={<Home size={18} />} label="首页" />
                                <NavItem href="/archive" icon={<Archive size={18} />} label="归档" />

                                <div className="py-4">
                                    <p className="px-4 text-[10px] font-bold text-[var(--text-primary)]/40 uppercase tracking-wider mb-2">Assets</p>
                                    <NavItem
                                        href="/whitepapers"
                                        icon={<Box size={18} className="text-[var(--gold-accent)]" />}
                                        label="Whitepapers"
                                        className="sidebar-item-gold"
                                    />
                                </div>

                                <div className="py-4">
                                    <p className="px-4 text-[10px] font-bold text-[var(--text-primary)]/40 uppercase tracking-wider mb-2">WeChat Matrix</p>
                                    <NavItem href="/wechat/ai_flow_club" icon={<MessageCircle size={18} />} label="AI 流习社" />
                                    <NavItem href="/wechat/open_source_core" icon={<MessageCircle size={18} />} label="开源智核" />
                                    <NavItem href="/wechat/ordinary_life" icon={<MessageCircle size={18} />} label="平凡日子记" />
                                </div>

                                <div className="py-4">
                                    <p className="px-4 text-[10px] font-bold text-[var(--text-primary)]/40 uppercase tracking-wider mb-2">Discovery</p>
                                    <NavItem href="/skills" icon={<Cpu size={18} />} label="Moltbot 技能" />
                                    <NavItem href="/library" icon={<Library size={18} />} label="书阁" />
                                    <NavItem href="/fragments" icon={<MessageSquareText size={18} />} label="思想碎片" />
                                    <NavItem href="/toolbox" icon={<Box size={18} />} label="万宝箱" />
                                </div>
                            </nav>

                            <div className="p-8 border-t border-[var(--sidebar-border)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--gold-accent)]/20 border border-[var(--gold-accent)]/40 flex items-center justify-center text-[var(--gold-accent)]">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--text-primary)]">ax</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]/60 uppercase tracking-tighter">Asset Architect</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 overflow-auto bg-[var(--background)] transition-colors duration-300">
                            <header className="md:hidden p-4 border-b border-[var(--sidebar-border)] flex flex-col gap-4 bg-[var(--sidebar)] sticky top-0 z-10 transition-colors duration-300">
                                <div className="flex justify-between items-center">
                                    <Link href="/" className="font-bold text-lg text-[var(--text-primary)]">意安序</Link>
                                    <div className="flex items-center gap-2">
                                        <ThemeToggle />
                                        <button className="p-2 hover:bg-[var(--text-secondary)]/5 rounded-lg text-[var(--text-secondary)]">
                                            <Menu size={20} />
                                        </button>
                                    </div>
                                </div>
                                <Search />
                            </header>
                            <div className="container max-w-5xl py-12 px-6 md:px-12 transition-all">
                                {children}
                            </div>
                            <footer className="border-t border-[var(--sidebar-border)] mt-auto bg-[var(--background)]">
                                <div className="container max-w-5xl py-8 px-6 md:px-12">
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-sm font-bold text-[var(--text-primary)]">友情链接</h3>
                                        <div className="flex gap-4">
                                            <Link href="/guestbook" className="text-sm text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors">
                                                留言板
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-xs text-[var(--text-secondary)]/40">
                                        © {new Date().getFullYear()} 意安序. All rights reserved.
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
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--text-secondary)]/5 transition-all ${className}`}
        >
            {icon}
            {label}
        </Link>
    );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";
import { Library, MessageSquareText, Box, Home, Archive, Tag, User, Menu } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  files.forEach(function(file) {
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tags = await getSidebarTags();

  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-100 bg-slate-50/50 hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
            <div className="p-8">
              <Link href="/" className="font-bold text-2xl tracking-tight text-slate-900">
                意安序
              </Link>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">Digital Archive</p>
            </div>
            
            <nav className="flex-1 px-4 space-y-1">
              <NavItem href="/" icon={<Home size={18} />} label="首页" />
              <NavItem href="/archive" icon={<Archive size={18} />} label="归档" />
              <NavItem href="/tags" icon={<Tag size={18} />} label="标签" />
              
              <div className="py-4">
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Workspace</p>
                <NavItem href="/library" icon={<Library size={18} />} label="书阁" />
                <NavItem href="/fragments" icon={<MessageSquareText size={18} />} label="思想碎片" />
                <NavItem href="/toolbox" icon={<Box size={18} />} label="万宝箱" />
              </div>

              {tags.length > 0 && (
                <div className="py-4">
                  <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Tags</p>
                  <div className="px-4 flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Link key={tag} href={`/tags#${tag}`} className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-100 rounded text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            <div className="p-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold">ax</p>
                  <p className="text-[10px] text-slate-400">Content Creator</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-white">
            <header className="md:hidden p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <Link href="/" className="font-bold text-lg">意安序</Link>
              <button className="p-2 hover:bg-slate-50 rounded-lg">
                <Menu size={20} />
              </button>
            </header>
            <div className="container max-w-5xl py-12 px-6 md:px-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

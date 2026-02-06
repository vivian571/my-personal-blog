import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import React from 'react';
import { Share2, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostData {
    title: string;
    date: string;
    contentHtml: string;
    slug: string;
}

type Params = {
    category: string;
    slug: string;
};

async function getPostData(category: string, slug: string): Promise<PostData> {
    const contentDir = path.join(process.cwd(), "content/wechat", category);
    const filePath = path.join(contentDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return {
            title: "Asset Not Found",
            date: "",
            contentHtml: "<p>The requested asset logic is not available in the current vault.</p>",
            slug: slug
        };
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process Markdown
    const processedContent = await remark()
        .use(html)
        .process(content);
    let contentHtml = processedContent.toString();

    // Highlight keywords with Antique Gold
    const keywords = ["万象", "1001 领地", "意安序"];
    keywords.forEach(kw => {
        const regex = new RegExp(kw, "g");
        contentHtml = contentHtml.replace(regex, `<span class="keyword-highlight">${kw}</span>`);
    });

    return {
        title: data.title || path.basename(filePath, '.md'),
        date: data.date || "Seed Asset",
        contentHtml,
        slug: slug
    };
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
    const params = await props.params;
    const postData = await getPostData(params.category, params.slug);
    return {
        title: `${postData.title} | Asset Archive`,
    };
}

export default async function WeChatArticlePage(props: { params: Promise<Params> }) {
    const params = await props.params;
    const postData = await getPostData(params.category, params.slug);

    return (
        <article className="whitepaper-layout">
            <header className="mb-12">
                <Link href={`/wechat/${params.category}`} className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Archive
                </Link>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-accent)] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="text-[10px] font-bold text-[var(--gold-accent)] tracking-[0.2em] uppercase">USD Whitepaper Asset</span>
                </div>
                <h1 className="whitepaper-title">{postData.title}</h1>
                <div className="whitepaper-meta">
                    <span className="font-bold text-[var(--gold-accent)]">Valuation: $12.50</span>
                    <span className="text-[var(--text-secondary)]/40">|</span>
                    <span>{postData.date}</span>
                    <span className="text-[var(--text-secondary)]/40">|</span>
                    <span className="italic">WhatsApp Sync</span>
                </div>
            </header>

            <div
                className="whitepaper-content"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />

            <footer className="mt-20 pt-10 border-t border-[var(--border)] flex justify-between items-center text-[10px] text-[var(--text-secondary)]/40 font-bold uppercase tracking-widest">
                <span>© 1001 Territory Archive</span>
                <div className="flex gap-4 text-[var(--text-secondary)] font-bold">
                    <span className="flex items-center gap-1 hover:text-[var(--gold-accent)] cursor-pointer transition-colors"><Share2 size={12} /> Share Logic</span>
                    <span className="flex items-center gap-1 hover:text-[var(--gold-accent)] cursor-pointer transition-colors"><Bookmark size={12} /> Vault Asset</span>
                </div>
            </footer>
        </article>
    );
}

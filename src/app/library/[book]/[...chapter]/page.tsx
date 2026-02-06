import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, Clock, Book } from "lucide-react";
import matter from "gray-matter";
import ReactMarkdown from 'react-markdown';

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string[] }> }) {
    const { book: encodedBook, chapter: encodedChapter } = await params;
    const book = decodeURIComponent(encodedBook);
    const chapter = encodedChapter.map(segment => decodeURIComponent(segment));
    const chapterSlug = chapter.join('/');

    // Check for both .md and .txt
    let filePath = path.join(process.cwd(), "content/小说", book, `${chapterSlug}.md`);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), "content/小说", book, `${chapterSlug}.txt`);
    }

    if (!fs.existsSync(filePath)) {
        return <div className="p-20 text-center">Chapter not found</div>;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const title = data.title || chapter[chapter.length - 1];
    const date = data.date || "Archive Item";

    return (
        <article className="whitepaper-layout">
            <header className="mb-12">
                <Link href={`/library/${book}`} className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collection
                </Link>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center">
                        <Book size={16} />
                    </div>
                    <span className="gold-accent-text">{book}</span>
                </div>
                <h1 className="whitepaper-title">{title}</h1>
                <div className="whitepaper-meta border-none mb-0 pb-0">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[var(--gold-accent)]" />
                        <span>{date}</span>
                    </div>
                </div>
            </header>

            <div className="whitepaper-content prose prose-slate max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            <footer className="mt-20 pt-8 border-t border-[var(--border)] text-center">
                <p className="text-sm text-[var(--text-secondary)] italic">
                    End of Chapter — Cultivated in the Digital Museum
                </p>
            </footer>
        </article>
    );
}

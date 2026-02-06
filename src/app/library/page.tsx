import Link from "next/link";
import fs from "fs";
import path from "path";
import { ArrowLeft, Book, Library as LibraryIcon } from "lucide-react";

function countChapters(dir: string): number {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            count += countChapters(fullPath);
        } else if (item.endsWith(".txt") || item.endsWith(".md")) {
            count++;
        }
    }
    return count;
}

function getBooks() {
    const novelsDirectory = path.join(process.cwd(), "content/小说");
    if (!fs.existsSync(novelsDirectory)) return [];

    const items = fs.readdirSync(novelsDirectory);
    const books = items.map(item => {
        const fullPath = path.join(novelsDirectory, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory() && !item.startsWith('.')) {
            const chapters = countChapters(fullPath);
            return {
                slug: item,
                title: item.replace(/_\d+_\d+$/, ""),
                chapters: chapters,
                type: "Novel"
            };
        }
        return null;
    }).filter(Boolean);

    return books;
}

export default function LibraryPage() {
    const books = getBooks();

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all duration-300">
                        <LibraryIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">书阁</h1>
                        <p className="text-[var(--text-secondary)] font-medium">Library — Systemic Knowledge & Long Narratives</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {books.map((book) => (
                    <Link
                        key={book.slug}
                        href={`/library/${book.slug}`}
                        className="artifact-card group p-6 flex flex-col h-full bg-[var(--card)] border border-[var(--border)] hover:border-blue-500/30 transition-all"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                            <Book size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-blue-500 transition-colors">
                            {book.title}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]/60 mb-6 font-bold uppercase tracking-wider">
                            <span>{book.type}</span>
                            <span>•</span>
                            <span>{book.chapters} Chapters</span>
                        </div>

                        <div className="mt-auto px-4 py-2 bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] text-sm text-center font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Read Narrative
                        </div>
                    </Link>
                ))}

                {books.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[var(--text-secondary)]/40 border border-dashed border-[var(--border)] rounded-2xl">
                        No long-form narratives found in current archive.
                    </div>
                )}
            </div>
        </div>
    );
}

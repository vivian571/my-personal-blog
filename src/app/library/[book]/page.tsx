import Link from "next/link";
import fs from "fs";
import path from "path";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import matter from "gray-matter";

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
    const { book: encodedBook } = await params;
    const book = decodeURIComponent(encodedBook);
    const bookPath = path.join(process.cwd(), "content/小说", book);

    if (!fs.existsSync(bookPath)) {
        return <div className="p-20 text-center">Book not found</div>;
    }

    const getChapters = (dir: string): any[] => {
        const items = fs.readdirSync(dir);
        const list = items.map(item => {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            const relativePath = path.relative(bookPath, fullPath);

            if (stats.isDirectory()) {
                if (item.startsWith('.')) return null;
                return {
                    name: item,
                    type: 'directory',
                    children: getChapters(fullPath)
                };
            } else if (item.endsWith('.md') || item.endsWith('.txt')) {
                const content = fs.readFileSync(fullPath, "utf8");
                const { data } = matter(content);
                return {
                    name: data.title || item.replace(/\.(md|txt)$/, ""),
                    slug: relativePath.replace(/\.(md|txt)$/, ""),
                    type: 'file'
                };
            }
            return null;
        }).filter(Boolean);

        // Natural sort by name
        return list.sort((a, b) =>
            (a as any).name.localeCompare((b as any).name, undefined, { numeric: true, sensitivity: 'base' })
        );
    };

    const chapters = getChapters(bookPath);

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12">
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/library" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Library
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--gold-accent)] text-white flex items-center justify-center shadow-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{book}</h1>
                        <p className="text-[var(--text-secondary)] font-medium">Table of Contents</p>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {chapters.map((item, idx) => (
                    <section key={idx} className="space-y-4">
                        {item.type === 'directory' ? (
                            <>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--gold-accent)] border-l-2 border-[var(--gold-accent)] pl-4">
                                    {item.name}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.children.map((child: any, cidx: number) => (
                                        <Link
                                            key={cidx}
                                            href={`/library/${book}/${child.slug}`}
                                            className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between hover:border-[var(--gold-accent)]/30 group transition-all"
                                        >
                                            <span className="text-[var(--text-primary)] font-medium group-hover:text-[var(--gold-accent)] transition-colors">
                                                {child.name}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <Link
                                href={`/library/${book}/${item.slug}`}
                                className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between hover:border-[var(--gold-accent)]/30 group transition-all"
                            >
                                <span className="text-[var(--text-primary)] font-medium group-hover:text-[var(--gold-accent)] transition-colors">
                                    {item.name}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}

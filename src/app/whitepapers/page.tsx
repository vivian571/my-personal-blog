import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, Box, ShieldCheck, DollarSign } from "lucide-react";

function getWhitepapers() {
    const whitepaperDir = "/app/dist/whitepapers";
    if (!fs.existsSync(whitepaperDir)) return [];

    const files = fs.readdirSync(whitepaperDir);
    return files.filter(f => f.endsWith(".md")).map(filename => {
        const fullPath = path.join(whitepaperDir, filename);
        const content = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(content);
        return {
            slug: filename.replace(/\.md$/, ""),
            title: data.title || filename.replace(/\.md$/, ""),
            date: data.date || "2026-02-06",
            value: (Math.random() * 20 + 10).toFixed(2),
        };
    });
}

export default function WhitepapersPage() {
    const whitepapers = getWhitepapers();

    return (
        <div className="space-y-12">
            <header className="space-y-4 border-b border-[var(--border)] pb-8">
                <Link href="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--gold-accent)] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Archive
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--gold-accent)]/10 border border-[var(--gold-accent)]/30 text-[var(--gold-accent)] flex items-center justify-center shadow-lg shadow-[var(--gold-accent)]/5">
                        <Box size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">资产白皮书</h1>
                        <p className="text-[var(--text-secondary)] font-medium italic">Asset Whitepapers — USD Global Arbitrage Valuations</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {whitepapers.map((paper) => (
                    <div key={paper.slug} className="artifact-card group p-6 flex flex-col items-start bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold-accent)]/30 transition-all">
                        <div className="flex justify-between w-full mb-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--gold-accent)] tracking-widest uppercase">
                                <ShieldCheck size={12} />
                                <span>Secured Asset</span>
                            </div>
                            <div className="px-2 py-1 bg-[var(--gold-accent)] text-black text-[10px] font-bold rounded shadow-lg">
                                VALUE: ${paper.value}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--gold-accent)] transition-colors">
                            {paper.title}
                        </h2>

                        <div className="mt-auto flex items-center justify-between w-full text-[10px] text-[var(--text-secondary)]/40">
                            <span className="font-mono uppercase">Reference: WP-{paper.slug.substring(0, 6).toUpperCase()}</span>
                            <span className="italic font-medium">Sync: WhatsApp</span>
                        </div>
                    </div>
                ))}

                {whitepapers.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[var(--text-secondary)]/40 border border-dashed border-[var(--border)] rounded-2xl">
                        No whitepaper assets found in global distribution vault.
                    </div>
                )}
            </div>
        </div>
    );
}

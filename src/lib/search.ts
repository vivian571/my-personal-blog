import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface SearchResult {
    title: string;
    slug: string;
    category: string;
    type: 'post' | 'book' | 'skill' | 'whitepaper';
    snippet: string;
}

export function generateSearchIndex(): SearchResult[] {
    const contentDir = path.join(process.cwd(), "content");
    const results: SearchResult[] = [];

    function scan(dir: string, type: 'post' | 'book' | 'skill' | 'whitepaper', categoryName?: string) {
        if (!fs.existsSync(dir)) return;

        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                if (type === 'book') {
                    // For books, the directory itself is the book
                    results.push({
                        title: item,
                        slug: item,
                        category: "Library",
                        type: 'book',
                        snippet: `Narrative book in the library.`
                    });
                } else {
                    scan(fullPath, type, categoryName || item);
                }
            } else if (item.endsWith(".md")) {
                const fileContents = fs.readFileSync(fullPath, "utf8");
                const { data, content } = matter(fileContents);
                const relativePath = path.relative(contentDir, fullPath);
                const slug = relativePath.replace(/\.md$/, "");

                results.push({
                    title: data.title || item.replace(/\.md$/, ""),
                    slug: slug,
                    category: categoryName || data.category || "General",
                    type: type,
                    snippet: content.slice(0, 150).replace(/[#*`]/g, "").trim() + "..."
                });
            }
        }
    }

    // Scan specific subdirectories with their types
    scan(path.join(contentDir, "小说"), 'book');
    scan(path.join(contentDir, "wechat"), 'post');
    scan(path.join(contentDir, "skills"), 'skill');
    scan(path.join(contentDir, "whitepapers"), 'whitepaper');

    return results;
}

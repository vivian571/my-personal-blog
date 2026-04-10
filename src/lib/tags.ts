import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface TagInfo {
    name: string;
    count: number;
}

export interface PostInfo {
    title: string;
    slug: string;
    date: string;
    tags: string[];
    category: string;
}

/**
 * Scans the content directory and aggregates all unique tags with their respective counts.
 */
export function getAllTags(): TagInfo[] {
    const contentDir = path.join(process.cwd(), "content");
    const tagMap: Record<string, number> = {};

    function scan(dir: string) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith(".md")) {
                try {
                    const fileContents = fs.readFileSync(fullPath, "utf8");
                    const { data } = matter(fileContents);
                    const tags = data.tags || [];

                    if (Array.isArray(tags)) {
                        tags.forEach(tag => {
                            const t = tag.trim();
                            if (t) {
                                tagMap[t] = (tagMap[t] || 0) + 1;
                            }
                        });
                    } else if (typeof tags === 'string') {
                        tags.split(',').forEach(tag => {
                            const t = tag.trim();
                            if (t) {
                                tagMap[t] = (tagMap[t] || 0) + 1;
                            }
                        });
                    }
                } catch (err) {
                    console.error(`Failed to parse tags for ${fullPath}:`, err);
                }
            }
        }
    }

    scan(contentDir);

    return Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Returns a list of posts that contain the specified tag.
 */
export function getPostsByTag(tag: string): PostInfo[] {
    const contentDir = path.join(process.cwd(), "content");
    const posts: PostInfo[] = [];

    function scan(dir: string) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith(".md")) {
                try {
                    const fileContents = fs.readFileSync(fullPath, "utf8");
                    const { data } = matter(fileContents);
                    
                    let tags: string[] = [];
                    if (Array.isArray(data.tags)) {
                        tags = data.tags;
                    } else if (typeof data.tags === 'string') {
                        tags = data.tags.split(',').map(t => t.trim());
                    }

                    if (tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
                        const relativePath = path.relative(contentDir, fullPath);
                        const slug = relativePath.replace(/\.md$/, "");
                        
                        posts.push({
                            title: data.title || item.replace(/\.md$/, ""),
                            slug: slug,
                            date: data.date ? data.date.toString() : "",
                            tags: tags,
                            category: data.category || path.basename(dir)
                        });
                    }
                } catch (err) {
                    console.error(`Failed to parse post for tag filtering ${fullPath}:`, err);
                }
            }
        }
    }

    scan(contentDir);

    return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

/**
 * Returns all posts across all categories, sorted by date.
 */
export function getAllPosts(): (PostInfo & { snippet: string })[] {
    const contentDir = path.join(process.cwd(), "content");
    const posts: (PostInfo & { snippet: string })[] = [];

    function scan(dir: string) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith(".md")) {
                try {
                    const fileContents = fs.readFileSync(fullPath, "utf8");
                    const { data, content } = matter(fileContents);
                    
                    let tags: string[] = [];
                    if (Array.isArray(data.tags)) {
                        tags = data.tags;
                    } else if (typeof data.tags === 'string') {
                        tags = data.tags.split(',').map(t => t.trim());
                    }

                    const relativePath = path.relative(contentDir, fullPath);
                    const slug = relativePath.replace(/\.md$/, "");
                    
                    posts.push({
                        title: data.title || item.replace(/\.md$/, ""),
                        slug: slug,
                        date: data.date ? data.date.toString() : "",
                        tags: tags,
                        category: data.category || path.basename(dir),
                        snippet: content.slice(0, 300).replace(/[#*`]/g, "").trim() + "..."
                    });
                } catch (err) {
                    console.error(`Failed to parse post for getAllPosts ${fullPath}:`, err);
                }
            }
        }
    }

    scan(contentDir);

    return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

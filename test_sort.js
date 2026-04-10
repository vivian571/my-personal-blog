const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function getRecentPosts() {
    const contentDirectory = path.join(process.cwd(), "content");
    if (!fs.existsSync(contentDirectory)) return [];

    const files_ = [];

    function scan(dir) {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith(".md")) {
                files_.push(fullPath);
            }
        });
    }

    scan(contentDirectory);

    const posts = files_.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const relativePath = path.relative(contentDirectory, filePath);
        const slug = relativePath.replace(/\.md$/, "");

        return {
            title: data.title || path.basename(filePath, ".md"),
            date: data.date || "",
            slug: slug
        };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));

    return posts;
}

console.log(getRecentPosts().slice(0, 6));

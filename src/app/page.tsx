import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
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

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDirectory)) return [];
  const filePaths = getAllFiles(postsDirectory);
  const posts = filePaths.map((filePath) => {
    // const filePath = filePath;
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);

    return {
      id: path.basename(filePath).replace(/\.md$/, ''),
      slug: data.slug || path.basename(filePath).replace(/\.md$/, ''),
      title: data.title || 'Untitled Post',
      date: data.date ? data.date.toString() : 'No date',
    };
  });

  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* AboutMe 模块 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">关于我</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          我在这里记录阅读过的书，分享对世界的观点，并致力于通过技术帮助更多人。
        </p>
      </section>

      {/* 文章列表转 Grid 布局 */}
      <section>
        <h2 className="text-2xl font-bold mb-8">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/posts/${post.slug}`}
              className="group block p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400">
                {post.date}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-24 py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>意安序 © 2026</p>
      </footer>
    </div>
  );
}

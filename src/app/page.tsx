import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { ArrowRight, Share2, Bookmark } from "lucide-react";

function getAllFiles(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles || [];
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
  const contentDirectory = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDirectory)) return [];
  const filePaths = getAllFiles(contentDirectory);
  const posts = filePaths.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    const { data } = matter(fileContents);
    return {
      id: path.basename(filePath).replace(/\.md$/, ""),
      slug: data.slug || path.basename(filePath).replace(/\.md$/, ""),
      title: data.title || "Untitled Post",
      date: data.date ? data.date.toString() : "No date",
      excerpt: data.description || data.excerpt || "点击阅读更多内容...",
    };
  });
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          探索知识的边界
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
          这里记录了我在技术、工程与生活中的思考与实践。愿这些文字能为你带来些许灵感。
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">最新发布</h2>
          <Link href="/archive" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            全部文章 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {posts.slice(0, 6).map((post) => (
            <div key={post.slug} className="group relative bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{post.date}</p>
                  <Link href={`/posts/${post.slug}`} className="block group">
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  {/* Pseudo buttons */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                      <Share2 size={14} /> 分享
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                      <Bookmark size={14} /> 收藏
                    </button>
                    <Link href={`/posts/${post.slug}`} className="ml-auto text-xs font-bold text-slate-900 hover:underline">
                      阅读全文
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

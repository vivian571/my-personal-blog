import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { Hash } from "lucide-react";

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

async function getTags() {
  const contentDirectory = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDirectory)) return {};
  const filePaths = getAllFiles(contentDirectory);
  
  const tagMap = {};
  filePaths.forEach((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    const { data } = matter(fileContents);
    const tags = data.tags || (data.category ? [data.category] : []);
    
    tags.forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push({
        title: data.title || "Untitled Post",
        slug: data.slug || path.basename(filePath).replace(/\.md$/, ""),
        date: data.date ? data.date.toString() : "No date",
      });
    });
  });
  return tagMap;
}

export default async function Tags() {
  const tagMap = await getTags();
  const tags = Object.keys(tagMap).sort();

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">标签云</h1>
        <p className="text-slate-500">按主题探索感兴趣的文件内容。</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <a key={tag} href={`#${tag}`} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-bold border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all">
            {tag} <span className="ml-1 text-xs opacity-50">{tagMap[tag].length}</span>
          </a>
        ))}
      </div>

      <div className="space-y-16 pt-8">
        {tags.map(tag => (
          <section key={tag} id={tag} className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              <Hash size={20} className="text-blue-500" /> {tag}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tagMap[tag].map(post => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="block p-4 rounded-xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50 transition-all">
                  <h3 className="font-bold text-slate-800 mb-1">{post.title}</h3>
                  <p className="text-xs text-slate-400">{post.date}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";

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
  return filePaths.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    const { data } = matter(fileContents);
    return {
      slug: data.slug || path.basename(filePath).replace(/\.md$/, ""),
      title: data.title || "Untitled Post",
      date: data.date ? data.date.toString() : "No date",
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function Archive() {
  const posts = await getPosts();
  
  // Group by year
  const groups = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear() || "Others";
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(groups).sort((a, b) => b - a);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">文章归档</h1>
        <p className="text-slate-500">按时间顺序回顾所有的思想足迹。</p>
      </header>

      <div className="space-y-16">
        {years.map(year => (
          <section key={year} className="relative pl-8 border-l-2 border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 absolute -left-[14px] bg-white px-1">
              {year}
            </h2>
            <div className="space-y-8 pt-4">
              {groups[year].map(post => (
                <div key={post.slug} className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 group">
                  <span className="text-sm font-bold text-slate-400 tabular-nums">
                    {new Date(post.date).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}
                  </span>
                  <Link href={`/posts/${post.slug}`} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

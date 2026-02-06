import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import React from 'react';
import { Share2, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReadingProgress } from "@/components/ReadingProgress";

// 定义文章数据结构
interface PostData {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
}

type Params = {
  slug: string[];
};

type Props = {
  params: Promise<Params>;
};

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".md")) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const contentDirectory = path.join(process.cwd(), "content");

// 生成所有可能的文章路径
export async function generateStaticParams() {
  if (!fs.existsSync(contentDirectory)) return [];
  const filePaths = getAllFiles(contentDirectory);
  return filePaths.map((filePath) => {
    const relativePath = path.relative(contentDirectory, filePath).replace(/\\/g, '/');
    const pathSlug = relativePath.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);

    return {
      slug: (data.slug || pathSlug).split('/')
    };
  });
}

// 根据 slug 获取文章数据
async function getPostData(slugArray: string[]): Promise<PostData> {
  const slug = decodeURIComponent(slugArray.join('/'));
  if (!fs.existsSync(contentDirectory)) throw new Error("Posts directory not found");
  const filePaths = getAllFiles(contentDirectory);
  const fullPath = filePaths.find(filePath => {
    const relativePath = path.relative(contentDirectory, filePath).replace(/\\/g, '/');
    const pathSlug = relativePath.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    return (data.slug || pathSlug) === slug;
  });

  if (!fullPath) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  // const fullPath = fullPath;
  const fileContents = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: matterResult.data.title || matterResult.data.name || 'Untitled Post',
    date: matterResult.data.date ? matterResult.data.date.toString() : new Date().toISOString(),
  };
}

// 生成页面元数据
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const postData = await getPostData(slug);
  return {
    title: postData.title,
  };
}

// 页面组件
export default async function PostPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const postData = await getPostData(slug);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <ReadingProgress />
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> 返回首页
      </Link>

      <main>
        <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600">
          <header className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">{postData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
              <span>{new Date(postData.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>•</span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                  <Share2 size={14} /> 分享
                </button>
                <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                  <Bookmark size={14} /> 收藏
                </button>
              </div>
            </div>
          </header>

          <div
            className="mt-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </main>

      <footer className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">
            关注作者
          </button>
          <button className="px-6 py-2 border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors">
            赞赏支持
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><Share2 size={20} /></button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><Bookmark size={20} /></button>
        </div>
      </footer>
    </div>
  );
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import React from 'react';

// 定义文章数据结构
interface PostData {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
}

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

const postsDirectory = path.join(process.cwd(), 'posts');

// 生成所有可能的文章路径
export async function generateStaticParams() {
  if (!fs.existsSync(postsDirectory)) return [];
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    
    return {
      slug: data.slug || filename.replace(/\.md$/, '')
    };
  });
}

// 根据 slug 获取文章数据
async function getPostData(slug: string): Promise<PostData> {
  slug = decodeURIComponent(slug);
  if (!fs.existsSync(postsDirectory)) throw new Error("Posts directory not found");
  const filenames = fs.readdirSync(postsDirectory);
  const filename = filenames.find(fname => {
    const filePath = path.join(postsDirectory, fname);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    return (data.slug || fname.replace(/\.md$/, '')) === slug;
  });

  if (!filename) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const fullPath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: matterResult.data.title || 'Untitled Post',
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <main>
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
          <div className="text-gray-400 mb-8">
            {new Date(postData.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div
            className="mt-8 leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </main>
    </div>
  );
}

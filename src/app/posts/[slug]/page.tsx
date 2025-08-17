import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import styles from '../../page.module.css';

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
  params: Params;
};

const postsDirectory = path.join(process.cwd(), 'posts');

// 生成所有可能的文章路径
export async function generateStaticParams() {
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
    date: matterResult.data.date || new Date().toISOString(),
  };
}

// 生成页面元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  return {
    title: postData.title,
  };
}

// 页面组件
export default async function PostPage({ params }: Props) {
  const postData = await getPostData(params.slug);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <article className={styles.post}>
          <h1>{postData.title}</h1>
          <div className={styles.postDate}>
            {new Date(postData.date).toLocaleDateString()}
          </div>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </main>
    </div>
  );
}
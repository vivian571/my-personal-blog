import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import styles from '../../page.module.css';

interface PostParams {
  params: {
    slug: string;
  };
}

interface PostData {
  title?: string;
  date?: string;
  contentHtml: string;
  [key: string]: any;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export async function generateStaticParams() {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}

interface PostData {
  title?: string;
  date?: string;
  contentHtml: string;
  [key: string]: any;
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  return {
    title: postData.title || 'Untitled Post',
  };
}

export default async function Post({ params }: PostParams) {
    const postData: PostData = await getPostData(params.slug);
  
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <article className={styles.post}>
            <h1>{postData.title || 'Untitled Post'}</h1>
            <div className={styles.postDate}>{postData.date || 'No date'}</div>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />
          </article>
        </main>
      </div>
    );
  }

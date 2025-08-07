import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import styles from '../../page.module.css';

interface PostData {
  title?: string;
  date?: string;
  contentHtml: string;
  [key: string]: unknown;
}

const postsDirectory = path.join(process.cwd(), 'posts');

// 生成静态参数
export async function generateStaticParams() {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    return filenames.map((filename) => ({
      slug: filename.replace(/\.md$/, ''),
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error reading posts directory:', error.message);
    } else {
      console.error('An unknown error occurred while reading posts directory');
    }
    return [];
  }
}

// 获取文章数据
async function getPostData(slug: string): Promise<PostData> {
  try {
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
      ...(matterResult.data as Omit<PostData, 'contentHtml' | 'slug'>),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error loading post ${slug}:`, error.message);
    } else {
      console.error(`An unknown error occurred while loading post ${slug}`);
    }
    return {
      title: 'Post not found',
      contentHtml: '<p>Sorry, the requested post could not be found.</p>',
    };
  }
}

// 生成页面元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  return {
    title: typeof postData.title === 'string' ? postData.title : 'Untitled Post',
  };
}

// 博客文章页面组件
export default async function Post({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const postData = await getPostData(params.slug);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <article className={styles.post}>
          <h1>{typeof postData.title === 'string' ? postData.title : 'Untitled Post'}</h1>
          {postData.date && (
            <div className={styles.postDate}>
              {new Date(postData.date as string).toLocaleDateString()}
            </div>
          )}
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ 
              __html: typeof postData.contentHtml === 'string' 
                ? postData.contentHtml 
                : '<p>No content available.</p>' 
            }}
          />
        </article>
      </main>
    </div>
  );
}

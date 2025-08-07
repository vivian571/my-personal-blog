import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import styles from '../../page.module.css';

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// 定义文章数据的结构
interface PostData {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

// 生成所有可能的文章路径
export async function generateStaticParams() {
  const filenames = fs.readdirSync(postsDirectory);
  const slugs = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    return { slug: data.slug };
  });
  return slugs.filter(item => item.slug);
}

// 根据 slug 获取文章数据
async function getPostData(slug: string): Promise<PostData | null> {
  const filenames = fs.readdirSync(postsDirectory);
  const filename = filenames.find(fname => {
    const filePath = path.join(postsDirectory, fname);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);
    return data.slug === slug;
  });

  if (!filename) {
    return null;
  }

  const fullPath = path.join(postsDirectory, filename);

  try {
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
  } catch (error) {
    // 如果文件读取失败，返回一个明确的错误文章
    console.error(`Failed to load post ${slug}:`, error);
    return {
      slug,
      title: 'Post Not Found',
      date: new Date().toISOString(),
      contentHtml: '<p>Sorry, the requested post could not be found.</p>',
    };
  }
}

// 生成页面的元数据
export async function generateMetadata({ params }: Props) {
  const postData = await getPostData(params.slug);
  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: postData.title,
  };
}

// 博客文章页面组件

export default async function Post({ params }: Props) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>Sorry, the requested post could not be found.</p>
      </div>
    );
  }

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

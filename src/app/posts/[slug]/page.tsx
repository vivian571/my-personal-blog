import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata, ResolvingMetadata } from 'next';
import styles from '../../page.module.css';

// 定义文章数据的结构
interface PostData {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
}



const postsDirectory = path.join(process.cwd(), 'posts');

// 生成所有可能的文章路径
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    return filenames
      .filter(filename => filename.endsWith('.md'))
      .map((filename) => ({
        slug: filename.replace(/\.md$/, ''),
      }));
  } catch (error) {
    // 如果 posts 目录不存在，则返回空数组，避免构建失败
    console.warn('Could not read posts directory, maybe it does not exist yet.', error);
    return [];
  }
}

// 根据 slug 获取文章数据
async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

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
export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  return {
    title: postData.title,
  };
}

// 博客文章页面组件
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Post({ params }: { params: any }) {
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

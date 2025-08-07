import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Metadata } from 'next';
import styles from '../../page.module.css';

interface PostData {
  title: string;
  date: string;
  contentHtml: string;
  slug: string;
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

const postsDirectory = path.join(process.cwd(), 'posts');

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    return filenames.map((filename) => ({
      slug: filename.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return {
      title: 'Post Not Found',
      date: '',
      contentHtml: '<p>Sorry, this post does not exist.</p>',
      slug,
    };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  return {
    title: postData.title,
  };
}

export default async function Post({ params }: PostPageProps) {
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

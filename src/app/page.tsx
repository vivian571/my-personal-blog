import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import styles from './page.module.css';

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title || 'Untitled Post',
      date: data.date || 'No date',
    };
  });

  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>My Personal Blog</h1>
          <p>A collection of my thoughts and writings.</p>
        </header>
        
        <div className={styles.postList}>
          <h2>Latest Posts</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`}>
                  <h3>{post.title}</h3>
                  <p>{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>Powered by Next.js and your creativity.</p>
      </footer>
    </div>
  );
}

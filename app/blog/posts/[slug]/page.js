import { posts } from "@/app/lib/blog-data";
import styles from "@/app/styles/Blog.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | SEO Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <article className={styles.articleContainer}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.dot}></span>
            <span>{post.date}</span>
            <span className={styles.dot}></span>
            <span>{post.readTime}</span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
        </header>

        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

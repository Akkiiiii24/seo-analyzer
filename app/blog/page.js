import Link from "next/link";
import { posts } from "@/app/lib/blog-data";
import styles from "@/app/styles/Blog.module.css";

export const metadata = {
  title: "SEO Blog & Optimization Guides",
  description:
    "Learn SEO best practices, on-page optimization tricks, heading structures, meta tagging guidelines, and image alt strategies.",
};

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            SEO <span className="gradient-text">Resources & Guides</span>
          </h1>
          <p className={styles.subtitle}>
            Level up your website search engine optimizations and learn how to drive more organic traffic.
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/posts/${post.slug}`} className={styles.card}>
              <div className={styles.meta}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.dot}></span>
                <span>{post.date}</span>
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.readMore}>
                Read Guide <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

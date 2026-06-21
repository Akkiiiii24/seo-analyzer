import Link from "next/link";
import styles from "@/app/styles/Error.module.css";

export const metadata = {
  title: "Page Not Found (404)",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        Oops! The page you are looking for doesn&apos;t exist or has been moved to another URL.
      </p>
      <div className={styles.btnGroup}>
        <Link href="/" className="btn btn-primary">
          ⚡ Return Home
        </Link>
        <Link href="/analyzer" className="btn btn-secondary">
          Run SEO Audit
        </Link>
      </div>
    </div>
  );
}

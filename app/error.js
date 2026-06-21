"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/Error.module.css";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to our logging helper
    console.error("Runtime Application Error:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>500</div>
      <h1 className={styles.title}>Internal Server Error</h1>
      <p className={styles.description}>
        Something went wrong on our end. We have logged this issue and our team is investigating.
      </p>
      <div className={styles.btnGroup}>
        <button onClick={() => reset()} className="btn btn-primary">
          🔄 Try Again
        </button>
        <Link href="/" className="btn btn-secondary">
          ⚡ Return Home
        </Link>
      </div>
    </div>
  );
}

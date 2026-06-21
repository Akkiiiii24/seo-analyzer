"use client";

import styles from "@/app/styles/SeoChecklist.module.css";

export default function SeoChecklist({ checks = [] }) {
  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const warned = checks.filter((c) => c.status === "warn").length;

  return (
    <div className={styles.checklist} id="seo-checklist">
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryDot} ${styles.dotPass}`}></span>
          {passed} Passed
        </div>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryDot} ${styles.dotFail}`}></span>
          {failed} Failed
        </div>
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryDot} ${styles.dotWarn}`}></span>
          {warned} Warnings
        </div>
      </div>

      {checks.map((check, index) => (
        <div
          key={index}
          className={styles.checkItem}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span
            className={`${styles.statusIcon} ${
              check.status === "pass"
                ? styles.statusPass
                : check.status === "fail"
                  ? styles.statusFail
                  : styles.statusWarn
            }`}
          >
            {check.status === "pass" ? "✓" : check.status === "fail" ? "✕" : "!"}
          </span>
          <div className={styles.checkContent}>
            <div className={styles.checkName}>{check.name}</div>
            <div className={styles.checkDescription}>{check.description}</div>
            {check.value && (
              <span className={styles.checkValue}>{check.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

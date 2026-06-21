import styles from "@/app/styles/Skeleton.module.css";

export function ScoreCardSkeleton() {
  return (
    <div className={`${styles.skeleton} ${styles.circle} ${styles.scoreCardSkeleton}`}></div>
  );
}

export function ReportSummarySkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.cardSkeleton}>
          <div className={`${styles.skeleton} ${styles.titleSkeleton}`} style={{ width: "30%" }}></div>
          <div className={`${styles.skeleton} ${styles.lineSkeleton}`} style={{ width: "60%", height: "24px" }}></div>
        </div>
      ))}
    </div>
  );
}

export function SeoChecklistSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={styles.cardSkeleton} style={{ height: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`} style={{ width: "40%", margin: 0 }}></div>
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`} style={{ width: "10%", margin: 0, height: "16px" }}></div>
          </div>
          <div className={`${styles.skeleton} ${styles.lineSkeleton}`} style={{ width: "80%", margin: 0 }}></div>
        </div>
      ))}
    </div>
  );
}

export function ReportListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={`${styles.skeleton} ${styles.reportItemSkeleton}`}></div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScoreCard from "@/app/components/ScoreCard";
import SeoChecklist from "@/app/components/SeoChecklist";
import ReportSummary from "@/app/components/ReportSummary";
import styles from "@/app/styles/Analyzer.module.css";

export default function ReportPage({ params }) {
  const { id } = use(params);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) {
          setError(data.error);
        } else {
          setReport(data.report);
        }
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [id, router]);

  function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Loading report...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❌</div>
            <div className={styles.emptyTitle}>{error}</div>
            <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse the data JSON if needed
  const data = typeof report.data === "string" ? JSON.parse(report.data) : report.data;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            Saved <span className="gradient-text">SEO Report</span>
          </h1>
          <p className={styles.headerSubtitle}>
            <Link href="/dashboard" style={{ color: "var(--purple)" }}>
              ← Dashboard
            </Link>
          </p>
        </div>

        <div className={styles.results}>
          {/* Analyzed URL Bar */}
          <div className={styles.analyzedUrl}>
            <span className={styles.urlLabel}>Analyzed:</span>
            <span className={styles.urlValue}>{report.url}</span>
            <span className={styles.timestamp}>
              {formatDate(report.createdAt)}
            </span>
          </div>

          {/* Score + Summary */}
          <div className={styles.scoreRow}>
            <div className={styles.scoreSection}>
              <ScoreCard score={report.score} />
            </div>
            <div className={styles.summarySection}>
              <ReportSummary stats={data.summary} />
            </div>
          </div>

          {/* Detailed Checks */}
          <div className={styles.checksSection}>
            <h2 className={styles.checksTitle}>Detailed SEO Checks</h2>
            <SeoChecklist checks={data.checks} />
          </div>
        </div>
      </div>
    </div>
  );
}

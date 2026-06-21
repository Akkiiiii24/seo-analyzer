"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { ReportListSkeleton } from "@/app/components/Skeleton";
import styles from "@/app/styles/Dashboard.module.css";
import skeletonStyles from "@/app/styles/Skeleton.module.css";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user and reports in parallel
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/reports").then((r) => r.json()),
    ])
      .then(([authData, reportsData]) => {
        if (!authData.user) {
          router.push("/auth/login");
          return;
        }
        setUser(authData.user);
        setReports(reportsData.reports || []);
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getScoreClass(score) {
    if (score >= 80) return styles.scoreGood;
    if (score >= 50) return styles.scoreAverage;
    return styles.scorePoor;
  }

  function avgScore() {
    if (reports.length === 0) return 0;
    return Math.round(
      reports.reduce((sum, r) => sum + r.score, 0) / reports.length
    );
  }

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <div className="container">
          {/* Header Skeleton */}
          <div className={styles.dashboardHeader}>
            <div className={skeletonStyles.skeleton} style={{ height: "38px", width: "260px" }}></div>
          </div>

          {/* Stats Row Skeleton */}
          <div className={styles.statsRow}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statCard} style={{ opacity: 0.6 }}>
                <div className={skeletonStyles.skeleton} style={{ height: "36px", width: "40px", margin: "0 auto var(--space-2) auto" }}></div>
                <div className={skeletonStyles.skeleton} style={{ height: "14px", width: "70px", margin: "0 auto" }}></div>
              </div>
            ))}
          </div>

          {/* Reports Section Skeleton */}
          <div className={styles.reportsSection} style={{ opacity: 0.6 }}>
            <div className={styles.reportsHeader}>
              <h2 className={styles.reportsTitle}>Your Reports</h2>
            </div>
            <ReportListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <h1 className={styles.greeting}>
            Welcome back,{" "}
            <span className={styles.greetingName}>
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <div className={styles.headerActions}>
            <Link href="/analyzer" className="btn btn-primary">
              🔍 New Analysis
            </Link>
            <form action={logout}>
              <button type="submit" className={styles.logoutBtn}>
                Log Out
              </button>
            </form>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{reports.length}</div>
            <div className={styles.statLabel}>Total Reports</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{avgScore()}</div>
            <div className={styles.statLabel}>Average Score</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {user?.plan === "pro" ? "Pro" : "Free"}
            </div>
            <div className={styles.statLabel}>Current Plan</div>
          </div>
        </div>

        {/* Reports List */}
        <div className={styles.reportsSection}>
          <div className={styles.reportsHeader}>
            <h2 className={styles.reportsTitle}>Your Reports</h2>
          </div>

          {reports.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <div className={styles.emptyTitle}>No reports yet</div>
              <div className={styles.emptySubtitle}>
                Analyze a website and save the report to see it here
              </div>
              <Link href="/analyzer" className="btn btn-primary">
                🔍 Analyze a Website
              </Link>
            </div>
          ) : (
            <div className={styles.reportsList}>
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className={styles.reportItem}
                >
                  <div
                    className={`${styles.reportScore} ${getScoreClass(report.score)}`}
                  >
                    {report.score}
                  </div>
                  <div className={styles.reportInfo}>
                    <div className={styles.reportUrl}>{report.url}</div>
                    <div className={styles.reportDate}>
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  <span className={styles.reportArrow}>→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

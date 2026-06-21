"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import UrlInput from "@/app/components/UrlInput";
import ScoreCard from "@/app/components/ScoreCard";
import SeoChecklist from "@/app/components/SeoChecklist";
import ReportSummary from "@/app/components/ReportSummary";
import { useAuth } from "@/app/context/AuthContext";
import { ScoreCardSkeleton, ReportSummarySkeleton, SeoChecklistSkeleton } from "@/app/components/Skeleton";
import styles from "@/app/styles/Analyzer.module.css";
import Link from "next/link";

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth state to resolve

    if (urlParam) {
      setError(null);
      
      // Try to load report from sessionStorage cache to prevent double-fetching on transition
      const cached = sessionStorage.getItem("lastAnalysis");
      if (cached) {
        try {
          const { url: cachedUrl, result, timestamp } = JSON.parse(cached);
          const isRecent = Date.now() - timestamp < 30000; // 30 seconds
          if (cachedUrl === urlParam && isRecent) {
            setReport(result);
            sessionStorage.removeItem("lastAnalysis");

            // Save to database if user is logged in
            if (user) {
              fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url: result.url,
                  score: result.score,
                  data: result,
                }),
              }).catch((err) => console.error("Error saving cached report:", err));
            }
            return;
          }
        } catch {
          // Fall through to fetch
        }
      }

      // Try to load report from legacy seoReport sessionStorage (only for guest users)
      if (!user) {
        const stored = sessionStorage.getItem("seoReport");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.url === urlParam) {
              setReport(parsed);
              return;
            }
          } catch {
            // Fall through to fetch
          }
        }
      }

      // If no stored report, fetch from API
      setLoading(true);
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlParam }),
      })
        .then((res) => {
          if (res.status === 403) {
            return res.json().then((data) => {
              throw { status: 403, message: data.message || data.error };
            });
          }
          if (!res.ok) {
            return res.json().then((data) => {
              throw { status: res.status, message: data.error || "Failed to analyze website." };
            });
          }
          return res.json();
        })
        .then((data) => {
          setReport(data);
          sessionStorage.setItem("seoReport", JSON.stringify(data));

          // Save to database if user is logged in
          if (user) {
            fetch("/api/reports", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: data.url,
                score: data.score,
                data: data,
              }),
            }).catch((err) => console.error("Error saving report:", err));
          }
        })
        .catch((err) => {
          setReport(null);
          if (err.status === 403) {
            setError({ type: "limit", message: err.message });
          } else {
            setError({ type: "generic", message: err.message || "An unexpected error occurred." });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [urlParam, user, authLoading]);

  function formatDate(iso) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            Website <span className="gradient-text">SEO Analyzer</span>
          </h1>
          <p className={styles.headerSubtitle}>
            Enter a URL below to get a comprehensive SEO audit report
          </p>
          <div className={styles.headerInput}>
            <UrlInput />
          </div>
        </div>

        {loading && (
          <div className={styles.results} style={{ opacity: 0.6 }}>
            {/* Analyzed URL Bar placeholder */}
            <div className={styles.analyzedUrl} style={{ background: "rgba(255, 255, 255, 0.01)" }}>
              <span className={styles.urlLabel}>Analyzing URL...</span>
            </div>

            {/* Score + Summary Skeletons */}
            <div className={styles.scoreRow}>
              <div className={styles.scoreSection}>
                <ScoreCardSkeleton />
              </div>
              <div className={styles.summarySection}>
                <ReportSummarySkeleton />
              </div>
            </div>

            {/* Detailed Checks Skeletons */}
            <div className={styles.checksSection}>
              <h2 className={styles.checksTitle}>Running SEO Checks...</h2>
              <SeoChecklistSkeleton />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{error.type === "limit" ? "🔒" : "❌"}</div>
            <div className={styles.emptyTitle}>{error.message}</div>
            {error.type === "limit" && (
              <Link href="/pricing" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                🚀 Upgrade to Pro
              </Link>
            )}
          </div>
        )}

        {!loading && !report && !urlParam && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <div className={styles.emptyTitle}>No URL analyzed yet</div>
            <div className={styles.emptySubtitle}>
              Enter a website URL above to start your SEO audit
            </div>
          </div>
        )}

        {report && !loading && !error && (
          <div className={styles.results}>
            {/* Analyzed URL Bar */}
            <div className={styles.analyzedUrl}>
              <span className={styles.urlLabel}>Analyzed:</span>
              <span className={styles.urlValue}>{report.url}</span>
              <span className={styles.timestamp}>
                {formatDate(report.analyzedAt)}
              </span>
            </div>

            {/* Score + Summary */}
            <div className={styles.scoreRow}>
              <div className={styles.scoreSection}>
                <ScoreCard score={report.score} />
              </div>
              <div className={styles.summarySection}>
                <ReportSummary stats={report.summary} />
              </div>
            </div>

            {/* Detailed Checks */}
            <div className={styles.checksSection}>
              <h2 className={styles.checksTitle}>Detailed SEO Checks</h2>
              <SeoChecklist checks={report.checks} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className="container">
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingText}>Loading...</div>
            </div>
          </div>
        </div>
      }
    >
      <AnalyzerContent />
    </Suspense>
  );
}

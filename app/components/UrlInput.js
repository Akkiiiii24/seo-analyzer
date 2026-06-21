"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/UrlInput.module.css";

export default function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function normalizeUrl(input) {
    let cleaned = input.trim();
    if (!cleaned) return "";
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = "https://" + cleaned;
    }
    try {
      new URL(cleaned);
      return cleaned;
    } catch {
      return "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Please enter a valid URL (e.g., example.com)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze the URL");
      }

      const data = await res.json();
      // Store report in sessionStorage with timestamp to prevent double-fetching on redirect
      sessionStorage.setItem(
        "lastAnalysis",
        JSON.stringify({
          url: normalized,
          result: data,
          timestamp: Date.now(),
        })
      );
      router.push("/analyzer?url=" + encodeURIComponent(normalized));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} id="url-analysis-form">
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}>🔗</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter any website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            id="url-input"
            aria-label="Website URL to analyze"
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !url.trim()}
            id="analyze-button"
          >
            {loading ? (
              <span className={styles.loading}>
                <span className={styles.spinner}></span>
                Analyzing...
              </span>
            ) : (
              <>🔍 Analyze</>
            )}
          </button>
        </div>
      </form>
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}

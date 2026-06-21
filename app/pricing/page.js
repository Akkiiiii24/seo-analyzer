"use client";

import { useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import styles from "@/app/styles/Pricing.module.css";

function PricingContent() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleUpgrade() {
    if (!user) {
      router.push("/auth/signup?redirect=/pricing");
      return;
    }

    setLoadingSession(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.url) {
        // Redirect to Razorpay checkout (or mock checkout flow)
        window.location.href = data.url;
      }
    } catch {
      setError("Failed to initialize checkout. Please try again.");
    } finally {
      setLoadingSession(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className={styles.subtitle}>
            Choose the plan that fits your needs. Upgrade or cancel at any time.
          </p>
        </div>

        {/* Status Messages */}
        {success && (
          <div className={`${styles.statusMsg} ${styles.successMsg}`}>
            🎉 Thank you for upgrading! Your account has been updated to Pro.
          </div>
        )}
        {canceled && (
          <div className={`${styles.statusMsg} ${styles.cancelMsg}`}>
            Checkout was canceled. No charges were made.
          </div>
        )}
        {error && (
          <div className={`${styles.statusMsg} ${styles.cancelMsg}`}>
            ❌ {error}
          </div>
        )}

        {/* Pricing Grid */}
        <div className={styles.grid}>
          {/* Free Plan */}
          <div className={styles.card}>
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>Free Plan</h2>
              <p className={styles.planDesc}>Perfect for trying out our SEO tools</p>
            </div>
            <div className={styles.priceBlock}>
              <span className={styles.price}>$0</span>
              <span className={styles.period}>/ month</span>
            </div>
            <ul className={styles.featuresList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                3 website analyses per day
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                16 core SEO checklist audits
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                Detailed action recommendations
              </li>
              <li className={`${styles.featureItem} ${styles.featureDisabled}`}>
                <span className={styles.featureIcon}>✗</span>
                Dashboard reports history
              </li>
              <li className={`${styles.featureItem} ${styles.featureDisabled}`}>
                <span className={styles.featureIcon}>✗</span>
                Priority check queuing
              </li>
            </ul>

            {user && user.plan === "free" ? (
              <button className={`${styles.upgradeBtn} ${styles.currentPlanBtn}`} disabled>
                Current Plan
              </button>
            ) : user && user.plan === "pro" ? (
              <Link href="/dashboard" className={`${styles.upgradeBtn} ${styles.freeBtn}`}>
                View Dashboard
              </Link>
            ) : (
              <Link href="/analyzer" className={`${styles.upgradeBtn} ${styles.freeBtn}`}>
                Try for Free
              </Link>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`${styles.card} ${styles.popularCard}`}>
            <span className={styles.popularBadge}>Most Popular</span>
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>Pro Plan</h2>
              <p className={styles.planDesc}>Best for website owners & marketers</p>
            </div>
            <div className={styles.priceBlock}>
              <span className={styles.price}>$9</span>
              <span className={styles.period}>/ month</span>
            </div>
            <ul className={styles.featuresList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <strong>Unlimited</strong> website analyses
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                16 core SEO checklist audits
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                Detailed action recommendations
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                Dashboard reports history (Save & track)
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                Priority check queuing
              </li>
            </ul>

            {user && user.plan === "pro" ? (
              <button className={`${styles.upgradeBtn} ${styles.currentPlanBtn}`} disabled>
                Active Subscription
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading || loadingSession}
                className={`${styles.upgradeBtn} ${styles.proBtn}`}
              >
                {loadingSession ? "Loading checkout..." : "Upgrade to Pro"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className="container" style={{ textAlign: "center" }}>
            <p className={styles.subtitle}>Loading plans...</p>
          </div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}

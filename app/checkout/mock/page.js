"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import styles from "@/app/styles/MockCheckout.module.css";

export default function MockCheckoutPage() {
  const { user, loading, refresh } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/checkout/mock");
    }
  }, [user, loading, router]);

  async function handleUpgrade() {
    setUpgrading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/mock", {
        method: "POST",
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Refresh AuthContext user plan so client components update immediately
        await refresh();
        router.push("/dashboard?success=true");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.page}>
        <div className={styles.checkoutCard} style={{ textAlign: "center" }}>
          <p className={styles.subtitle}>Loading secure checkout session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.checkoutCard}>
        <div className={styles.header}>
          <span className={styles.badge}>Simulated Checkout</span>
          <h1 className={styles.title}>Upgrade to Pro Plan</h1>
          <p className={styles.subtitle}>
            You are running in local test mode (no real Razorpay keys set).
          </p>
        </div>

        <div className={styles.priceBlock}>
          <span className={styles.price}>$9.00</span>
          <span className={styles.period}>/ month</span>
        </div>

        <div className={styles.mockForm}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          {/* Credit Card Mock */}
          <div className={styles.cardMock}>
            <div className={styles.cardHeader}>
              <div className={styles.chip}></div>
              <span className={styles.cardLogo}>MockCard</span>
            </div>

            <div className={styles.cardNumber}>••••  ••••  ••••  4242</div>

            <div className={styles.cardMeta}>
              <div className={styles.cardHolder}>
                <span className={styles.cardLabel}>Card Holder</span>
                <span className={styles.cardValue}>{user.name}</span>
              </div>
              <div className={styles.cardExpiry}>
                <span className={styles.cardLabel}>Expires</span>
                <span className={styles.cardValue}>12 / 30</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className={styles.payBtn}
          >
            {upgrading ? "Simulating Upgrade..." : "🚀 Simulate Payment Success"}
          </button>

          <Link href="/pricing" className={styles.cancelBtn}>
            Cancel and Return
          </Link>
        </div>
      </div>
    </div>
  );
}

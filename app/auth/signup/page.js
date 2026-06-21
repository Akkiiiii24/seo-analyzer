"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import styles from "@/app/styles/Auth.module.css";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIcon}>🚀</div>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>
            Start saving your SEO reports and track improvements
          </p>
        </div>

        <form action={action} className={styles.form} id="signup-form">
          {state?.error && (
            <div className={styles.errorMsg}>{state.error}</div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
              minLength={2}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className={styles.submitBtn}
            id="signup-button"
          >
            {pending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.authFooter}>
          Already have an account?{" "}
          <Link href="/auth/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

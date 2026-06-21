"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import styles from "@/app/styles/Auth.module.css";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIcon}>👋</div>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>
            Log in to access your saved reports and dashboard
          </p>
        </div>

        <form action={action} className={styles.form} id="login-form">
          {state?.error && (
            <div className={styles.errorMsg}>{state.error}</div>
          )}

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
              placeholder="Enter your password"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className={styles.submitBtn}
            id="login-button"
          >
            {pending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.authFooter}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

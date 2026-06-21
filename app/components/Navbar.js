"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import styles from "@/app/styles/Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    refresh();
  }, [pathname]); // Refresh user state on navigation

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>SEO Analyzer</span>
        </Link>

        <div className={styles.navLinks}>
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}
          >
            Home
          </Link>
          <Link
            href="/analyzer"
            className={`${styles.navLink} ${pathname === "/analyzer" ? styles.navLinkActive : ""}`}
          >
            Analyzer
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${pathname === "/dashboard" ? styles.navLinkActive : ""}`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/blog"
            className={`${styles.navLink} ${pathname.startsWith("/blog") ? styles.navLinkActive : ""}`}
          >
            Blog
          </Link>
          <Link
            href="/pricing"
            className={`${styles.navLink} ${pathname === "/pricing" ? styles.navLinkActive : ""}`}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${pathname === "/about" ? styles.navLinkActive : ""}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`${styles.navLink} ${pathname === "/contact" ? styles.navLinkActive : ""}`}
          >
            Contact
          </Link>
        </div>

        <div className={styles.navCta}>
          {!loading && !user && (
            <Link href="/auth/login" className="btn btn-secondary">
              Log In
            </Link>
          )}
          {!loading && user && (
            <div className={styles.userMenu}>
              <span className={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
              <Link href="/dashboard" className={styles.userName}>
                {user.name}
              </Link>
            </div>
          )}
        </div>

        <button className={styles.mobileMenuBtn} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

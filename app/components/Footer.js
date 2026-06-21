import Link from "next/link";
import styles from "@/app/styles/Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="site-footer">
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <h3>⚡ SEO Analyzer</h3>
            <p>
              Analyze any website&apos;s SEO health in seconds. Get actionable
              insights and recommendations to improve your search engine
              rankings.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <ul>
              <li>
                <Link href="/analyzer">Analyzer</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/">Features</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Resources</h4>
            <ul>
              <li>
                <Link href="/">SEO Guide</Link>
              </li>
              <li>
                <Link href="/">Blog</Link>
              </li>
              <li>
                <Link href="/">API Docs</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} SEO Analyzer. All rights reserved.</p>
          <div className={styles.footerSocials}>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" aria-label="GitHub">
              GitHub
            </a>
            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

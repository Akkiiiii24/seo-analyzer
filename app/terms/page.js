import styles from "@/app/styles/StaticPages.module.css";

export const metadata = {
  title: "Terms & Conditions",
  description: "Review the Terms & Conditions governing your use of the SEO Analyzer SaaS platform.",
};

export default function TermsPage() {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} gradient-text`}>Terms &amp; Conditions</h1>
        <p className={styles.subtitle}>Last updated: June 22, 2026</p>
      </div>

      <div className={`${styles.card} glass-card`}>
        <div className={styles.content}>
          <p>
            Welcome to SEO Analyzer! These terms and conditions outline the rules and regulations for the use of SEO Analyzer&apos;s Website, located at seooptik.com.
          </p>

          <h2>1. Terms of Use</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use SEO Analyzer if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2>2. License and Usage</h2>
          <p>
            Unless otherwise stated, SEO Analyzer owns the intellectual property rights for all material on SEO Analyzer. All intellectual property rights are reserved. You may access this from SEO Analyzer for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from SEO Analyzer</li>
            <li>Sell, rent or sub-license material from SEO Analyzer</li>
            <li>Reproduce, duplicate or copy material from SEO Analyzer</li>
            <li>Redistribute content from SEO Analyzer</li>
          </ul>

          <h2>3. User Account Security</h2>
          <p>
            If you create an account, you are responsible for maintaining the confidentiality of your account credentials and session tokens. You must immediately notify us of any unauthorized use of your account.
          </p>

          <h2>4. Website Auditing &amp; Scraper Abuse Policy</h2>
          <p>
            Our tool analyzes external website URLs. You agree not to use our auditing engine to scan websites without authorization or in a manner that causes network degradation or denial-of-service issues for target servers.
          </p>
          <p>
            We implement DNS-pinning, redirect limits, and internal network range blocks to prevent Server-Side Request Forgery (SSRF). Any attempts to bypass these security filters will result in immediate account termination.
          </p>

          <h2>5. Subscription Billing and Cancellations</h2>
          <p>
            Subscribing to the Pro plan grants you unlimited analyses and historical dashboard saves. Billing is handled through Razorpay. You can cancel your subscription at any time via your billing dashboard. Refunds are subject to our refund policy.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall SEO Analyzer, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. SEO Analyzer shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
          </p>

          <h2>7. Contact Information</h2>
          <p>
            If you have any queries regarding any of our terms, please contact us at support@seooptik.com.
          </p>
        </div>
      </div>
    </div>
  );
}

import styles from "@/app/styles/StaticPages.module.css";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how we protect and handle your personal data when using the SEO Analyzer SaaS tool.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} gradient-text`}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: June 22, 2026</p>
      </div>

      <div className={`${styles.card} glass-card`}>
        <div className={styles.content}>
          <p>
            At SEO Analyzer, accessible from seooptik.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SEO Analyzer and how we use it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            If you create an account, we collect personal credentials such as:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Session and authentication cookies</li>
          </ul>
          <p>
            When you perform a website analysis audit, our systems collect and process the target website URL that you submit. We do not store or inspect any personal data contained on the scanned sites.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our web application.</li>
            <li>Improve, personalize, and expand our platform.</li>
            <li>Understand and analyze how you use our tool.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Process payment transactions securely via Razorpay.</li>
            <li>Send transactional emails (welcome notifications and account status changes).</li>
          </ul>

          <h2>3. Cookies and Session Storage</h2>
          <p>
            SEO Analyzer uses secure session cookies to verify authenticated accounts. We implement a database-backed session revocation system which immediately invalidates session tokens upon logout.
          </p>

          <h2>4. Data Retention Policy</h2>
          <p>
            For users on the free tier, generated SEO audit reports are automatically pruned from our database after 30 days. Pro users can retain their history indefinitely. Session records are regularly cleared upon expiration.
          </p>

          <h2>5. Payment Processing Security</h2>
          <p>
            All subscriptions are processed through Razorpay. We do not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@seooptik.com.
          </p>
        </div>
      </div>
    </div>
  );
}

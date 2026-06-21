import styles from "@/app/styles/StaticPages.module.css";

export const metadata = {
  title: "About Us",
  description: "Learn more about the team and mission behind the SEO Analyzer SaaS platform.",
};

export default function AboutPage() {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} gradient-text`}>About Us</h1>
        <p className={styles.subtitle}>Empowering website owners to rank better</p>
      </div>

      <div className={`${styles.card} glass-card`}>
        <div className={styles.content}>
          <p>
            At SEO Analyzer, our mission is simple: **demystify search engine optimization** and make advanced website auditing accessible to everyone. Whether you are a small business owner, a marketing professional, or a developer, our platform provides you with clear, actionable advice to help your site rank higher.
          </p>

          <h2>Who We Are</h2>
          <p>
            Founded in 2026, we are a small, passionate team of search marketers and web developers who believe that web metrics should be simple and transparent. We noticed that most SEO platforms are either overly complex enterprise tools or insecure, outdated checkers. We built SEO Analyzer to bridge that gap.
          </p>

          <h2>Our Platform</h2>
          <p>
            SEO Analyzer runs a comprehensive set of 16 core check audits on any page you submit. We inspect heading hierarchies, meta descriptions, image alternative tags, link structures, open graph details, and crawler-accessibility directives like `robots.txt` and sitemaps.
          </p>

          <h2>Our Commitment to Security</h2>
          <p>
            We take web safety seriously. Our infrastructure utilizes state-of-the-art secure routing, client-IP rate limiters, database-backed session revocation, and DNS-pinning safeguards. We protect both our servers and the sites we analyze from request spoofing and internal range access risks.
          </p>

          <h2>Connect With Us</h2>
          <p>
            We are constantly improving our engine. If you have feature suggestions, feedback, or business inquiries, feel free to reach out to us via our <a href="/contact" style={{ color: "var(--purple)", fontWeight: "600" }}>Contact Us</a> page or email us at team@seooptik.com.
          </p>
        </div>
      </div>
    </div>
  );
}

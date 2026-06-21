import Link from "next/link";
import UrlInput from "@/app/components/UrlInput";
import styles from "@/app/styles/Home.module.css";

const features = [
  {
    icon: "📝",
    title: "Title & Meta Analysis",
    description:
      "Check if your title tags and meta descriptions are optimized for search engines with proper length and keyword usage.",
  },
  {
    icon: "📐",
    title: "Heading Structure",
    description:
      "Verify your H1-H6 hierarchy is correct. Proper heading structure helps search engines understand your content.",
  },
  {
    icon: "🖼️",
    title: "Image Optimization",
    description:
      "Ensure all images have alt text for accessibility and SEO. Missing alt tags hurt your rankings.",
  },
  {
    icon: "🔗",
    title: "Link Analysis",
    description:
      "Count internal and external links. A healthy link structure helps search engines crawl and index your site.",
  },
  {
    icon: "📱",
    title: "Mobile Readiness",
    description:
      "Check viewport meta tags and mobile-friendly configuration. Google uses mobile-first indexing.",
  },
  {
    icon: "🌐",
    title: "Social Media Tags",
    description:
      "Verify Open Graph and Twitter Card tags for beautiful social media previews when your content is shared.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroBg}>
          <div className={styles.heroOrb1}></div>
          <div className={styles.heroOrb2}></div>
        </div>

        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          Free SEO Analysis Tool
        </div>

        <h1 className={styles.heroTitle}>
          Analyze Your Website&apos;s{" "}
          <span className="gradient-text">SEO Health</span>{" "}
          in Seconds
        </h1>

        <p className={styles.heroSubtitle}>
          Enter any URL and get a comprehensive SEO audit with actionable
          recommendations. Improve your search rankings today.
        </p>

        <div className={styles.heroInput}>
          <UrlInput />
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>16+</div>
            <div className={styles.heroStatLabel}>SEO Checks</div>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>Free</div>
            <div className={styles.heroStatLabel}>No Signup</div>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>Instant</div>
            <div className={styles.heroStatLabel}>Results</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features-section">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Features</span>
          <h2 className={styles.sectionTitle}>
            Everything You Need to{" "}
            <span className="gradient-text">Rank Higher</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Our analyzer checks every critical SEO factor so you know exactly
            what to fix.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} id="cta-section">
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Ready to Improve Your <span className="gradient-text">SEO?</span>
          </h2>
          <p className={styles.ctaSubtitle}>
            Start analyzing your website for free — no signup required.
          </p>
          <Link href="/analyzer" className="btn btn-primary btn-lg">
            🔍 Start Free Analysis
          </Link>
        </div>
      </section>
    </>
  );
}

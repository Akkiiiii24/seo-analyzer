import styles from "@/app/styles/StaticPages.module.css";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the SEO Analyzer support and sales teams.",
};

export default function ContactPage() {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} gradient-text`}>Contact Us</h1>
        <p className={styles.subtitle}>Get in touch. We usually reply within 24 hours.</p>
      </div>

      <ContactForm />
    </div>
  );
}

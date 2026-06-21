"use client";

import { useState } from "react";
import styles from "@/app/styles/StaticPages.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending email/form message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className={styles.contactGrid}>
      {/* Contact Form */}
      <div className={`${styles.card} glass-card`}>
        {submitted ? (
          <div className={styles.successMsg}>
            <h3>🎉 Thank You!</h3>
            <p style={{ marginTop: "var(--space-2)", color: "var(--text-primary)" }}>
              Your message has been sent successfully. Our team will get back to you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-secondary"
              style={{ marginTop: "var(--space-4)" }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Your Name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="How can we help?"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea}
                placeholder="Tell us what you need..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`${styles.submitBtn} btn btn-primary`}
            >
              {submitting ? "Sending..." : "🚀 Send Message"}
            </button>
          </form>
        )}
      </div>

      {/* Contact Info */}
      <div className={styles.infoCol}>
        <div className={`${styles.infoCard} glass-card`}>
          <h3 className={styles.infoTitle}>📍 Our Location</h3>
          <p className={styles.infoText}>
            SEO Analyzer SaaS Inc.<br />
            100 Tech Hub Suite<br />
            San Francisco, CA 94103
          </p>
        </div>

        <div className={`${styles.infoCard} glass-card`}>
          <h3 className={styles.infoTitle}>✉️ Direct Support</h3>
          <p className={styles.infoText}>
            General Inquiries: team@seooptik.com<br />
            Technical Support: support@seooptik.com<br />
            Billing support: billing@seooptik.com
          </p>
        </div>
      </div>
    </div>
  );
}

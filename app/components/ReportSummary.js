"use client";

import styles from "@/app/styles/ReportSummary.module.css";

const defaultStats = [
  { icon: "📝", label: "Title Tag", value: "—", color: "Purple" },
  { icon: "📋", label: "Meta Description", value: "—", color: "Blue" },
  { icon: "🔗", label: "Links Found", value: "—", color: "Cyan" },
  { icon: "🖼️", label: "Images", value: "—", color: "Green" },
  { icon: "📐", label: "Headings", value: "—", color: "Amber" },
  { icon: "⚡", label: "Issues Found", value: "—", color: "Red" },
];

export default function ReportSummary({ stats = defaultStats }) {
  return (
    <div className={styles.grid} id="report-summary">
      {stats.map((stat, index) => (
        <div key={index} className={styles.card}>
          <div className={`${styles.cardIcon} ${styles[`icon${stat.color}`]}`}>
            {stat.icon}
          </div>
          <div className={styles.cardValue}>{stat.value}</div>
          <div className={styles.cardLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

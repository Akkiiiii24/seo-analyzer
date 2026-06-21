"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/ScoreCard.module.css";

export default function ScoreCard({ score = 0, label = "SEO Score", size = "default" }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // SVG circle math
  const radius = size === "mini" ? 32 : 76;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine score tier
  const tier = score >= 80 ? "Good" : score >= 50 ? "Average" : "Poor";
  const tierLabel = score >= 80 ? "Excellent" : score >= 50 ? "Needs Work" : "Poor";

  useEffect(() => {
    // Animate the score counting up
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className={styles.scoreContainer} id="score-card">
      <div className={`${styles.scoreRing} ${size === "mini" ? styles.scoreMini : ""}`}>
        <svg className={styles.scoreSvg} viewBox={size === "mini" ? "0 0 72 72" : "0 0 160 160"}>
          <circle
            className={styles.scoreBgCircle}
            cx={size === "mini" ? 36 : 80}
            cy={size === "mini" ? 36 : 80}
            r={radius}
          />
          <circle
            className={`${styles.scoreCircle} ${styles[`score${tier}`]}`}
            cx={size === "mini" ? 36 : 80}
            cy={size === "mini" ? 36 : 80}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <div className={styles.scoreValue}>
          <span className={`${styles.scoreNumber} ${styles[`scoreNumber${tier}`]}`}>
            {animatedScore}
          </span>
          <span className={styles.scoreMax}>/ 100</span>
        </div>
      </div>
      {size !== "mini" && (
        <>
          <span className={styles.scoreLabel}>{label}</span>
          <span className={`${styles.scoreBadge} ${styles[`badge${tier}`]}`}>
            {tier === "Good" ? "✓" : tier === "Average" ? "⚠" : "✕"} {tierLabel}
          </span>
        </>
      )}
    </div>
  );
}

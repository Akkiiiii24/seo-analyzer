import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "SEO Analyzer — Free Website SEO Audit Tool",
    template: "%s | SEO Analyzer",
  },
  description:
    "Analyze any website's SEO health in seconds. Get actionable recommendations to improve your search engine rankings. Free SEO audit tool.",
  keywords: [
    "SEO analyzer",
    "website audit",
    "SEO checker",
    "search engine optimization",
    "SEO tool",
    "free SEO audit",
  ],
  openGraph: {
    title: "SEO Analyzer — Free Website SEO Audit Tool",
    description:
      "Analyze any website's SEO health in seconds. Get actionable recommendations.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { AuthProvider } from "@/app/context/AuthContext";
import Analytics from "@/app/components/Analytics";
import { Suspense } from "react";

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SEO Analyzer",
    "description":
      "Analyze any website's SEO health in seconds. Get actionable recommendations to improve your search engine rankings.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XDJLJ38QNE"
          nonce={nonce}
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XDJLJ38QNE');
            `,
          }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

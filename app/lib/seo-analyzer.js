/**
 * SEO Analyzer Engine
 *
 * This is the BRAIN of the application.
 * It fetches a webpage's HTML and runs a series of SEO checks.
 * Each check returns a name, status (pass/fail/warn), description, and optional value.
 *
 * The overall score is calculated as: (passed checks / total checks) * 100
 */

import * as cheerio from "cheerio";
import { isSafeUrl } from "@/app/lib/ssrf-filter";
import { safeFetch } from "@/app/lib/safe-fetch";

/**
 * Main analysis function.
 * @param {string} url - The URL to analyze
 * @returns {Promise<object>} - Complete SEO analysis report
 */
export async function analyzeSeo(url) {
  // SSRF check: prevent scanning loopback, private, and reserved subnets
  const safe = await isSafeUrl(url);
  if (!safe) {
    throw new Error("Access Denied: Target URL resolves to an internal or private address.");
  }

  // Step 1: Fetch the HTML
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Step 2: Run all checks
  const checks = [
    checkTitle($),
    checkMetaDescription($),
    checkH1($),
    checkHeadingHierarchy($),
    checkImageAlt($),
    checkLinks($, url),
    checkCanonical($),
    checkViewport($),
    checkLangAttribute($),
    checkOpenGraph($),
    checkTwitterCard($),
    checkFavicon($),
    await checkRobotsTxt(url),
    await checkSitemap(url),
    checkUrlStructure(url),
    checkCharset($),
  ];

  // Step 3: Calculate overall score
  const passed = checks.filter((c) => c.status === "pass").length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  // Step 4: Build summary statistics
  const title = $("title").text().trim() || null;
  const metaDesc = $('meta[name="description"]').attr("content") || null;
  const images = $("img").length;
  const imagesWithoutAlt = $("img:not([alt]), img[alt='']").length;
  const allLinks = $("a[href]").length;
  const headings = $("h1, h2, h3, h4, h5, h6").length;
  const issues = checks.filter((c) => c.status === "fail").length;

  const summary = [
    {
      icon: "📝",
      label: "Title Tag",
      value: title ? `${title.length} chars` : "Missing",
      color: title ? "Purple" : "Red",
    },
    {
      icon: "📋",
      label: "Meta Description",
      value: metaDesc ? `${metaDesc.length} chars` : "Missing",
      color: metaDesc ? "Blue" : "Red",
    },
    {
      icon: "🔗",
      label: "Links Found",
      value: String(allLinks),
      color: "Cyan",
    },
    {
      icon: "🖼️",
      label: "Images",
      value: `${images - imagesWithoutAlt}/${images} with alt`,
      color: imagesWithoutAlt === 0 ? "Green" : "Amber",
    },
    {
      icon: "📐",
      label: "Headings",
      value: String(headings),
      color: "Amber",
    },
    {
      icon: "⚡",
      label: "Issues Found",
      value: String(issues),
      color: issues === 0 ? "Green" : "Red",
    },
  ];

  return {
    url,
    score,
    checks,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}

// ============================================================
// Helper: Fetch a webpage
// ============================================================
async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await safeFetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOAnalyzerBot/1.0; +https://seoanalyzer.com)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// Individual SEO Checks
// ============================================================

function checkTitle($) {
  const title = $("title").text().trim();

  if (!title) {
    return {
      name: "Title Tag",
      status: "fail",
      description: "No <title> tag found. Every page needs a title for search engines.",
      value: null,
    };
  }

  if (title.length < 30) {
    return {
      name: "Title Tag",
      status: "warn",
      description: `Title is too short (${title.length} chars). Aim for 50-60 characters.`,
      value: title,
    };
  }

  if (title.length > 60) {
    return {
      name: "Title Tag",
      status: "warn",
      description: `Title is too long (${title.length} chars). Google typically shows 50-60 characters.`,
      value: title,
    };
  }

  return {
    name: "Title Tag",
    status: "pass",
    description: `Title is ${title.length} characters — within the ideal range.`,
    value: title,
  };
}

function checkMetaDescription($) {
  const desc = $('meta[name="description"]').attr("content")?.trim();

  if (!desc) {
    return {
      name: "Meta Description",
      status: "fail",
      description:
        "No meta description found. Add one to control how your page appears in search results.",
      value: null,
    };
  }

  if (desc.length < 120) {
    return {
      name: "Meta Description",
      status: "warn",
      description: `Meta description is short (${desc.length} chars). Aim for 150-160 characters.`,
      value: desc,
    };
  }

  if (desc.length > 160) {
    return {
      name: "Meta Description",
      status: "warn",
      description: `Meta description is long (${desc.length} chars). It may be truncated in search results.`,
      value: desc,
    };
  }

  return {
    name: "Meta Description",
    status: "pass",
    description: `Meta description is ${desc.length} characters — ideal length.`,
    value: desc,
  };
}

function checkH1($) {
  const h1s = $("h1");

  if (h1s.length === 0) {
    return {
      name: "H1 Heading",
      status: "fail",
      description: "No <h1> tag found. Every page should have exactly one H1.",
      value: null,
    };
  }

  if (h1s.length > 1) {
    return {
      name: "H1 Heading",
      status: "warn",
      description: `Found ${h1s.length} H1 tags. Best practice is to have exactly one per page.`,
      value: h1s
        .map((_, el) => $(el).text().trim())
        .get()
        .join(" | "),
    };
  }

  const h1Text = h1s.first().text().trim();
  return {
    name: "H1 Heading",
    status: "pass",
    description: "Page has exactly one H1 heading.",
    value: h1Text,
  };
}

function checkHeadingHierarchy($) {
  const headings = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const level = parseInt(el.tagName.charAt(1));
    headings.push(level);
  });

  if (headings.length === 0) {
    return {
      name: "Heading Hierarchy",
      status: "fail",
      description: "No headings found. Use H1-H6 to structure your content.",
      value: null,
    };
  }

  // Check if headings skip levels (e.g., H1 → H3, skipping H2)
  let skipped = false;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      skipped = true;
      break;
    }
  }

  if (skipped) {
    return {
      name: "Heading Hierarchy",
      status: "warn",
      description:
        "Headings skip levels (e.g., H1 → H3). Use a sequential hierarchy for better accessibility.",
      value: headings.map((h) => `H${h}`).join(" → "),
    };
  }

  return {
    name: "Heading Hierarchy",
    status: "pass",
    description: `${headings.length} headings with proper hierarchy.`,
    value: headings.map((h) => `H${h}`).join(" → "),
  };
}

function checkImageAlt($) {
  const images = $("img");
  const total = images.length;

  if (total === 0) {
    return {
      name: "Image Alt Text",
      status: "pass",
      description: "No images found on the page.",
      value: null,
    };
  }

  const missingAlt = $("img:not([alt]), img[alt='']").length;

  if (missingAlt === 0) {
    return {
      name: "Image Alt Text",
      status: "pass",
      description: `All ${total} images have alt text.`,
      value: `${total}/${total} images have alt`,
    };
  }

  if (missingAlt === total) {
    return {
      name: "Image Alt Text",
      status: "fail",
      description: `None of the ${total} images have alt text. Alt text is crucial for accessibility and SEO.`,
      value: `0/${total} images have alt`,
    };
  }

  return {
    name: "Image Alt Text",
    status: "warn",
    description: `${missingAlt} of ${total} images are missing alt text.`,
    value: `${total - missingAlt}/${total} images have alt`,
  };
}

function checkLinks($, pageUrl) {
  const links = $("a[href]");
  let internal = 0;
  let external = 0;
  let broken = 0;

  try {
    const pageHost = new URL(pageUrl).hostname;

    links.each((_, el) => {
      const href = $(el).attr("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return;
      }

      try {
        const linkUrl = new URL(href, pageUrl);
        if (linkUrl.hostname === pageHost) {
          internal++;
        } else {
          external++;
        }
      } catch {
        broken++;
      }
    });
  } catch {
    // URL parsing failed
  }

  const total = internal + external;

  if (total === 0) {
    return {
      name: "Links",
      status: "warn",
      description: "No links found on the page.",
      value: null,
    };
  }

  return {
    name: "Links",
    status: "pass",
    description: `Found ${internal} internal and ${external} external links.`,
    value: `${internal} internal, ${external} external${broken > 0 ? `, ${broken} broken` : ""}`,
  };
}

function checkCanonical($) {
  const canonical = $('link[rel="canonical"]').attr("href");

  if (!canonical) {
    return {
      name: "Canonical URL",
      status: "warn",
      description:
        "No canonical URL set. This helps prevent duplicate content issues.",
      value: null,
    };
  }

  return {
    name: "Canonical URL",
    status: "pass",
    description: "Canonical URL is set.",
    value: canonical,
  };
}

function checkViewport($) {
  const viewport = $('meta[name="viewport"]').attr("content");

  if (!viewport) {
    return {
      name: "Viewport Meta Tag",
      status: "fail",
      description:
        "No viewport meta tag. Your page won't display correctly on mobile devices.",
      value: null,
    };
  }

  return {
    name: "Viewport Meta Tag",
    status: "pass",
    description: "Viewport meta tag is set for mobile responsiveness.",
    value: viewport,
  };
}

function checkLangAttribute($) {
  const lang = $("html").attr("lang");

  if (!lang) {
    return {
      name: "Language Attribute",
      status: "warn",
      description:
        'No lang attribute on <html>. Add one (e.g., lang="en") for accessibility and SEO.',
      value: null,
    };
  }

  return {
    name: "Language Attribute",
    status: "pass",
    description: `Language is set to "${lang}".`,
    value: lang,
  };
}

function checkOpenGraph($) {
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDescription = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");

  const present = [ogTitle, ogDescription, ogImage].filter(Boolean).length;

  if (present === 0) {
    return {
      name: "Open Graph Tags",
      status: "fail",
      description:
        "No Open Graph tags found. These control how your page appears when shared on social media.",
      value: null,
    };
  }

  if (present < 3) {
    const missing = [];
    if (!ogTitle) missing.push("og:title");
    if (!ogDescription) missing.push("og:description");
    if (!ogImage) missing.push("og:image");
    return {
      name: "Open Graph Tags",
      status: "warn",
      description: `Missing: ${missing.join(", ")}. Add all three for best social media previews.`,
      value: `${present}/3 tags present`,
    };
  }

  return {
    name: "Open Graph Tags",
    status: "pass",
    description: "All essential Open Graph tags are present.",
    value: `Title: ${ogTitle}`,
  };
}

function checkTwitterCard($) {
  const twitterCard = $('meta[name="twitter:card"]').attr("content");

  if (!twitterCard) {
    return {
      name: "Twitter Card",
      status: "warn",
      description:
        "No Twitter card meta tag. Add one for better Twitter/X previews.",
      value: null,
    };
  }

  return {
    name: "Twitter Card",
    status: "pass",
    description: `Twitter card type: "${twitterCard}".`,
    value: twitterCard,
  };
}

function checkFavicon($) {
  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href");

  if (!favicon) {
    return {
      name: "Favicon",
      status: "warn",
      description:
        "No favicon link found. A favicon helps with brand recognition in browser tabs.",
      value: null,
    };
  }

  return {
    name: "Favicon",
    status: "pass",
    description: "Favicon is set.",
    value: favicon,
  };
}

async function checkRobotsTxt(url) {
  try {
    const origin = new URL(url).origin;
    const response = await safeFetch(`${origin}/robots.txt`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const text = await response.text();
      if (text.includes("User-agent") || text.includes("user-agent")) {
        return {
          name: "robots.txt",
          status: "pass",
          description: "robots.txt file exists and contains directives.",
          value: `${origin}/robots.txt`,
        };
      }
    }

    return {
      name: "robots.txt",
      status: "warn",
      description:
        "robots.txt not found or empty. Add one to guide search engine crawlers.",
      value: null,
    };
  } catch {
    return {
      name: "robots.txt",
      status: "warn",
      description: "Could not check robots.txt (request failed).",
      value: null,
    };
  }
}

async function checkSitemap(url) {
  try {
    const origin = new URL(url).origin;
    const response = await safeFetch(`${origin}/sitemap.xml`, {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const text = await response.text();
      if (text.includes("<urlset") || text.includes("<sitemapindex")) {
        return {
          name: "Sitemap",
          status: "pass",
          description: "XML sitemap found.",
          value: `${origin}/sitemap.xml`,
        };
      }
    }

    return {
      name: "Sitemap",
      status: "warn",
      description:
        "No XML sitemap found. A sitemap helps search engines discover all your pages.",
      value: null,
    };
  } catch {
    return {
      name: "Sitemap",
      status: "warn",
      description: "Could not check sitemap (request failed).",
      value: null,
    };
  }
}

function checkUrlStructure(url) {
  try {
    const parsedUrl = new URL(url);

    // Check for HTTPS
    if (parsedUrl.protocol !== "https:") {
      return {
        name: "URL Structure",
        status: "fail",
        description:
          "Site is not using HTTPS. HTTPS is a ranking factor and essential for user trust.",
        value: url,
      };
    }

    // Check for clean URL (no excessive parameters)
    const paramCount = parsedUrl.searchParams.toString().split("&").filter(Boolean).length;
    if (paramCount > 3) {
      return {
        name: "URL Structure",
        status: "warn",
        description: `URL has ${paramCount} query parameters. Clean URLs are better for SEO.`,
        value: url,
      };
    }

    return {
      name: "URL Structure",
      status: "pass",
      description: "URL uses HTTPS and has a clean structure.",
      value: url,
    };
  } catch {
    return {
      name: "URL Structure",
      status: "fail",
      description: "Invalid URL format.",
      value: url,
    };
  }
}

function checkCharset($) {
  const charset =
    $('meta[charset]').attr("charset") ||
    $('meta[http-equiv="Content-Type"]').attr("content");

  if (!charset) {
    return {
      name: "Character Encoding",
      status: "warn",
      description:
        'No character encoding declared. Add <meta charset="UTF-8"> for proper text rendering.',
      value: null,
    };
  }

  return {
    name: "Character Encoding",
    status: "pass",
    description: "Character encoding is declared.",
    value: typeof charset === "string" ? charset : "Set via Content-Type",
  };
}

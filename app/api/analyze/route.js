/**
 * POST /api/analyze
 *
 * Receives a URL in the request body, verifies rate limits/plan limits,
 * and returns a full SEO analysis report.
 *
 * Request body: { url: "https://example.com" }
 * Response: { url, score, checks, summary, analyzedAt }
 */

import { analyzeSeo } from "@/app/lib/seo-analyzer";
import { getSession } from "@/app/lib/session";
import prisma from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";

export async function POST(request) {
  try {
    const session = await getSession();

    // Limit checks for guest (unauthenticated) users (Centralized DB-backed)
    if (!session) {
      const clientIp =
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
        "anonymous";
      const todayDateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const rateLimit = await prisma.rateLimit.findUnique({
        where: { ip: clientIp },
      });

      if (rateLimit) {
        if (rateLimit.date === todayDateStr) {
          if (rateLimit.count >= 3) {
            return Response.json(
              {
                error: "Limit Reached",
                message:
                  "Guest users are limited to 3 free analyses per day. Please sign up or upgrade to Pro for unlimited reports.",
              },
              { status: 403 }
            );
          }

          // Increment count
          await prisma.rateLimit.update({
            where: { ip: clientIp },
            data: { count: rateLimit.count + 1 },
          });
        } else {
          // Reset count for new day
          await prisma.rateLimit.update({
            where: { ip: clientIp },
            data: { count: 1, date: todayDateStr },
          });
        }
      } else {
        // Create initial record for guest IP
        await prisma.rateLimit.create({
          data: {
            ip: clientIp,
            count: 1,
            date: todayDateStr,
          },
        });
      }
    }

    // Limit checks for logged-in users on Free Plan
    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { plan: true },
      });

      if (user && user.plan !== "pro") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayReportsCount = await prisma.report.count({
          where: {
            userId: session.userId,
            createdAt: {
              gte: startOfToday,
            },
          },
        });

        if (todayReportsCount >= 3) {
          return Response.json(
            {
              error: "Limit Reached",
              message:
                "You have reached your limit of 3 free reports today. Upgrade to Pro for unlimited analyses.",
            },
            { status: 403 }
          );
        }
      }
    }

    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== "string") {
      return Response.json(
        { error: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return Response.json(
        { error: "Invalid URL format. Please include http:// or https://" },
        { status: 400 }
      );
    }

    // Run the SEO analysis
    const report = await analyzeSeo(url);

    return Response.json(report);
  } catch (error) {
    logger.error("Analysis failed", {
      url: url || "unknown",
      error: error.message,
      stack: error.stack,
      userId: session?.userId,
    });

    // Provide user-friendly error messages
    if (error.name === "AbortError") {
      return Response.json(
        { error: "Request timed out. The website took too long to respond." },
        { status: 408 }
      );
    }

    if (error.cause?.code === "ENOTFOUND") {
      return Response.json(
        { error: "Website not found. Please check the URL and try again." },
        { status: 404 }
      );
    }

    return Response.json(
      {
        error:
          "Failed to analyze the website. It may be blocking automated requests or the URL may be incorrect.",
      },
      { status: 500 }
    );
  }
}

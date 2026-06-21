import prisma from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";

export async function GET(request) {
  // Verify this is called by Vercel Cron, not random public requests
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Delete old reports for free tier users only
    const deletedReports = await prisma.report.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        user: {
          plan: "free",
        },
      },
    });

    // Clean up expired sessions
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    logger.info("Cron cleanup executed successfully", {
      deletedReportsCount: deletedReports.count,
      deletedSessionsCount: deletedSessions.count,
    });

    return Response.json({
      deletedReports: deletedReports.count,
      deletedSessions: deletedSessions.count,
    });
  } catch (error) {
    logger.error("Error executing cron cleanup", {
      error: error.message,
      stack: error.stack,
    });
    return Response.json({ error: "Internal processing error" }, { status: 500 });
  }
}

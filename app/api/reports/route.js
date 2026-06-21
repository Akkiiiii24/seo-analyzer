/**
 * GET /api/reports — Fetch all reports for the logged-in user
 * POST /api/reports — Save a new report
 */

import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { logger } from "@/app/lib/logger";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      score: true,
      createdAt: true,
    },
  });

  return Response.json({ reports });
}

export async function POST(request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, score, data } = body;

    if (!url || score === undefined || !data) {
      return Response.json(
        { error: "Missing required fields: url, score, data" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        url,
        score,
        data: typeof data === "string" ? data : JSON.stringify(data),
        userId: session.userId,
      },
    });

    return Response.json({ report: { id: report.id } }, { status: 201 });
  } catch (error) {
    logger.error("Error saving report", {
      error: error.message,
      stack: error.stack,
      userId: session?.userId,
    });
    return Response.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reports/[id] — Fetch a single report by ID
 */

import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }

  // Only allow users to see their own reports
  if (report.userId !== session.userId) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  return Response.json({
    report: {
      ...report,
      data: JSON.parse(report.data),
    },
  });
}

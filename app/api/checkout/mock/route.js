/**
 * POST /api/checkout/mock
 *
 * Simulates a successful checkout completion for local testing.
 * Updates the user's plan to "pro".
 */

import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function POST() {
  // SECURITY: Block in production
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { plan: "pro" },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error simulating mock checkout:", error);
    return Response.json(
      { error: "Failed to complete mock upgrade" },
      { status: 500 }
    );
  }
}

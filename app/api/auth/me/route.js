/**
 * GET /api/auth/me — Returns the current user's session info
 * Used by client components to check if a user is logged in and their plan
 */

import { getSession } from "@/app/lib/session";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
      },
    });

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({ user });
  } catch (error) {
    console.error("Error fetching user session info:", error);
    return Response.json({ user: null });
  }
}

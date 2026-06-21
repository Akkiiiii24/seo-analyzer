/**
 * POST /api/checkout
 *
 * Creates a Razorpay Payment Link for subscription upgrade.
 * If RAZORPAY_KEY_ID is missing, falls back to simulated mock checkout.
 */

import { razorpay } from "@/app/lib/razorpay";
import { getSession } from "@/app/lib/session";
import { logger } from "@/app/lib/logger";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fallback to simulated mock checkout if Razorpay is not configured
  if (!razorpay) {
    console.log("Razorpay not configured. Falling back to mock checkout flow.");
    return Response.json({ url: "/checkout/mock" });
  }

  try {
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const paymentLink = await razorpay.paymentLink.create({
      amount: 900, // INR 9.00 (900 paise)
      currency: "INR",
      accept_partial: false,
      description: "SEO Analyzer Pro Plan Upgrade",
      customer: {
        name: session.userEmail?.split("@")[0] || "User",
        email: session.userEmail || "user@example.com",
      },
      notify: {
        sms: false,
        email: true,
      },
      reminder_enable: false,
      notes: {
        userId: session.userId,
      },
      callback_url: `${appUrl}/dashboard?success=true`,
      callback_method: "get",
    });

    return Response.json({ url: paymentLink.short_url });
  } catch (error) {
    logger.error("Error creating Razorpay payment link", {
      error: error.message,
      stack: error.stack,
      userId: session?.userId,
    });
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

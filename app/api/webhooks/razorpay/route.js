/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay Webhook endpoint. Receives events from Razorpay when:
 * - A payment link is paid -> upgrades user to "pro"
 */

import crypto from "crypto";
import prisma from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";

export async function POST(request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("Razorpay webhook secret not configured in environment variables");
    return Response.json(
      { error: "Razorpay webhook secret not configured" },
      { status: 400 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    logger.error("Missing x-razorpay-signature header in webhook request");
    return Response.json(
      { error: "Missing signature header" },
      { status: 400 }
    );
  }

  // Validate the signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) {
    logger.error("Razorpay webhook signature verification failed");
    return Response.json(
      { error: "Signature mismatch" },
      { status: 400 }
    );
  }

  // Signature is valid. Parse payload.
  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    logger.error("Failed to parse Razorpay webhook payload", { error: err.message });
    return Response.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  try {
    const eventType = event.event;
    logger.info("Received Razorpay webhook event", { event: eventType });

    switch (eventType) {
      case "payment_link.paid": {
        const paymentLinkObj = event.payload?.payment_link?.entity;
        if (!paymentLinkObj) {
          logger.warn("payment_link.paid event missing payment_link entity");
          break;
        }

        const notes = paymentLinkObj.notes || {};
        const userId = notes.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "pro" },
          });
          logger.info("User upgraded to Pro plan via Razorpay webhook", { userId });
        } else {
          logger.warn("payment_link.paid event missing userId in notes", { paymentLinkObj });
        }
        break;
      }

      default:
        logger.info("Unhandled Razorpay event type", { event: eventType });
    }

    return Response.json({ received: true });
  } catch (error) {
    logger.error("Error processing Razorpay webhook", {
      error: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}

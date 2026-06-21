/**
 * Authentication Server Actions
 *
 * Server Actions are functions that run on the server.
 * They're perfect for handling sensitive operations like
 * password hashing and database queries.
 *
 * "use server" means this code NEVER runs in the browser.
 */

"use server";

import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";
import { sendWelcomeEmail } from "@/app/lib/email";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { logger } from "@/app/lib/logger";

/**
 * Sign up a new user
 */
export async function signup(prevState, formData) {
  // --- IP Rate Limiting for Signup Prevention ---
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-real-ip") ||
      headersList.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
      "anonymous";
    const todayDateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const rateLimitKey = `signup:${clientIp}`;

    const limitRecord = await prisma.rateLimit.findUnique({
      where: { ip: rateLimitKey },
    });

    if (limitRecord) {
      if (limitRecord.date === todayDateStr) {
        if (limitRecord.count >= 5) {
          return { error: "Too many registration attempts. Please try again tomorrow." };
        }
        await prisma.rateLimit.update({
          where: { ip: rateLimitKey },
          data: { count: limitRecord.count + 1 },
        });
      } else {
        await prisma.rateLimit.update({
          where: { ip: rateLimitKey },
          data: { count: 1, date: todayDateStr },
        });
      }
    } else {
      await prisma.rateLimit.create({
        data: {
          ip: rateLimitKey,
          count: 1,
          date: todayDateStr,
        },
      });
    }
  } catch (err) {
    logger.error("Signup rate limiter error", {
      error: err.message,
      stack: err.stack,
      ip: clientIp || "unknown",
    });
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  // --- Validation ---
  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // --- Check if email already exists ---
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // --- Hash password and create user ---
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // --- Create session, send welcome email, and redirect ---
  await createSession(user.id, user.name, user.email);
  
  // Non-blocking welcome email log
  sendWelcomeEmail(user.email, user.name).catch((err) =>
    logger.error("Error sending welcome email", {
      error: err.message,
      stack: err.stack,
      email: user.email,
    })
  );

  redirect("/dashboard");
}

/**
 * Log in an existing user
 */
export async function login(prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  const failResponse = async (errorMsg) => {
    // Artificial 1-second delay to mitigate automated brute force credential stuffing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: errorMsg };
  };

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  // --- Find the user ---
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return await failResponse("Invalid email or password.");
  }

  // --- Verify password ---
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return await failResponse("Invalid email or password.");
  }

  // --- Create session and redirect ---
  await createSession(user.id, user.name, user.email);
  redirect("/dashboard");
}

/**
 * Log out the current user
 */
export async function logout() {
  await deleteSession();
  redirect("/");
}

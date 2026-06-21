/**
 * Session Management
 *
 * Uses JWT tokens stored in HttpOnly cookies and tracked in the database
 * to allow server-side session revocation.
 */

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";
import crypto from "crypto";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey || secretKey.length < 32) {
  throw new Error(
    "FATAL CONFIGURATION ERROR: SESSION_SECRET environment variable is missing, or is too short (must be at least 32 characters long)."
  );
}

const encodedKey = new TextEncoder().encode(secretKey);
const COOKIE_NAME = "__Host-session";

// Hash the token for database storage (never store raw JWT)
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Encrypt user data into a signed JWT token
 */
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(encodedKey);
}

/**
 * Decrypt and verify a JWT token
 */
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a new session (set the cookie and store hash in DB)
 */
export async function createSession(userId, userName, userEmail) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, userName, userEmail, expiresAt });

  // Store hash in database for revocation tracking
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(session),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true, // Required for __Host- prefix
    expires: expiresAt,
    sameSite: "lax",
    path: "/", // Required for __Host- prefix
  });
}

/**
 * Get the current session (read from cookie and verify against DB)
 * Returns null if no valid or active session exists
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload) return null;

  try {
    // Check if session has been revoked in database
    const dbSession = await prisma.session.findUnique({
      where: { tokenHash: hashToken(session) },
    });

    if (!dbSession || dbSession.revokedAt !== null) {
      return null; // Session was revoked or doesn't exist
    }
  } catch (error) {
    console.error("Error verifying session in database:", error);
    return null;
  }

  return {
    userId: payload.userId,
    userName: payload.userName,
    userEmail: payload.userEmail,
  };
}

/**
 * Delete the session (remove cookie and mark database record as revoked)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (session) {
    try {
      // Revoke in database so stolen cookies stop working
      await prisma.session.updateMany({
        where: { tokenHash: hashToken(session) },
        data: { revokedAt: new Date() },
      });
    } catch (error) {
      console.error("Error revoking session in database:", error);
    }
  }

  cookieStore.delete(COOKIE_NAME);
}

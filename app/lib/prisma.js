/**
 * Prisma Client Singleton for Prisma 7
 *
 * In Prisma 7, driver adapters are required for direct database connections.
 * The client is imported from the generated output path.
 */

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  // PRISMA 7 NOTE: Direct database connections require a driver adapter.
  // Standard PostgreSQL (Supabase / pg) configuration is enabled by default.
  // To use Neon Serverless Postgres instead, the user can swap this with @prisma/adapter-neon.
  const connectionString = process.env.DATABASE_URL || "postgresql://user:password@host/dbname?sslmode=require";
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  globalForPrisma.prisma = new PrismaClient({ adapter });
}

prisma = globalForPrisma.prisma;

export default prisma;

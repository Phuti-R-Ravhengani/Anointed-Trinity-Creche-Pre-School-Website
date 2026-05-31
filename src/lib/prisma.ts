// Database initialization file
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Ensure we create a single instance of PrismaClient across the app
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"],
} as any);

export { prisma };

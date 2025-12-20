import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma configuration optimized for Cloudflare Edge Runtime
// Handle missing DATABASE_URL gracefully for build-time operations
const getPrismaClient = (): PrismaClient | null => {
  if (!process.env.DATABASE_URL) {
    // During build time, DATABASE_URL might not be available
    // Return null to prevent Prisma from initializing with invalid config
    return null;
  }

  try {
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      // Use connection pooling URL for better performance on Cloudflare
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  } catch (error) {
    console.warn('Failed to initialize Prisma Client:', error);
    return null;
  }
};

const prismaInstance = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production" && prismaInstance) {
  globalForPrisma.prisma = prismaInstance;
}

// Export prisma, but it might be null during build time
export const prisma = prismaInstance as PrismaClient;

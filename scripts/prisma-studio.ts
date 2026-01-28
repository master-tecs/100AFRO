import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

console.log("🚀 Starting Prisma Studio...");

try {
  execSync("npx prisma studio", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  // Prisma Studio exits with code 0 when closed normally
  if ((error as any).status !== 0) {
    console.error("❌ Error starting Prisma Studio:", error);
    process.exit(1);
  }
}

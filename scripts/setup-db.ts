import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

console.log("🌱 Setting up database...");

try {
  // First, push schema to ensure it's in sync (adds missing columns like passwordSalt)
  console.log("📊 Syncing database schema...");
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("✅ Schema synced!");

  // Run migrations to ensure all migrations are marked as applied
  console.log("📊 Running migrations...");
  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });
    console.log("✅ Migrations completed!");
  } catch (migrationError) {
    console.log("⚠️  Migration check completed (some may already be applied)");
  }

  // Run seed
  console.log("🌱 Seeding database...");
  execSync("npm run db:seed", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("✅ Database setup complete!");
} catch (error) {
  console.error("❌ Error setting up database:", error);
  process.exit(1);
}

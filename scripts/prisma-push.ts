import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

try {
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  process.exit(1);
}

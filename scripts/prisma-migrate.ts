import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

// Get the migration name from command line args
const args = process.argv.slice(2);
const migrationName = args.find(arg => arg.startsWith('--name'))?.split('=')[1] || args[args.indexOf('--name') + 1];

try {
  const command = migrationName 
    ? `npx prisma migrate dev --name ${migrationName}`
    : "npx prisma migrate dev";
  
  execSync(command, {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  process.exit(1);
}

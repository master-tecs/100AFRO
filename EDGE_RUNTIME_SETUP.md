# Edge Runtime Setup for Cloudflare Pages

## ⚠️ Important: Prisma and Edge Runtime

Your application now uses Edge Runtime for all API routes and dynamic pages, which is required for Cloudflare Pages deployment. However, **Prisma Client does not work with Edge Runtime by default** because it requires Node.js APIs.

## Solution: Use Prisma Data Proxy (Prisma Accelerate)

To make Prisma work with Edge Runtime on Cloudflare Pages, you need to use **Prisma Data Proxy** (now called Prisma Accelerate). This creates a connection pooler that works with Edge Runtime.

### Step 1: Set up Prisma Accelerate

1. **Sign up for Prisma Accelerate**:
   - Go to [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
   - Sign up for a free account
   - Create a new project

2. **Get your Accelerate connection string**:
   - In the Prisma Accelerate dashboard, you'll get a connection string like:
     ```
     prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
     ```

3. **Update your environment variables**:
   - In Cloudflare Pages → Settings → Environment Variables
   - Add or update `DATABASE_URL` with your Prisma Accelerate connection string
   - Keep your original Neon connection string as `DIRECT_URL` (for migrations)

### Step 2: Update Prisma Client Configuration

Update `lib/prisma.ts` to use Prisma Accelerate:

```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 3: Install Prisma Accelerate Extension

```bash
npm install @prisma/extension-accelerate
```

### Step 4: Update package.json

Add the Accelerate extension to your dependencies:

```json
{
  "dependencies": {
    "@prisma/extension-accelerate": "^1.0.0"
  }
}
```

## Alternative: Use Connection Pooling

If you prefer not to use Prisma Accelerate, you can try using Neon's connection pooler directly. However, this may not work reliably with Edge Runtime.

1. **Use Neon's connection pooler URL**:
   - Your `DATABASE_URL` should end with `-pooler` instead of the direct connection
   - Example: `postgresql://user:pass@ep-xxx-pooler.neon.tech/db`

2. **Note**: This approach may still have issues with Edge Runtime, as Prisma Client uses Node.js APIs that aren't available in Edge Runtime.

## Current Status

✅ All API routes have `export const runtime = 'edge'`  
✅ Dynamic pages have `export const runtime = 'edge'`  
⚠️ Prisma Client needs Prisma Accelerate to work with Edge Runtime

## Next Steps

1. Set up Prisma Accelerate (recommended)
2. Update `lib/prisma.ts` to use the Accelerate extension
3. Install `@prisma/extension-accelerate`
4. Update environment variables in Cloudflare Pages
5. Redeploy

## Resources

- [Prisma Accelerate Documentation](https://www.prisma.io/docs/accelerate)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Cloudflare Pages with Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/)


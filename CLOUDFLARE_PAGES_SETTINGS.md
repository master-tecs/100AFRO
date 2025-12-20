# Cloudflare Pages Build Settings

## Required Build Configuration

When setting up your project in Cloudflare Pages Dashboard, use these exact settings:

### Build Settings

- **Framework preset**: `None` (custom build)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (leave empty or use `/`)
- **Node version**: `22.x` or latest LTS

### Deploy Settings

- **Deploy command**: LEAVE EMPTY ❌
  - Do NOT set this to `npx wrangler deploy`
  - Do NOT set this to `wrangler pages deploy`
  - Cloudflare Pages automatically deploys the build output

### Why This Matters

- `npm run build:cloudflare` runs `@cloudflare/next-on-pages` which creates the correct output structure
- `npm run build` only runs Next.js build and doesn't create the Pages-compatible output
- Cloudflare Pages automatically handles deployment - no deploy command needed

### Current Issue

If you're seeing this error:
```
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
For Pages, please run `wrangler pages deploy` instead.
```

This means:
1. ❌ Build command is set to `npm run build` (should be `npm run build:cloudflare`)
2. ❌ Deploy command is set to `npx wrangler deploy` (should be empty)

### How to Fix

1. Go to Cloudflare Dashboard → Your Pages Project → Settings → Builds & deployments
2. Update Build command to: `npm run build:cloudflare`
3. Remove/clear the Deploy command field (leave it empty)
4. Save and redeploy


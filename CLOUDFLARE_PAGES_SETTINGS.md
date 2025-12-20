# Cloudflare Pages Build Settings

⚠️ **IMPORTANT**: You MUST configure these settings in the Cloudflare Dashboard. They cannot be set in code.

## Required Build Configuration

When setting up your project in Cloudflare Pages Dashboard, use these exact settings:

### Where to Find These Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → Your Project → **Settings**
3. Click on **Builds & deployments** section
4. Edit the configuration fields

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

### How to Fix (Step by Step)

1. **Go to Cloudflare Dashboard**

   - Visit: https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → Click on your project

2. **Open Settings**

   - Click on **Settings** tab at the top
   - Scroll down to **Builds & deployments** section

3. **Update Build Command**

   - Find the **Build command** field
   - Change from: `npm run build` ❌
   - Change to: `npm run build:cloudflare` ✅
   - Click **Save**

4. **Remove Deploy Command**

   - Find the **Deploy command** field (if it exists)
   - **DELETE/REMOVE** everything in this field
   - Leave it completely **EMPTY** ✅
   - Do NOT put `wrangler pages deploy` here
   - Click **Save**

5. **Verify Build Output Directory**

   - Build output directory should be: `.vercel/output/static`

6. **Trigger New Deployment**
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest failed deployment
   - OR push a new commit to trigger a new build

### Current Error in Your Logs

If you see this in your build logs:

```
Executing user build command: npm run build
```

This confirms the dashboard still has `npm run build` set. You need to change it to `npm run build:cloudflare`.

If you see this:

```
Executing user deploy command: npx wrangler deploy
```

This confirms there's a deploy command set. You need to remove it completely.

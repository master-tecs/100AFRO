# Deploying 100AFRO to Cloudflare Pages

This guide will help you deploy your Next.js application to Cloudflare Pages with your custom domain `100afro.com`.

## Prerequisites

- ✅ Cloudflare account with `100afro.com` domain
- ✅ Neon PostgreSQL database (already configured)
- ✅ Cloudinary account (already configured)
- ✅ GitHub repository (recommended for automatic deployments)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare deployment"
   git push origin main
   ```

## Step 2: Configure Environment Variables

You'll need to set these environment variables in Cloudflare Pages:

### Required Variables

1. **Database**

   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - Format: `postgresql://user:password@host/database?sslmode=require`

2. **NextAuth.js**

   - `NEXTAUTH_URL` - Your production URL: `https://100afro.com`
   - `NEXTAUTH_SECRET` - Generate a random secret:
     ```bash
     openssl rand -base64 32
     ```

3. **Cloudinary**

   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

4. **OAuth Providers (Optional)**
   - `GOOGLE_CLIENT_ID` - If using Google OAuth
   - `GOOGLE_CLIENT_SECRET` - If using Google OAuth
   - `GITHUB_ID` - If using GitHub OAuth
   - `GITHUB_SECRET` - If using GitHub OAuth

## Step 3: Deploy via Cloudflare Dashboard

### Option A: Connect GitHub Repository

1. **Go to Cloudflare Dashboard**

   - Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click on **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**

2. **Connect Repository**

   - Select your GitHub account
   - Choose the repository: `100afro-african-entertainment-hub`
   - Click **Begin setup**

3. **Configure Build Settings**

   - **Framework preset**: `None` (custom build)
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (or leave empty)
   - **Node version**: `22.x` (or latest LTS)
   - **Deploy command**: (LEAVE EMPTY - Cloudflare Pages deploys automatically)

   **Important**: Do NOT set a deploy command. Cloudflare Pages automatically deploys the build output. If you see a deploy command field, leave it empty or remove it.

   **Note**: The `.npmrc` file in the repository is configured to use `legacy-peer-deps=true` to handle dependency conflicts.

4. **Add Environment Variables**

   - Scroll down to **Environment variables**
   - Add all the variables listed in Step 2
   - Make sure to add them for **Production** environment

5. **Deploy**
   - Click **Save and Deploy**
   - Wait for the build to complete

### Option B: Deploy via Wrangler CLI

1. **Install Wrangler** (if not already installed):

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

3. **Build the project**:

   ```bash
   npm run build:cloudflare
   ```

4. **Deploy**:
   ```bash
   wrangler pages deploy .vercel/output/static --project-name=100afro
   ```

## Step 4: Configure Custom Domain

1. **In Cloudflare Dashboard**:

   - Go to your Pages project
   - Click on **Custom domains**
   - Click **Set up a custom domain**
   - Enter: `100afro.com`
   - Click **Continue**

2. **DNS Configuration**:

   - Cloudflare will automatically configure DNS
   - If needed, add a CNAME record:
     - **Name**: `@` (or `www`)
     - **Target**: Your Pages domain (e.g., `100afro.pages.dev`)
     - **Proxy status**: Proxied (orange cloud)

3. **SSL/TLS**:
   - Cloudflare will automatically provision SSL certificates
   - Ensure SSL/TLS encryption mode is set to **Full** or **Full (strict)**

## Step 5: Post-Deployment Setup

1. **Run Database Migrations**:

   ```bash
   npm run db:push
   # or
   npm run db:migrate
   ```

2. **Seed the Database** (if needed):

   ```bash
   npm run db:seed
   ```

3. **Create Admin User** (if not already created):
   ```bash
   npm run create-admin
   ```

## Step 6: Verify Deployment

1. **Visit your site**: `https://100afro.com`
2. **Test admin login**: `https://100afro.com/admin/login`
   - Email: `admin@100afro.com`
   - Password: `12345678`
3. **Check API routes**: Test blog posts, search, etc.

## Troubleshooting

### Build Failures

- **Error: Module not found**: Ensure all dependencies are in `package.json`
- **Error: Prisma Client**: Run `npm run postinstall` or `npx prisma generate`
- **Error: Environment variables**: Double-check all env vars are set in Cloudflare

### Runtime Errors

- **Database connection issues**: Verify `DATABASE_URL` is correct and uses connection pooling
- **NextAuth errors**: Ensure `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set
- **Image upload failures**: Verify Cloudinary credentials

### Performance Optimization

1. **Enable Cloudflare CDN**: Already enabled by default
2. **Enable Caching**: Configure cache rules in Cloudflare
3. **Image Optimization**: Consider using Cloudflare Images or keep Cloudinary

## Important Notes

⚠️ **Prisma on Cloudflare Edge**:

- Prisma works on Cloudflare, but you may need to use connection pooling
- Consider using Neon's connection pooler URL (ends with `-pooler`)
- Example: `postgresql://user:pass@ep-xxx-pooler.neon.tech/db`

⚠️ **NextAuth.js**:

- Ensure `NEXTAUTH_URL` matches your production domain exactly
- Session storage uses JWT (configured in `authOptions`)

⚠️ **File Uploads**:

- File uploads go directly to Cloudinary
- No file storage needed on Cloudflare

## Alternative: Using OpenNext (Recommended)

The `@cloudflare/next-on-pages` package is deprecated. Consider migrating to [OpenNext](https://opennext.js.org/cloudflare) for better support:

```bash
npm install -D open-next
```

Then update your build script:

```json
"build:cloudflare": "open-next build"
```

## Support

For issues specific to:

- **Cloudflare Pages**: [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **Next.js on Cloudflare**: [Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- **Prisma**: [Prisma Docs](https://www.prisma.io/docs)

---

**Deployment Status**: ✅ Ready for deployment
**Last Updated**: December 2024

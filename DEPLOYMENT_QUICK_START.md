# Quick Start: Deploy to Cloudflare Pages

## 🚀 Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create Application** → **Pages**
3. Click **Connect to Git**
4. Select your GitHub repository
5. Configure build settings:
   - **Framework preset**: `None` (or `Next.js (Static HTML Export)`)
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (leave empty)

### 3. Add Environment Variables

In Cloudflare Pages → Your Project → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://... (your Neon connection string)
NEXTAUTH_URL=https://100afro.com
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Configure Custom Domain

1. In your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `100afro.com`
4. Cloudflare will auto-configure DNS and SSL

### 5. Deploy!

Click **Save and Deploy** and wait for the build to complete.

## ✅ Verify Deployment

- Visit: `https://100afro.com`
- Test admin: `https://100afro.com/admin/login`
  - Email: `admin@100afro.com`
  - Password: `12345678`

## 📝 Important Notes

- **Database**: Use Neon's connection pooler URL (ends with `-pooler`)
- **NextAuth**: `NEXTAUTH_URL` must match your production domain exactly
- **Build Time**: First build may take 5-10 minutes

## 🆘 Troubleshooting

See `CLOUDFLARE_DEPLOY.md` for detailed troubleshooting guide.


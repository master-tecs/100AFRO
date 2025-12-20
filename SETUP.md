# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to `.env.local` as `DATABASE_URL`

### 3. Configure Environment Variables

Create `.env.local` file:

```env
# Database (from Neon)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# OAuth (optional - for authentication)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npm run db:seed
```

### 5. Set Up Full-Text Search (Optional but Recommended)

```bash
# Run the SQL migration for full-text search
psql $DATABASE_URL -f prisma/migrations/add_fulltext_search.sql
```

Or manually in Neon console:
1. Go to SQL Editor
2. Copy contents from `prisma/migrations/add_fulltext_search.sql`
3. Run the SQL

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Database Connection Issues
- Make sure your Neon connection string includes `?sslmode=require`
- Check that your IP is whitelisted in Neon (if required)

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations

### NextAuth Issues
- Make sure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL

### Cloudinary Issues
- Verify your API credentials in Cloudinary dashboard
- Check that your Cloudinary account is active

## Next Steps

1. **Customize Content**: Update blog posts, videos, and charts
2. **Configure OAuth**: Set up Google/GitHub OAuth for user authentication
3. **Deploy**: Deploy to Vercel or your preferred platform
4. **Add Caching**: Implement Redis caching for better performance (as mentioned in plan)

## Production Deployment

1. Set all environment variables in your hosting platform
2. Run `npm run build` to test the build
3. Deploy to Vercel (recommended) or your platform
4. Set up custom domain
5. Configure CDN for images (Cloudinary handles this)


# 100AFRO - African Entertainment Hub

A full-stack Next.js application for African entertainment content, featuring blogs, videos, charts, and alot more.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Media Storage**: Cloudinary
- **Email Service**: Resend
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Features

- ✅ Server-Side Rendering (SSR) and Static Site Generation (SSG)
- ✅ Full-text search using PostgreSQL
- ✅ Blog posts with comments
- ✅ Video gallery with YouTube integration
- ✅ Music charts
- ✅ User authentication
- ✅ Image upload with Cloudinary
- ✅ SEO optimized with metadata and sitemap
- ✅ Professional newsletter subscription with email confirmation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Resend account (for newsletter emails)
- NextAuth providers (Google, GitHub, etc.)

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (Resend) - Required for newsletter functionality
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="100AFRO <newsletter@100afro.com>" # Optional, defaults to newsletter@100afro.com
NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Optional, defaults to NEXTAUTH_URL or localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

3. **Set up the database**:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run db:seed
```

4. **Set up full-text search** (optional but recommended):

```bash
# Run the full-text search migration
psql $DATABASE_URL -f prisma/migrations/add_fulltext_search.sql
```

5. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/              # API routes
│   ├── auth/         # NextAuth configuration
│   ├── blog/         # Blog API endpoints
│   ├── comments/     # Comments API
│   ├── search/       # Search API
│   └── ...
├── components/       # React components
├── blog/            # Blog pages
├── videos/          # Video gallery
├── charts/          # Music charts
└── ...
prisma/
├── schema.prisma    # Database schema
├── seed.ts         # Seed script
└── migrations/      # Database migrations
lib/
├── prisma.ts       # Prisma client
├── cloudinary.ts   # Cloudinary config
└── utils.ts       # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses the following main models:

- `User` - User accounts and authentication
- `BlogPost` - Blog articles
- `Comment` - Comments on blog posts
- `Video` - Video content
- `ChartEntry` - Music chart entries
- `Artist` - Featured artists
- `TrendingTopic` - Trending topics
- `Poll` - Community polls
- `NewsletterSubscriber` - Newsletter subscribers with email verification

## Full-Text Search

The application uses PostgreSQL's native full-text search capabilities. The search index is created via the migration script in `prisma/migrations/add_fulltext_search.sql`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:

- Set all environment variables
- Run `npm run build` to test the build
- Configure your database connection
- Set up Cloudinary and OAuth providers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

# 100AFRO

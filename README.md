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
- ✅ Music charts (Apple Music-powered live charts + DB fallback)
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

# Apple Music (Live charts)
# No API keys required! Uses Apple's free RSS feeds.

# Daily Fact (On This Day in History)
# Used by /api/admin/daily-fact/refresh for cron automation
DAILY_FACT_REFRESH_SECRET=""
# Optional but recommended user agents (some public APIs expect this)
WIKIDATA_USER_AGENT="100AFRO/1.0 (admin@100afro.com)"
MUSICBRAINZ_USER_AGENT="100AFRO/1.0 (admin@100afro.com)"

# Email Service (Resend) - Required for newsletter functionality
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="100AFRO <newsletter@100afro.com>" # Optional, defaults to newsletter@100afro.com
RESEND_WEBHOOK_SECRET="your-webhook-secret" # Optional, for verifying incoming email webhooks
INCOMING_EMAIL_FORWARD_TO="your-email@example.com" # Optional, forward all incoming emails to this address
NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Optional, defaults to NEXTAUTH_URL or localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# AI Service Configuration (for automated content generation)
AI_PROVIDER=openai  # Default: openai (future: anthropic)
OPENAI_API_KEY="sk-..."  # Required for article generation
OPENAI_MODEL="gpt-4"  # Default: gpt-4 (can use gpt-3.5-turbo for cost savings)
ANTHROPIC_API_KEY="sk-ant-..."  # Optional, for future Anthropic Claude support

# Research Agent Configuration (for automated topic discovery)
TWITTER_BEARER_TOKEN="..."  # Optional, for Twitter/X API v2 (get from developer.twitter.com)
RESEARCH_CRON_SECRET="..."  # Secret for protecting cron endpoint (generate random string)
AFRICAN_NEWS_RSS_FEEDS="https://www.bellanaija.com/feed/,https://www.pulse.ng/feed"  # Optional, comma-separated RSS feed URLs
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

5. **Set up incoming email receiving** (optional):

   If you want to receive emails sent to your domain:
   
   a. **Enable receiving in Resend**: Go to your Resend dashboard → Domains → Enable Receiving
   
   b. **Configure MX record**: Add the MX record provided by Resend to your DNS:
      ```
      Type: MX
      Name: @
      Value: inbound-smtp.us-east-1.amazonaws.com
      Priority: 10
      ```
   
   c. **Set up webhook in Resend**:
      - Go to Resend Dashboard → Webhooks
      - Add webhook URL: `https://yourdomain.com/api/emails/inbound`
      - Select event: `email.inbound` or `email.received`
      - Copy the webhook secret and add it to `.env.local` as `RESEND_WEBHOOK_SECRET`
   
   d. **Optional**: Set `INCOMING_EMAIL_FORWARD_TO` in `.env.local` to forward all incoming emails to a single address
   
   e. **Run database migration** to create the incoming emails table:
      ```bash
      npx prisma migrate dev --name add_incoming_emails
      ```

6. **Run the development server**:

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

## Apple Music Charts Attribution

The charts page uses Apple Music RSS feeds to display **metadata** (track/album titles, artists, artwork) and links back to Apple Music.
We do **not** host or redistribute audio. Charts are powered by Apple's free RSS feeds - no API keys required!

## Daily Fact (On This Day in History) Automation

The homepage "On This Day in History" block is backed by the `OnThisDayFact` table and can be refreshed daily automatically using Vercel Cron Jobs.

### Automatic Daily Updates (Vercel Cron)

The project includes a `vercel.json` configuration that sets up automatic daily fact refresh at 5:00 AM UTC every day.

**Setup Steps:**

1. **Add CRON_SECRET environment variable in Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add `CRON_SECRET` with a random string (at least 16 characters)
   - Use a password generator like [1Password](https://1password.com/password-generator/) to create a secure secret
   - Make sure to add it to **Production** environment

2. **Deploy your project:**
   - The cron job is configured in `vercel.json`
   - After deployment, Vercel will automatically create the cron job
   - You can view it in: Settings → Cron Jobs

3. **Verify the cron job:**
   - Go to Settings → Cron Jobs in your Vercel dashboard
   - You should see a cron job for `/api/admin/daily-fact/refresh`
   - It will run daily at 5:00 AM UTC (`0 5 * * *`)

### Manual Refresh

You can also manually refresh the daily fact:
- **Via Admin Dashboard:** Use the "Refresh Daily Fact" button in the Stats/Analytics tab
- **Via API:** `POST /api/admin/daily-fact/refresh` (requires admin authentication or `DAILY_FACT_REFRESH_SECRET`)

### Attribution
Facts are sourced from Wikidata (and optionally enriched with MusicBrainz links). Include attribution if you display source links.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

# 100AFRO

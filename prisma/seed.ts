import {
  PrismaClient,
  BlogCategory,
  VideoCategory,
  ChartTrend,
  ChartType,
  UserRole,
} from "@prisma/client";
import {
  BLOG_POSTS,
  VIDEOS,
  CHART_DATA,
  COMMENTS,
  FEATURED_ARTISTS,
  TRENDING_TOPICS,
  CURRENT_POLL,
} from "../data";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash admin password
  const adminPassword = await bcrypt.hash("12345678", 10);

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@100afro.com" },
    update: {
      password: adminPassword, // Update password if user exists
    },
    create: {
      email: "admin@100afro.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create author users from blog posts
  const authorEmails = new Set(
    BLOG_POSTS.map(
      (post) => post.author.toLowerCase().replace(/\s+/g, ".") + "@100afro.com"
    )
  );
  const authorMap = new Map<string, string>();

  for (const email of authorEmails) {
    const name = email
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        role: UserRole.AUTHOR,
      },
    });
    authorMap.set(name, user.id);
  }

  // Create blog posts
  console.log("📝 Creating blog posts...");
  for (const post of BLOG_POSTS) {
    const authorName = post.author;
    const authorId = authorMap.get(authorName) || adminUser.id;

    const categoryMap: Record<string, BlogCategory> = {
      Music: BlogCategory.Music,
      Culture: BlogCategory.Culture,
      Lifestyle: BlogCategory.Lifestyle,
      News: BlogCategory.News,
      Industry: BlogCategory.Industry,
    };

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content:
          post.content ||
          post.excerpt +
            " " +
            "This is a detailed article about " +
            post.title +
            ". " +
            post.excerpt,
        authorId,
        category: categoryMap[post.category] || BlogCategory.News,
        featured: post.featured || false,
        imageUrl: post.imageUrl,
        createdAt: parseDate(post.date),
      },
    });
  }

  // Create videos
  console.log("🎥 Creating videos...");
  for (const video of VIDEOS) {
    const categoryMap: Record<string, VideoCategory> = {
      "Music Video": VideoCategory.Music_Video,
      Dance: VideoCategory.Dance,
      Interview: VideoCategory.Interview,
      Vlog: VideoCategory.Vlog,
      Performance: VideoCategory.Performance,
    };

    await prisma.video.upsert({
      where: { youtubeId: video.youtubeId },
      update: {},
      create: {
        title: video.title,
        youtubeId: video.youtubeId,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: video.views,
        date: video.date,
        category: categoryMap[video.category] || VideoCategory.Vlog,
        featured: video.featured || false,
        tags: video.tags || [],
      },
    });
  }

  // Create chart entries
  console.log("📊 Creating chart entries...");

  // Clear existing chart entries first
  await prisma.chartEntry.deleteMany({});

  // Songs
  for (const song of CHART_DATA.songs) {
    await prisma.chartEntry.create({
      data: {
        rank: song.rank,
        title: song.title,
        artist: song.artist,
        coverUrl: song.coverUrl,
        trend: song.trend as ChartTrend,
        lastWeek: song.lastWeek,
        peak: song.peak,
        weeksOnChart: song.weeksOnChart,
        type: ChartType.song,
        previewUrl: song.previewUrl,
        spotifyLink: song.externalLinks?.spotify,
        appleMusicLink: song.externalLinks?.appleMusic,
      },
    });
  }

  // Albums
  for (const album of CHART_DATA.albums) {
    await prisma.chartEntry.create({
      data: {
        rank: album.rank,
        title: album.title,
        artist: album.artist,
        coverUrl: album.coverUrl,
        trend: album.trend as ChartTrend,
        lastWeek: album.lastWeek,
        peak: album.peak,
        weeksOnChart: album.weeksOnChart,
        type: ChartType.album,
        spotifyLink: album.externalLinks?.spotify,
        appleMusicLink: album.externalLinks?.appleMusic,
      },
    });
  }

  // Create artists
  console.log("🎤 Creating artists...");
  for (const artist of FEATURED_ARTISTS) {
    await prisma.artist.upsert({
      where: { name: artist.name },
      update: {},
      create: {
        name: artist.name,
        imageUrl: artist.imageUrl,
        genre: artist.genre,
        socialLink: artist.socialLink,
      },
    });
  }

  // Create trending topics
  console.log("🔥 Creating trending topics...");
  for (const topic of TRENDING_TOPICS) {
    await prisma.trendingTopic.upsert({
      where: { name: topic.name },
      update: {},
      create: {
        name: topic.name,
        count: topic.count,
        imageUrl: topic.imageUrl,
      },
    });
  }

  // Create poll
  console.log("📊 Creating poll...");
  await prisma.poll.upsert({
    where: { id: CURRENT_POLL.id },
    update: {},
    create: {
      id: CURRENT_POLL.id,
      question: CURRENT_POLL.question,
      options: CURRENT_POLL.options,
      active: true,
    },
  });

  // Create comments
  console.log("💬 Creating comments...");
  for (const comment of COMMENTS) {
    // Find post by matching the old ID to slug (we'll use the first 9 posts)
    const postIndex = parseInt(comment.postId) - 1;
    if (postIndex >= 0 && postIndex < BLOG_POSTS.length) {
      const postSlug = BLOG_POSTS[postIndex].slug;
      const post = await prisma.blogPost.findUnique({
        where: { slug: postSlug },
      });

      if (post) {
        try {
          await prisma.comment.create({
            data: {
              postId: post.id,
              author: comment.author,
              content: comment.content,
              likes: comment.likes,
              createdAt: parseRelativeDate(comment.date),
            },
          });
        } catch (error) {
          // Skip if comment already exists
          console.log(`Comment already exists for post ${postSlug}`);
        }
      }
    }
  }

  console.log("✅ Seed completed!");
}

function parseDate(dateStr: string): Date {
  // Parse dates like "Oct 12, 2023"
  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const month = months[parts[0]];
    const day = parseInt(parts[1].replace(",", ""));
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  return new Date();
}

function parseRelativeDate(dateStr: string): Date {
  // Parse relative dates like "2 hours ago", "1 day ago"
  const now = new Date();
  const match = dateStr.match(/(\d+)\s*(hour|day|week|month)s?\s*ago/i);

  if (match) {
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === "hour") {
      now.setHours(now.getHours() - amount);
    } else if (unit === "day") {
      now.setDate(now.getDate() - amount);
    } else if (unit === "week") {
      now.setDate(now.getDate() - amount * 7);
    } else if (unit === "month") {
      now.setMonth(now.getMonth() - amount);
    }
  }

  return now;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

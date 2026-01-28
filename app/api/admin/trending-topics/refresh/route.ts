import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { rateLimit } from "@/lib/rate-limit";

function monthRangeUtc(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return { start, end };
}

function isAuthorizedBySecret(req: NextRequest) {
  const secret = process.env.DAILY_FACT_REFRESH_SECRET;
  if (!secret) return false;
  const qs = req.nextUrl.searchParams.get("secret");
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
  return qs === secret || bearer === secret;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    const secretOk = isAuthorizedBySecret(request);

    if (!secretOk) {
      if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const rlKey = user?.id || (secretOk ? "secret" : "unknown");
    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 10,
      keyPrefix: "admin:trending-topics:refresh",
      key: rlKey,
    });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const now = new Date();
    const { start, end } = monthRangeUtc(now);

    // 1) Pull monthly metrics with tags + image to build tag scores
    const metricsRows = await prisma.blogPostMetricsDaily.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      include: {
        post: {
          select: {
            tags: true,
            imageUrl: true,
            status: true,
            publishAt: true,
          },
        },
      },
    });

    // 2) Pull approved comments for the month (for extra weighting)
    const comments = await prisma.comment.findMany({
      where: {
        status: "APPROVED",
        createdAt: { gte: start, lt: end },
      },
      select: {
        postId: true,
      },
    });
    const commentCountsByPost: Record<string, number> = {};
    for (const c of comments) {
      commentCountsByPost[c.postId] = (commentCountsByPost[c.postId] || 0) + 1;
    }

    // Build post->tag list and tag scores
    const tagUniqueViews: Record<string, number> = {};
    const tagScore: Record<string, number> = {};
    const tagBestImage: Record<string, { imageUrl: string; score: number }> = {};

    for (const row of metricsRows) {
      const post = row.post;

      // Only count published posts that are actually eligible
      const publishAt = post.publishAt ? new Date(post.publishAt) : null;
      if (post.status !== "PUBLISHED") continue;
      if (publishAt && publishAt > now) continue;

      const unique = row.uniqueViews || 0;
      const commentCount = commentCountsByPost[row.postId] || 0;

      for (const rawTag of post.tags || []) {
        const tag = String(rawTag || "").trim();
        if (!tag) continue;

        tagUniqueViews[tag] = (tagUniqueViews[tag] || 0) + unique;
        // Score weights: views (1.0) + comments (0.5)
        const inc = unique + commentCount * 0.5;
        tagScore[tag] = (tagScore[tag] || 0) + inc;

        const candidateScore = unique;
        const current = tagBestImage[tag];
        if (!current || candidateScore > current.score) {
          tagBestImage[tag] = { imageUrl: post.imageUrl, score: candidateScore };
        }
      }
    }

    const ranked = Object.keys(tagScore)
      .map((tag) => ({
        tag,
        score: tagScore[tag] || 0,
        uniqueViews: tagUniqueViews[tag] || 0,
        imageUrl: tagBestImage[tag]?.imageUrl || "https://picsum.photos/seed/trending/600/600",
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Replace the set on refresh (keeps homepage behavior unchanged)
    await prisma.$transaction(async (tx) => {
      await tx.trendingTopic.deleteMany({});
      if (ranked.length > 0) {
        await tx.trendingTopic.createMany({
          data: ranked.map((r) => ({
            name: r.tag,
            count: `${Math.round(r.uniqueViews).toLocaleString()} views`,
            imageUrl: r.imageUrl,
          })),
        });
      }
    });

    return NextResponse.json({
      success: true,
      month: now.getUTCMonth() + 1,
      year: now.getUTCFullYear(),
      topics: ranked,
    });
  } catch (error) {
    console.error("Error refreshing trending topics:", error);
    return NextResponse.json({ error: "Failed to refresh trending topics" }, { status: 500 });
  }
}


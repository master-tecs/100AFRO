import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isProbablyBot(ua: string | null) {
  if (!ua) return true;
  return /(bot|crawler|spider|headless|uptimerobot|pingdom|statuscake)/i.test(ua);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ua = request.headers.get("user-agent");
    if (isProbablyBot(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    const { slug } = await params;
    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 60,
      keyPrefix: "views:blog",
      key: slug,
    });
    if (!rl.ok) {
      return new NextResponse(null, { status: 204 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const now = new Date();
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        OR: [{ publishAt: null }, { publishAt: { lte: now } }],
      },
      select: { id: true },
    });

    if (!post) {
      return new NextResponse(null, { status: 204 });
    }

    const cookieName = `pv_${post.id}`;
    const lastSeen = request.cookies.get(cookieName)?.value || null;
    const lastSeenMs = lastSeen ? Number.parseInt(lastSeen, 10) : NaN;
    const isUnique = !Number.isFinite(lastSeenMs) || now.getTime() - lastSeenMs >= 24 * 60 * 60 * 1000;

    const date = startOfUtcDay(now);

    await prisma.blogPostMetricsDaily.upsert({
      where: {
        postId_date: {
          postId: post.id,
          date,
        },
      },
      create: {
        postId: post.id,
        date,
        pageviews: 1,
        uniqueViews: isUnique ? 1 : 0,
      },
      update: {
        pageviews: { increment: 1 },
        uniqueViews: isUnique ? { increment: 1 } : undefined,
      },
    });

    const res = NextResponse.json({ ok: true, unique: isUnique });
    if (isUnique) {
      res.cookies.set(cookieName, String(now.getTime()), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }
    return res;
  } catch (error) {
    console.error("Error recording view:", error);
    return new NextResponse(null, { status: 204 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { rateLimit } from "@/lib/rate-limit";
import { fetchWikidataMusicFacts } from "@/lib/wikidata";

function todayUtc() {
  const d = new Date();
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
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
      keyPrefix: "admin:daily-fact:refresh",
      key: rlKey,
    });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { month, day } = todayUtc();
    const facts = await fetchWikidataMusicFacts({ month, day, limit: 25 });

    // Upsert facts, keeping the latest updatedAt as “winner” for display.
    const sourceName = "MusicBrainz/Wikidata";

    const results = [];
    for (const f of facts) {
      if (f.externalId) {
        const upserted = await prisma.onThisDayFact.upsert({
          where: { externalId: f.externalId },
          update: {
            month,
            day,
            year: f.year ?? null,
            text: f.text,
            sourceName,
            sourceUrl: f.sourceUrl || null,
          },
          create: {
            month,
            day,
            year: f.year ?? null,
            text: f.text,
            sourceName,
            sourceUrl: f.sourceUrl || null,
            externalId: f.externalId,
          },
        });
        results.push(upserted);
      } else {
        const created = await prisma.onThisDayFact.create({
          data: {
            month,
            day,
            year: f.year ?? null,
            text: f.text,
            sourceName,
            sourceUrl: f.sourceUrl || null,
            externalId: null,
          },
        });
        results.push(created);
      }
    }

    // Pick the latest one
    const latest = await prisma.onThisDayFact.findFirst({
      where: { month, day },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      month,
      day,
      imported: results.length,
      latest,
    });
  } catch (error) {
    console.error("Error refreshing daily fact:", error);
    return NextResponse.json({ error: "Failed to refresh daily fact" }, { status: 500 });
  }
}


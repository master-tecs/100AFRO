import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { ChartTrend, ChartType } from "@prisma/client";
import { getNewReleases, getTopSongs } from "@/lib/spotify";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function parseCountry(v: string | null): "NG" | "GH" | "ZA" {
  if (v === "GH" || v === "ZA" || v === "NG") return v;
  return "NG";
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 10,
      keyPrefix: "admin:charts:refresh",
      key: user.id,
    });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const country = parseCountry(request.nextUrl.searchParams.get("country"));

    const [songs, albums] = await Promise.all([
      getTopSongs(country),
      getNewReleases(country),
    ]);

    // Store country/source in existing optional columns to avoid schema change:
    // - previewUrl: use as "country" marker (e.g., "NG")
    // - appleMusicLink: use as "source" marker (e.g., "spotify")
    // This preserves compatibility without migrations; if you want a cleaner schema,
    // we can add explicit fields later.
    const source = "spotify";

    await prisma.$transaction(async (tx) => {
      // Clear previous synced entries for this country/source
      await tx.chartEntry.deleteMany({
        where: {
          appleMusicLink: source,
          previewUrl: country,
        },
      });

      // Insert songs
      if (songs.length > 0) {
        await tx.chartEntry.createMany({
          data: songs.map((s) => ({
            rank: s.rank,
            title: s.title,
            artist: s.artist,
            coverUrl: s.coverUrl,
            trend: ChartTrend.same,
            lastWeek: null,
            peak: s.rank,
            weeksOnChart: 1,
            type: ChartType.song,
            previewUrl: country,
            spotifyLink: s.spotifyLink,
            appleMusicLink: source,
          })),
        });
      }

      // Insert albums (not a true chart; we rank by listing order)
      if (albums.length > 0) {
        await tx.chartEntry.createMany({
          data: albums.map((a) => ({
            rank: a.rank,
            title: a.title,
            artist: a.artist,
            coverUrl: a.coverUrl,
            trend: ChartTrend.new,
            lastWeek: null,
            peak: a.rank,
            weeksOnChart: 1,
            type: ChartType.album,
            previewUrl: country,
            spotifyLink: a.spotifyLink,
            appleMusicLink: source,
          })),
        });
      }
    });

    return NextResponse.json({
      success: true,
      country,
      source,
      counts: { songs: songs.length, albums: albums.length },
    });
  } catch (error) {
    console.error("Error refreshing charts:", error);
    return NextResponse.json({ error: "Failed to refresh charts" }, { status: 500 });
  }
}


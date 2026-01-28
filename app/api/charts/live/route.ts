import { NextRequest, NextResponse } from "next/server";
import { getNewReleases, getTopSongs } from "@/lib/spotify";

export const runtime = "nodejs";

function parseCountry(v: string | null): "NG" | "GH" | "ZA" {
  if (v === "GH" || v === "ZA" || v === "NG") return v;
  return "NG";
}

export async function GET(request: NextRequest) {
  try {
    const country = parseCountry(request.nextUrl.searchParams.get("country"));

    const [songs, albums] = await Promise.all([
      getTopSongs(country),
      getNewReleases(country),
    ]);

    return NextResponse.json({
      country,
      source: "spotify",
      attribution: "Charts data from Spotify",
      songs,
      albums,
      cachedTtlMinutes: 15,
    });
  } catch (error) {
    console.error("Error fetching Spotify live charts:", error);
    return NextResponse.json(
      { error: "Failed to fetch live charts" },
      { status: 500 }
    );
  }
}


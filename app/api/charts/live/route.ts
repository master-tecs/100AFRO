import { NextRequest, NextResponse } from "next/server";
import { getNewReleases, getTopSongs } from "@/lib/itunes";

export const runtime = "nodejs";

function parseCountry(v: string | null): "NG" | "GH" | "ZA" {
  if (v === "GH" || v === "ZA" || v === "NG") return v;
  return "NG";
}

export async function GET(request: NextRequest) {
  try {
    const country = parseCountry(request.nextUrl.searchParams.get("country"));

    const [songs, albums] = await Promise.all([
      getTopSongs(country).catch((err) => {
        console.error(`Error fetching top songs for ${country}:`, err);
        return [];
      }),
      getNewReleases(country).catch((err) => {
        console.error(`Error fetching new releases for ${country}:`, err);
        return [];
      }),
    ]);

    // Return data even if empty, so the page can show fallback
    return NextResponse.json({
      country,
      source: "itunes",
      attribution: "Charts data from Apple Music",
      songs: songs || [],
      albums: albums || [],
      cachedTtlMinutes: 15,
    });
  } catch (error: any) {
    console.error("Error fetching iTunes live charts:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch live charts",
        message: error?.message || "Unknown error",
        songs: [],
        albums: [],
      },
      { status: 500 }
    );
  }
}


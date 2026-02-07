import { NextRequest, NextResponse } from "next/server";
import {
  getChannelIdFromHandle,
  fetchChannelVideos,
} from "@/lib/youtube-api";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const maxResults = parseInt(searchParams.get("maxResults") || "50", 10);
    const pageToken = searchParams.get("pageToken") || undefined;

    // Get channel ID from handle
    const channelId = await getChannelIdFromHandle(apiKey, "@100AFRO");
    if (!channelId) {
      return NextResponse.json(
        { error: "Could not find channel @100AFRO" },
        { status: 404 }
      );
    }

    // Fetch videos from YouTube
    const response = await fetchChannelVideos(
      apiKey,
      channelId,
      maxResults,
      pageToken
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch videos",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

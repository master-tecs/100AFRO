import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import {
  getChannelIdFromHandle,
  fetchChannelVideos,
  youtubeVideoToDbFormat,
} from "@/lib/youtube-api";

export async function POST(request: NextRequest) {
  try {
    // Check authentication (admin only)
    const user = await getUser(request);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const dbUser = await prisma?.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    // Get channel ID from handle
    const channelId = await getChannelIdFromHandle(apiKey, "@100AFRO");
    if (!channelId) {
      return NextResponse.json(
        { error: "Could not find channel @100AFRO" },
        { status: 404 }
      );
    }

    // Fetch videos from YouTube
    let allVideos: any[] = [];
    let nextPageToken: string | undefined;
    let totalFetched = 0;

    do {
      const response = await fetchChannelVideos(
        apiKey,
        channelId,
        50,
        nextPageToken
      );

      allVideos = allVideos.concat(response.videos);
      nextPageToken = response.nextPageToken;
      totalFetched += response.videos.length;

      // Limit to first 200 videos to avoid rate limits
      if (totalFetched >= 200) {
        break;
      }
    } while (nextPageToken);

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Sync videos to database
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const video of allVideos) {
      try {
        const dbData = youtubeVideoToDbFormat(video);

        // Try to find existing video by youtubeId
        const existing = await prisma.video.findUnique({
          where: { youtubeId: video.youtubeId },
        });

        if (existing) {
          // Update existing video
          // Try to include publishedAt if the field exists
          const updateData: any = {
            title: dbData.title,
            thumbnailUrl: dbData.thumbnailUrl,
            duration: dbData.duration,
            views: dbData.views,
            date: dbData.date,
            // Don't update category if manually set
          };
          
          // Only include publishedAt if the field exists in the schema
          try {
            await prisma.video.update({
              where: { youtubeId: video.youtubeId },
              data: {
                ...updateData,
                publishedAt: dbData.publishedAt,
              },
            });
          } catch (error: any) {
            // If publishedAt doesn't exist, update without it
            if (error.message?.includes('publishedAt')) {
              await prisma.video.update({
                where: { youtubeId: video.youtubeId },
                data: updateData,
              });
            } else {
              throw error;
            }
          }
          updated++;
        } else {
          // Create new video
          // Try to include publishedAt if the field exists
          const createData: any = {
            youtubeId: dbData.youtubeId,
            title: dbData.title,
            thumbnailUrl: dbData.thumbnailUrl,
            duration: dbData.duration,
            views: dbData.views,
            date: dbData.date,
            category: dbData.category as any, // Default category
            tags: [],
          };
          
          try {
            await prisma.video.create({
              data: {
                ...createData,
                publishedAt: dbData.publishedAt,
              },
            });
          } catch (error: any) {
            // If publishedAt doesn't exist, create without it
            if (error.message?.includes('publishedAt')) {
              await prisma.video.create({
                data: createData,
              });
            } else {
              throw error;
            }
          }
          created++;
        }
      } catch (error) {
        console.error(`Error syncing video ${video.youtubeId}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        fetched: totalFetched,
        created,
        updated,
        errors,
      },
      message: `Synced ${totalFetched} videos: ${created} created, ${updated} updated, ${errors} errors`,
    });
  } catch (error: any) {
    console.error("Error syncing YouTube videos:", error);
    return NextResponse.json(
      {
        error: "Failed to sync videos",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

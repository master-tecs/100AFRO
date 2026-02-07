import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { VideoCategory } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    // Validate category if provided
    if (body.category && !Object.values(VideoCategory).includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Check if video exists
    const existing = await prisma.video.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};
    if (body.category !== undefined) {
      updateData.category = body.category;
    }
    if (body.featured !== undefined) {
      updateData.featured = body.featured;
    }
    if (body.tags !== undefined) {
      updateData.tags = body.tags;
    }

    // Update video
    const updated = await prisma.video.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      video: updated,
    });
  } catch (error: any) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      {
        error: "Failed to update video",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch video",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

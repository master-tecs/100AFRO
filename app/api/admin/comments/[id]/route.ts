import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { CommentStatus } from "@prisma/client";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const moderateSchema = z.object({
  status: z.nativeEnum(CommentStatus),
  reason: z.string().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(request, { windowMs: 60_000, max: 120, keyPrefix: "admin:comments:moderate", key: user.id });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = moderateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: {
        status: parsed.data.status,
        moderatedAt: new Date(),
        moderatedById: user.id,
        moderationReason: parsed.data.reason || null,
      },
      include: {
        post: { select: { id: true, slug: true, title: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error moderating comment:", error);
    return NextResponse.json({ error: "Failed to moderate comment" }, { status: 500 });
  }
}


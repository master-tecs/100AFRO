import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Rate limiting to prevent abuse
    const rl = rateLimit(request, {
      windowMs: 60_000, // 1 minute
      max: 20, // 20 likes per minute
      keyPrefix: 'comments:like',
      key: request.ip || 'anonymous',
    });

    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many likes. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Check if comment exists and is approved
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { id: true, status: true, likes: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Comment is not approved' },
        { status: 403 }
      );
    }

    // Atomically increment likes
    const updated = await prisma.comment.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        likes: true,
      },
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes,
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

function looksLikeSpam(input: { author: string; content: string }) {
  const author = (input.author || '').trim();
  const content = (input.content || '').trim();
  const text = `${author} ${content}`.toLowerCase();

  // Use a simple score so we don't block normal short comments like "Nice!".
  // Hold for review when score >= 2.
  let score = 0;

  // Basic URL counting (strong signal)
  const urlMatches = text.match(/https?:\/\/\S+|www\.\S+/g) || [];
  if (urlMatches.length >= 2) score += 2;
  else if (urlMatches.length === 1) score += 1;

  // Obvious spam keywords (strong signal)
  const keywords = [
    'crypto',
    'forex',
    'bitcoin',
    'investment',
    'earn money',
    'work from home',
    'airdrop',
    'giveaway',
    'loan',
    'casino',
    'betting',
  ];
  if (keywords.some((k) => text.includes(k))) score += 2;

  // Repeated characters (medium signal)
  if (/(.)\1{9,}/.test(content)) score += 1;

  // Extremely short content (weak signal)
  if (content.length < 3) score += 1;

  return score >= 2;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId, status: 'APPROVED' },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, { windowMs: 60_000, max: 5, keyPrefix: "comments:post" });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many comments. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { postId, author, content, authorId } = body;

    if (!postId || !author || !content) {
      return NextResponse.json(
        { error: 'postId, author, and content are required' },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const pending = looksLikeSpam({ author, content });
    const created = await prisma.comment.create({
      data: {
        postId,
        author,
        content,
        authorId: authorId || null,
        status: pending ? 'PENDING' : 'APPROVED',
      },
    });

    return NextResponse.json(
      {
        pending,
        approved: !pending,
        message: pending
          ? 'Thanks! Your comment was received and is being reviewed.'
          : 'Thanks! Your comment is now live.',
        comment: pending ? null : created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/get-user';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request);
    const { id } = await params;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 60,
      keyPrefix: 'admin:topics:reject',
      key: user.id,
    });

    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const topic = await prisma.researchTopic.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error('Topic reject API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

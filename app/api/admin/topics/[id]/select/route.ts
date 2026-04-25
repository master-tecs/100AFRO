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

    if (!user || (user.role !== 'ADMIN' && user.role !== 'AUTHOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 60,
      keyPrefix: 'admin:topics:select',
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
        status: 'SELECTED',
        selectedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error('Topic select API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/get-user';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const bulkSelectSchema = z.object({
  topicIds: z.array(z.string()).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'AUTHOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 10,
      keyPrefix: 'admin:topics:bulk-select',
      key: user.id,
    });

    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const body = await request.json();
    const parsed = bulkSelectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { topicIds } = parsed.data;

    // Update all topics to SELECTED status
    const result = await prisma.researchTopic.updateMany({
      where: {
        id: { in: topicIds },
        status: { not: 'USED' }, // Don't update already used topics
      },
      data: {
        status: 'SELECTED',
        selectedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error('Bulk select API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

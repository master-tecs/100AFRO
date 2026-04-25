import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/get-user';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'AUTHOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const runs = await prisma.researchRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Research runs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

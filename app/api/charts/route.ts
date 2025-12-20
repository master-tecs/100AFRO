import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ChartType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as ChartType | null;

    const where: any = {};
    if (type) {
      where.type = type;
    }

    const charts = await prisma.chartEntry.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { rank: 'asc' },
      ],
    });

    // Group by type
    const songs = charts.filter(c => c.type === ChartType.song);
    const albums = charts.filter(c => c.type === ChartType.album);

    return NextResponse.json({
      songs,
      albums,
    });
  } catch (error) {
    console.error('Error fetching charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charts' },
      { status: 500 }
    );
  }
}


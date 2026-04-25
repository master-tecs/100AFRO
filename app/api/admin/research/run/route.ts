import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/get-user';
import { prisma } from '@/lib/prisma';
import { ResearchAgent } from '@/lib/research-agent';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 5,
      keyPrefix: 'admin:research:run',
      key: user.id,
    });

    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    // Create research run record
    const researchRun = await prisma.researchRun.create({
      data: {
        status: 'RUNNING',
        topicsFound: 0,
      },
    });

    try {
      // Run research agent
      const agent = new ResearchAgent();
      const topics = await agent.discoverTopics();

      // Save topics to database
      let savedCount = 0;
      for (const topic of topics) {
        try {
          await prisma.researchTopic.create({
            data: {
              title: topic.title,
              description: topic.description,
              source: topic.source,
              sourceUrl: topic.sourceUrl,
              category: topic.category,
              relevanceScore: topic.relevanceScore,
              status: 'PENDING',
            },
          });
          savedCount++;
        } catch (error) {
          // Skip duplicates or errors
          console.error('Failed to save topic:', error);
        }
      }

      // Update research run
      await prisma.researchRun.update({
        where: { id: researchRun.id },
        data: {
          status: 'COMPLETED',
          topicsFound: savedCount,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        topicsFound: savedCount,
        runId: researchRun.id,
      });
    } catch (error) {
      // Update research run with error
      await prisma.researchRun.update({
        where: { id: researchRun.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      });

      console.error('Research run error:', error);
      return NextResponse.json(
        {
          error: 'Research run failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

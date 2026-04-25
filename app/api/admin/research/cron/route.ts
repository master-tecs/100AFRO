import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResearchAgent } from '@/lib/research-agent';

function isAuthorizedBySecret(req: NextRequest) {
  // Check for Vercel CRON_SECRET (automatically sent by Vercel cron jobs)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get('authorization');
    if (authHeader === `Bearer ${cronSecret}`) {
      return true;
    }
  }
  
  // Check for manual RESEARCH_CRON_SECRET (for manual/admin calls)
  const secret = process.env.RESEARCH_CRON_SECRET;
  if (!secret) return false;
  const qs = req.nextUrl.searchParams.get('secret');
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
  return qs === secret || bearer === secret;
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    if (!isAuthorizedBySecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

      console.error('Research cron error:', error);
      return NextResponse.json(
        {
          error: 'Research run failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Research cron API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

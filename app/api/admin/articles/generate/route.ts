import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/get-user';
import { prisma } from '@/lib/prisma';
import { ArticleGenerator } from '@/lib/article-generator';
import { BlogCategory } from '@prisma/client';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const generateArticleSchema = z.object({
  topicId: z.string(),
  category: z.nativeEnum(BlogCategory).optional(),
});

const generateBulkArticlesSchema = z.object({
  topicIds: z.array(z.string()).min(1),
  category: z.nativeEnum(BlogCategory).optional(),
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
      keyPrefix: 'admin:articles:generate',
      key: user.id,
    });

    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const body = await request.json();

    // Check if it's bulk generation
    const bulkParse = generateBulkArticlesSchema.safeParse(body);
    if (bulkParse.success) {
      const { topicIds, category } = bulkParse.data;
      const generator = new ArticleGenerator();
      const result = await generator.generateBulkArticles(topicIds, user.id);

      return NextResponse.json({
        success: true,
        generated: result.success.length,
        failed: result.failed.length,
        articles: result.success,
        errors: result.failed,
      });
    }

    // Single article generation
    const parse = generateArticleSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parse.error.flatten() },
        { status: 400 }
      );
    }

    const { topicId, category } = parse.data;

    const generator = new ArticleGenerator();
    const article = await generator.generateArticle({
      topicId,
      authorId: user.id,
      category,
    });

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Article generation API error:', error);
    return NextResponse.json(
      {
        error: 'Article generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

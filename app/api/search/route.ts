import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const type = searchParams.get('type'); // 'blog', 'video', or 'all'

    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const results: any = {
      blogs: [],
      videos: [],
    };

    // Full-text search for blog posts using PostgreSQL
    if (type === 'all' || type === 'blog' || !type) {
      const blogPosts = await prisma.$queryRaw`
        SELECT 
          id, slug, title, excerpt, "imageUrl", category, featured, "createdAt",
          ts_rank(
            to_tsvector('english', title || ' ' || excerpt || ' ' || COALESCE(content, '')),
            plainto_tsquery('english', ${q})
          ) as rank
        FROM blog_posts
        WHERE 
          to_tsvector('english', title || ' ' || excerpt || ' ' || COALESCE(content, '')) 
          @@ plainto_tsquery('english', ${q})
        ORDER BY rank DESC
        LIMIT 10
      `;

      // Fetch full post data with author
      const blogIds = (blogPosts as any[]).map((p: any) => p.id);
      if (blogIds.length > 0) {
        const fullPosts = await prisma.blogPost.findMany({
          where: {
            id: { in: blogIds },
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        });
        results.blogs = fullPosts;
      }
    }

    // Search videos (simple text search)
    if (type === 'all' || type === 'video' || !type) {
      const videos = await prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { tags: { has: q } },
          ],
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      results.videos = videos;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}


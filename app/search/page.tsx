import React from 'react';
import { prisma } from '@/lib/prisma';
import BlogPostCard from '../components/BlogPostCard';
import VideoCard from '../components/VideoCard';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  let blogs: any[] = [];
  let videos: any[] = [];

  if (query && query.length >= 2) {
    // Full-text search for blog posts
    const blogPosts = await prisma.$queryRaw`
      SELECT 
        id, slug, title, excerpt, "imageUrl", category, featured, "createdAt",
        ts_rank(
          to_tsvector('english', title || ' ' || excerpt || ' ' || COALESCE(content, '')),
          plainto_tsquery('english', ${query})
        ) as rank
      FROM blog_posts
      WHERE 
        to_tsvector('english', title || ' ' || excerpt || ' ' || COALESCE(content, '')) 
        @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT 20
    `;

    const blogIds = (blogPosts as any[]).map((p: any) => p.id);
    if (blogIds.length > 0) {
      blogs = await prisma.blogPost.findMany({
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
    }

    // Search videos
    videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400 text-lg">
              Results for &quot;{query}&quot;
            </p>
          )}
        </div>

        {!query || query.length < 2 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Enter at least 2 characters to search</p>
          </div>
        ) : (
          <>
            {blogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Articles ({blogs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Videos ({videos.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}

            {blogs.length === 0 && videos.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No results found for &quot;{query}&quot;</p>
                <p className="text-gray-500 text-sm mt-2">Try different keywords or check for typos</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


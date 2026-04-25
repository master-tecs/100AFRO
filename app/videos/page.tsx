import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import VideoCard from '../components/VideoCard';
import VideoFilters from '../components/VideoFilters';
import VideoPagination from '../components/VideoPagination';
import { VideoCategory } from '@prisma/client';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface VideosPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

async function VideosPageContent({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const category = params.category as VideoCategory | undefined;
  const page = parseInt(params.page || '1', 10);
  const videosPerPage = 12;
  const skip = (page - 1) * videosPerPage;

  // Handle missing DATABASE_URL or Prisma
  let videos: any[] = [];
  let featuredVideos: any[] = [];
  let totalVideos = 0;
  
  try {
    if (process.env.DATABASE_URL && prisma !== null) {
      // Build where clause
      const where: any = {};
      if (category) {
        where.category = category;
      }

      // Get featured videos (for featured section) - don't apply category filter to featured
      // Try to sort by publishedAt if available, otherwise use createdAt
      try {
        featuredVideos = await prisma.video.findMany({
          where: { featured: true },
          orderBy: [
            { publishedAt: 'desc' },
            { createdAt: 'desc' },
          ],
          take: 1,
        });
      } catch {
        // Fallback if publishedAt field doesn't exist yet
        featuredVideos = await prisma.video.findMany({
          where: { featured: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        });
      }

      // Get total count for pagination
      totalVideos = await prisma.video.count({ where });

      // Get paginated videos - sort by publishedAt (YouTube publish date) descending, fallback to createdAt
      try {
        videos = await prisma.video.findMany({
          where,
          orderBy: [
            { publishedAt: 'desc' },
            { createdAt: 'asc' },
          ],
          skip,
          take: videosPerPage,
        });
      } catch {
        // Fallback if publishedAt field doesn't exist yet
        videos = await prisma.video.findMany({
          where,
          orderBy: { createdAt: 'asc' },
          skip,
          take: videosPerPage,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Continue with empty array
  }

  const totalPages = Math.ceil(totalVideos / videosPerPage);

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Video Gallery
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Watch the latest African entertainment content from @100AFRO
          </p>

          {/* Channel CTA */}
          <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">
                  Subscribe to @100AFRO on YouTube
                </h2>
                <p className="text-gray-300 text-sm">
                  Get notified when we upload new videos
                </p>
              </div>
              <Link
                href="https://www.youtube.com/@100AFRO?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <ExternalLink size={18} />
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Video Section */}
        {featuredVideos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Featured Video</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <Suspense fallback={<div className="h-12 mb-8" />}>
          <VideoFilters activeCategory={category || null} />
        </Suspense>

        {/* Videos Grid */}
        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Suspense fallback={<div className="h-20 mt-12" />}>
                <VideoPagination currentPage={page} totalPages={totalPages} />
              </Suspense>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">
              {category
                ? `No ${category.replace('_', ' ')} videos available yet.`
                : 'No videos available yet.'}
            </p>
            {category && (
              <Link
                href="/videos"
                className="text-afro-primary hover:underline text-sm"
              >
                View all videos
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function VideosPage(props: VideosPageProps) {
  return (
    <Suspense fallback={
      <div className="bg-gray-900 min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Video Gallery
            </h1>
            <p className="text-gray-400 text-lg">Loading videos...</p>
          </div>
        </div>
      </div>
    }>
      <VideosPageContent {...props} />
    </Suspense>
  );
}

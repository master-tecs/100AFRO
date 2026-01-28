import React from 'react';
import { prisma } from '@/lib/prisma';
import VideoCard from '../components/VideoCard';

export default async function VideosPage() {
  // Handle missing DATABASE_URL or Prisma
  let videos: any[] = [];
  
  try {
    if (process.env.DATABASE_URL && prisma !== null) {
      videos = await prisma.video.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Continue with empty array
  }

  // Show fallback if no data
  if (videos.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Video Gallery</h1>
            <p className="text-gray-400 text-lg">Watch the latest African entertainment content</p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Videos will be available once the database is connected.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Video Gallery</h1>
          <p className="text-gray-400 text-lg">Watch the latest African entertainment content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No videos available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}


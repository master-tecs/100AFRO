import React from 'react';
import { prisma } from '@/lib/prisma';
import { ChartType, ChartTrend } from '@prisma/client';
import { ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';

export const runtime = 'edge';

export default async function ChartsPage() {
  // Handle missing DATABASE_URL or Prisma
  let charts: any[] = [];
  
  try {
    if (process.env.DATABASE_URL && prisma !== null) {
      charts = await prisma.chartEntry.findMany({
        orderBy: [
          { type: 'asc' },
          { rank: 'asc' },
        ],
      });
    }
  } catch (error) {
    console.error('Error fetching charts:', error);
    // Continue with empty array
  }

  // Show fallback if no data
  if (charts.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Top Charts</h1>
            <p className="text-gray-400 text-lg">The hottest African music right now</p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Charts will be available once the database is connected.</p>
          </div>
        </div>
      </div>
    );
  }

  const songs = charts.filter(c => c.type === ChartType.song);
  const albums = charts.filter(c => c.type === ChartType.album);

  const getTrendIcon = (trend: ChartTrend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'down':
        return <ArrowDown size={16} className="text-red-500" />;
      case 'new':
        return <Sparkles size={16} className="text-yellow-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Top Charts</h1>
          <p className="text-gray-400 text-lg">The hottest African music right now</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Songs Chart */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top Songs</h2>
            <div className="space-y-4">
              {songs.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="text-3xl font-display font-bold text-gray-500 w-12 text-center">
                    {entry.rank}
                  </div>
                  <img src={entry.coverUrl} alt={entry.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-white font-bold">{entry.title}</h3>
                    <p className="text-gray-400 text-sm">{entry.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(entry.trend)}
                    {entry.lastWeek && (
                      <span className="text-xs text-gray-500">#{entry.lastWeek}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Albums Chart */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top Albums</h2>
            <div className="space-y-4">
              {albums.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="text-3xl font-display font-bold text-gray-500 w-12 text-center">
                    {entry.rank}
                  </div>
                  <img src={entry.coverUrl} alt={entry.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-white font-bold">{entry.title}</h3>
                    <p className="text-gray-400 text-sm">{entry.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(entry.trend)}
                    {entry.lastWeek && (
                      <span className="text-xs text-gray-500">#{entry.lastWeek}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


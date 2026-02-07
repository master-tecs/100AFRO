import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChartType, ChartTrend } from '@prisma/client';
import { ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ChartsPageProps {
  searchParams?: Promise<{ country?: string }>;
}

function parseCountry(v?: string): 'NG' | 'GH' | 'ZA' {
  if (v === 'GH' || v === 'ZA' || v === 'NG') return v;
  return 'NG';
}

export default async function ChartsPage({ searchParams }: ChartsPageProps) {
  const sp = (await searchParams) || {};
  const country = parseCountry(sp.country);

  // iTunes/Apple Music live first (cached), then DB fallback.
  let itunesSongs: any[] = [];
  let itunesAlbums: any[] = [];
  let usedFallback = false;

  // Handle missing DATABASE_URL or Prisma
  let charts: any[] = [];

  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/charts/live?country=${country}`, {
      next: { revalidate: 900 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.error) {
        console.error('Charts API error:', data.error);
        usedFallback = true;
      } else {
        itunesSongs = data.songs || [];
        itunesAlbums = data.albums || [];
      }
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error('Charts API failed:', res.status, errorData);
      usedFallback = true;
    }
  } catch (error) {
    console.error('Error fetching live charts:', error);
    usedFallback = true;
  }

  if (usedFallback) {
    try {
      if (process.env.DATABASE_URL && prisma !== null) {
        charts = await prisma.chartEntry.findMany({
          where: {
            appleMusicLink: 'itunes',
            previewUrl: country,
          },
          orderBy: [{ type: 'asc' }, { rank: 'asc' }],
        });
      }
    } catch (error) {
      console.error('Error fetching charts fallback:', error);
    }
  }

  const songs =
    itunesSongs.length > 0
      ? itunesSongs.map((s: any) => ({
          id: `${country}-song-${s.rank}`,
          rank: s.rank,
          title: s.title,
          artist: s.artist,
          coverUrl: s.coverUrl,
          trend: 'same',
          lastWeek: null,
          spotifyLink: s.appleMusicLink || s.spotifyLink,
        }))
      : charts.filter((c) => c.type === ChartType.song);

  const albums =
    itunesAlbums.length > 0
      ? itunesAlbums.map((a: any) => ({
          id: `${country}-album-${a.rank}`,
          rank: a.rank,
          title: a.title,
          artist: a.artist,
          coverUrl: a.coverUrl,
          trend: 'new',
          lastWeek: null,
          spotifyLink: a.appleMusicLink || a.spotifyLink,
          releaseDate: a.releaseDate,
        }))
      : charts.filter((c) => c.type === ChartType.album);

  // Show empty state if no live and no fallback
  if (songs.length === 0 && albums.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Top Charts</h1>
            <p className="text-gray-400 text-lg">The hottest African music right now</p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              Live charts will be available once configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Top Charts</h1>
              <p className="text-gray-400 text-lg">Live charts powered by Apple Music (metadata only)</p>
              <p className="text-xs text-gray-500 mt-2">
                Attribution: Charts data from Apple Music. We display titles, artists, artwork and links.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(['NG', 'GH', 'ZA'] as const).map((c) => (
                <Link
                  key={c}
                  href={`/charts?country=${c}`}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    c === country
                      ? 'bg-afro-primary text-black border-afro-primary'
                      : 'bg-gray-800 text-gray-200 border-gray-700 hover:border-afro-primary/60'
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Songs Chart */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top Songs</h2>
            <div className="space-y-4">
              {songs.map((entry: any) => (
                <div key={entry.id} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="text-3xl font-display font-bold text-gray-500 w-12 text-center">
                    {entry.rank}
                  </div>
                  <img src={entry.coverUrl} alt={entry.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-white font-bold">
                      {entry.spotifyLink ? (
                        <a href={entry.spotifyLink} target="_blank" className="hover:text-afro-primary">
                          {entry.title}
                        </a>
                      ) : (
                        entry.title
                      )}
                    </h3>
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

          {/* Albums (New Releases) */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">New Releases (Albums)</h2>
            <div className="space-y-4">
              {albums.map((entry: any) => (
                <div key={entry.id} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="text-3xl font-display font-bold text-gray-500 w-12 text-center">
                    {entry.rank}
                  </div>
                  <img src={entry.coverUrl} alt={entry.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-white font-bold">
                      {entry.spotifyLink ? (
                        <a href={entry.spotifyLink} target="_blank" className="hover:text-afro-primary">
                          {entry.title}
                        </a>
                      ) : (
                        entry.title
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm">{entry.artist}</p>
                    {entry.releaseDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Released: {entry.releaseDate}
                      </p>
                    )}
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


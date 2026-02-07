/**
 * YouTube Data API v3 Integration Utilities
 * Handles fetching videos from @100AFRO channel and syncing to database
 */

import { detectVideoCategory } from './video-categorizer';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = '@100AFRO';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string; // ISO 8601 format
  views: number;
  publishedAt: string;
  youtubeId: string;
}

export interface YouTubeChannelVideosResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults?: number;
}

/**
 * Parse ISO 8601 duration (PT4M13S) to readable format (4:13)
 */
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format view count (e.g., 1500000 -> "1.5M")
 */
function formatViews(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get channel ID from handle (@100AFRO)
 */
export async function getChannelIdFromHandle(
  apiKey: string,
  handle: string = CHANNEL_HANDLE
): Promise<string | null> {
  try {
    // Remove @ symbol if present
    const cleanHandle = handle.replace('@', '');
    
    // Try forHandle parameter (newer API)
    let url = `${YOUTUBE_API_BASE}/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`;
    let response = await fetch(url);
    
    if (!response.ok) {
      // Fallback to forUsername (legacy)
      url = `${YOUTUBE_API_BASE}/channels?part=id&forUsername=${cleanHandle}&key=${apiKey}`;
      response = await fetch(url);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`YouTube API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error fetching channel ID:', error);
    return null;
  }
}

/**
 * Fetch videos from a YouTube channel
 */
export async function fetchChannelVideos(
  apiKey: string,
  channelId: string,
  maxResults: number = 50,
  pageToken?: string
): Promise<YouTubeChannelVideosResponse> {
  try {
    // Note: search.list API only supports 'snippet' in part parameter
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      type: 'video',
      maxResults: maxResults.toString(),
      order: 'date',
      key: apiKey,
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`YouTube API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return {
        videos: [],
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults || 0,
      };
    }

    // Get video IDs to fetch detailed info (duration, views)
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

    // Fetch detailed video information
    const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);

    if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || detailsResponse.statusText;
      throw new Error(`YouTube API error fetching details: ${detailsResponse.status} - ${errorMessage}`);
    }

    const detailsData = await detailsResponse.json();
    type VideoDetails = {
      id: string;
      contentDetails?: { duration?: string };
      statistics?: { viewCount?: string };
    };
    const detailsMap = new Map<string, VideoDetails>(
      (detailsData.items || []).map((item: VideoDetails) => [item.id, item])
    );

    // Map to our format
    const videos: YouTubeVideo[] = data.items.map((item: any) => {
      const videoId = item.id.videoId;
      const details: VideoDetails | undefined = detailsMap.get(videoId);

      return {
        id: videoId,
        youtubeId: videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnailUrl:
          item.snippet.thumbnails?.maxres?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: details?.contentDetails?.duration
          ? parseDuration(details.contentDetails.duration)
          : '0:00',
        views: parseInt(details?.statistics?.viewCount || '0', 10),
        publishedAt: item.snippet.publishedAt,
      };
    });

    return {
      videos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults || 0,
    };
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
}

/**
 * Convert YouTube video to database format
 */
export function youtubeVideoToDbFormat(
  video: YouTubeVideo
): {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  date: string;
  publishedAt: Date;
  category: string;
  description: string;
} {
  // Format date (e.g., "2 weeks ago" or "Jan 15, 2024")
  const publishedDate = new Date(video.publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dateStr: string;
  if (diffDays === 0) {
    dateStr = 'Today';
  } else if (diffDays === 1) {
    dateStr = 'Yesterday';
  } else if (diffDays < 7) {
    dateStr = `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    dateStr = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    dateStr = `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    dateStr = publishedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Auto-detect category from title and description
  const detectedCategory = detectVideoCategory(video.title, video.description);

  return {
    youtubeId: video.youtubeId,
    title: video.title,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
    views: formatViews(video.views),
    date: dateStr,
    publishedAt: publishedDate,
    category: detectedCategory,
    description: video.description,
  };
}

/**
 * YouTube URL parsing and embed generation utilities
 */

export interface YouTubeVideoInfo {
  videoId: string;
  isValid: boolean;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): YouTubeVideoInfo {
  if (!url || typeof url !== 'string') {
    return { videoId: '', isValid: false };
  }

  // Remove whitespace
  const cleanUrl = url.trim();

  // YouTube URL patterns
  const patterns = [
    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URL: youtu.be/VIDEO_ID
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return { videoId: match[1], isValid: true };
    }
  }

  return { videoId: '', isValid: false };
}

/**
 * Generate YouTube embed HTML
 */
export function generateYouTubeEmbed(videoId: string, options?: {
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
}): string {
  const {
    width = 560,
    height = 315,
    autoplay = false,
    controls = true,
  } = options || {};

  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', '1');
  if (!controls) params.append('controls', '0');
  params.append('rel', '0'); // Don't show related videos from other channels
  params.append('modestbranding', '1'); // Minimal YouTube branding

  const queryString = params.toString();
  const embedUrl = `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;

  return `<div class="youtube-embed-wrapper">
    <div class="youtube-embed-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
      <iframe
        src="${embedUrl}"
        width="${width}"
        height="${height}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        loading="lazy"
      ></iframe>
    </div>
  </div>`;
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url).isValid;
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    standard: 'sddefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

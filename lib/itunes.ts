/**
 * iTunes/Apple Music RSS Feed Integration
 * Free, no API key required - uses Apple's public RSS feeds
 */

type Cached<T> = { value: T; expiresAt: number };

const responseCache = new Map<string, Cached<any>>();

function cacheGet<T>(key: string): T | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.value as T;
}

function cacheSet<T>(key: string, value: T, ttlMs: number) {
  responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function countryCodeToLowerCase(country: "NG" | "GH" | "ZA"): string {
  return country.toLowerCase();
}

type iTunesSongItem = {
  artistName: string;
  name: string;
  artworkUrl100: string;
  url: string;
  previewUrl?: string;
};

type iTunesRSSAlbumItem = {
  artistName: string;
  name: string;
  artworkUrl100: string;
  url: string;
  releaseDate?: string;
};

type iTunesRSSResponse = {
  feed: {
    results: Array<iTunesSongItem | iTunesRSSAlbumItem>;
  };
};

export type iTunesSongChartItem = {
  rank: number;
  title: string;
  artist: string;
  coverUrl: string;
  appleMusicLink: string;
  previewUrl?: string | null;
};

export type iTunesAlbumItem = {
  rank: number;
  title: string;
  artist: string;
  coverUrl: string;
  appleMusicLink: string;
  releaseDate?: string | null;
};

export async function getTopSongs(
  country: "NG" | "GH" | "ZA",
  opts?: { cacheTtlMs?: number }
): Promise<iTunesSongChartItem[]> {
  const ttl = opts?.cacheTtlMs ?? 15 * 60 * 1000; // 15 minutes default
  const cacheKey = `itunes:top50:${country}`;
  const cached = cacheGet<iTunesSongChartItem[]>(cacheKey);
  if (cached) return cached;

  const countryCode = countryCodeToLowerCase(country);
  // Try alternative endpoint format if the first one fails
  const urls = [
    `https://rss.applemarketingtools.com/api/v2/${countryCode}/music/most-played/50/songs.json`,
    `https://rss.itunes.apple.com/api/v1/${countryCode}/apple-music/top-songs/all/50/explicit.json`,
  ];

  let lastError: Error | null = null;
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          'User-Agent': '100AFRO/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        lastError = new Error(`iTunes RSS error (${response.status}): ${response.statusText} - ${errorText}`);
        continue; // Try next URL
      }

      const data = (await response.json()) as iTunesRSSResponse;
      
      if (!data.feed || !data.feed.results || data.feed.results.length === 0) {
        lastError = new Error('iTunes RSS returned empty results');
        continue; // Try next URL
      }

      const items: iTunesSongChartItem[] = (data.feed?.results || [])
        .map((song, idx) => ({
          rank: idx + 1,
          title: song.name,
          artist: song.artistName,
          coverUrl: song.artworkUrl100,
          appleMusicLink: song.url,
          previewUrl: (song as iTunesSongItem).previewUrl ?? null,
        }))
        .filter((x) => x.title && x.artist && x.coverUrl && x.appleMusicLink);

      cacheSet(cacheKey, items, ttl);
      return items;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      lastError = error as Error;
      continue; // Try next URL
    }
  }
  
  // If all URLs failed, throw the last error
  if (lastError) {
    console.error("All iTunes RSS endpoints failed for", country);
    throw lastError;
  }
  
  throw new Error("No valid iTunes RSS endpoint found");
}

export async function getNewReleases(
  country: "NG" | "GH" | "ZA",
  opts?: { cacheTtlMs?: number }
): Promise<iTunesAlbumItem[]> {
  const ttl = opts?.cacheTtlMs ?? 15 * 60 * 1000; // 15 minutes default
  const cacheKey = `itunes:new-releases:${country}`;
  const cached = cacheGet<iTunesAlbumItem[]>(cacheKey);
  if (cached) return cached;

  const countryCode = countryCodeToLowerCase(country);
  // Try alternative endpoint format if the first one fails
  const urls = [
    `https://rss.applemarketingtools.com/api/v2/${countryCode}/music/most-played/20/albums.json`,
    `https://rss.itunes.apple.com/api/v1/${countryCode}/apple-music/top-albums/all/20/explicit.json`,
  ];

  let lastError: Error | null = null;
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          'User-Agent': '100AFRO/1.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        lastError = new Error(`iTunes RSS error (${response.status}): ${response.statusText} - ${errorText}`);
        continue; // Try next URL
      }

      const data = (await response.json()) as iTunesRSSResponse;
      
      if (!data.feed || !data.feed.results || data.feed.results.length === 0) {
        lastError = new Error('iTunes RSS returned empty results');
        continue; // Try next URL
      }

      const items: iTunesAlbumItem[] = (data.feed?.results || [])
        .map((album, idx) => ({
          rank: idx + 1,
          title: album.name,
          artist: album.artistName,
          coverUrl: album.artworkUrl100,
          appleMusicLink: album.url,
          releaseDate: (album as iTunesRSSAlbumItem).releaseDate ?? null,
        }))
        .filter((x) => x.title && x.artist && x.coverUrl && x.appleMusicLink);

      cacheSet(cacheKey, items, ttl);
      return items;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      lastError = error as Error;
      continue; // Try next URL
    }
  }
  
  // If all URLs failed, throw the last error
  if (lastError) {
    console.error("All iTunes RSS endpoints failed for", country);
    throw lastError;
  }
  
  throw new Error("No valid iTunes RSS endpoint found");
}

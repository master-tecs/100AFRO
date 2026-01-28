type SpotifyToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type Cached<T> = { value: T; expiresAt: number };

const tokenCache: Cached<SpotifyToken> | null = null;
let cachedToken: Cached<SpotifyToken> | null = null;
const responseCache = new Map<string, Cached<any>>();

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

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

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value.access_token;
  }

  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Spotify token error (${res.status}): ${text}`);
  }

  const token = (await res.json()) as SpotifyToken;
  // Refresh a bit early
  const expiresAt = Date.now() + Math.max(0, token.expires_in - 60) * 1000;
  cachedToken = { value: token, expiresAt };
  return token.access_token;
}

async function spotifyFetch<T>(url: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // We handle caching ourselves
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Spotify API error (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

function countryName(code: string) {
  switch (code) {
    case "NG":
      return "Nigeria";
    case "GH":
      return "Ghana";
    case "ZA":
      return "South Africa";
    default:
      return code;
  }
}

async function findTop50PlaylistId(country: "NG" | "GH" | "ZA"): Promise<string> {
  const envKey = `SPOTIFY_TOP50_PLAYLIST_${country}`;
  const fromEnv = process.env[envKey];
  if (fromEnv) return fromEnv;

  const query = encodeURIComponent(`Top 50 - ${countryName(country)}`);
  type SearchResult = {
    playlists: {
      items: Array<{
        id: string;
        name: string;
        owner?: { display_name?: string };
      }>;
    };
  };
  const data = await spotifyFetch<SearchResult>(
    `https://api.spotify.com/v1/search?type=playlist&limit=10&market=${country}&q=${query}`
  );
  const items = data.playlists?.items || [];
  const preferred = items.find((p) =>
    (p.owner?.display_name || "").toLowerCase().includes("spotify")
  );
  const first = preferred || items[0];
  if (!first?.id) {
    throw new Error(
      `Top 50 playlist not configured. Set ${envKey} to a Spotify playlist ID.`
    );
  }
  return first.id;
}

export type SpotifySongChartItem = {
  rank: number;
  title: string;
  artist: string;
  coverUrl: string;
  spotifyLink: string;
  previewUrl?: string | null;
};

export type SpotifyAlbumItem = {
  rank: number;
  title: string;
  artist: string;
  coverUrl: string;
  spotifyLink: string;
  releaseDate?: string | null;
};

export async function getTopSongs(
  country: "NG" | "GH" | "ZA",
  opts?: { cacheTtlMs?: number }
): Promise<SpotifySongChartItem[]> {
  const ttl = opts?.cacheTtlMs ?? 15 * 60 * 1000;
  const cacheKey = `spotify:top50:${country}`;
  const cached = cacheGet<SpotifySongChartItem[]>(cacheKey);
  if (cached) return cached;

  const playlistId = await findTop50PlaylistId(country);
  type PlaylistTracks = {
    items: Array<{
      track: {
        name: string;
        preview_url?: string | null;
        external_urls: { spotify: string };
        artists: Array<{ name: string }>;
        album: {
          images: Array<{ url: string }>;
        };
      };
    }>;
  };

  const data = await spotifyFetch<PlaylistTracks>(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=${country}&limit=50`
  );

  const items: SpotifySongChartItem[] = (data.items || [])
    .map((it, idx) => {
      const t = it.track;
      const cover = t.album?.images?.[0]?.url || "";
      return {
        rank: idx + 1,
        title: t.name,
        artist: (t.artists || []).map((a) => a.name).join(", "),
        coverUrl: cover,
        spotifyLink: t.external_urls?.spotify || "",
        previewUrl: t.preview_url ?? null,
      };
    })
    .filter((x) => x.title && x.artist && x.coverUrl && x.spotifyLink);

  cacheSet(cacheKey, items, ttl);
  return items;
}

export async function getNewReleases(
  country: "NG" | "GH" | "ZA",
  opts?: { cacheTtlMs?: number }
): Promise<SpotifyAlbumItem[]> {
  const ttl = opts?.cacheTtlMs ?? 15 * 60 * 1000;
  const cacheKey = `spotify:new-releases:${country}`;
  const cached = cacheGet<SpotifyAlbumItem[]>(cacheKey);
  if (cached) return cached;

  type NewReleases = {
    albums: {
      items: Array<{
        name: string;
        release_date?: string;
        external_urls: { spotify: string };
        artists: Array<{ name: string }>;
        images: Array<{ url: string }>;
      }>;
    };
  };

  const data = await spotifyFetch<NewReleases>(
    `https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=20`
  );

  const items: SpotifyAlbumItem[] = (data.albums?.items || [])
    .map((a, idx) => ({
      rank: idx + 1,
      title: a.name,
      artist: (a.artists || []).map((x) => x.name).join(", "),
      coverUrl: a.images?.[0]?.url || "",
      spotifyLink: a.external_urls?.spotify || "",
      releaseDate: a.release_date || null,
    }))
    .filter((x) => x.title && x.artist && x.coverUrl && x.spotifyLink);

  cacheSet(cacheKey, items, ttl);
  return items;
}


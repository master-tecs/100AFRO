type Cached<T> = { value: T; expiresAt: number };

const cache = new Map<string, Cached<any>>();
let lastRequestAt = 0;

function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

function cacheSet<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function userAgent() {
  return (
    process.env.MUSICBRAINZ_USER_AGENT ||
    "100AFRO/1.0 (admin@100afro.com)"
  );
}

// MusicBrainz recommends 1 req/sec for unauthenticated clients.
async function throttle() {
  const now = Date.now();
  const elapsed = now - lastRequestAt;
  if (elapsed < 1100) {
    await sleep(1100 - elapsed);
  }
  lastRequestAt = Date.now();
}

export type MusicBrainzEntityInfo = {
  url?: string | null;
};

// Optional enrichment: if you have a MusicBrainz MBID (artist ID, release ID, etc)
// we can produce a canonical MusicBrainz URL for attribution/linking.
export async function enrichWithMusicBrainz(params: {
  mbid?: string | null;
  entityType?: "artist" | "release" | "release-group" | "recording";
  cacheTtlMs?: number;
}): Promise<MusicBrainzEntityInfo> {
  const mbid = params.mbid?.trim();
  if (!mbid) return { url: null };

  const type = params.entityType || "artist";
  const ttl = params.cacheTtlMs ?? 7 * 24 * 60 * 60 * 1000;
  const cacheKey = `mb:entity:${type}:${mbid}`;
  const cached = cacheGet<MusicBrainzEntityInfo>(cacheKey);
  if (cached) return cached;

  // We do a lightweight lookup just to validate the MBID exists.
  // Endpoint pattern: /ws/2/{entity}/{mbid}?fmt=json
  await throttle();
  const res = await fetch(`https://musicbrainz.org/ws/2/${type}/${mbid}?fmt=json`, {
    headers: {
      "User-Agent": userAgent(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // If it fails, still return a stable URL as a best-effort link.
    const info = { url: `https://musicbrainz.org/${type}/${mbid}` };
    cacheSet(cacheKey, info, ttl);
    return info;
  }

  // Consume body to avoid leaks; we don't need fields right now.
  await res.json().catch(() => null);

  const info = { url: `https://musicbrainz.org/${type}/${mbid}` };
  cacheSet(cacheKey, info, ttl);
  return info;
}


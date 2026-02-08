type Cached<T> = { value: T; expiresAt: number };

const cache = new Map<string, Cached<any>>();

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

export type WikidataFact = {
  year?: number | null;
  text: string;
  externalId?: string | null; // Wikidata QID
  sourceUrl?: string | null; // Wikidata entity URL
};

// Fetches music-related events for a given month/day from Wikidata via SPARQL.
// We keep the query conservative and return short, usable fact strings.
export async function fetchWikidataMusicFacts(params: {
  month: number;
  day: number;
  limit?: number;
  cacheTtlMs?: number;
}): Promise<WikidataFact[]> {
  const { month, day } = params;
  const limit = params.limit ?? 20;
  const ttl = params.cacheTtlMs ?? 24 * 60 * 60 * 1000;
  const cacheKey = `wikidata:musicfacts:${month}:${day}:${limit}`;
  const cached = cacheGet<WikidataFact[]>(cacheKey);
  if (cached) return cached;

  // Wikidata model:
  // - Many events use P585 (point in time) or P580/P582.
  // - We filter by month/day and favor items with a music connection (e.g., instance of musical work/event,
  //   or has a MusicBrainz ID, or genre/performer relations).
  //
  // Note: SPARQL is “best effort”. We will still validate/format results.
  const query = `
SELECT ?item ?itemLabel ?itemDescription ?date ?mbid WHERE {
  ?item wdt:P585 ?date .
  FILTER(MONTH(?date) = ${month} && DAY(?date) = ${day})

  OPTIONAL { ?item wdt:P434 ?mbid . } # MusicBrainz artist ID (common)

  # Heuristic music relevance:
  FILTER(
    EXISTS { ?item wdt:P434 ?_mb } ||
    EXISTS { ?item wdt:P136 ?_genre } ||
    EXISTS { ?item wdt:P175 ?_performer } ||
    EXISTS { ?item wdt:P31 ?_instanceOf }
  )

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?date)
LIMIT ${limit}
  `.trim();

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      // Wikidata prefers a descriptive UA; keep it simple here.
      "User-Agent": process.env.WIKIDATA_USER_AGENT || "100AFRO/1.0 (contact: admin@contact.100afro.com)",
      Accept: "application/sparql-results+json",
    },
    // cache at our layer
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Wikidata SPARQL error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as any;
  const rows = data?.results?.bindings ?? [];

  const facts: WikidataFact[] = rows
    .map((r: any) => {
      const itemUrl = r?.item?.value as string | undefined;
      const qid = itemUrl ? itemUrl.split("/").pop() : null;
      const label = (r?.itemLabel?.value as string | undefined) || "";
      const desc = (r?.itemDescription?.value as string | undefined) || "";
      const dateStr = (r?.date?.value as string | undefined) || "";
      const year = dateStr ? new Date(dateStr).getUTCFullYear() : null;

      const headline = label.trim();
      const detail = desc.trim();

      // Build a short readable sentence.
      const text =
        detail && detail.toLowerCase().includes(headline.toLowerCase())
          ? detail
          : detail
            ? `${headline} — ${detail}`
            : headline;

      if (!text) return null;

      return {
        year,
        text,
        externalId: qid,
        sourceUrl: itemUrl || null,
      } as WikidataFact;
    })
    .filter(Boolean);

  cacheSet(cacheKey, facts, ttl);
  return facts;
}


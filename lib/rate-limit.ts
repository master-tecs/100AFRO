import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function rateLimit(
  req: NextRequest,
  opts: { windowMs: number; max: number; keyPrefix: string; key?: string }
) {
  const now = Date.now();
  const key = `${opts.keyPrefix}:${opts.key ?? getClientIp(req)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + opts.windowMs };
    buckets.set(key, bucket);
    return { ok: true, remaining: opts.max - 1, resetAt: bucket.resetAt };
  }

  if (existing.count >= opts.max) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true, remaining: Math.max(0, opts.max - existing.count), resetAt: existing.resetAt };
}


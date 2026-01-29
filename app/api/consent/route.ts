import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/get-user';
import { randomBytes } from 'crypto';
import { rateLimit } from '@/lib/rate-limit';

const CONSENT_VERSION = '1.0';
const SESSION_COOKIE_NAME = 'consent-session-id';
const SESSION_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function anonymizeIp(ip: string | null): string | null {
  if (!ip) return null;
  // Anonymize IP: keep only first 3 octets for IPv4, or hash for IPv6
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  // For IPv6 or other formats, return null (don't store)
  return null;
}

function getOrCreateSessionId(request: NextRequest, response: NextResponse): string {
  let sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionId) {
    sessionId = randomBytes(16).toString('hex');
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: '/',
    });
  }
  
  return sessionId;
}

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 10,
      keyPrefix: 'consent:post',
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Invalid preferences' },
        { status: 400 }
      );
    }

    // Validate preferences structure
    const requiredKeys = ['essential', 'analytics', 'marketing', 'functional', 'performance'];
    const optionalKeys = ['heatmaps'];
    for (const key of requiredKeys) {
      if (typeof preferences[key] !== 'boolean') {
        return NextResponse.json(
          { error: `Invalid preference for ${key}` },
          { status: 400 }
        );
      }
    }
    // Optional keys can be undefined or boolean
    for (const key of optionalKeys) {
      if (preferences[key] !== undefined && typeof preferences[key] !== 'boolean') {
        return NextResponse.json(
          { error: `Invalid preference for ${key}` },
          { status: 400 }
        );
      }
    }

    // Essential must always be true
    if (preferences.essential !== true) {
      preferences.essential = true;
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const user = await getUser(request);
    const ipAddress = anonymizeIp(
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      null
    );
    const userAgent = request.headers.get('user-agent') || null;

    const response = NextResponse.json({ success: true });
    const sessionId = getOrCreateSessionId(request, response);

    // Upsert consent record
    await prisma.cookieConsent.upsert({
      where: { sessionId },
      update: {
        userId: user?.id || null,
        ipAddress,
        userAgent,
        consentPreferences: preferences,
        consentVersion: CONSENT_VERSION,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        userId: user?.id || null,
        ipAddress,
        userAgent,
        consentPreferences: preferences,
        consentVersion: CONSENT_VERSION,
      },
    });

    return response;
  } catch (error) {
    console.error('Error saving consent:', error);
    return NextResponse.json(
      { error: 'Failed to save consent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 30,
      keyPrefix: 'consent:get',
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return NextResponse.json({
        preferences: null,
        consented: false,
      });
    }

    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId },
      select: {
        consentPreferences: true,
        consentVersion: true,
        consentedAt: true,
      },
    });

    if (!consent || consent.consentVersion !== CONSENT_VERSION) {
      return NextResponse.json({
        preferences: null,
        consented: false,
      });
    }

    return NextResponse.json({
      preferences: consent.consentPreferences,
      consented: true,
      consentedAt: consent.consentedAt,
    });
  } catch (error) {
    console.error('Error fetching consent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { randomUUID } from "crypto";

const voteSchema = z.object({
  pollId: z.string().min(1),
  optionId: z.string().min(1),
});

function normalizeOptions(options: any): Array<{ id: string; text: string }> {
  if (!Array.isArray(options)) return [];
  return options
    .map((o) => ({ id: String(o.id), text: String(o.text) }))
    .filter((o) => o.id && o.text);
}

function isWithinWindow(p: any, now: Date) {
  const startsOk = !p.startsAt || new Date(p.startsAt) <= now;
  const endsOk = !p.endsAt || new Date(p.endsAt) > now;
  return startsOk && endsOk;
}

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, { windowMs: 60_000, max: 10, keyPrefix: "poll:vote" });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests. Please try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const { pollId, optionId } = parsed.data;
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.active || !isWithinWindow(poll, new Date())) {
      return NextResponse.json({ error: "Poll is not active" }, { status: 400 });
    }

    const options = normalizeOptions(poll.options);
    if (!options.some((o) => o.id === optionId)) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    const user = await getUser(request);
    const existingGuestId = request.cookies.get("poll-guest-id")?.value || null;
    const guestId = existingGuestId || randomUUID();

    try {
      await prisma.pollVote.create({
        data: {
          pollId,
          optionId,
          userId: user?.id || null,
          guestId: user?.id ? null : guestId,
        },
      });
    } catch (e: any) {
      // Prisma unique constraint -> already voted
      return NextResponse.json(
        { error: "You already voted in this poll." },
        { status: 409 }
      );
    }

    const votes = await prisma.pollVote.findMany({
      where: { pollId },
      select: { optionId: true },
    });

    const counts: Record<string, number> = {};
    for (const v of votes) counts[v.optionId] = (counts[v.optionId] || 0) + 1;
    const totalVotes = votes.length;
    const results = options.map((o) => ({
      id: o.id,
      text: o.text,
      votes: counts[o.id] || 0,
      percent: totalVotes ? Math.round(((counts[o.id] || 0) / totalVotes) * 100) : 0,
    }));

    const res = NextResponse.json({
      success: true,
      poll: {
        id: poll.id,
        question: poll.question,
        options: results,
        totalVotes,
      },
    });

    if (!existingGuestId && !user?.id) {
      res.cookies.set("poll-guest-id", guestId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}


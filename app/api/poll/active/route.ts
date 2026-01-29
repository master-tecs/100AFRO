import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isWithinWindow(p: any, now: Date) {
  const startsOk = !p.startsAt || new Date(p.startsAt) <= now;
  const endsOk = !p.endsAt || new Date(p.endsAt) > now;
  return startsOk && endsOk;
}

function normalizeOptions(options: any): Array<{ id: string; text: string }> {
  if (!Array.isArray(options)) return [];
  return options
    .map((o) => ({ id: String(o.id), text: String(o.text) }))
    .filter((o) => o.id && o.text);
}

export async function GET(_request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const now = new Date();
    const poll = await prisma.poll.findFirst({
      where: { active: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!poll || !isWithinWindow(poll, now)) {
      return NextResponse.json({ poll: null });
    }

    const options = normalizeOptions(poll.options);
    const votes = await prisma.pollVote.findMany({
      where: { pollId: poll.id },
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

    return NextResponse.json({
      poll: {
        id: poll.id,
        question: poll.question,
        startsAt: poll.startsAt,
        endsAt: poll.endsAt,
        active: poll.active,
        options: results,
        totalVotes,
      },
    });
  } catch (error: any) {
    console.error("Error fetching active poll:", error);
    // If table doesn't exist, return empty poll instead of error
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      return NextResponse.json({ poll: null });
    }
    return NextResponse.json({ error: "Failed to fetch poll" }, { status: 500 });
  }
}


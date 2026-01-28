import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const pollCreateSchema = z.object({
  question: z.string().min(3),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 60, keyPrefix: "admin:polls:list" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const polls = await prisma.poll.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // Attach vote totals for quick admin overview
  const ids = polls.map((p) => p.id);
  const votes = await prisma.pollVote.findMany({
    where: { pollId: { in: ids } },
    select: { pollId: true },
  });
  const totals: Record<string, number> = {};
  for (const v of votes) totals[v.pollId] = (totals[v.pollId] || 0) + 1;

  return NextResponse.json({
    polls: polls.map((p) => ({
      ...p,
      totalVotes: totals[p.id] || 0,
    })),
  });
}

export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 30, keyPrefix: "admin:polls:create" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const body = await request.json();
  const parsed = pollCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { question, options, startsAt, endsAt, active } = parsed.data;

  // If activating, deactivate others
  if (active) {
    await prisma.poll.updateMany({ data: { active: false }, where: { active: true } });
  }

  const poll = await prisma.poll.create({
    data: {
      question,
      options,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      active: active ?? false,
    },
  });

  return NextResponse.json({ poll }, { status: 201 });
}


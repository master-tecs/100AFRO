import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const pollUpdateSchema = z.object({
  question: z.string().min(3).optional(),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2).optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 60, keyPrefix: "admin:polls:get" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const { id } = await params;
  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const votes = await prisma.pollVote.findMany({ where: { pollId: poll.id }, select: { optionId: true } });
  const counts: Record<string, number> = {};
  for (const v of votes) counts[v.optionId] = (counts[v.optionId] || 0) + 1;

  const options = Array.isArray(poll.options) ? poll.options : [];
  const normalized = options
    .map((o: any) => ({ id: String(o.id), text: String(o.text) }))
    .filter((o: any) => o.id && o.text);

  const totalVotes = votes.length;
  const results = normalized.map((o: any) => ({
    ...o,
    votes: counts[o.id] || 0,
    percent: totalVotes ? Math.round(((counts[o.id] || 0) / totalVotes) * 100) : 0,
  }));

  return NextResponse.json({ poll: { ...poll, options: results, totalVotes } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 30, keyPrefix: "admin:polls:update" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const body = await request.json();
  const parsed = pollUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { active, startsAt, endsAt, ...rest } = parsed.data;

  if (active) {
    await prisma.poll.updateMany({ data: { active: false }, where: { active: true } });
  }

  const { id } = await params;
  const poll = await prisma.poll.update({
    where: { id },
    data: {
      ...rest,
      active: active ?? undefined,
      startsAt: startsAt === undefined ? undefined : startsAt ? new Date(startsAt) : null,
      endsAt: endsAt === undefined ? undefined : endsAt ? new Date(endsAt) : null,
    },
  });

  return NextResponse.json({ poll });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 30, keyPrefix: "admin:polls:delete" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const { id } = await params;
  await prisma.poll.delete({ where: { id } });
  return NextResponse.json({ success: true });
}


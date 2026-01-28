import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(request, { windowMs: 60_000, max: 30, keyPrefix: "admin:polls:activate" });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const user = await getUser(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });

  const { id } = await params;
  await prisma.poll.updateMany({ data: { active: false }, where: { active: true } });
  const poll = await prisma.poll.update({ where: { id }, data: { active: true } });

  return NextResponse.json({ poll });
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function todayUtc() {
  const d = new Date();
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export async function GET(_request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const { month, day } = todayUtc();

    const fact = await prisma.onThisDayFact.findFirst({
      where: { month, day },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ fact: fact || null });
  } catch (error) {
    console.error("Error fetching daily fact:", error);
    return NextResponse.json({ error: "Failed to fetch daily fact" }, { status: 500 });
  }
}


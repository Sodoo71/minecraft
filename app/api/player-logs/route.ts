import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const logs = await prisma.playerLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });
  return NextResponse.json(logs);
}

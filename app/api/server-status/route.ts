import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const latest = await prisma.serverStatusLog.findFirst({
    orderBy: { timestamp: "desc" },
  });
  const history = await prisma.serverStatusLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 20,
  });
  return NextResponse.json({ latest, history });
}

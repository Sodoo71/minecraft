import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const commands = await prisma.commandQueue.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(commands);
}

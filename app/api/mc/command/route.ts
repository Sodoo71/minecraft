import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const cmd = await prisma.commandQueue.findFirst({
    where: { executed: false },
    orderBy: { createdAt: "asc" },
  });

  if (!cmd) return NextResponse.json(null);

  await prisma.commandQueue.update({
    where: { id: cmd.id },
    data: { executed: true },
  });

  return NextResponse.json(cmd);
}

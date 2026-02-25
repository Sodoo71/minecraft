import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { target, reason } = await req.json();

  await prisma.commandQueue.create({
    data: {
      type: "kick",
      target,
      reason,
    },
  });

  return NextResponse.json({ success: true });
}

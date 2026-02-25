import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.player.upsert({
    where: { uuid: body.uuid },
    update: body,
    create: body,
  });

  return NextResponse.json({ ok: true });
}

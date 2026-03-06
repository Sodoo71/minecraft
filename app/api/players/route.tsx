import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET: Бүх тоглогчдын жагсаалтыг DB-ээс татаж харуулах
 */
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { lastUpdate: "desc" },
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { error: "Мэдээлэл авахад алдаа гарлаа" },
      { status: 500 },
    );
  }
}

/**
 * POST: Тоглогчийн мэдээллийг шинэчлэх эсвэл шинээр үүсгэх (Upsert)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, health, level } = body;

    if (!username) {
      return NextResponse.json(
        { status: "error", message: "Username is required" },
        { status: 400 },
      );
    }

    // Upsert: Хэрэв username байвал Update хийнэ, байхгүй бол Create хийнэ.
    const player = await prisma.player.upsert({
      where: { username: username },
      update: {
        health: health,
        level: level,
        lastUpdate: new Date(),
      },
      create: {
        username: username,
        health: health,
        level: level,
      },
    });

    console.log(`Updated DB: ${username} - HP: ${health}`);
    return NextResponse.json({ status: "success", data: player });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error occurred" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getOnlinePlayers, MinecraftApiError } from "@/lib/minecraft-api";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/players
 * Returns list of online players from the Minecraft server
 * Proxies request to the Minecraft plugin API
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch players from Minecraft server
    const players = await getOnlinePlayers();

    // Log player activity to database (async, don't block response)
    if (players.length > 0) {
      prisma.playerLog
        .createMany({
          data: players.map((p) => ({
            uuid: p.uuid,
            username: p.username,
            action: "ONLINE_SNAPSHOT",
            health: p.health,
            level: p.level,
            world: p.world,
            x: p.x,
            y: p.y,
            z: p.z,
          })),
          skipDuplicates: true,
        })
        .catch((err) => {
          console.error("[API/Players] Failed to log player activity:", err);
        });
    }

    return NextResponse.json(players, {
      headers: {
        // Disable caching for real-time data
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("[API/Players] Error fetching players:", error);

    if (error instanceof MinecraftApiError) {
      return NextResponse.json(
        { error: error.message, details: error.response },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch players from Minecraft server" },
      { status: 503 },
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

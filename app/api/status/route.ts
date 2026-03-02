import { NextRequest, NextResponse } from "next/server";
import { getServerStatus, MinecraftApiError } from "@/lib/minecraft-api";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/status
 * Returns server status from the Minecraft server
 * Includes TPS, RAM usage, and player counts
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch status from Minecraft server
    const status = await getServerStatus();

    // Log server status to database (async, don't block response)
    prisma.serverStatusLog
      .create({
        data: {
          tps1m: status.tps1m,
          tps5m: status.tps5m,
          tps15m: status.tps15m,
          memoryUsed: status.memoryUsed,
          memoryMax: status.memoryMax,
          memoryUsagePercent: status.memoryUsagePercent,
          onlinePlayers: status.onlinePlayers,
          maxPlayers: status.maxPlayers,
          serverVersion: status.serverVersion,
        },
      })
      .catch((err: Error) => {
        console.error("[API/Status] Failed to log server status:", err);
      });

    return NextResponse.json(status, {
      headers: {
        // Disable caching for real-time data
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("[API/Status] Error fetching status:", error);

    if (error instanceof MinecraftApiError) {
      return NextResponse.json(
        { error: error.message, details: error.response },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch server status from Minecraft server" },
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

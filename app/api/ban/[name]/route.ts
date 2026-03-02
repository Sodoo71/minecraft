import { NextRequest, NextResponse } from "next/server";
import { banPlayer, MinecraftApiError } from "@/lib/minecraft-api";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/ban/{name}
 * Bans a player from the Minecraft server
 * Logs the admin action to database
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const playerName = decodeURIComponent(params.name);
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Banned by admin";
    const expiresMs = body.expiresMs; // Optional: milliseconds until expiration
    const adminId = body.adminId || "unknown";
    const adminName = body.adminName || "Unknown Admin";

    console.log(`[API/Ban] Admin ${adminName} banning player ${playerName}`);

    // Execute ban on Minecraft server
    const result = await banPlayer(playerName, reason, expiresMs);

    // Log admin action to database (async)
    prisma.adminActionLog
      .create({
        data: {
          action: "BAN",
          targetPlayer: playerName,
          targetUuid: result.player || playerName,
          reason: reason,
          expiresAt: expiresMs ? new Date(Date.now() + expiresMs) : null,
          adminId: adminId,
          adminName: adminName,
          success: true,
          details: JSON.stringify(result),
        },
      })
      .catch((err: Error) => {
        console.error("[API/Ban] Failed to log admin action:", err);
      });

    return NextResponse.json({
      success: true,
      message: `Player ${playerName} has been banned`,
      data: result,
    });
  } catch (error) {
    console.error("[API/Ban] Error banning player:", error);

    // Log failed action
    prisma.adminActionLog
      .create({
        data: {
          action: "BAN",
          targetPlayer: params.name,
          reason: "API Error",
          adminId: "unknown",
          adminName: "System",
          success: false,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      })
      .catch(() => {});

    if (error instanceof MinecraftApiError) {
      return NextResponse.json(
        { error: error.message, details: error.response },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Failed to ban player" },
      { status: 500 },
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

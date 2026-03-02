import { NextRequest, NextResponse } from "next/server";
import { opPlayer, MinecraftApiError } from "@/lib/minecraft-api";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/op/{name}
 * Gives operator status to a player
 * Logs the admin action to database
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const playerName = decodeURIComponent(params.name);
    const body = await request.json().catch(() => ({}));
    const adminId = body.adminId || "unknown";
    const adminName = body.adminName || "Unknown Admin";

    console.log(`[API/Op] Admin ${adminName} granting OP to ${playerName}`);

    // Execute OP on Minecraft server
    const result = await opPlayer(playerName);

    // Log admin action to database (async)
    prisma.adminActionLog
      .create({
        data: {
          action: "OP",
          targetPlayer: playerName,
          targetUuid: result.player || playerName,
          reason: "Granted operator status",
          adminId: adminId,
          adminName: adminName,
          success: true,
          details: JSON.stringify(result),
        },
      })
      .catch((err: Error) => {
        console.error("[API/Op] Failed to log admin action:", err);
      });

    return NextResponse.json({
      success: true,
      message: `Player ${playerName} is now an operator`,
      data: result,
    });
  } catch (error) {
    console.error("[API/Op] Error granting OP:", error);

    // Log failed action
    prisma.adminActionLog
      .create({
        data: {
          action: "OP",
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
      { error: "Failed to grant operator status" },
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

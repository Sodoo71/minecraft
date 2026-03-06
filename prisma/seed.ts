import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Players
  const players = await prisma.player.createMany({
    data: [
      {
        uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
        name: "Notch",
        health: 20,
        hunger: 20,
        level: 30,
        dimension: "overworld",
        x: 100.5,
        y: 64,
        z: -200.3,
      },
      {
        uuid: "853c80ef-3c37-49fd-aa49-938b674adae6",
        name: "jeb_",
        health: 18,
        hunger: 15,
        level: 22,
        dimension: "overworld",
        x: -50.2,
        y: 72,
        z: 300.7,
      },
      {
        uuid: "d8d5a923-7b20-43d8-883b-1150148d6955",
        name: "Steve",
        health: 14,
        hunger: 10,
        level: 5,
        dimension: "nether",
        x: 30,
        y: 40,
        z: -15,
      },
      {
        uuid: "ec561538-f3fd-461d-aff5-086b22154bce",
        name: "Alex",
        health: 20,
        hunger: 18,
        level: 12,
        dimension: "overworld",
        x: 500,
        y: 68,
        z: 120.5,
      },
      {
        uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        name: "DragonSlayer",
        health: 8,
        hunger: 6,
        level: 45,
        dimension: "the_end",
        x: 0,
        y: 60,
        z: 0,
      },
    ],
  });
  console.log(`Seeded ${players.count} players`);

  // Seed PlayerLogs
  const logs = await prisma.playerLog.createMany({
    data: [
      { uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5", username: "Notch", action: "join", health: 20, level: 30, world: "overworld", x: 100.5, y: 64, z: -200.3 },
      { uuid: "853c80ef-3c37-49fd-aa49-938b674adae6", username: "jeb_", action: "join", health: 18, level: 22, world: "overworld", x: -50.2, y: 72, z: 300.7 },
      { uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5", username: "Notch", action: "leave", health: 16, level: 30, world: "overworld", x: 110, y: 64, z: -195 },
      { uuid: "d8d5a923-7b20-43d8-883b-1150148d6955", username: "Steve", action: "join", health: 14, level: 5, world: "nether", x: 30, y: 40, z: -15 },
      { uuid: "ec561538-f3fd-461d-aff5-086b22154bce", username: "Alex", action: "join", health: 20, level: 12, world: "overworld", x: 500, y: 68, z: 120.5 },
    ],
  });
  console.log(`Seeded ${logs.count} player logs`);

  // Seed ServerStatusLogs
  const statusLogs = await prisma.serverStatusLog.createMany({
    data: [
      { tps1m: 20.0, tps5m: 19.8, tps15m: 19.5, memoryUsed: 2048, memoryMax: 4096, memoryUsagePercent: 50, onlinePlayers: 5, maxPlayers: 20, motd: "Minecraft Server", version: "1.21.4" },
      { tps1m: 19.5, tps5m: 19.2, tps15m: 19.0, memoryUsed: 2200, memoryMax: 4096, memoryUsagePercent: 53.7, onlinePlayers: 8, maxPlayers: 20, motd: "Minecraft Server", version: "1.21.4" },
      { tps1m: 18.0, tps5m: 18.5, tps15m: 19.0, memoryUsed: 3000, memoryMax: 4096, memoryUsagePercent: 73.2, onlinePlayers: 15, maxPlayers: 20, motd: "Minecraft Server", version: "1.21.4" },
    ],
  });
  console.log(`Seeded ${statusLogs.count} server status logs`);

  // Seed AdminActionLogs
  const adminLogs = await prisma.adminActionLog.createMany({
    data: [
      { action: "kick", targetPlayer: "Griefer123", targetUuid: "f1e2d3c4-b5a6-7890-1234-567890abcdef", reason: "Griefing spawn area", adminId: "admin1", adminName: "ServerAdmin", success: true, details: "Player was kicked from the server" },
      { action: "ban", targetPlayer: "HackerX", targetUuid: "a9b8c7d6-e5f4-3210-fedc-ba0987654321", reason: "Using fly hacks", adminId: "admin1", adminName: "ServerAdmin", success: true, details: "Permanent ban applied" },
      { action: "op", targetPlayer: "jeb_", targetUuid: "853c80ef-3c37-49fd-aa49-938b674adae6", reason: "Trusted player", adminId: "admin1", adminName: "ServerAdmin", success: true, details: "Operator status granted" },
    ],
  });
  console.log(`Seeded ${adminLogs.count} admin action logs`);

  // Seed CommandQueue
  const commands = await prisma.commandQueue.createMany({
    data: [
      { type: "say", target: "all", reason: "Server restart in 5 minutes", executed: true, executedAt: new Date() },
      { type: "give", target: "Notch", reason: "diamond_sword 1", executed: false },
      { type: "tp", target: "Steve", reason: "0 64 0", executed: false },
    ],
  });
  console.log(`Seeded ${commands.count} command queue entries`);

  // Seed DashboardUser
  const users = await prisma.dashboardUser.createMany({
    data: [
      { email: "admin@minecraft.local", username: "admin", passwordHash: "$2b$10$placeholder_hash_admin", role: "admin", isActive: true },
      { email: "mod@minecraft.local", username: "moderator", passwordHash: "$2b$10$placeholder_hash_mod", role: "moderator", isActive: true },
    ],
  });
  console.log(`Seeded ${users.count} dashboard users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });

import type {
  Player,
  ServerStatusLog,
  AdminActionLog,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const players = await prisma.player.findMany({
    orderBy: { updated: "desc" },
  });
  const serverStatus = await prisma.serverStatusLog.findFirst({
    orderBy: { timestamp: "desc" },
  });
  const recentActions = await prisma.adminActionLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Players Online</div>
          <div className="text-3xl font-bold">
            {serverStatus?.onlinePlayers ?? 0}
            <span className="text-sm font-normal text-gray-400">
              /{serverStatus?.maxPlayers ?? 20}
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">TPS (1m)</div>
          <div className="text-3xl font-bold">
            <span
              className={
                (serverStatus?.tps1m ?? 20) >= 18
                  ? "text-green-600"
                  : (serverStatus?.tps1m ?? 20) >= 15
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            >
              {serverStatus?.tps1m?.toFixed(1) ?? "-"}
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Memory Usage</div>
          <div className="text-3xl font-bold">
            {serverStatus?.memoryUsagePercent?.toFixed(0) ?? "-"}%
          </div>
          <div className="text-xs text-gray-400">
            {serverStatus?.memoryUsed ?? 0}MB / {serverStatus?.memoryMax ?? 0}MB
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Version</div>
          <div className="text-xl font-bold mt-1">
            {serverStatus?.version ?? "-"}
          </div>
        </div>
      </div>

      {/* Players Online */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-bold mb-3">Players ({players.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map((p: Player) => (
            <div key={p.uuid} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm font-bold">
                {p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-gray-500">
                  {p.dimension} &middot; Lvl {p.level}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                HP {p.health}/{20}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Admin Actions */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-bold mb-3">Recent Admin Actions</h3>
        <div className="space-y-2">
          {recentActions.map((a: AdminActionLog) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.action === "ban"
                      ? "bg-red-100 text-red-700"
                      : a.action === "kick"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {a.action}
                </span>
                <span className="font-medium">{a.targetPlayer}</span>
                {a.reason && (
                  <span className="text-gray-400">- {a.reason}</span>
                )}
              </div>
              <div className="text-gray-400 text-xs">
                {a.adminName} &middot;{" "}
                {new Date(a.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

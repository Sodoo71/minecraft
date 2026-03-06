import type { Player, PlayerLog } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function PlayerPage() {
  const players = await prisma.player.findMany({
    orderBy: { updated: "desc" },
  });
  const recentLogs = await prisma.playerLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Players</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p: Player) => (
          <div
            key={p.uuid}
            className="border rounded-xl p-4 shadow-sm space-y-2 bg-white"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{p.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {p.dimension}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Health: {p.health}/20</div>
              <div>Hunger: {p.hunger}/20</div>
              <div>Level: {p.level}</div>
              <div>
                Pos: {p.x.toFixed(0)}, {p.y.toFixed(0)}, {p.z.toFixed(0)}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Updated: {new Date(p.updated).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2">Player</th>
                <th className="text-left px-4 py-2">Action</th>
                <th className="text-left px-4 py-2">World</th>
                <th className="text-left px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log: PlayerLog) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{log.username}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        log.action === "join"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {log.world ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import type {
  ServerStatusLog,
  CommandQueue,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function ServerPage() {
  const latest = await prisma.serverStatusLog.findFirst({
    orderBy: { timestamp: "desc" },
  });
  const history = await prisma.serverStatusLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 10,
  });
  const commands = await prisma.commandQueue.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Server</h1>

      {/* Current Status */}
      {latest ? (
        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Current Status</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Online
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">TPS (1m / 5m / 15m)</div>
              <div className="font-bold">
                {latest.tps1m?.toFixed(1)} / {latest.tps5m?.toFixed(1)} /{" "}
                {latest.tps15m?.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Memory</div>
              <div className="font-bold">
                {latest.memoryUsed}MB / {latest.memoryMax}MB
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    (latest.memoryUsagePercent ?? 0) > 80
                      ? "bg-red-500"
                      : (latest.memoryUsagePercent ?? 0) > 60
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${latest.memoryUsagePercent ?? 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Players</div>
              <div className="font-bold">
                {latest.onlinePlayers} / {latest.maxPlayers}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Version</div>
              <div className="font-bold">{latest.version}</div>
              <div className="text-xs text-gray-400">{latest.motd}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow border text-gray-500">
          No server status data available.
        </div>
      )}

      {/* Status History */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Status History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-left px-4 py-2">TPS</th>
              <th className="text-left px-4 py-2">Memory</th>
              <th className="text-left px-4 py-2">Players</th>
            </tr>
          </thead>
          <tbody>
            {history.map((s: ServerStatusLog) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-2 text-gray-500">
                  {new Date(s.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      (s.tps1m ?? 20) >= 18
                        ? "text-green-600"
                        : (s.tps1m ?? 20) >= 15
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  >
                    {s.tps1m?.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {s.memoryUsagePercent?.toFixed(0)}%
                </td>
                <td className="px-4 py-2">
                  {s.onlinePlayers}/{s.maxPlayers}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Command Queue */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Command Queue</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Target</th>
              <th className="text-left px-4 py-2">Reason</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((c: CommandQueue) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{c.type}</td>
                <td className="px-4 py-2">{c.target}</td>
                <td className="px-4 py-2 text-gray-500">{c.reason ?? "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      c.executed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.executed ? "Executed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

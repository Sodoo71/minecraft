import type { DashboardUser } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const users = await prisma.dashboardUser.findMany({
    orderBy: { createdAt: "desc" },
  });
  const recentAdminLogs = await prisma.adminActionLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Dashboard Users */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Dashboard Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2">Username</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Last Login</th>
              <th className="text-left px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: DashboardUser) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{u.username}</td>
                <td className="px-4 py-2 text-gray-500">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {u.lastLoginAt
                    ? new Date(u.lastLoginAt).toLocaleString()
                    : "Never"}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Action Log */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Admin Action Log</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2">Action</th>
              <th className="text-left px-4 py-2">Target</th>
              <th className="text-left px-4 py-2">Reason</th>
              <th className="text-left px-4 py-2">Admin</th>
              <th className="text-left px-4 py-2">Result</th>
              <th className="text-left px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentAdminLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.action === "ban"
                        ? "bg-red-100 text-red-700"
                        : log.action === "kick"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium">{log.targetPlayer}</td>
                <td className="px-4 py-2 text-gray-500">
                  {log.reason ?? "-"}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {log.adminName ?? "-"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      log.success
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.success ? "Success" : "Failed"}
                  </span>
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
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Cpu, Users, Clock } from "lucide-react";
import type { ServerStatus } from "@/types/minecraft";

interface ServerStatusCardProps {
  status: ServerStatus | null;
  loading: boolean;
}

/**
 * Displays server status information including TPS, RAM, and player count
 */
export function ServerStatusCard({ status, loading }: ServerStatusCardProps) {
  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to fetch server status</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate TPS color based on value
  const getTpsColor = (tps: number) => {
    if (tps >= 18) return "text-green-500";
    if (tps >= 15) return "text-yellow-500";
    return "text-red-500";
  };

  // Calculate memory color based on usage
  const getMemoryColor = (percent: number) => {
    if (percent < 70) return "text-green-500";
    if (percent < 85) return "text-yellow-500";
    return "text-red-500";
  };

  // Format uptime
  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Server Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* TPS Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">TPS</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span
              className={getTpsColor(status.tps1m)}
              title="1 minute average"
            >
              {status.tps1m.toFixed(1)}
            </span>
            <span className="text-muted-foreground">|</span>
            <span
              className={getTpsColor(status.tps5m)}
              title="5 minute average"
            >
              {status.tps5m.toFixed(1)}
            </span>
            <span className="text-muted-foreground">|</span>
            <span
              className={getTpsColor(status.tps15m)}
              title="15 minute average"
            >
              {status.tps15m.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Memory Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Memory</span>
          </div>
          <div className="text-sm">
            <span className={getMemoryColor(status.memoryUsagePercent)}>
              {status.memoryUsed} MB / {status.memoryMax} MB
            </span>
            <span className="text-muted-foreground ml-2">
              ({status.memoryUsagePercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Player Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Players</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">{status.onlinePlayers}</span>
            <span className="text-muted-foreground">
              {" "}
              / {status.maxPlayers}
            </span>
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Uptime</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatUptime(status.uptime)}
          </div>
        </div>

        {/* Version */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground text-center">
            {status.serverVersion}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

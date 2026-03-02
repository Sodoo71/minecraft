"use client";

import { useState } from "react";
import { useMinecraftData } from "@/hooks/useMinecraftData";
import { ServerStatusCard } from "@/components/minecraft/ServerStatusCard";
import { PlayerList } from "@/components/minecraft/PlayerList";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Main Dashboard Page
 * Displays server status and online players with admin controls
 */
export default function DashboardPage() {
  const [refreshRate, setRefreshRate] = useState(5000);
  const {
    players,
    serverStatus,
    loading,
    error,
    lastUpdated,
    refresh,
    kickPlayer,
    banPlayer,
    opPlayer,
  } = useMinecraftData({
    refreshInterval: refreshRate,
    autoRefresh: true,
  });

  const handleKick = async (name: string) => {
    try {
      const result = await kickPlayer(name);
      if (result.success) {
        console.log(`Kicked ${name}`);
      } else {
        console.error(`Failed to kick ${name}:`, result.error);
      }
    } catch (err) {
      console.error("Kick error:", err);
    }
  };

  const handleBan = async (name: string) => {
    try {
      const result = await banPlayer(name);
      if (result.success) {
        console.log(`Banned ${name}`);
      } else {
        console.error(`Failed to ban ${name}:`, result.error);
      }
    } catch (err) {
      console.error("Ban error:", err);
    }
  };

  const handleOp = async (name: string) => {
    try {
      const result = await opPlayer(name);
      if (result.success) {
        console.log(`Granted OP to ${name}`);
      } else {
        console.error(`Failed to OP ${name}:`, result.error);
      }
    } catch (err) {
      console.error("OP error:", err);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Minecraft Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your Minecraft server in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={loading}
            className={loading ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server Status - Takes 1 column */}
        <div className="lg:col-span-1">
          <ServerStatusCard status={serverStatus} loading={loading} />
        </div>

        {/* Player List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PlayerList
            players={players}
            loading={loading}
            onKick={handleKick}
            onBan={handleBan}
            onOp={handleOp}
          />
        </div>
      </div>

      {/* Refresh Rate Selector */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Refresh rate:</span>
        <select
          value={refreshRate}
          onChange={(e) => setRefreshRate(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-background"
        >
          <option value={1000}>1 second</option>
          <option value={5000}>5 seconds</option>
          <option value={10000}>10 seconds</option>
          <option value={30000}>30 seconds</option>
        </select>
      </div>
    </div>
  );
}

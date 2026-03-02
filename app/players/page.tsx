"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  Heart,
  Trophy,
  Wifi,
  Globe,
  MapPin,
  RefreshCw,
  UserMinus,
  Ban,
  UserCog,
  AlertCircle,
} from "lucide-react";
import type { MinecraftPlayer } from "@/types/minecraft";

// Types
interface PlayerAction {
  player: MinecraftPlayer;
  type: "kick" | "ban" | "op";
}

// Helper functions
const getPingColor = (ping: number) => {
  if (ping < 50) return "text-green-500 bg-green-500/10";
  if (ping < 100) return "text-yellow-500 bg-yellow-500/10";
  return "text-red-500 bg-red-500/10";
};

const getHealthPercentage = (health: number) => {
  return Math.min(100, Math.max(0, (health / 20) * 100));
};

const getHealthColor = (percentage: number) => {
  if (percentage > 70) return "bg-green-500";
  if (percentage > 30) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Players Page
 * Shows online players with username, health, level, ping
 * Supports search/filter and live updates
 */
export default function PlayersPage() {
  // State
  const [players, setPlayers] = useState<MinecraftPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actionDialog, setActionDialog] = useState<PlayerAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch players data
  const fetchPlayers = useCallback(async () => {
    try {
      const res = await fetch("/api/players", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setPlayers(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 5 seconds
  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, [fetchPlayers]);

  // Filter players by search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const query = searchQuery.toLowerCase();
    return players.filter(
      (p) =>
        p.username.toLowerCase().includes(query) ||
        p.world.toLowerCase().includes(query),
    );
  }, [players, searchQuery]);

  // Admin actions
  const handleKick = async (player: MinecraftPlayer) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/kick/${encodeURIComponent(player.username)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: "Kicked by admin",
            adminName: "Dashboard Admin",
          }),
        },
      );
      if (res.ok) {
        await fetchPlayers();
      }
    } catch (err) {
      console.error("Kick failed:", err);
    } finally {
      setActionLoading(false);
      setActionDialog(null);
    }
  };

  const handleBan = async (player: MinecraftPlayer) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/ban/${encodeURIComponent(player.username)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: "Banned by admin",
            adminName: "Dashboard Admin",
          }),
        },
      );
      if (res.ok) {
        await fetchPlayers();
      }
    } catch (err) {
      console.error("Ban failed:", err);
    } finally {
      setActionLoading(false);
      setActionDialog(null);
    }
  };

  const handleOp = async (player: MinecraftPlayer) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/op/${encodeURIComponent(player.username)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminName: "Dashboard Admin" }),
        },
      );
      if (res.ok) {
        await fetchPlayers();
      }
    } catch (err) {
      console.error("Op failed:", err);
    } finally {
      setActionLoading(false);
      setActionDialog(null);
    }
  };

  // Execute action based on dialog type
  const executeAction = () => {
    if (!actionDialog) return;
    const { player, type } = actionDialog;
    switch (type) {
      case "kick":
        handleKick(player);
        break;
      case "ban":
        handleBan(player);
        break;
      case "op":
        handleOp(player);
        break;
    }
  };

  // Loading skeleton
  if (loading && players.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Online Players
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor online players
            </p>
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && players.length === 0) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Players</h2>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button onClick={fetchPlayers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Online Players</h1>
          <p className="text-muted-foreground">
            {players.length} players online
            {lastUpdated && (
              <span className="ml-2 text-xs">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchPlayers}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{players.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Trophy className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Level</p>
              <p className="text-2xl font-bold">
                {players.length > 0
                  ? Math.round(
                      players.reduce((a, p) => a + p.level, 0) / players.length,
                    )
                  : 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Health</p>
              <p className="text-2xl font-bold">
                {players.length > 0
                  ? Math.round(
                      players.reduce((a, p) => a + p.health, 0) /
                        players.length,
                    )
                  : 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Wifi className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Ping</p>
              <p className="text-2xl font-bold">
                {players.length > 0
                  ? Math.round(
                      players.reduce((a, p) => a + p.ping, 0) / players.length,
                    )
                  : 0}
                ms
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {searchQuery
                ? "No players match your search"
                : "No players online"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Players will appear here when they join the server"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <Card
              key={player.uuid}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">
                    {player.username}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={getPingColor(player.ping)}
                  >
                    {player.ping}ms
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      <span>Health</span>
                    </div>
                    <span className="font-medium">
                      {player.health.toFixed(1)}/20
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHealthColor(getHealthPercentage(player.health))} transition-all`}
                      style={{
                        width: `${getHealthPercentage(player.health)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Level</span>
                  </div>
                  <span className="font-medium">{player.level}</span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>World</span>
                  </div>
                  <span className="font-medium capitalize">{player.world}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Position</span>
                  </div>
                  <span className="font-mono text-xs">
                    {Math.round(player.x)}, {Math.round(player.y)},{" "}
                    {Math.round(player.z)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setActionDialog({ player, type: "kick" })}
                  >
                    <UserMinus className="h-3.5 w-3.5 mr-1" />
                    Kick
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setActionDialog({ player, type: "ban" })}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" />
                    Ban
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setActionDialog({ player, type: "op" })}
                  >
                    <UserCog className="h-3.5 w-3.5 mr-1" />
                    OP
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === "kick" && "Kick Player"}
              {actionDialog?.type === "ban" && "Ban Player"}
              {actionDialog?.type === "op" && "Grant Operator"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.type === "kick" &&
                `Are you sure you want to kick ${actionDialog.player.username}?`}
              {actionDialog?.type === "ban" &&
                `Are you sure you want to ban ${actionDialog.player.username}? This action cannot be undone.`}
              {actionDialog?.type === "op" &&
                `Are you sure you want to grant operator status to ${actionDialog.player.username}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              disabled={actionLoading}
              variant={actionDialog?.type === "ban" ? "destructive" : "default"}
            >
              {actionLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <>
                  {actionDialog?.type === "kick" && "Kick"}
                  {actionDialog?.type === "ban" && "Ban"}
                  {actionDialog?.type === "op" && "Grant OP"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

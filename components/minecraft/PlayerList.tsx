"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerRow } from "./PlayerRow";
import type { MinecraftPlayer } from "@/types/minecraft";

interface PlayerListProps {
  players: MinecraftPlayer[];
  loading: boolean;
  onKick: (name: string) => void;
  onBan: (name: string) => void;
  onOp: (name: string) => void;
}

/**
 * Displays a list of online players with admin actions
 */
export function PlayerList({
  players,
  loading,
  onKick,
  onBan,
  onOp,
}: PlayerListProps) {
  if (loading && players.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Online Players</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Online Players
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({players.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No players online
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <PlayerRow
                key={player.uuid}
                player={player}
                onKick={onKick}
                onBan={onBan}
                onOp={onOp}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

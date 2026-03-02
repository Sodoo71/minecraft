"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, UserX, Ban, Crown } from "lucide-react";
import type { MinecraftPlayer } from "@/types/minecraft";

interface PlayerRowProps {
  player: MinecraftPlayer;
  onKick: (name: string) => void;
  onBan: (name: string) => void;
  onOp: (name: string) => void;
}

/**
 * Single player row with stats and admin action buttons
 */
export function PlayerRow({ player, onKick, onBan, onOp }: PlayerRowProps) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [opDialogOpen, setOpDialogOpen] = useState(false);

  // Calculate health percentage
  const healthPercent = Math.min(100, (player.health / 20) * 100);
  const getHealthColor = () => {
    if (healthPercent > 70) return "bg-green-500";
    if (healthPercent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      {/* Player Avatar Placeholder */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {player.username.charAt(0).toUpperCase()}
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{player.username}</span>
          <span className="text-xs text-muted-foreground">{player.ping}ms</span>
        </div>

        {/* Health Bar */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px]">
            <div
              className={`h-full ${getHealthColor()} transition-all`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(player.health)}/20 ❤
          </span>
        </div>

        {/* Level and Location */}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>Level {player.level}</span>
          <span>•</span>
          <span className="truncate">
            {player.world} ({player.x}, {player.y}, {player.z})
          </span>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex items-center gap-1">
        {/* Kick Dialog */}
        <Dialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kick Player</DialogTitle>
              <DialogDescription>
                Are you sure you want to kick <strong>{player.username}</strong>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setKickDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onKick(player.username);
                  setKickDialogOpen(false);
                }}
              >
                Kick Player
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ban Dialog */}
        <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              <Ban className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban Player</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban <strong>{player.username}</strong>?
                This will prevent them from joining the server.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onBan(player.username);
                  setBanDialogOpen(false);
                }}
              >
                Ban Player
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* OP Dialog */}
        <Dialog open={opDialogOpen} onOpenChange={setOpDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              <Crown className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Operator Status</DialogTitle>
              <DialogDescription>
                Are you sure you want to grant operator status to{" "}
                <strong>{player.username}</strong>? This will give them full
                administrative access to the server.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  onOp(player.username);
                  setOpDialogOpen(false);
                }}
              >
                Grant OP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

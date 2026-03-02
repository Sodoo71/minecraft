/**
 * TypeScript types for Minecraft Dashboard
 * Mirrors the Java plugin response structures
 */

// Player types
export interface MinecraftPlayer {
  uuid: string;
  username: string;
  health: number;
  hunger: number;
  level: number;
  ping: number;
  world: string;
  x: number;
  y: number;
  z: number;
}

// Server status types
export interface ServerStatus {
  tps1m: number;
  tps5m: number;
  tps15m: number;
  memoryUsed: number;
  memoryMax: number;
  memoryCommitted: number;
  memoryUsagePercent: number;
  onlinePlayers: number;
  maxPlayers: number;
  serverVersion: string;
  bukkitVersion: string;
  uptime: number;
  timestamp: number;
}

// Admin action types
export interface AdminActionResult {
  player: string;
  action: string;
  reason?: string;
  expires?: string;
  isOnline?: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: number;
}

// Dashboard state types
export interface DashboardState {
  players: MinecraftPlayer[];
  serverStatus: ServerStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Admin action log
export interface AdminActionLog {
  id: number;
  action: "KICK" | "BAN" | "OP" | "UNBAN";
  targetPlayer: string;
  targetUuid?: string;
  reason?: string;
  adminName: string;
  success: boolean;
  timestamp: Date;
}

// Player log
export interface PlayerLog {
  id: number;
  uuid: string;
  username: string;
  action: "JOIN" | "LEAVE" | "ONLINE_SNAPSHOT";
  health?: number;
  level?: number;
  world?: string;
  timestamp: Date;
}

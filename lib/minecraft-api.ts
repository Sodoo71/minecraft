/**
 * Minecraft Plugin API Client
 * Handles secure communication with the Minecraft server
 */

// Environment validation
const MC_API_URL = process.env.MINECRAFT_API_URL;
const MC_API_KEY = process.env.MINECRAFT_API_KEY;

if (!MC_API_URL) {
  console.error(
    "[MC-API] ERROR: MINECRAFT_API_URL environment variable is not set",
  );
}

if (!MC_API_KEY) {
  console.error(
    "[MC-API] ERROR: MINECRAFT_API_KEY environment variable is not set",
  );
}

// Types matching the Minecraft plugin response format
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

export interface MinecraftServerStatus {
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

export interface MinecraftApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: number;
}

export interface AdminActionResult {
  player: string;
  action: string;
  reason?: string;
  expires?: string;
  isOnline?: boolean;
}

// API Error class
export class MinecraftApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any,
  ) {
    super(message);
    this.name = "MinecraftApiError";
  }
}

/**
 * Base fetch function with authentication and error handling
 */
async function fetchFromMinecraft<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<MinecraftApiResponse<T>> {
  if (!MC_API_URL || !MC_API_KEY) {
    throw new MinecraftApiError("Minecraft API configuration missing", 500);
  }

  const url = `${MC_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${MC_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    // Disable caching for real-time data
    cache: "no-store",
  });

  let data: MinecraftApiResponse<T>;

  try {
    data = await response.json();
  } catch (e) {
    throw new MinecraftApiError(
      "Invalid JSON response from Minecraft server",
      response.status,
    );
  }

  if (!response.ok) {
    throw new MinecraftApiError(
      data.error || `HTTP ${response.status}`,
      response.status,
      data,
    );
  }

  return data;
}

/**
 * Get list of online players from Minecraft server
 */
export async function getOnlinePlayers(): Promise<MinecraftPlayer[]> {
  const response = await fetchFromMinecraft<MinecraftPlayer[]>("/api/players");
  return response.data || [];
}

/**
 * Get server status from Minecraft server
 */
export async function getServerStatus(): Promise<MinecraftServerStatus> {
  const response =
    await fetchFromMinecraft<MinecraftServerStatus>("/api/status");
  return response.data as MinecraftServerStatus;
}

/**
 * Kick a player from the server
 */
export async function kickPlayer(
  playerName: string,
  reason: string = "Kicked by admin",
): Promise<AdminActionResult> {
  const params = new URLSearchParams({ reason });
  const response = await fetchFromMinecraft<AdminActionResult>(
    `/api/kick/${encodeURIComponent(playerName)}?${params}`,
    { method: "POST" },
  );
  return response.data as AdminActionResult;
}

/**
 * Ban a player from the server
 */
export async function banPlayer(
  playerName: string,
  reason: string = "Banned by admin",
  expiresMs?: number,
): Promise<AdminActionResult> {
  const params = new URLSearchParams({ reason });
  if (expiresMs) {
    params.append("expires", expiresMs.toString());
  }

  const response = await fetchFromMinecraft<AdminActionResult>(
    `/api/ban/${encodeURIComponent(playerName)}?${params}`,
    { method: "POST" },
  );
  return response.data as AdminActionResult;
}

/**
 * Give operator status to a player
 */
export async function opPlayer(playerName: string): Promise<AdminActionResult> {
  const response = await fetchFromMinecraft<AdminActionResult>(
    `/api/op/${encodeURIComponent(playerName)}`,
    { method: "POST" },
  );
  return response.data as AdminActionResult;
}

/**
 * Health check for the Minecraft API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await fetchFromMinecraft("/api/status");
    return true;
  } catch {
    return false;
  }
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  MinecraftPlayer,
  ServerStatus,
  AdminActionResult,
  ApiResponse,
} from "@/types/minecraft";

interface UseMinecraftDataOptions {
  refreshInterval?: number; // milliseconds
  autoRefresh?: boolean;
}

interface UseMinecraftDataReturn {
  players: MinecraftPlayer[];
  serverStatus: ServerStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  kickPlayer: (
    name: string,
    reason?: string,
  ) => Promise<ApiResponse<AdminActionResult>>;
  banPlayer: (
    name: string,
    reason?: string,
    expiresMs?: number,
  ) => Promise<ApiResponse<AdminActionResult>>;
  opPlayer: (name: string) => Promise<ApiResponse<AdminActionResult>>;
}

/**
 * Custom hook for fetching and managing Minecraft server data
 * Handles polling, caching, and admin actions
 */
export function useMinecraftData(
  options: UseMinecraftDataOptions = {},
): UseMinecraftDataReturn {
  const {
    refreshInterval = 5000, // Default 5 seconds
    autoRefresh = true,
  } = options;

  const [players, setPlayers] = useState<MinecraftPlayer[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  /**
   * Fetch both players and server status
   */
  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading((prev) => (lastUpdated ? prev : true));
      setError(null);

      // Fetch both endpoints in parallel
      const [playersRes, statusRes] = await Promise.all([
        fetch("/api/players", { cache: "no-store" }),
        fetch("/api/status", { cache: "no-store" }),
      ]);

      if (!playersRes.ok) {
        throw new Error(`Failed to fetch players: ${playersRes.status}`);
      }
      if (!statusRes.ok) {
        throw new Error(`Failed to fetch status: ${statusRes.status}`);
      }

      const playersData: MinecraftPlayer[] = await playersRes.json();
      const statusData: ServerStatus = await statusRes.json();

      if (isMounted.current) {
        setPlayers(playersData);
        setServerStatus(statusData);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [lastUpdated]);

  /**
   * Kick a player from the server
   */
  const kickPlayer = useCallback(
    async (
      name: string,
      reason: string = "Kicked by admin",
    ): Promise<ApiResponse<AdminActionResult>> => {
      const response = await fetch(`/api/kick/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, adminName: "Dashboard Admin" }),
      });

      const data: ApiResponse<AdminActionResult> = await response.json();

      if (response.ok) {
        // Refresh data after successful action
        await fetchData();
      }

      return data;
    },
    [fetchData],
  );

  /**
   * Ban a player from the server
   */
  const banPlayer = useCallback(
    async (
      name: string,
      reason: string = "Banned by admin",
      expiresMs?: number,
    ): Promise<ApiResponse<AdminActionResult>> => {
      const response = await fetch(`/api/ban/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          expiresMs,
          adminName: "Dashboard Admin",
        }),
      });

      const data: ApiResponse<AdminActionResult> = await response.json();

      if (response.ok) {
        await fetchData();
      }

      return data;
    },
    [fetchData],
  );

  /**
   * Give operator status to a player
   */
  const opPlayer = useCallback(
    async (name: string): Promise<ApiResponse<AdminActionResult>> => {
      const response = await fetch(`/api/op/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminName: "Dashboard Admin" }),
      });

      const data: ApiResponse<AdminActionResult> = await response.json();

      if (response.ok) {
        await fetchData();
      }

      return data;
    },
    [fetchData],
  );

  // Initial fetch and polling
  useEffect(() => {
    isMounted.current = true;

    // Initial fetch
    fetchData();

    // Set up polling if autoRefresh is enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      isMounted.current = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, refreshInterval, autoRefresh]);

  return {
    players,
    serverStatus,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
    kickPlayer,
    banPlayer,
    opPlayer,
  };
}

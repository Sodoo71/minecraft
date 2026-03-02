package com.mcadmin.model;

/**
 * Data model representing server status information
 * Used for API responses to the dashboard
 */
public class ServerStatus {
    private final double tps1m;
    private final double tps5m;
    private final double tps15m;
    private final long memoryUsed;
    private final long memoryMax;
    private final long memoryCommitted;
    private final double memoryUsagePercent;
    private final int onlinePlayers;
    private final int maxPlayers;
    private final String serverVersion;
    private final String bukkitVersion;
    private final long uptime;
    private final long timestamp;

    public ServerStatus(double tps1m, double tps5m, double tps15m, 
                        long memoryUsed, long memoryMax, long memoryCommitted, 
                        double memoryUsagePercent, int onlinePlayers, int maxPlayers,
                        String serverVersion, String bukkitVersion, long uptime, long timestamp) {
        this.tps1m = tps1m;
        this.tps5m = tps5m;
        this.tps15m = tps15m;
        this.memoryUsed = memoryUsed;
        this.memoryMax = memoryMax;
        this.memoryCommitted = memoryCommitted;
        this.memoryUsagePercent = memoryUsagePercent;
        this.onlinePlayers = onlinePlayers;
        this.maxPlayers = maxPlayers;
        this.serverVersion = serverVersion;
        this.bukkitVersion = bukkitVersion;
        this.uptime = uptime;
        this.timestamp = timestamp;
    }

    // Getters required for JSON serialization
    public double getTps1m() { return tps1m; }
    public double getTps5m() { return tps5m; }
    public double getTps15m() { return tps15m; }
    public long getMemoryUsed() { return memoryUsed; }
    public long getMemoryMax() { return memoryMax; }
    public long getMemoryCommitted() { return memoryCommitted; }
    public double getMemoryUsagePercent() { return memoryUsagePercent; }
    public int getOnlinePlayers() { return onlinePlayers; }
    public int getMaxPlayers() { return maxPlayers; }
    public String getServerVersion() { return serverVersion; }
    public String getBukkitVersion() { return bukkitVersion; }
    public long getUptime() { return uptime; }
    public long getTimestamp() { return timestamp; }
}
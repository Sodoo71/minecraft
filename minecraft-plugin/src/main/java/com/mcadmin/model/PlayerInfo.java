package com.mcadmin.model;

/**
 * Data model representing a Minecraft player's information
 * Used for API responses to the dashboard
 */
public class PlayerInfo {
    private final String uuid;
    private final String username;
    private final double health;
    private final int hunger;
    private final int level;
    private final int ping;
    private final String world;
    private final int x;
    private final int y;
    private final int z;

    public PlayerInfo(String uuid, String username, double health, int hunger, 
                      int level, int ping, String world, int x, int y, int z) {
        this.uuid = uuid;
        this.username = username;
        this.health = Math.round(health * 10.0) / 10.0;
        this.hunger = hunger;
        this.level = level;
        this.ping = ping;
        this.world = world;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Getters required for JSON serialization
    public String getUuid() { return uuid; }
    public String getUsername() { return username; }
    public double getHealth() { return health; }
    public int getHunger() { return hunger; }
    public int getLevel() { return level; }
    public int getPing() { return ping; }
    public String getWorld() { return world; }
    public int getX() { return x; }
    public int getY() { return y; }
    public int getZ() { return z; }
}
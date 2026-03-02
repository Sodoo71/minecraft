package com.mcadmin.config;

import com.mcadmin.MCAdminPlugin;
import org.bukkit.configuration.file.FileConfiguration;

/**
 * Configuration manager for MCAdmin plugin
 * Handles all configurable settings including API security
 */
public class PluginConfig {

    private final MCAdminPlugin plugin;
    private int apiPort;
    private String apiKey;
    private boolean debugMode;
    private int maxRequestsPerMinute;
    private boolean logAdminActions;

    public PluginConfig(MCAdminPlugin plugin) {
        this.plugin = plugin;
        reload();
    }

    /**
     * Reloads configuration from config.yml
     */
    public void reload() {
        FileConfiguration config = plugin.getConfig();
        
        // API Server settings
        this.apiPort = config.getInt("api.port", 8080);
        this.apiKey = config.getString("api.key", generateDefaultKey());
        this.debugMode = config.getBoolean("api.debug", false);
        this.maxRequestsPerMinute = config.getInt("api.rate-limit", 60);
        this.logAdminActions = config.getBoolean("logging.admin-actions", true);
        
        // Ensure API key is set
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("CHANGE_THIS_SECRET_KEY")) {
            plugin.getLogger().warning("===============================================");
            plugin.getLogger().warning("WARNING: Default or empty API key detected!");
            plugin.getLogger().warning("Please set a secure API key in config.yml");
            plugin.getLogger().warning("===============================================");
        }
        
        if (debugMode) {
            plugin.getLogger().info("Debug mode enabled - API requests will be logged");
        }
    }

    /**
     * Generates a random default API key
     */
    private String generateDefaultKey() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(32);
        java.security.SecureRandom random = new java.security.SecureRandom();
        for (int i = 0; i < 32; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public int getApiPort() {
        return apiPort;
    }

    public String getApiKey() {
        return apiKey;
    }

    public boolean isDebugMode() {
        return debugMode;
    }

    public int getMaxRequestsPerMinute() {
        return maxRequestsPerMinute;
    }

    public boolean isLogAdminActions() {
        return logAdminActions;
    }
}
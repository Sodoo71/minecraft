package com.mcadmin;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import com.mcadmin.api.APIServer;
import com.mcadmin.config.PluginConfig;
import com.mcadmin.listeners.PlayerListener;

/**
 * Main plugin class for MCAdmin - Minecraft Admin Dashboard
 * Provides REST API endpoints for server management
 */
public class MCAdminPlugin extends JavaPlugin {

    private static MCAdminPlugin instance;
    private APIServer apiServer;
    private PluginConfig config;

    @Override
    public void onEnable() {
        instance = this;
        
        // Save default config
        saveDefaultConfig();
        
        // Initialize configuration
        config = new PluginConfig(this);
        
        // Register event listeners
        getServer().getPluginManager().registerEvents(new PlayerListener(this), this);
        
        // Register commands
        getCommand("mcadmin").setExecutor(new MCAdminCommand(this));
        
        // Start API server asynchronously to avoid blocking main thread
        new BukkitRunnable() {
            @Override
            public void run() {
                startAPIServer();
            }
        }.runTaskAsynchronously(this);
        
        getLogger().info("=================================");
        getLogger().info("MCAdmin Plugin Enabled!");
        getLogger().info("API Server starting on port: " + config.getApiPort());
        getLogger().info("=================================");
    }

    @Override
    public void onDisable() {
        stopAPIServer();
        getLogger().info("MCAdmin Plugin Disabled!");
    }

    /**
     * Starts the embedded HTTP server for REST API
     */
    private void startAPIServer() {
        try {
            apiServer = new APIServer(this, config.getApiPort(), config.getApiKey());
            apiServer.start();
            getLogger().info("API Server started successfully on port " + config.getApiPort());
        } catch (Exception e) {
            getLogger().severe("Failed to start API Server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Stops the embedded HTTP server
     */
    private void stopAPIServer() {
        if (apiServer != null) {
            try {
                apiServer.stop();
                getLogger().info("API Server stopped");
            } catch (Exception e) {
                getLogger().severe("Error stopping API Server: " + e.getMessage());
            }
        }
    }

    /**
     * Reloads the plugin configuration
     */
    public void reload() {
        reloadConfig();
        config.reload();
        getLogger().info("Configuration reloaded");
    }

    /**
     * Gets the plugin instance
     */
    public static MCAdminPlugin getInstance() {
        return instance;
    }

    /**
     * Gets the plugin configuration
     */
    public PluginConfig getPluginConfig() {
        return config;
    }

    /**
     * Gets the API server instance
     */
    public APIServer getApiServer() {
        return apiServer;
    }
}
package com.mcadmin.listeners;

import com.mcadmin.MCAdminPlugin;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

/**
 * Event listener for player join/quit events
 * Can be extended to log player activity to database
 */
public class PlayerListener implements Listener {

    private final MCAdminPlugin plugin;

    public PlayerListener(MCAdminPlugin plugin) {
        this.plugin = plugin;
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerJoin(PlayerJoinEvent event) {
        String playerName = event.getPlayer().getName();
        String uuid = event.getPlayer().getUniqueId().toString();
        
        if (plugin.getPluginConfig().isDebugMode()) {
            plugin.getLogger().info(String.format("[EVENT] Player joined: %s (%s)", playerName, uuid));
        }

        // TODO: Send join event to dashboard via WebSocket or API callback
        // This can be implemented for real-time notifications
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerQuit(PlayerQuitEvent event) {
        String playerName = event.getPlayer().getName();
        String uuid = event.getPlayer().getUniqueId().toString();
        
        if (plugin.getPluginConfig().isDebugMode()) {
            plugin.getLogger().info(String.format("[EVENT] Player left: %s (%s)", playerName, uuid));
        }

        // TODO: Send quit event to dashboard via WebSocket or API callback
    }
}
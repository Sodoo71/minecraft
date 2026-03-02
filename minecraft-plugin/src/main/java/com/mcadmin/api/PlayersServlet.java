package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import com.mcadmin.model.PlayerInfo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Servlet for /api/players endpoint
 * Returns list of online players with their stats
 */
public class PlayersServlet extends BaseServlet {

    public PlayersServlet(MCAdminPlugin plugin, String apiKey) {
        super(plugin, apiKey);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);

        // Validate authentication
        if (!validateAuth(request, response)) {
            return;
        }

        try {
            // Get online players data on the main thread
            List<PlayerInfo> players = new ArrayList<>();
            
            // Use synchronous call since we need player data
            for (Player player : Bukkit.getOnlinePlayers()) {
                PlayerInfo info = new PlayerInfo(
                    player.getUniqueId().toString(),
                    player.getName(),
                    player.getHealth(),
                    player.getFoodLevel(),
                    player.getLevel(),
                    player.getPing(),
                    player.getLocation().getWorld().getName(),
                    player.getLocation().getBlockX(),
                    player.getLocation().getBlockY(),
                    player.getLocation().getBlockZ()
                );
                players.add(info);
            }

            sendSuccess(response, players);
            logRequest(request, 200);

        } catch (Exception e) {
            plugin.getLogger().severe("Error getting players: " + e.getMessage());
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve player data");
        }
    }
}
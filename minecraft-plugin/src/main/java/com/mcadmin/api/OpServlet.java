package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;
import org.bukkit.entity.Player;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet for /api/op/{name} endpoint
 * Gives operator status to a player
 */
public class OpServlet extends BaseServlet {

    public OpServlet(MCAdminPlugin plugin, String apiKey) {
        super(plugin, apiKey);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);

        // Validate authentication
        if (!validateAuth(request, response)) {
            return;
        }

        // Extract player name from path
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Player name required");
            return;
        }

        String playerName = pathInfo.substring(1); // Remove leading slash

        try {
            OfflinePlayer target = Bukkit.getOfflinePlayer(playerName);
            
            if (target == null) {
                sendError(response, HttpServletResponse.SC_NOT_FOUND, "Player not found");
                return;
            }

            // Check if already op
            if (target.isOp()) {
                sendError(response, HttpServletResponse.SC_CONFLICT, "Player is already an operator");
                return;
            }

            // Give operator status on main thread
            Bukkit.getScheduler().runTask(plugin, () -> {
                target.setOp(true);
            });

            // Notify player if online
            if (target.isOnline()) {
                Player onlinePlayer = target.getPlayer();
                if (onlinePlayer != null) {
                    Bukkit.getScheduler().runTask(plugin, () -> {
                        onlinePlayer.sendMessage("§aYou have been granted operator status!");
                    });
                }
            }

            logAdminAction("OP", playerName, "API");

            Map<String, Object> result = new HashMap<>();
            result.put("player", playerName);
            result.put("action", "op");
            result.put("isOnline", target.isOnline());

            sendSuccess(response, "Player is now an operator", result);
            logRequest(request, 200);

        } catch (Exception e) {
            plugin.getLogger().severe("Error giving OP: " + e.getMessage());
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to give operator status");
        }
    }
}
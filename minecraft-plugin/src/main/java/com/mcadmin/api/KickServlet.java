package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet for /api/kick/{name} endpoint
 * Kicks a player from the server
 */
public class KickServlet extends BaseServlet {

    public KickServlet(MCAdminPlugin plugin, String apiKey) {
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
        String reason = request.getParameter("reason");
        if (reason == null || reason.isEmpty()) {
            reason = "Kicked by admin";
        }

        try {
            Player target = Bukkit.getPlayerExact(playerName);
            
            if (target == null || !target.isOnline()) {
                sendError(response, HttpServletResponse.SC_NOT_FOUND, "Player not found or offline");
                return;
            }

            // Check bypass permission
            if (target.hasPermission("mcadmin.bypass")) {
                sendError(response, HttpServletResponse.SC_FORBIDDEN, "Cannot kick this player");
                return;
            }

            // Kick the player on main thread
            final String kickReason = reason;
            Bukkit.getScheduler().runTask(plugin, () -> {
                target.kickPlayer("§cYou have been kicked!\n\n§7Reason: §f" + kickReason);
            });

            logAdminAction("KICK", playerName, "API");

            Map<String, Object> result = new HashMap<>();
            result.put("player", playerName);
            result.put("reason", reason);
            result.put("action", "kick");

            sendSuccess(response, "Player kicked successfully", result);
            logRequest(request, 200);

        } catch (Exception e) {
            plugin.getLogger().severe("Error kicking player: " + e.getMessage());
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to kick player");
        }
    }
}
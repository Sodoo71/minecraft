package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bukkit.BanList;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet for /api/ban/{name} endpoint
 * Bans a player from the server
 */
public class BanServlet extends BaseServlet {

    public BanServlet(MCAdminPlugin plugin, String apiKey) {
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
            reason = "Banned by admin";
        }

        // Parse expiration (if provided)
        String expiresParam = request.getParameter("expires");
        Date expires = null;
        if (expiresParam != null && !expiresParam.isEmpty()) {
            try {
                long expiresMs = Long.parseLong(expiresParam);
                expires = new Date(System.currentTimeMillis() + expiresMs);
            } catch (NumberFormatException e) {
                // Permanent ban
            }
        }

        try {
            Player target = Bukkit.getPlayerExact(playerName);
            
            // Check bypass permission for online players
            if (target != null && target.isOnline() && target.hasPermission("mcadmin.bypass")) {
                sendError(response, HttpServletResponse.SC_FORBIDDEN, "Cannot ban this player");
                return;
            }

            // Ban the player
            BanList banList = Bukkit.getBanList(BanList.Type.NAME);
            banList.addBan(playerName, reason, expires, "MCAdmin API");

            // Kick if online
            if (target != null && target.isOnline()) {
                final String banReason = reason;
                Bukkit.getScheduler().runTask(plugin, () -> {
                    target.kickPlayer("§cYou have been banned!\n\n§7Reason: §f" + banReason);
                });
            }

            logAdminAction("BAN", playerName, "API");

            Map<String, Object> result = new HashMap<>();
            result.put("player", playerName);
            result.put("reason", reason);
            result.put("expires", expires != null ? expires.toString() : "permanent");
            result.put("action", "ban");

            sendSuccess(response, "Player banned successfully", result);
            logRequest(request, 200);

        } catch (Exception e) {
            plugin.getLogger().severe("Error banning player: " + e.getMessage());
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to ban player");
        }
    }
}
package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import com.mcadmin.model.ServerStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bukkit.Bukkit;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

/**
 * Servlet for /api/status endpoint
 * Returns server status including TPS, RAM, and player count
 */
public class StatusServlet extends BaseServlet {

    public StatusServlet(MCAdminPlugin plugin, String apiKey) {
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
            // Get memory usage
            MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
            MemoryUsage heapUsage = memoryMXBean.getHeapMemoryUsage();
            
            long usedMemoryMB = heapUsage.getUsed() / 1024 / 1024;
            long maxMemoryMB = heapUsage.getMax() / 1024 / 1024;
            long committedMemoryMB = heapUsage.getCommitted() / 1024 / 1024;
            double memoryUsagePercent = (double) heapUsage.getUsed() / heapUsage.getCommitted() * 100;

            // Get TPS using Paper's API if available
            double[] tps = getTPS();
            
            // Get server info
            int onlinePlayers = Bukkit.getOnlinePlayers().size();
            int maxPlayers = Bukkit.getMaxPlayers();
            String serverVersion = Bukkit.getVersion();
            String bukkitVersion = Bukkit.getBukkitVersion();
            long uptime = ManagementFactory.getRuntimeMXBean().getUptime();

            ServerStatus status = new ServerStatus(
                tps[0], // 1m TPS
                tps[1], // 5m TPS
                tps[2], // 15m TPS
                usedMemoryMB,
                maxMemoryMB,
                committedMemoryMB,
                Math.round(memoryUsagePercent * 100.0) / 100.0,
                onlinePlayers,
                maxPlayers,
                serverVersion,
                bukkitVersion,
                uptime,
                System.currentTimeMillis()
            );

            sendSuccess(response, status);
            logRequest(request, 200);

        } catch (Exception e) {
            plugin.getLogger().severe("Error getting server status: " + e.getMessage());
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve server status");
        }
    }

    /**
     * Gets TPS values from the server
     * Uses reflection to access Paper's TPS method
     */
    private double[] getTPS() {
        double[] tps = new double[] { 20.0, 20.0, 20.0 };
        
        try {
            // Try Paper's getTPS method
            Object server = Bukkit.getServer().getClass().getMethod("getServer").invoke(Bukkit.getServer());
            double[] serverTps = (double[]) server.getClass().getField("recentTps").get(server);
            
            if (serverTps != null && serverTps.length >= 3) {
                tps = new double[] {
                    round(serverTps[0]),
                    round(serverTps[1]),
                    round(serverTps[2])
                };
            }
        } catch (Exception e) {
            // Fallback: return default TPS
        }
        
        return tps;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
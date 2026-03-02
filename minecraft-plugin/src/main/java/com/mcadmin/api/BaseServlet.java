package com.mcadmin.api;

import com.google.gson.Gson;
import com.mcadmin.MCAdminPlugin;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * Base servlet class with common functionality for all API endpoints
 * Handles authentication, CORS, and JSON responses
 */
public abstract class BaseServlet extends HttpServlet {

    protected final MCAdminPlugin plugin;
    protected final String apiKey;
    protected final Gson gson = new Gson();

    public BaseServlet(MCAdminPlugin plugin, String apiKey) {
        this.plugin = plugin;
        this.apiKey = apiKey;
    }

    /**
     * Validates API key from Authorization header
     * Expected format: Authorization: Bearer <api_key>
     */
    protected boolean validateAuth(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            logRequest(request, 401);
            return false;
        }

        String token = authHeader.substring(7);
        if (!token.equals(apiKey)) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid API key");
            logRequest(request, 401);
            return false;
        }

        return true;
    }

    /**
     * Sends a JSON error response
     */
    protected void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        error.put("timestamp", System.currentTimeMillis());

        PrintWriter out = response.getWriter();
        out.print(gson.toJson(error));
        out.flush();
    }

    /**
     * Sends a JSON success response
     */
    protected void sendSuccess(HttpServletResponse response, Object data) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", data);
        result.put("timestamp", System.currentTimeMillis());

        PrintWriter out = response.getWriter();
        out.print(gson.toJson(result));
        out.flush();
    }

    /**
     * Sends a JSON success response with custom message
     */
    protected void sendSuccess(HttpServletResponse response, String message, Object data) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", message);
        result.put("data", data);
        result.put("timestamp", System.currentTimeMillis());

        PrintWriter out = response.getWriter();
        out.print(gson.toJson(result));
        out.flush();
    }

    /**
     * Sets CORS headers for cross-origin requests
     */
    protected void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }

    /**
     * Logs the request for audit purposes
     */
    protected void logRequest(HttpServletRequest request, int status) {
        if (plugin.getPluginConfig().isDebugMode()) {
            plugin.getLogger().info(String.format(
                "[API] %s %s - %d - %s",
                request.getMethod(),
                request.getRequestURI(),
                status,
                request.getRemoteAddr()
            ));
        }
    }

    /**
     * Logs admin actions
     */
    protected void logAdminAction(String action, String target, String admin) {
        if (plugin.getPluginConfig().isLogAdminActions()) {
            plugin.getLogger().info(String.format(
                "[ADMIN] %s performed %s on %s",
                admin, action, target
            ));
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
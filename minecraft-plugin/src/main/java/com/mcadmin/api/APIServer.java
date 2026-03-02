package com.mcadmin.api;

import com.mcadmin.MCAdminPlugin;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.thread.QueuedThreadPool;

/**
 * Embedded Jetty HTTP server for REST API
 * Handles all incoming HTTP requests
 */
public class APIServer {

    private final MCAdminPlugin plugin;
    private final int port;
    private final String apiKey;
    private Server server;
    private boolean running = false;

    public APIServer(MCAdminPlugin plugin, int port, String apiKey) {
        this.plugin = plugin;
        this.port = port;
        this.apiKey = apiKey;
    }

    /**
     * Starts the HTTP server
     */
    public void start() throws Exception {
        // Configure thread pool
        QueuedThreadPool threadPool = new QueuedThreadPool();
        threadPool.setMaxThreads(50);
        threadPool.setMinThreads(10);
        
        server = new Server(threadPool);
        
        // Configure connector
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(port);
        connector.setIdleTimeout(30000);
        server.addConnector(connector);
        
        // Configure servlet context
        ServletContextHandler context = new ServletContextHandler();
        context.setContextPath("/");
        server.setHandler(context);
        
        // Add servlets for each endpoint
        context.addServlet(new ServletHolder(new PlayersServlet(plugin, apiKey)), "/api/players");
        context.addServlet(new ServletHolder(new StatusServlet(plugin, apiKey)), "/api/status");
        context.addServlet(new ServletHolder(new KickServlet(plugin, apiKey)), "/api/kick/*");
        context.addServlet(new ServletHolder(new BanServlet(plugin, apiKey)), "/api/ban/*");
        context.addServlet(new ServletHolder(new OpServlet(plugin, apiKey)), "/api/op/*");
        
        // Start server
        server.start();
        running = true;
    }

    /**
     * Stops the HTTP server
     */
    public void stop() throws Exception {
        if (server != null) {
            server.stop();
            running = false;
        }
    }

    /**
     * Checks if the server is running
     */
    public boolean isRunning() {
        return running && server != null && server.isRunning();
    }
}
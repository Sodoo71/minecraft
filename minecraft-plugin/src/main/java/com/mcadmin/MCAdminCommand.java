package com.mcadmin;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

/**
 * Command executor for /mcadmin command
 */
public class MCAdminCommand implements CommandExecutor {

    private final MCAdminPlugin plugin;

    public MCAdminCommand(MCAdminPlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sendHelp(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "reload":
                if (!sender.hasPermission("mcadmin.admin")) {
                    sender.sendMessage(ChatColor.RED + "You don't have permission to use this command.");
                    return true;
                }
                plugin.reload();
                sender.sendMessage(ChatColor.GREEN + "MCAdmin configuration reloaded!");
                break;

            case "status":
                if (!sender.hasPermission("mcadmin.admin")) {
                    sender.sendMessage(ChatColor.RED + "You don't have permission to use this command.");
                    return true;
                }
                sendStatus(sender);
                break;

            default:
                sendHelp(sender);
                break;
        }

        return true;
    }

    private void sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== MCAdmin Commands ===");
        sender.sendMessage(ChatColor.YELLOW + "/mcadmin reload" + ChatColor.GRAY + " - Reload configuration");
        sender.sendMessage(ChatColor.YELLOW + "/mcadmin status" + ChatColor.GRAY + " - Show API server status");
    }

    private void sendStatus(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== MCAdmin Status ===");
        sender.sendMessage(ChatColor.YELLOW + "Plugin Version: " + ChatColor.WHITE + plugin.getDescription().getVersion());
        sender.sendMessage(ChatColor.YELLOW + "API Port: " + ChatColor.WHITE + plugin.getPluginConfig().getApiPort());
        sender.sendMessage(ChatColor.YELLOW + "API Server: " + 
            (plugin.getApiServer() != null && plugin.getApiServer().isRunning() 
                ? ChatColor.GREEN + "Running" 
                : ChatColor.RED + "Stopped"));
        sender.sendMessage(ChatColor.YELLOW + "Online Players: " + ChatColor.WHITE + plugin.getServer().getOnlinePlayers().size());
    }
}
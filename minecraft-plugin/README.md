# MCAdmin - Minecraft Admin Dashboard Plugin

A Paper/Spigot plugin that provides a secure REST API for managing your Minecraft server remotely.

## Features

- 🔒 **Secure REST API** with API key authentication
- 📊 **Real-time server status** (TPS, RAM, player count)
- 👥 **Online player tracking** with health, level, and location
- ⚡ **Admin actions**: Kick, Ban, and OP players
- 📝 **Audit logging** for all admin actions
- 🔥 **Lightweight** embedded Jetty server

## Requirements

- Minecraft 1.20+ (Paper/Spigot)
- Java 17+
- Maven 3.6+ (for building)

## Installation

### 1. Build the Plugin

```bash
# Clone or download the plugin source
cd minecraft-plugin

# Build with Maven
mvn clean package

# The compiled JAR will be in:
# target/mc-admin-plugin-1.0.0.jar
```

### 2. Install on Your Minecraft Server

1. Copy `target/mc-admin-plugin-1.0.0.jar` to your server's `plugins/` folder
2. Start the server to generate the configuration file
3. Stop the server
4. Edit `plugins/MCAdmin/config.yml` and set a secure API key
5. Restart the server

### 3. Configure the Plugin

Edit `plugins/MCAdmin/config.yml`:

```yaml
api:
  port: 8080
  key: "YOUR_SECURE_RANDOM_KEY_HERE" # CHANGE THIS!
  debug: false
  rate-limit: 60

logging:
  admin-actions: true
```

### 4. Open Firewall Port

Make sure the API port (default 8080) is accessible from your dashboard:

```bash
# Example: Open port 8080 on Linux with UFW
sudo ufw allow 8080/tcp

# Or with iptables
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
```

## API Endpoints

All endpoints require an `Authorization: Bearer YOUR_API_KEY` header.

### GET /api/players

Returns list of online players.

```json
{
  "success": true,
  "data": [
    {
      "uuid": "...",
      "username": "Steve",
      "health": 20.0,
      "hunger": 20,
      "level": 30,
      "ping": 45,
      "world": "world",
      "x": 100,
      "y": 64,
      "z": -200
    }
  ],
  "timestamp": 1234567890
}
```

### GET /api/status

Returns server status.

```json
{
  "success": true,
  "data": {
    "tps1m": 20.0,
    "tps5m": 19.95,
    "tps15m": 19.98,
    "memoryUsed": 1024,
    "memoryMax": 4096,
    "memoryUsagePercent": 25.0,
    "onlinePlayers": 10,
    "maxPlayers": 100,
    "serverVersion": "1.20.4",
    "uptime": 3600000
  },
  "timestamp": 1234567890
}
```

### POST /api/kick/{playerName}?reason=...

Kicks a player from the server.

### POST /api/ban/{playerName}?reason=...&expires={ms}

Bans a player. Optional `expires` parameter for temporary bans (milliseconds).

### POST /api/op/{playerName}

Grants operator status to a player.

## Commands

- `/mcadmin reload` - Reload configuration
- `/mcadmin status` - Show API server status

## Permissions

- `mcadmin.admin` - Access to /mcadmin command (default: op)
- `mcadmin.bypass` - Cannot be kicked/banned via API (default: op)

## Security Best Practices

1. **Always change the default API key** - Use a strong, random 32+ character key
2. **Restrict access by IP** - Use a firewall to only allow dashboard IP
3. **Use HTTPS** - Put the API behind a reverse proxy with SSL
4. **Monitor logs** - Enable debug mode temporarily to audit requests
5. **Regular updates** - Keep the plugin updated

## Troubleshooting

### Plugin won't start

- Check Java version (requires Java 17+)
- Check server logs for port conflicts

### Can't connect to API

- Verify the port is open in firewall
- Check `config.yml` has correct API key
- Test with curl: `curl -H "Authorization: Bearer YOUR_KEY" http://server:8080/api/status`

### High CPU usage

- Lower the rate limit in config
- Disable debug mode

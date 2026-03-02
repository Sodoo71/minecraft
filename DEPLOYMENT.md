# Minecraft Admin Dashboard - Deployment Guide

Complete deployment instructions for setting up the full Minecraft Admin Dashboard stack.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                  Next.js Dashboard UI                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VERCEL / NEXT.JS SERVER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ /api/players│  │ /api/status │  │ /api/kick/[name] │    │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘    │
│         │                │                   │              │
│         └────────────────┴───────────────────┘              │
│                          │                                  │
│                     Prisma Client                          │
│                          │                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│  PostgreSQL │   │  Minecraft   │   │   Plugin    │
│  (Vercel/   │   │   Server     │   │   REST API  │
│   Railway)  │   │ (Paper/      │   │  (Port 8080)│
│             │   │  Spigot)     │   │             │
└─────────────┘   └──────────────┘   └─────────────┘
```

## Prerequisites

- Node.js 18+
- PostgreSQL database (local, Vercel Postgres, Railway, or Supabase)
- Minecraft server with Java 17+
- A Vercel account (for dashboard hosting)

---

## Part 1: Minecraft Server Setup

### 1. Install Paper/Spigot Server

```bash
# Download Paper 1.20.4
curl -o server.jar https://api.papermc.io/v2/projects/paper/versions/1.20.4/builds/496/downloads/paper-1.20.4-496.jar

# Create start script
echo "java -Xms1G -Xmx4G -jar server.jar nogui" > start.sh
chmod +x start.sh

# First run to generate files
./start.sh

# Accept EULA
echo "eula=true" > eula.txt
```

### 2. Build and Install the Plugin

```bash
# Navigate to plugin directory
cd minecraft-plugin

# Build the plugin
mvn clean package

# Copy to server
cp target/mc-admin-plugin-1.0.0.jar /path/to/minecraft-server/plugins/

# Start server to generate config
./start.sh
```

### 3. Configure the Plugin

Edit `plugins/MCAdmin/config.yml`:

```yaml
api:
  port: 8080
  key: "REPLACE_WITH_32_CHAR_RANDOM_STRING" # IMPORTANT!
  debug: false
  rate-limit: 60

logging:
  admin-actions: true

security:
  ip-whitelist: []
  require-https: false
```

### 4. Open Firewall

```bash
# Ubuntu/Debian with UFW
sudo ufw allow 8080/tcp
sudo ufw allow 25565/tcp  # Minecraft port

# Or iptables
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT
```

---

## Part 2: Database Setup

### Option A: Vercel Postgres (Recommended for Vercel hosting)

```bash
# Install Vercel CLI
npm i -g vercel

# Add Postgres to your project
vercel storage add postgres

# Follow the prompts - this will set DATABASE_URL automatically
```

### Option B: Railway

1. Go to [Railway.app](https://railway.app)
2. Create a new project → Provision PostgreSQL
3. Copy the `DATABASE_URL` from Variables

### Option C: Local PostgreSQL

```bash
# Create database
createdb minecraft_dashboard

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/minecraft_dashboard"
```

### Run Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

---

## Part 3: Dashboard Deployment

### 1. Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL="your-postgres-url"

# Minecraft API
MINECRAFT_API_URL="http://your-server-ip:8080"
MINECRAFT_API_KEY="your-minecraft-plugin-api-key"

# Next.js
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Dashboard will be at http://localhost:3000
```

### 3. Deploy to Vercel

```bash
# Using Vercel CLI
vercel

# Or deploy from GitHub
# 1. Push code to GitHub
# 2. Import project on Vercel
# 3. Add environment variables
# 4. Deploy
```

### Required Environment Variables on Vercel

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| `DATABASE_URL`      | PostgreSQL connection string   |
| `MINECRAFT_API_URL` | Your Minecraft server API URL  |
| `MINECRAFT_API_KEY` | API key from plugin config.yml |

---

## Part 4: Security Checklist

### 🔒 Minecraft Plugin Security

- [ ] Changed default API key to 32+ random characters
- [ ] Restricted API port access to dashboard IP only
- [ ] Enabled HTTPS (via reverse proxy if possible)
- [ ] Set appropriate rate limits
- [ ] Enabled admin action logging

### 🔒 Dashboard Security

- [ ] Used strong PostgreSQL password
- [ ] Restricted database access
- [ ] Set up proper CORS rules
- [ ] Added authentication (recommended: NextAuth.js)
- [ ] Used HTTPS only

### 🔒 Network Security

```bash
# Example: Restrict API to specific IP (iptables)
sudo iptables -A INPUT -p tcp --dport 8080 -s YOUR_VERCEL_IP -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j DROP

# Example: nginx reverse proxy with SSL
server {
    listen 443 ssl;
    server_name mc-api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Part 5: Testing

### Test Minecraft Plugin API

```bash
# Test server status
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://your-server:8080/api/status

# Test players endpoint
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://your-server:8080/api/players
```

### Test Dashboard API Routes

```bash
# Test dashboard players endpoint
curl http://localhost:3000/api/players

# Test status endpoint
curl http://localhost:3000/api/status
```

---

## Troubleshooting

### Connection Refused

1. Check firewall rules
2. Verify plugin is loaded: `/mcadmin status`
3. Check port is correct in config

### Authentication Failed

1. Verify API key matches between plugin and dashboard
2. Check `Authorization: Bearer` header format
3. Ensure no extra spaces in API key

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check database is running
3. Verify network access (for remote DB)

### CORS Errors

1. Check API routes include CORS headers
2. Verify domain matches `NEXT_PUBLIC_APP_URL`

---

## Maintenance

### Updating the Plugin

```bash
# Backup old plugin
cp plugins/mc-admin-plugin.jar plugins/mc-admin-plugin.jar.backup

# Copy new version
cp target/mc-admin-plugin-1.0.1.jar plugins/

# Restart server
```

### Database Backups

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20240101.sql
```

### Monitoring

1. Check Vercel Analytics for dashboard usage
2. Monitor PostgreSQL connection limits
3. Watch Minecraft server console for plugin errors

---

## Support

For issues and questions:

1. Check plugin logs in `logs/latest.log`
2. Review dashboard logs on Vercel
3. Enable debug mode in plugin config temporarily

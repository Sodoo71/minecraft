# Minecraft Admin Dashboard

A full-stack real-time Minecraft Admin & Player Dashboard built with Next.js 14, Prisma, and a custom Paper/Spigot plugin.

## 🚀 Live Demo

https://minecraft-nine-zeta.vercel.app/

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Security](#security)

## 🏗️ Architecture

This project consists of 3 main components:

### 1. Minecraft Plugin (Java/Paper)

- Embedded Jetty HTTP server
- Secure REST API with API key authentication
- Real-time player and server data
- Admin actions: Kick, Ban, OP

### 2. Next.js Backend API

- Proxies requests to Minecraft plugin
- Database logging for audit trail
- Environment-based configuration
- CORS and security headers

### 3. Next.js Frontend Dashboard

- Real-time player list with polling
- Server status monitoring (TPS, RAM, players)
- Admin controls with confirmation dialogs
- Responsive Tailwind CSS design

## ✨ Features

### Real-time Monitoring

- ✅ Live online player list
- ✅ Player health, level, ping, and location
- ✅ Server TPS (Ticks Per Second) monitoring
- ✅ RAM usage tracking
- ✅ Auto-refresh with configurable intervals

### Admin Actions

- ✅ Kick players with custom reason
- ✅ Ban players (temporary or permanent)
- ✅ Grant operator status
- ✅ Confirmation dialogs for destructive actions

### Data Persistence

- ✅ Player activity logs
- ✅ Admin action audit trail
- ✅ Server status history
- ✅ PostgreSQL database with Prisma ORM

### Security

- ✅ API key authentication
- ✅ Request rate limiting
- ✅ IP whitelisting support
- ✅ CORS protection
- ✅ Input validation

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── players/route.ts      # GET /api/players
│   │   ├── status/route.ts       # GET /api/status
│   │   ├── kick/[name]/route.ts  # POST /api/kick/:name
│   │   ├── ban/[name]/route.ts   # POST /api/ban/:name
│   │   └── op/[name]/route.ts    # POST /api/op/:name
│   ├── dashboard/page.tsx        # Main dashboard
│   └── ...
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── minecraft/                # Minecraft-specific components
│       ├── ServerStatusCard.tsx
│       ├── PlayerList.tsx
│       └── PlayerRow.tsx
├── hooks/
│   └── useMinecraftData.ts       # Custom hook for data fetching
├── lib/
│   ├── minecraft-api.ts          # Minecraft API client
│   └── prisma.ts                 # Prisma client
├── types/
│   └── minecraft.ts              # TypeScript types
├── prisma/
│   └── schema.prisma             # Database schema
└── minecraft-plugin/             # Java Plugin Source
    ├── src/main/java/com/mcadmin/
    │   ├── MCAdminPlugin.java    # Main plugin class
    │   ├── api/                  # API servlets
    │   ├── config/               # Configuration
    │   ├── listeners/            # Event listeners
    │   └── model/                # Data models
    └── pom.xml                   # Maven build file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Java 17+ (for plugin)
- Maven 3.6+ (for plugin)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/minecraft-dashboard.git
cd minecraft-dashboard

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env.local

# Edit with your values
DATABASE_URL="postgresql://user:pass@localhost:5432/minecraft"
MINECRAFT_API_URL="http://your-mc-server:8080"
MINECRAFT_API_KEY="your-secret-key"
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Build and Install Plugin

```bash
cd minecraft-plugin
mvn clean package
cp target/mc-admin-plugin-1.0.0.jar /path/to/minecraft/plugins/
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📚 Documentation

- [Plugin README](minecraft-plugin/README.md) - Plugin installation and configuration
- [Deployment Guide](DEPLOYMENT.md) - Full deployment instructions
- [API Reference](#api-reference) - API endpoints and usage

## 🔒 Security

### API Authentication

All requests to the Minecraft plugin require an `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

### Recommended Security Measures

1. **Change the default API key** - Use a 32+ character random string
2. **Restrict by IP** - Firewall the API port to only accept dashboard connections
3. **Use HTTPS** - Deploy behind a reverse proxy with SSL
4. **Enable logging** - Monitor admin actions for audit purposes
5. **Rate limiting** - Built-in rate limiting protects against abuse

### Firewall Configuration

```bash
# Allow only dashboard IP
sudo ufw allow from YOUR_DASHBOARD_IP to any port 8080

# Or with iptables
sudo iptables -A INPUT -p tcp --dport 8080 -s YOUR_DASHBOARD_IP -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j DROP
```

## 🔌 API Reference

### Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/api/players`     | List online players |
| GET    | `/api/status`      | Server status       |
| POST   | `/api/kick/{name}` | Kick player         |
| POST   | `/api/ban/{name}`  | Ban player          |
| POST   | `/api/op/{name}`   | Grant OP status     |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1234567890
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Prisma](https://prisma.io/)
- Plugin uses [PaperMC](https://papermc.io/)

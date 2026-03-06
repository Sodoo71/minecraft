-- AlterTable
ALTER TABLE "CommandQueue" ADD COLUMN     "executedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "health" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "PlayerLog" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "health" DOUBLE PRECISION,
    "level" INTEGER,
    "world" TEXT,
    "x" INTEGER,
    "y" INTEGER,
    "z" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminActionLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "targetPlayer" TEXT NOT NULL,
    "targetUuid" TEXT,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerStatusLog" (
    "id" SERIAL NOT NULL,
    "tps1m" DOUBLE PRECISION NOT NULL,
    "tps5m" DOUBLE PRECISION NOT NULL,
    "tps15m" DOUBLE PRECISION NOT NULL,
    "memoryUsed" INTEGER NOT NULL,
    "memoryMax" INTEGER NOT NULL,
    "memoryUsagePercent" DOUBLE PRECISION NOT NULL,
    "onlinePlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "serverVersion" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerLog_uuid_idx" ON "PlayerLog"("uuid");

-- CreateIndex
CREATE INDEX "PlayerLog_timestamp_idx" ON "PlayerLog"("timestamp");

-- CreateIndex
CREATE INDEX "PlayerLog_action_idx" ON "PlayerLog"("action");

-- CreateIndex
CREATE INDEX "AdminActionLog_action_idx" ON "AdminActionLog"("action");

-- CreateIndex
CREATE INDEX "AdminActionLog_targetPlayer_idx" ON "AdminActionLog"("targetPlayer");

-- CreateIndex
CREATE INDEX "AdminActionLog_timestamp_idx" ON "AdminActionLog"("timestamp");

-- CreateIndex
CREATE INDEX "AdminActionLog_adminId_idx" ON "AdminActionLog"("adminId");

-- CreateIndex
CREATE INDEX "ServerStatusLog_timestamp_idx" ON "ServerStatusLog"("timestamp");

-- CreateIndex
CREATE INDEX "ServerStatusLog_onlinePlayers_idx" ON "ServerStatusLog"("onlinePlayers");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardUser_email_key" ON "DashboardUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardUser_username_key" ON "DashboardUser"("username");

-- CreateIndex
CREATE INDEX "DashboardUser_email_idx" ON "DashboardUser"("email");

-- CreateIndex
CREATE INDEX "DashboardUser_role_idx" ON "DashboardUser"("role");

-- CreateIndex
CREATE INDEX "CommandQueue_executed_idx" ON "CommandQueue"("executed");

-- CreateIndex
CREATE INDEX "CommandQueue_createdAt_idx" ON "CommandQueue"("createdAt");

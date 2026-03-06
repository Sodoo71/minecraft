/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dimension` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `hunger` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `AdminActionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommandQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DashboardUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerStatusLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "dimension",
DROP COLUMN "hunger",
DROP COLUMN "name",
DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "health" DROP NOT NULL,
ALTER COLUMN "level" DROP NOT NULL,
ALTER COLUMN "x" DROP NOT NULL,
ALTER COLUMN "x" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "y" DROP NOT NULL,
ALTER COLUMN "y" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "z" DROP NOT NULL,
ALTER COLUMN "z" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Player_id_seq";

-- DropTable
DROP TABLE "AdminActionLog";

-- DropTable
DROP TABLE "CommandQueue";

-- DropTable
DROP TABLE "DashboardUser";

-- DropTable
DROP TABLE "PlayerLog";

-- DropTable
DROP TABLE "ServerStatusLog";

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "description" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

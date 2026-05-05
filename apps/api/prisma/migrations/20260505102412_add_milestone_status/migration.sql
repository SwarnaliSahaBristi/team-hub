/*
  Warnings:

  - You are about to drop the column `progress` on the `Milestone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "progress",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

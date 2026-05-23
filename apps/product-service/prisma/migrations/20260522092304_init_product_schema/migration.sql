/*
  Warnings:

  - You are about to drop the column `craetedAt` on the `Brand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "craetedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "taxPercentage" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP NOT NULL;

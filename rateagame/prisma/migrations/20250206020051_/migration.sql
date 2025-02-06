/*
  Warnings:

  - Added the required column `assetId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` ADD COLUMN `assetId` VARCHAR(191) NOT NULL;

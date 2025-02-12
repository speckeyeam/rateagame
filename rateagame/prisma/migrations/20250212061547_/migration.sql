/*
  Warnings:

  - You are about to drop the column `rarity` on the `award` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `awardInventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `award` DROP COLUMN `rarity`;

-- AlterTable
ALTER TABLE `awardInventory` DROP COLUMN `rarity`;

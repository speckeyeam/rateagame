/*
  Warnings:

  - Added the required column `rarity` to the `awardInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `awardInventory` ADD COLUMN `rarity` INTEGER NOT NULL;

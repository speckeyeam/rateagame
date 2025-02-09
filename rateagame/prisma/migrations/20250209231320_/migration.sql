/*
  Warnings:

  - Added the required column `rarity` to the `award` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `award` ADD COLUMN `rarity` INTEGER NOT NULL;

/*
  Warnings:

  - Added the required column `date` to the `saved` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `saved` ADD COLUMN `date` VARCHAR(191) NOT NULL;

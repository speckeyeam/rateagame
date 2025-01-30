/*
  Warnings:

  - Added the required column `time` to the `reviewData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reviewData` ADD COLUMN `time` DATETIME(3) NOT NULL;

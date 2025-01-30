/*
  Warnings:

  - You are about to drop the column `time` on the `reviewData` table. All the data in the column will be lost.
  - Added the required column `date` to the `reviewData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reviewData` DROP COLUMN `time`,
    ADD COLUMN `date` VARCHAR(191) NOT NULL;

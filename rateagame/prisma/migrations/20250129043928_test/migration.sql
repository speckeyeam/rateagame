/*
  Warnings:

  - You are about to drop the column `gamePass` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `gamePass` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `gamePass` on the `reviewData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_gameId_fkey`;

-- AlterTable
ALTER TABLE `game` DROP COLUMN `gamePass`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `gamePass`,
    ADD COLUMN `gamePassId` VARCHAR(191) NULL,
    MODIFY `gameId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reviewData` DROP COLUMN `gamePass`,
    ADD COLUMN `gamePassId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `gamePass` (
    `gamePassId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `gamePass_gamePassId_key`(`gamePassId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviewData` ADD CONSTRAINT `reviewData_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game`(`gameId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewData` ADD CONSTRAINT `reviewData_gamePassId_fkey` FOREIGN KEY (`gamePassId`) REFERENCES `gamePass`(`gamePassId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game`(`gameId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_gamePassId_fkey` FOREIGN KEY (`gamePassId`) REFERENCES `gamePass`(`gamePassId`) ON DELETE SET NULL ON UPDATE CASCADE;

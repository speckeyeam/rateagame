-- AlterTable
ALTER TABLE `saved` ADD COLUMN `gamePassId` VARCHAR(191) NULL,
    MODIFY `gameId` VARCHAR(191) NULL;

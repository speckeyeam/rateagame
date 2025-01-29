-- DropForeignKey
ALTER TABLE `reviewData` DROP FOREIGN KEY `reviewData_gameId_fkey`;

-- DropIndex
DROP INDEX `reviewData_gameId_fkey` ON `reviewData`;

-- AlterTable
ALTER TABLE `reviewData` MODIFY `gameId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reviewData` ADD CONSTRAINT `reviewData_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game`(`gameId`) ON DELETE SET NULL ON UPDATE CASCADE;

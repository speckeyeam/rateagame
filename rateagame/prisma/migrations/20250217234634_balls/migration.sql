-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_userId_fkey`;

-- DropIndex
DROP INDEX `like_userId_fkey` ON `like`;

-- AlterTable
ALTER TABLE `like` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

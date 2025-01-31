-- AlterTable
ALTER TABLE `like` ADD COLUMN `userUserId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_userUserId_fkey` FOREIGN KEY (`userUserId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

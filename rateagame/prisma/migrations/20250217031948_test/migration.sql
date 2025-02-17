/*
  Warnings:

  - You are about to drop the column `userUserId` on the `like` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_userUserId_fkey`;

-- DropIndex
DROP INDEX `like_userUserId_fkey` ON `like`;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `userUserId`,
    ADD COLUMN `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

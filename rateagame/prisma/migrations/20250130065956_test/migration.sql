/*
  Warnings:

  - You are about to drop the `reviewData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `award_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewData` DROP FOREIGN KEY `reviewData_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewData` DROP FOREIGN KEY `reviewData_gamePassId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewData` DROP FOREIGN KEY `reviewData_userId_fkey`;

-- AlterTable
ALTER TABLE `award` ADD COLUMN `reviewReviewId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `like` ADD COLUMN `reviewReviewId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `text` VARCHAR(2000) NOT NULL;

-- DropTable
DROP TABLE `reviewData`;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_reviewReviewId_fkey` FOREIGN KEY (`reviewReviewId`) REFERENCES `review`(`reviewId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `award` ADD CONSTRAINT `award_reviewReviewId_fkey` FOREIGN KEY (`reviewReviewId`) REFERENCES `review`(`reviewId`) ON DELETE SET NULL ON UPDATE CASCADE;

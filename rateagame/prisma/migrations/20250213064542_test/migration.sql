/*
  Warnings:

  - You are about to drop the column `reviewReviewId` on the `award` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `award_reviewReviewId_fkey`;

-- DropIndex
DROP INDEX `award_reviewReviewId_fkey` ON `award`;

-- AlterTable
ALTER TABLE `award` DROP COLUMN `reviewReviewId`;

-- AddForeignKey
ALTER TABLE `award` ADD CONSTRAINT `award_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`reviewId`) ON DELETE RESTRICT ON UPDATE CASCADE;

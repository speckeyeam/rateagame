/*
  Warnings:

  - You are about to drop the column `reviewGameId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `reviewReviewId` on the `like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewId]` on the table `review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `like_reviewReviewId_fkey`;

-- DropIndex
DROP INDEX `like_reviewReviewId_fkey` ON `like`;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `reviewGameId`,
    DROP COLUMN `reviewReviewId`,
    ADD COLUMN `gamePassId` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL,
    MODIFY `gameId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `like_id_key` ON `like`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `review_reviewId_key` ON `review`(`reviewId`);

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`reviewId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `user` (
    `userId` VARCHAR(191) NOT NULL,
    `dateJoined` DATETIME(3) NOT NULL,
    `coins` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_userId_key`(`userId`),
    UNIQUE INDEX `user_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game` (
    `gameId` VARCHAR(191) NOT NULL,
    `forSale` BOOLEAN NOT NULL DEFAULT false,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `game_gameId_key`(`gameId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gamePass` (
    `gamePassId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `gamePass_gamePassId_key`(`gamePassId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `time` DATETIME(3) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `recommends` BOOLEAN NOT NULL,
    `rating` INTEGER NOT NULL,
    `gamePassId` VARCHAR(191) NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `text` VARCHAR(2000) NOT NULL,

    UNIQUE INDEX `review_reviewId_key`(`reviewId`),
    INDEX `review_gameId_fkey`(`gameId`),
    INDEX `review_userId_fkey`(`userId`),
    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `like` (
    `id` VARCHAR(191) NOT NULL,
    `value` BOOLEAN NOT NULL DEFAULT true,
    `reviewId` VARCHAR(191) NOT NULL,
    `gamePassId` VARCHAR(191) NULL,
    `gameId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `like_id_key`(`id`),
    INDEX `like_reviewId_fkey`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `award` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` DATETIME(3) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `awardId` VARCHAR(191) NOT NULL,
    `givenUserId` VARCHAR(191) NOT NULL,
    `receivedUserId` VARCHAR(191) NOT NULL,
    `rarity` INTEGER NOT NULL,
    `reviewReviewId` VARCHAR(191) NULL,

    INDEX `award_givenUserId_fkey`(`givenUserId`),
    INDEX `award_receivedUserId_fkey`(`receivedUserId`),
    INDEX `award_reviewId_fkey`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `awardInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `awardId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `rarity` INTEGER NOT NULL,

    INDEX `awardInventory_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved` (
    `id` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NULL,
    `gamePassId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `date` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `saved_id_key`(`id`),
    INDEX `saved_userId_fkey`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` VARCHAR(191) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `saved_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `game`(`gameId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_gamePassId_fkey` FOREIGN KEY (`gamePassId`) REFERENCES `gamePass`(`gamePassId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`reviewId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like` ADD CONSTRAINT `like_userUserId_fkey` FOREIGN KEY (`userUserId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `award` ADD CONSTRAINT `award_givenUserId_fkey` FOREIGN KEY (`givenUserId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `award` ADD CONSTRAINT `award_receivedUserId_fkey` FOREIGN KEY (`receivedUserId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `award` ADD CONSTRAINT `award_reviewReviewId_fkey` FOREIGN KEY (`reviewReviewId`) REFERENCES `review`(`reviewId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `awardInventory` ADD CONSTRAINT `awardInventory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved` ADD CONSTRAINT `saved_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

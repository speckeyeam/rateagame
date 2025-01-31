/*
  Warnings:

  - The primary key for the `saved` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `saved` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `saved` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `saved_id_key` ON `saved`(`id`);

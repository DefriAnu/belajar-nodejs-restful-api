/*
  Warnings:

  - Made the column `postal_code` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `postal_code` VARCHAR(10) NOT NULL;

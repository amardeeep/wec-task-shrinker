/*
  Warnings:

  - You are about to drop the column `user_id` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_user_id_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "user_id";

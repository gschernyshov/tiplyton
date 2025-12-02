/*
  Warnings:

  - You are about to drop the column `authorAdressWallet` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorAddressWallet` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorAdressWallet",
ADD COLUMN     "authorAddressWallet" TEXT NOT NULL;

/*
  Warnings:

  - The `imageUrl` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

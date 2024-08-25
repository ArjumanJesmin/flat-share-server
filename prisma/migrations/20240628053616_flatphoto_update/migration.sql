/*
  Warnings:

  - You are about to drop the `FlatPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FlatPhoto" DROP CONSTRAINT "FlatPhoto_flatId_fkey";

-- DropTable
DROP TABLE "FlatPhoto";

-- CreateTable
CREATE TABLE "flatPhoto" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "flatId" TEXT NOT NULL,

    CONSTRAINT "flatPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flatPhoto" ADD CONSTRAINT "flatPhoto_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

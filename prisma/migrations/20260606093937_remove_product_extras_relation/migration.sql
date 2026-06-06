/*
  Warnings:

  - You are about to drop the `_ExtraToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExtraToProduct" DROP CONSTRAINT "_ExtraToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraToProduct" DROP CONSTRAINT "_ExtraToProduct_B_fkey";

-- DropTable
DROP TABLE "_ExtraToProduct";

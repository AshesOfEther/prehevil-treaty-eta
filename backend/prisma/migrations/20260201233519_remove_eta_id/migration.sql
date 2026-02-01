/*
  Warnings:

  - The primary key for the `Eta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Eta` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Eta_passportNumber_key";

-- AlterTable
ALTER TABLE "Eta" DROP CONSTRAINT "Eta_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Eta_pkey" PRIMARY KEY ("passportNumber");

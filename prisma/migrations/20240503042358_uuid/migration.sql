/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `ContactFormSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `ContactFormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactFormSubmission" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContactFormSubmission_uuid_key" ON "ContactFormSubmission"("uuid");

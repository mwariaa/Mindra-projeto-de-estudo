/*
  Warnings:

  - The values [DEVO_APROFUNDAR,DEVO_REVISAR] on the enum `ReviewRating` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `flashcardId` on the `ReviewHistory` table. All the data in the column will be lost.
  - Added the required column `topicId` to the `ReviewHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewRating_new" AS ENUM ('APROFUNDAR', 'REVISAR', 'DOMINANDO');
ALTER TABLE "ReviewHistory" ALTER COLUMN "rating" TYPE "ReviewRating_new" USING ("rating"::text::"ReviewRating_new");
ALTER TYPE "ReviewRating" RENAME TO "ReviewRating_old";
ALTER TYPE "ReviewRating_new" RENAME TO "ReviewRating";
DROP TYPE "public"."ReviewRating_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ReviewHistory" DROP CONSTRAINT "ReviewHistory_flashcardId_fkey";

-- AlterTable
ALTER TABLE "ReviewHistory" DROP COLUMN "flashcardId",
ADD COLUMN     "topicId" TEXT NOT NULL,
ALTER COLUMN "reviewDate" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

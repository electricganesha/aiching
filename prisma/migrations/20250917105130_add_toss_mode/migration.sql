-- CreateEnum
CREATE TYPE "public"."TossMode" AS ENUM ('AUTOMATIC', 'MANUAL');

-- AlterTable
ALTER TABLE "public"."TossHistory" ADD COLUMN     "mode" "public"."TossMode" NOT NULL DEFAULT 'AUTOMATIC';

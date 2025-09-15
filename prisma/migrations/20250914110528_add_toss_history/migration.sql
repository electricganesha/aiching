-- CreateTable
CREATE TABLE "public"."TossHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intention" TEXT NOT NULL,
    "tosses" INTEGER[],
    "hexagram" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TossHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TossHistory" ADD CONSTRAINT "TossHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

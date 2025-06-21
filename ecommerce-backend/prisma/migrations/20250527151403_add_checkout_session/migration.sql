-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountTotal" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_sessionId_key" ON "CheckoutSession"("sessionId");

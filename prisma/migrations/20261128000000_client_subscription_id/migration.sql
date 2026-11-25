-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "stripeSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_stripeSubscriptionId_key" ON "Client"("stripeSubscriptionId");

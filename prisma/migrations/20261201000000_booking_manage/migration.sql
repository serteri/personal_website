-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "manageToken" TEXT,
ADD COLUMN     "googleEventId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_manageToken_key" ON "Booking"("manageToken");

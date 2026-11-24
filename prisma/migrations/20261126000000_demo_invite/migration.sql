-- CreateTable
CREATE TABLE "DemoInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'outbound_email',
    "maxCalls" INTEGER NOT NULL DEFAULT 3,
    "callsUsed" INTEGER NOT NULL DEFAULT 0,
    "openedAt" TIMESTAMP(3),
    "lastCalledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoInvite_token_key" ON "DemoInvite"("token");

-- CreateIndex
CREATE INDEX "DemoInvite_email_idx" ON "DemoInvite"("email");


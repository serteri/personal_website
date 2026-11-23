-- CreateEnum
CREATE TYPE "ClientPlan" AS ENUM ('PILOT', 'STARTER', 'GROWTH');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "phone" TEXT,
    "stripeCustomerId" TEXT NOT NULL,
    "retellAgentId" TEXT,
    "plan" "ClientPlan" NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyMinuteLimit" INTEGER NOT NULL,
    "minutesUsedCurrentPeriod" INTEGER NOT NULL DEFAULT 0,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "retellCallId" TEXT NOT NULL,
    "callerNumber" TEXT,
    "durationSeconds" INTEGER NOT NULL,
    "billedMinutes" INTEGER NOT NULL,
    "summary" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_stripeCustomerId_key" ON "Client"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_retellAgentId_key" ON "Client"("retellAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "CallLog_retellCallId_key" ON "CallLog"("retellCallId");

-- CreateIndex
CREATE INDEX "CallLog_clientId_createdAt_idx" ON "CallLog"("clientId", "createdAt");

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;


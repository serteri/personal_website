-- CreateTable
CREATE TABLE "ChatWidget" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "industry" TEXT NOT NULL DEFAULT 'general',
    "assistantName" TEXT NOT NULL DEFAULT 'Sam',
    "primaryColor" TEXT NOT NULL DEFAULT '#0f172a',
    "greetingMessage" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "serviceArea" TEXT,
    "businessHours" TEXT,
    "customInstructions" TEXT,
    "bookingUrl" TEXT,
    "notifyEmail" TEXT,
    "notifyPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WidgetLead" (
    "id" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "callerName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "suburb" TEXT,
    "issue" TEXT,
    "urgency" TEXT,
    "transcript" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WidgetLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatWidget_slug_key" ON "ChatWidget"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WidgetLead_conversationId_key" ON "WidgetLead"("conversationId");

-- CreateIndex
CREATE INDEX "WidgetLead_widgetId_createdAt_idx" ON "WidgetLead"("widgetId", "createdAt");

-- AddForeignKey
ALTER TABLE "WidgetLead" ADD CONSTRAINT "WidgetLead_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "ChatWidget"("id") ON DELETE CASCADE ON UPDATE CASCADE;


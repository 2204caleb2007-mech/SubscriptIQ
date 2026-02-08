-- CreateTable
CREATE TABLE "automation_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflow" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "records" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "triggeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

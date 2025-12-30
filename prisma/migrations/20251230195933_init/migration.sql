-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "allowed_origins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "allowed_origins_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "domPath" TEXT NOT NULL,
    "viewportWidth" INTEGER NOT NULL,
    "viewportHeight" INTEGER NOT NULL,
    "triggerType" TEXT NOT NULL,
    "triggerElement" TEXT,
    "triggerCoordX" REAL,
    "triggerCoordY" REAL,
    "responseType" TEXT NOT NULL,
    "responseValue" TEXT NOT NULL,
    CONSTRAINT "Feedback_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "title" TEXT,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    CONSTRAINT "Snapshot_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_api_key_key" ON "projects"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "allowed_origins_project_id_origin_key" ON "allowed_origins"("project_id", "origin");

-- CreateIndex
CREATE INDEX "Feedback_project_id_idx" ON "Feedback"("project_id");

-- CreateIndex
CREATE INDEX "Feedback_sessionId_idx" ON "Feedback"("sessionId");

-- CreateIndex
CREATE INDEX "Feedback_url_idx" ON "Feedback"("url");

-- CreateIndex
CREATE INDEX "Feedback_triggerType_idx" ON "Feedback"("triggerType");

-- CreateIndex
CREATE INDEX "Feedback_receivedAt_idx" ON "Feedback"("receivedAt");

-- CreateIndex
CREATE INDEX "Snapshot_project_id_idx" ON "Snapshot"("project_id");

-- CreateIndex
CREATE INDEX "Snapshot_sessionId_idx" ON "Snapshot"("sessionId");

-- CreateIndex
CREATE INDEX "Snapshot_fingerprint_idx" ON "Snapshot"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_project_id_sessionId_url_key" ON "Snapshot"("project_id", "sessionId", "url");

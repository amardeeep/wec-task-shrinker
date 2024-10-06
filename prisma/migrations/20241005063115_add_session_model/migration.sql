-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_key" ON "Session"("session");

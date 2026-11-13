CREATE TABLE "HscInfo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "announceAt" DATE NOT NULL,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "HscInfo_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "HscInfo_single_row" CHECK ("id" = 1)
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Stock" (
    "ticker" CHAR(4) NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("ticker")
);

-- CreateTable
CREATE TABLE "StockInvestor" (
    "id" SERIAL NOT NULL,
    "ticker" CHAR(4) NOT NULL,
    "investorName" VARCHAR(100) NOT NULL,
    "investorType" CHAR(2) NOT NULL,
    "localForeign" CHAR(1) NOT NULL,
    "domicile" VARCHAR(100) NOT NULL,
    "scripless" BIGINT NOT NULL,
    "scrip" BIGINT NOT NULL,
    "totalHoldingShare" BIGINT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StockInvestor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "idxLastUpdated" VARCHAR(26) NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockInvestor" ADD CONSTRAINT "StockInvestor_ticker_fkey" FOREIGN KEY ("ticker") REFERENCES "Stock"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;

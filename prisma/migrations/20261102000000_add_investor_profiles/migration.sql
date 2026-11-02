CREATE TABLE "InvestorProfile" (
    "investorName" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    CONSTRAINT "InvestorProfile_pkey" PRIMARY KEY ("investorName")
);

CREATE UNIQUE INDEX "InvestorProfile_slug_key" ON "InvestorProfile"("slug");
CREATE INDEX "StockInvestor_investorName_infoId_idx" ON "StockInvestor"("investorName", "infoId");

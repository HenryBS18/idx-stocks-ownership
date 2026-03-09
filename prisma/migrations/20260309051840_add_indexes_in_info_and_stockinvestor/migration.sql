-- CreateIndex
CREATE INDEX "Info_year_month_idx" ON "Info"("year", "month");

-- CreateIndex
CREATE INDEX "StockInvestor_infoId_ticker_idx" ON "StockInvestor"("infoId", "ticker");

/*
  Warnings:

  - You are about to alter the column `percentage` on the `StockInvestor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - Added the required column `month` to the `Info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infoId` to the `StockInvestor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Info" ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StockInvestor" ADD COLUMN     "infoId" INTEGER NOT NULL,
ALTER COLUMN "percentage" SET DATA TYPE DECIMAL(5,2);

-- AddForeignKey
ALTER TABLE "StockInvestor" ADD CONSTRAINT "StockInvestor_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

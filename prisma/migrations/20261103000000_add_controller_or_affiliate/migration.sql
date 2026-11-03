CREATE TYPE "ControllerOrAffiliate" AS ENUM ('CONTROLLER', 'AFFILIATE');

ALTER TABLE "StockInvestor"
ADD COLUMN "controllerOrAffiliate" "ControllerOrAffiliate";

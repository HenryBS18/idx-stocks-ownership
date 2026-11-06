CREATE TYPE "Sector" AS ENUM ('Basic Mat', 'Cyclical', 'Energy', 'Finance', 'Health', 'Industrial', 'Infrastructures', 'Non-Cyclical', 'Property', 'Technology', 'Transport');

ALTER TABLE "Stock" ADD COLUMN "sector" "Sector";

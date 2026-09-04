-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN     "deliveryRegion" TEXT;
ALTER TABLE "Order" ADD COLUMN     "deliveryCharge" DOUBLE PRECISION;

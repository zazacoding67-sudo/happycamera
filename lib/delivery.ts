export type DeliveryMethod = "standard" | "self_collect";
export type DeliveryRegion = "west_malaysia" | "sabah_sarawak";

export const DELIVERY_CHARGES: Record<DeliveryRegion, number> = {
  west_malaysia: 20,
  sabah_sarawak: 30,
};

export const SELF_COLLECT_CHARGE = 0;

export const STORE_ADDRESS =
  "G-01-12 & 17, Kiara East Suite Dex, Jalan 3/18a, Taman Mastiara, 51200 Kuala Lumpur";

export const STORE_PHONE = "016-320 8864";

export const STORE_HOURS = "Mon–Sat, 11am–7pm (Closed on Sundays)";

export function isValidDeliveryMethod(value: unknown): value is DeliveryMethod {
  return value === "standard" || value === "self_collect";
}

export function isValidDeliveryRegion(value: unknown): value is DeliveryRegion {
  return value === "west_malaysia" || value === "sabah_sarawak";
}

export function computeDeliveryCharge(method: DeliveryMethod, region?: DeliveryRegion): number {
  if (method === "self_collect") return SELF_COLLECT_CHARGE;
  if (region && isValidDeliveryRegion(region)) return DELIVERY_CHARGES[region];
  return 0;
}

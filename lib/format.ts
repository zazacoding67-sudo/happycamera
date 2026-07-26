export function formatPrice(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

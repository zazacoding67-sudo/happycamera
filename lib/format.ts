export function formatPrice(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export function formatCompactPrice(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `RM ${(amount / 1_000_000).toLocaleString("en-MY", {
      maximumFractionDigits: 1,
    })}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `RM ${(amount / 1_000).toLocaleString("en-MY", {
      maximumFractionDigits: 1,
    })}K`;
  }
  return formatPrice(amount);
}

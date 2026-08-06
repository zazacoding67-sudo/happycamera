const OVERRIDES: Record<string, string> = {
  hiniso: "HINISO",
  pgytech: "PGYTECH",
  "f-stop": "F-Stop",
  "digi cabi": "Digi Cabi",
};

export function normalizeBrand(brand: string): string {
  const trimmed = brand.trim();
  if (!trimmed) return trimmed;

  const key = trimmed.toLowerCase();
  const override = OVERRIDES[key];
  if (override) return override;

  return trimmed
    .toLowerCase()
    .split(/([\s-]+)/)
    .map((part) =>
      part.trim() ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join("");
}

export const POLICIES = {
  returnWindow: "7 days from delivery",
  returnConditions:
    "The item must be in its original condition with all included accessories, and the buyer covers return shipping.",
  warranty: {
    tiers: [
      "Preloved display units: 3-month shop warranty",
      "Preloved normal units (non-display): 1-month shop warranty",
      "Brand new items: covered by the manufacturer's own warranty, which varies by product",
    ],
    coverage:
      "Our shop warranty covers internal and button/control problems. It does not cover drop damage, water damage, or general wear and tear — since we specialize in preloved gear, we ask customers to handle each unit with the same care they'd give their own equipment.",
  },
  exclusions: [
    "Film and consumables are non-returnable",
    "Items marked 'Final Sale' cannot be returned",
    "Shipping costs are non-refundable",
  ],
} as const;

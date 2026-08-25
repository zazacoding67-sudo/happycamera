export const POLICIES = {
  returnWindow: "14 days from delivery",
  returnConditions:
    "Item must be in original condition with all accessories. Buyer pays return shipping.",
  warranty: {
    general: "6-month warranty on all products.",
    condition: "Covers manufacturing defects. Does not cover accidental damage, wear and tear, or consumables.",
  },
  exclusions: [
    "Film and consumables are non-returnable",
    "Items marked 'Final Sale' cannot be returned",
    "Shipping costs are non-refundable",
  ],
} as const;

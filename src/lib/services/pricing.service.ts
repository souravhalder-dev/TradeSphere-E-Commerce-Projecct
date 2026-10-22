export interface PriceTierInput {
  minQuantity: number;
  maxQuantity?: number | null;
  unitPrice: number;
}

export interface PricingResult {
  unitPrice: number;
  originalUnitPrice: number;
  totalPrice: number;
  savings: number;
  appliedTier: PriceTierInput | null;
  meetsMoq: boolean;
  moq: number;
  error?: string;
}

/**
 * Calculates effective unit price and total price based on volume-discount tiers.
 * Guarantees that client-submitted prices are NEVER trusted.
 */
export function calculateTieredPrice(
  basePrice: number,
  moq: number,
  quantity: number,
  priceTiers: PriceTierInput[] = []
): PricingResult {
  if (quantity <= 0) {
    return {
      unitPrice: basePrice,
      originalUnitPrice: basePrice,
      totalPrice: 0,
      savings: 0,
      appliedTier: null,
      meetsMoq: false,
      moq,
      error: `Quantity must be greater than zero`,
    };
  }

  if (quantity < moq) {
    return {
      unitPrice: basePrice,
      originalUnitPrice: basePrice,
      totalPrice: Number((basePrice * quantity).toFixed(2)),
      savings: 0,
      appliedTier: null,
      meetsMoq: false,
      moq,
      error: `Order quantity (${quantity}) is below the Minimum Order Quantity (${moq})`,
    };
  }

  // Sort tiers ascending by minQuantity
  const sortedTiers = [...priceTiers].sort((a, b) => a.minQuantity - b.minQuantity);

  let appliedTier: PriceTierInput | null = null;
  let effectiveUnitPrice = basePrice;

  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      if (tier.maxQuantity === null || tier.maxQuantity === undefined || quantity <= tier.maxQuantity) {
        effectiveUnitPrice = tier.unitPrice;
        appliedTier = tier;
      }
    }
  }

  const totalPrice = Number((effectiveUnitPrice * quantity).toFixed(2));
  const fullPriceTotal = Number((basePrice * quantity).toFixed(2));
  const savings = Number(Math.max(0, fullPriceTotal - totalPrice).toFixed(2));

  return {
    unitPrice: effectiveUnitPrice,
    originalUnitPrice: basePrice,
    totalPrice,
    savings,
    appliedTier,
    meetsMoq: true,
    moq,
  };
}

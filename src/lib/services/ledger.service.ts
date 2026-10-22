export interface CommissionCalculation {
  subtotal: number;
  commissionRate: number; // percentage, e.g. 5.0 = 5%
  commissionAmount: number;
  sellerNetAmount: number;
}

/**
 * Calculates marketplace commission and seller net earnings.
 */
export function calculateMarketplaceCommission(
  subtotal: number,
  commissionRate: number = 5.0
): CommissionCalculation {
  const rate = Math.max(0, commissionRate);
  const commissionAmount = Number(((subtotal * rate) / 100).toFixed(2));
  const sellerNetAmount = Number((subtotal - commissionAmount).toFixed(2));

  return {
    subtotal,
    commissionRate: rate,
    commissionAmount,
    sellerNetAmount,
  };
}

/**
 * Calculates ledger balance changes for a completed order.
 */
export function calculateOrderSettlementBalance(
  currentBalance: number,
  sellerNetAmount: number
): { newBalance: number; netCredited: number } {
  const newBalance = Number((currentBalance + sellerNetAmount).toFixed(2));
  return {
    newBalance,
    netCredited: sellerNetAmount,
  };
}

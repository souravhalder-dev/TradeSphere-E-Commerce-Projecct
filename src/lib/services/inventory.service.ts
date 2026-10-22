export interface StockReservationResult {
  success: boolean;
  availableStock: number;
  reservedStock: number;
  error?: string;
}

/**
 * Checks whether an inventory balance can satisfy a reservation request.
 */
export function canReserveStock(availableStock: number, requestedQuantity: number): boolean {
  return requestedQuantity > 0 && availableStock >= requestedQuantity;
}

/**
 * Calculates stock movements for a reservation event.
 */
export function calculateStockReservation(
  availableStock: number,
  reservedStock: number,
  quantityToReserve: number
): StockReservationResult {
  if (quantityToReserve <= 0) {
    return {
      success: false,
      availableStock,
      reservedStock,
      error: "Quantity to reserve must be greater than zero",
    };
  }

  if (availableStock < quantityToReserve) {
    return {
      success: false,
      availableStock,
      reservedStock,
      error: `Insufficient stock: requested ${quantityToReserve}, available ${availableStock}`,
    };
  }

  return {
    success: true,
    availableStock: availableStock - quantityToReserve,
    reservedStock: reservedStock + quantityToReserve,
  };
}

/**
 * Calculates stock movements for a cancellation / release event.
 */
export function calculateStockRelease(
  availableStock: number,
  reservedStock: number,
  quantityToRelease: number
): StockReservationResult {
  const actualRelease = Math.min(reservedStock, quantityToRelease);
  return {
    success: true,
    availableStock: availableStock + actualRelease,
    reservedStock: Math.max(0, reservedStock - actualRelease),
  };
}

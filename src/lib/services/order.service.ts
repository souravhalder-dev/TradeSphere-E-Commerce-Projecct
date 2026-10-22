import { OrderStatus } from "@prisma/client";

export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAYMENT_PENDING, OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  PAYMENT_PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [OrderStatus.REFUNDED],
  CANCELLED: [],
  REFUNDED: [],
};

export class OrderStateMachineError extends Error {
  constructor(public currentStatus: OrderStatus, public attemptedStatus: OrderStatus) {
    super(`Invalid order state transition from ${currentStatus} to ${attemptedStatus}`);
    this.name = "OrderStateMachineError";
  }
}

/**
 * Validates whether an order can transition from currentStatus to nextStatus.
 */
export function canTransitionOrder(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

export function validateOrderTransition(currentStatus: OrderStatus, nextStatus: OrderStatus): void {
  if (!canTransitionOrder(currentStatus, nextStatus)) {
    throw new OrderStateMachineError(currentStatus, nextStatus);
  }
}

export interface ImmutableOrderItemSnapshot {
  productId: string;
  variantId?: string | null;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  metadata?: Record<string, unknown>;
}

export function createOrderItemSnapshot(item: {
  productId: string;
  variantId?: string | null;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}): ImmutableOrderItemSnapshot {
  const totalPrice = Number((item.unitPrice * item.quantity).toFixed(2));
  return {
    productId: item.productId,
    variantId: item.variantId || null,
    productName: item.productName,
    sku: item.sku,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    totalPrice,
    metadata: {
      ...item.metadata,
      snapshotTimestamp: new Date().toISOString(),
    },
  };
}

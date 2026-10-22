import { CouponType } from "@prisma/client";

export interface CouponRule {
  code: string;
  type: CouponType;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: Date;
  expiresAt?: Date | null;
}

export interface CouponDiscountResult {
  isValid: boolean;
  discountAmount: number;
  error?: string;
}

/**
 * Validates and calculates discount for an order subtotal.
 * Enforces minimum cart value, expiration date, active flag, and max discount cap.
 */
export function calculateCouponDiscount(
  coupon: CouponRule,
  subtotal: number,
  now: Date = new Date()
): CouponDiscountResult {
  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, error: "Coupon is not active" };
  }

  if (now < coupon.startsAt) {
    return { isValid: false, discountAmount: 0, error: "Coupon is not yet valid" };
  }

  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { isValid: false, discountAmount: 0, error: "Coupon has expired" };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { isValid: false, discountAmount: 0, error: "Coupon usage limit reached" };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      error: `Minimum order value of $${coupon.minOrderValue.toFixed(2)} required to use this coupon`,
    };
  }

  let calculatedDiscount = 0;
  if (coupon.type === CouponType.PERCENTAGE) {
    calculatedDiscount = Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
    if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
      calculatedDiscount = coupon.maxDiscount;
    }
  } else if (coupon.type === CouponType.FIXED_AMOUNT) {
    calculatedDiscount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    isValid: true,
    discountAmount: calculatedDiscount,
  };
}

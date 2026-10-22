import { describe, it, expect } from "vitest";
import { calculateTieredPrice } from "./pricing.service";
import { canTransitionOrder, createOrderItemSnapshot, OrderStateMachineError, validateOrderTransition } from "./order.service";
import { calculateStockReservation, calculateStockRelease } from "./inventory.service";
import { canTransitionRFQ, validateRFQTransition } from "./rfq.service";
import { calculateCouponDiscount } from "./promotion.service";
import { calculateMarketplaceCommission } from "./ledger.service";
import { mockPaymentAdapter } from "../adapters/payments/mock-payment.adapter";
import { OrderStatus, RFQStatus, CouponType } from "@prisma/client";

describe("TradeSphere Core Commerce Domain Services", () => {
  // ---------------------------------------------------------------------------
  // 1. Tiered Wholesale Pricing & MOQ Tests
  // ---------------------------------------------------------------------------
  describe("Wholesale Pricing & MOQ Calculator", () => {
    const basePrice = 50.0;
    const moq = 10;
    const priceTiers = [
      { minQuantity: 10, maxQuantity: 49, unitPrice: 45.0 },
      { minQuantity: 50, maxQuantity: 99, unitPrice: 40.0 },
      { minQuantity: 100, maxQuantity: null, unitPrice: 32.0 },
    ];

    it("should reject quantities below MOQ", () => {
      const result = calculateTieredPrice(basePrice, moq, 5, priceTiers);
      expect(result.meetsMoq).toBe(false);
      expect(result.error).toContain("below the Minimum Order Quantity");
    });

    it("should apply tier 1 price for quantity 20", () => {
      const result = calculateTieredPrice(basePrice, moq, 20, priceTiers);
      expect(result.meetsMoq).toBe(true);
      expect(result.unitPrice).toBe(45.0);
      expect(result.totalPrice).toBe(900.0);
      expect(result.savings).toBe(100.0); // 20 * (50 - 45)
    });

    it("should apply bulk tier 3 price for quantity 150", () => {
      const result = calculateTieredPrice(basePrice, moq, 150, priceTiers);
      expect(result.meetsMoq).toBe(true);
      expect(result.unitPrice).toBe(32.0);
      expect(result.totalPrice).toBe(4800.0); // 150 * 32
      expect(result.savings).toBe(2700.0); // 150 * (50 - 32)
    });

    it("should handle zero or negative quantities safely", () => {
      const result = calculateTieredPrice(basePrice, moq, 0, priceTiers);
      expect(result.meetsMoq).toBe(false);
      expect(result.totalPrice).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Order State Machine & Snapshot Tests
  // ---------------------------------------------------------------------------
  describe("Order State Machine & Immutable Snapshots", () => {
    it("should allow valid progressive transitions", () => {
      expect(canTransitionOrder(OrderStatus.PENDING, OrderStatus.CONFIRMED)).toBe(true);
      expect(canTransitionOrder(OrderStatus.CONFIRMED, OrderStatus.PROCESSING)).toBe(true);
      expect(canTransitionOrder(OrderStatus.PROCESSING, OrderStatus.SHIPPED)).toBe(true);
      expect(canTransitionOrder(OrderStatus.SHIPPED, OrderStatus.DELIVERED)).toBe(true);
    });

    it("should disallow invalid or backward transitions", () => {
      expect(canTransitionOrder(OrderStatus.DELIVERED, OrderStatus.PROCESSING)).toBe(false);
      expect(canTransitionOrder(OrderStatus.CANCELLED, OrderStatus.CONFIRMED)).toBe(false);
      expect(() => validateOrderTransition(OrderStatus.SHIPPED, OrderStatus.PENDING)).toThrow(
        OrderStateMachineError
      );
    });

    it("should generate an immutable snapshot with exact pricing", () => {
      const snapshot = createOrderItemSnapshot({
        productId: "prod-123",
        productName: "Industrial CNC Milling Cutter",
        sku: "CNC-MILL-500",
        unitPrice: 32.5,
        quantity: 100,
        metadata: { tier: "100+ bulk discount" },
      });

      expect(snapshot.totalPrice).toBe(3250.0);
      expect(snapshot.productName).toBe("Industrial CNC Milling Cutter");
      expect(snapshot.metadata?.snapshotTimestamp).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Inventory Reservation & Stock Concurrency Tests
  // ---------------------------------------------------------------------------
  describe("Inventory Stock Reservation", () => {
    it("should reserve stock when sufficient units exist", () => {
      const result = calculateStockReservation(100, 20, 30);
      expect(result.success).toBe(true);
      expect(result.availableStock).toBe(70);
      expect(result.reservedStock).toBe(50);
    });

    it("should fail reservation when stock is insufficient", () => {
      const result = calculateStockReservation(15, 0, 20);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient stock");
    });

    it("should release reserved stock upon order cancellation", () => {
      const result = calculateStockRelease(70, 50, 30);
      expect(result.success).toBe(true);
      expect(result.availableStock).toBe(100);
      expect(result.reservedStock).toBe(20);
    });
  });

  // ---------------------------------------------------------------------------
  // 4. B2B RFQ Negotiation State Machine
  // ---------------------------------------------------------------------------
  describe("B2B RFQ State Machine", () => {
    it("should allow RFQ progression from SUBMITTED to QUOTED and ACCEPTED", () => {
      expect(canTransitionRFQ(RFQStatus.SUBMITTED, RFQStatus.QUOTED)).toBe(true);
      expect(canTransitionRFQ(RFQStatus.QUOTED, RFQStatus.NEGOTIATING)).toBe(true);
      expect(canTransitionRFQ(RFQStatus.NEGOTIATING, RFQStatus.ACCEPTED)).toBe(true);
      expect(canTransitionRFQ(RFQStatus.ACCEPTED, RFQStatus.CONVERTED_TO_ORDER)).toBe(true);
    });

    it("should reject illegal RFQ jumps", () => {
      expect(canTransitionRFQ(RFQStatus.SUBMITTED, RFQStatus.CONVERTED_TO_ORDER)).toBe(false);
      expect(() => validateRFQTransition(RFQStatus.EXPIRED, RFQStatus.QUOTED)).toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Coupon & Promotion Rules Tests
  // ---------------------------------------------------------------------------
  describe("Coupon & Promotion Engine", () => {
    const validCoupon = {
      code: "BULK10",
      type: CouponType.PERCENTAGE,
      discountValue: 10, // 10%
      minOrderValue: 500,
      maxDiscount: 100,
      usageLimit: 50,
      usedCount: 5,
      isActive: true,
      startsAt: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 3600000),
    };

    it("should reject coupon when order subtotal is below minimum", () => {
      const result = calculateCouponDiscount(validCoupon, 300);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Minimum order value");
    });

    it("should calculate correct percentage discount and respect max cap", () => {
      // 10% of 800 = 80 (< maxDiscount 100)
      const res1 = calculateCouponDiscount(validCoupon, 800);
      expect(res1.isValid).toBe(true);
      expect(res1.discountAmount).toBe(80);

      // 10% of 2000 = 200 (capped at maxDiscount 100)
      const res2 = calculateCouponDiscount(validCoupon, 2000);
      expect(res2.isValid).toBe(true);
      expect(res2.discountAmount).toBe(100);
    });

    it("should calculate fixed amount discount properly", () => {
      const fixedCoupon = {
        ...validCoupon,
        code: "FLAT50",
        type: CouponType.FIXED_AMOUNT,
        discountValue: 50,
      };
      const res = calculateCouponDiscount(fixedCoupon, 600);
      expect(res.isValid).toBe(true);
      expect(res.discountAmount).toBe(50);
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Financial Ledger & Commission Tests
  // ---------------------------------------------------------------------------
  describe("Financial Ledger & Commission Split", () => {
    it("should calculate platform commission and seller net correctly", () => {
      const result = calculateMarketplaceCommission(1000.0, 5.0);
      expect(result.commissionAmount).toBe(50.0); // 5% of 1000
      expect(result.sellerNetAmount).toBe(950.0);
    });

    it("should handle custom negotiated commission rates", () => {
      const result = calculateMarketplaceCommission(5000.0, 2.5);
      expect(result.commissionAmount).toBe(125.0); // 2.5% of 5000
      expect(result.sellerNetAmount).toBe(4875.0);
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Payment Simulation Adapter Tests
  // ---------------------------------------------------------------------------
  describe("Mock Payment Sandbox Adapter", () => {
    it("should process successful simulated payment with explicit sandbox markers", async () => {
      const result = await mockPaymentAdapter.createPaymentIntent({
        orderId: "ord-test-1",
        orderNumber: "TS-2026-0001",
        amount: 450.0,
        currency: "USD",
        customerEmail: "buyer@trade.com",
        customerName: "Acme Purchasing",
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe("MOCK_DEVELOPMENT");
      expect(result.status).toBe("PAID");
      expect(result.rawDetails?.simulated).toBe(true);
    });

    it("should simulate payment failure when forced for testing", async () => {
      const result = await mockPaymentAdapter.createPaymentIntent({
        orderId: "ord-test-2",
        orderNumber: "TS-2026-0002",
        amount: 450.0,
        currency: "USD",
        customerEmail: "buyer@trade.com",
        customerName: "Acme Purchasing",
        metadata: { forceFail: "true" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe("FAILED");
    });
  });
});

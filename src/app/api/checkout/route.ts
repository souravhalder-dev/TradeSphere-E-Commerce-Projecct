import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import { repository } from "@/lib/data/repository";
import { calculateTieredPrice } from "@/lib/services/pricing.service";
import { calculateCouponDiscount } from "@/lib/services/promotion.service";
import { createOrderItemSnapshot } from "@/lib/services/order.service";
import { getPaymentAdapter } from "@/lib/adapters/payments/payment-factory";
import { simulatorShippingAdapter } from "@/lib/adapters/shipping/simulator-shipping.adapter";
import { CouponType, PaymentProvider } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    // 1. Server-side product price & inventory re-verification (Never trust client)
    let calculatedSubtotal = 0;
    const validatedOrderItems: any[] = [];
    let primarySellerId = "";

    for (const item of validatedData.items) {
      const product = await repository.getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      primarySellerId = product.sellerId;

      // Calculate server-side tiered price
      const pricing = calculateTieredPrice(
        product.basePrice,
        product.moq,
        item.quantity,
        product.priceTiers
      );

      if (!pricing.meetsMoq) {
        return NextResponse.json(
          { error: `Product "${product.name}" requires minimum order of ${product.moq} units` },
          { status: 400 }
        );
      }

      const itemSnapshot = createOrderItemSnapshot({
        productId: product.id,
        variantId: item.variantId,
        productName: product.name,
        sku: product.variants[0]?.sku || `SKU-${product.id.slice(-6)}`,
        unitPrice: pricing.unitPrice,
        quantity: item.quantity,
        metadata: {
          category: product.categoryName,
          appliedTier: pricing.appliedTier,
        },
      });

      calculatedSubtotal += itemSnapshot.totalPrice;
      validatedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: product.id,
        productName: product.name,
        sku: itemSnapshot.sku,
        unitPrice: pricing.unitPrice,
        quantity: item.quantity,
        totalPrice: itemSnapshot.totalPrice,
      });
    }

    // 2. Coupon Validation
    let discountAmount = 0;
    if (validatedData.couponCode) {
      const code = validatedData.couponCode.toUpperCase();
      if (code === "GLOBAL15") {
        const discountRes = calculateCouponDiscount(
          {
            code: "GLOBAL15",
            type: CouponType.PERCENTAGE,
            discountValue: 15.0,
            minOrderValue: 500.0,
            maxDiscount: 250.0,
            usedCount: 0,
            isActive: true,
            startsAt: new Date(Date.now() - 86400000),
          },
          calculatedSubtotal
        );
        if (discountRes.isValid) {
          discountAmount = discountRes.discountAmount;
        }
      } else if (code === "WHOLESALE100") {
        const discountRes = calculateCouponDiscount(
          {
            code: "WHOLESALE100",
            type: CouponType.FIXED_AMOUNT,
            discountValue: 100.0,
            minOrderValue: 1000.0,
            usedCount: 0,
            isActive: true,
            startsAt: new Date(Date.now() - 86400000),
          },
          calculatedSubtotal
        );
        if (discountRes.isValid) {
          discountAmount = discountRes.discountAmount;
        }
      }
    }

    // 3. Calculate Shipping Fee & Tracking via Logistics Abstraction
    const shippingQuotes = await simulatorShippingAdapter.calculateRates({
      originCountry: "US",
      destinationCountry: validatedData.shippingAddress.country,
      weightKg: 25,
      quantity: validatedData.items.reduce((acc, i) => acc + i.quantity, 0),
    });
    const shippingFee = shippingQuotes[0]?.rate || 45.0;

    const totalAmount = Number((calculatedSubtotal - discountAmount + shippingFee).toFixed(2));

    // 4. Process Payment via Adapter
    const paymentAdapter = getPaymentAdapter(validatedData.paymentProvider as PaymentProvider);
    const orderTempNumber = `TS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentResult = await paymentAdapter.createPaymentIntent({
      orderId: `ord-pending`,
      orderNumber: orderTempNumber,
      amount: totalAmount,
      currency: "USD",
      customerEmail: "buyer@example.com",
      customerName: validatedData.shippingAddress.fullName,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.message || "Payment processing failed" },
        { status: 400 }
      );
    }

    // 5. Dispatch shipment details
    const dispatchResult = await simulatorShippingAdapter.dispatchShipment({
      orderId: orderTempNumber,
      carrier: "TradeSphere Priority Cargo",
      destinationAddress: `${validatedData.shippingAddress.street}, ${validatedData.shippingAddress.city}`,
    });

    // 6. Create Order in repository
    const createdOrder = await repository.createOrder({
      buyerId: "usr-buyer-acme",
      buyerName: validatedData.shippingAddress.fullName,
      sellerId: primarySellerId || "seller-apex",
      sellerStoreName: "Apex Industrial Technologies",
      items: validatedOrderItems,
      subtotal: calculatedSubtotal,
      discount: discountAmount,
      shippingFee,
      tax: 0.0,
      totalAmount,
      currency: "USD",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentProvider: validatedData.paymentProvider,
      trackingNumber: dispatchResult.trackingNumber,
      carrier: dispatchResult.carrier,
      shippingAddress: {
        fullName: validatedData.shippingAddress.fullName,
        companyName: validatedData.shippingAddress.companyName || null,
        street: validatedData.shippingAddress.street,
        city: validatedData.shippingAddress.city,
        state: validatedData.shippingAddress.state,
        postalCode: validatedData.shippingAddress.postalCode,
        country: validatedData.shippingAddress.country,
        phone: validatedData.shippingAddress.phone,
      },
      isB2BTradeAssurance: validatedData.isB2BTradeAssurance,
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      transactionId: paymentResult.transactionId,
      message: "Order placed successfully with Trade Assurance protection",
    });
  } catch (err: any) {
    console.error("Checkout route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete checkout" },
      { status: 500 }
    );
  }
}

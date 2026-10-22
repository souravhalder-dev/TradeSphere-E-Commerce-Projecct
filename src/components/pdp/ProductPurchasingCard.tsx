"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ShieldCheck, Truck, Check, AlertCircle, Sparkles } from "lucide-react";
import { MockProduct, MockVariant } from "@/lib/data/mock-data";
import { calculateTieredPrice } from "@/lib/services/pricing.service";
import { formatCurrency } from "@/lib/utils";

interface ProductPurchasingCardProps {
  product: MockProduct;
}

export function ProductPurchasingCard({ product }: ProductPurchasingCardProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<MockVariant>(
    product.variants[0] || {
      id: "var-default",
      productId: product.id,
      sku: "SKU-DEFAULT",
      title: "Default Edition",
      price: product.basePrice,
      stock: 100,
      attributes: {},
    }
  );

  const [quantity, setQuantity] = useState<number>(product.moq);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isSampleMode, setIsSampleMode] = useState(false);

  // Compute live tiered price based on selected quantity
  const effectiveBasePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const pricingResult = calculateTieredPrice(
    effectiveBasePrice,
    isSampleMode ? 1 : product.moq,
    quantity,
    product.priceTiers
  );

  const handleQuantityChange = (val: number) => {
    const min = isSampleMode ? 1 : product.moq;
    const newQty = Math.max(min, val);
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("tradesphere_cart") || "[]");

      const itemPayload = {
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        variantTitle: selectedVariant.title,
        sku: selectedVariant.sku,
        image: product.images[0],
        sellerId: product.sellerId,
        sellerStoreName: product.sellerStoreName,
        basePrice: effectiveBasePrice,
        unitPrice: pricingResult.unitPrice,
        quantity: quantity,
        moq: product.moq,
        priceTiers: product.priceTiers,
        isSample: isSampleMode,
      };

      // Check if item already in cart
      const existingIdx = existingCart.findIndex(
        (i: any) => i.productId === product.id && i.variantId === selectedVariant.id
      );

      if (existingIdx >= 0) {
        existingCart[existingIdx].quantity += quantity;
      } else {
        existingCart.push(itemPayload);
      }

      localStorage.setItem("tradesphere_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cart_updated"));

      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
      {/* Wholesale Tier Breakdown Banner */}
      <div>
        <div className="text-xs text-slate-500 font-medium mb-1">Volume Wholesale Pricing</div>
        <div className="grid grid-cols-3 gap-2 py-2">
          {product.priceTiers.map((tier, idx) => {
            const isCurrentTier =
              quantity >= tier.minQuantity &&
              (tier.maxQuantity === null || tier.maxQuantity === undefined || quantity <= tier.maxQuantity);

            return (
              <div
                key={tier.id || idx}
                className={`p-2.5 rounded-xl border text-center transition ${
                  isCurrentTier
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="text-[11px] text-slate-500 font-medium">
                  {tier.maxQuantity ? `${tier.minQuantity} - ${tier.maxQuantity} pcs` : `≥ ${tier.minQuantity} pcs`}
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {formatCurrency(tier.unitPrice)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variant Selector */}
      {product.variants.length > 1 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">Select Specification / Variant:</label>
          <div className="space-y-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                  selectedVariant.id === v.id
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 font-semibold"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <div>
                  <div className="font-semibold">{v.title}</div>
                  <div className="text-[11px] text-slate-500">SKU: {v.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatCurrency(v.price)}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">{v.stock} units in stock</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sample vs Bulk Order Toggle */}
      {product.sampleAvailable && (
        <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs">
          <div>
            <span className="font-semibold text-amber-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Request Evaluation Sample
            </span>
            <p className="text-[11px] text-amber-800">
              Sample price: {formatCurrency(product.samplePrice || product.basePrice)} (MOQ 1 pc)
            </p>
          </div>
          <button
            onClick={() => {
              setIsSampleMode(!isSampleMode);
              setQuantity(isSampleMode ? product.moq : 1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isSampleMode
                ? "bg-amber-600 text-white"
                : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {isSampleMode ? "Sample Active" : "Order Sample"}
          </button>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">Order Quantity:</span>
          <span className="text-slate-500">
            {isSampleMode ? "Sample (MOQ 1)" : `Minimum Order: ${product.moq} units`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
            <button
              onClick={() => handleQuantityChange(quantity - (isSampleMode ? 1 : 5))}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm"
            >
              -
            </button>
            <input
              type="number"
              aria-label="Order Quantity"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              className="w-20 text-center text-sm font-bold text-slate-900 focus:outline-none"
            />
            <button
              onClick={() => handleQuantityChange(quantity + (isSampleMode ? 1 : 5))}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm"
            >
              +
            </button>
          </div>

          <div className="text-right flex-1">
            <div className="text-[11px] text-slate-500">Subtotal</div>
            <div className="text-xl font-extrabold text-slate-900">
              {formatCurrency(pricingResult.totalPrice)}
            </div>
            {pricingResult.savings > 0 && (
              <div className="text-[11px] text-emerald-600 font-semibold">
                Saved {formatCurrency(pricingResult.savings)} (Volume Tier)
              </div>
            )}
          </div>
        </div>

        {!pricingResult.meetsMoq && (
          <div className="text-xs text-rose-600 flex items-center gap-1.5 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {pricingResult.error}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={!pricingResult.meetsMoq}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Wholesale Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!pricingResult.meetsMoq}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition"
        >
          Direct Checkout with Trade Assurance
        </button>
      </div>

      {/* Trade Assurance Guarantee Box */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Trade Assurance Covered</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Your payment is held securely in escrow until you receive and verify the cargo against agreed specifications.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Dispatches in {product.leadTimeDays} business days via Global Freight</span>
        </div>
      </div>
    </div>
  );
}

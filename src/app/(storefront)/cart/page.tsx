"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Building2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { calculateTieredPrice } from "@/lib/services/pricing.service";
import { formatCurrency } from "@/lib/utils";

interface CartItemData {
  productId: string;
  variantId?: string;
  name: string;
  variantTitle?: string;
  sku?: string;
  image: string;
  sellerId: string;
  sellerStoreName: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  moq: number;
  priceTiers: any[];
  isSample?: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("tradesphere_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  const saveCart = (items: CartItemData[]) => {
    setCartItems(items);
    localStorage.setItem("tradesphere_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const updateQuantity = (index: number, newQty: number) => {
    const updated = [...cartItems];
    const item = updated[index];
    const minQty = item.isSample ? 1 : item.moq;
    const finalQty = Math.max(1, newQty);

    // Recalibrate unit price based on tiers
    const pricing = calculateTieredPrice(item.basePrice, minQty, finalQty, item.priceTiers || []);
    item.quantity = finalQty;
    item.unitPrice = pricing.unitPrice;

    saveCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, idx) => idx !== index);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  if (!mounted) return null;

  // Group items by seller
  const sellerGroups: Record<string, { sellerStoreName: string; items: { item: CartItemData; originalIndex: number }[] }> = {};
  cartItems.forEach((item, index) => {
    if (!sellerGroups[item.sellerId]) {
      sellerGroups[item.sellerId] = {
        sellerStoreName: item.sellerStoreName,
        items: [],
      };
    }
    sellerGroups[item.sellerId].items.push({ item, originalIndex: index });
  });

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasMoqViolations = cartItems.some((item) => !item.isSample && item.quantity < item.moq);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wholesale Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">
            {cartItems.length === 0
              ? "Your cart is currently empty"
              : `Reviewing ${cartItems.length} product line items (${totalItemsCount} total units)`}
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your sourcing cart is empty</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore our verified wholesale catalog to source components, raw materials, or industrial equipment with volume discount pricing.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-blue-500/20"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items Area grouped by Seller (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {Object.entries(sellerGroups).map(([sellerId, group]) => (
              <div
                key={sellerId}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Seller Group Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Supplier: {group.sellerStoreName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {group.items.length} {group.items.length === 1 ? "shipment package" : "shipment packages"}
                  </span>
                </div>

                {/* Items List in this Group */}
                <div className="divide-y divide-slate-100 p-6 space-y-6">
                  {group.items.map(({ item, originalIndex }) => {
                    const isBelowMoq = !item.isSample && item.quantity < item.moq;

                    return (
                      <div
                        key={originalIndex}
                        className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Image & Title */}
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              className="text-xs font-semibold text-slate-900 hover:text-blue-600 line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.variantTitle && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Spec: {item.variantTitle}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-slate-900">
                                {formatCurrency(item.unitPrice)}
                              </span>
                              <span className="text-[11px] text-slate-400">/ unit</span>
                              {item.isSample && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  Evaluation Sample
                                </span>
                              )}
                            </div>

                            {isBelowMoq && (
                              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Below MOQ ({item.moq} units required)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls & Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(originalIndex, item.quantity - 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(originalIndex, item.quantity + 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[5rem]">
                            <div className="text-sm font-bold text-slate-900">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Checkout Card (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Procurement Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Merchandise Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Freight & Cargo</span>
                <span className="font-semibold text-slate-900">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Applicable Import Duties & Taxes</span>
                <span className="font-semibold text-slate-900">$0.00 (Exempt)</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Estimated Total</span>
                <span className="font-extrabold text-blue-600 text-lg">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {hasMoqViolations && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>One or more items do not meet the supplier Minimum Order Quantity (MOQ). Please adjust quantities to proceed.</span>
              </div>
            )}

            <button
              onClick={() => router.push("/checkout")}
              disabled={hasMoqViolations || cartItems.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Trade Assurance Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-500 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>TradeSphere Escrow Protection</span>
              </div>
              <p>
                Funds are retained securely until Bill of Lading (BL) inspection or verified delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

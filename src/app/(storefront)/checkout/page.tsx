"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isB2BTradeAssurance, setIsB2BTradeAssurance] = useState(true);

  // Address State
  const [address, setAddress] = useState({
    fullName: "Sarah Jenkins",
    companyName: "Acme Global Procurement Inc",
    street: "742 Evergreen Blvd, Suite 800",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "US",
    phone: "+1-212-555-0144",
  });

  // Payment Provider Selection
  const [paymentProvider, setPaymentProvider] = useState("MOCK_DEVELOPMENT");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tradesphere_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  const subtotal = cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const estimatedShipping = cartItems.length > 0 ? 45.0 : 0.0;
  const grandTotal = Math.max(0, subtotal - discountAmount + estimatedShipping);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "GLOBAL15") {
      if (subtotal < 500) {
        setErrorMsg("GLOBAL15 requires minimum order of $500");
        return;
      }
      const disc = Math.min(250, (subtotal * 15) / 100);
      setDiscountAmount(disc);
      setAppliedCoupon("GLOBAL15 (15% Off)");
      setErrorMsg("");
    } else if (code === "WHOLESALE100") {
      if (subtotal < 1000) {
        setErrorMsg("WHOLESALE100 requires minimum order of $1,000");
        return;
      }
      setDiscountAmount(100);
      setAppliedCoupon("WHOLESALE100 ($100 Off)");
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid promotional coupon code");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentProvider,
        couponCode: appliedCoupon ? couponCode : null,
        isB2BTradeAssurance,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process order");
      }

      // Clear local cart
      localStorage.removeItem("tradesphere_cart");
      window.dispatchEvent(new Event("cart_updated"));

      router.push(`/orders/${data.order.id || data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during checkout");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trade Assurance Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">
            Protected transaction with escrow settlement and Bill of Lading verification
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit Encrypted SSL Checkout</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              1. Commercial Delivery & Consignee Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consignee Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={address.companyName}
                  onChange={(e) => setAddress({ ...address, companyName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Facility Address / Street *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State / Province / Region *</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Postal / ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country / Territory *</label>
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="US">United States (US)</option>
                  <option value="CN">China (CN)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="BD">Bangladesh (BD)</option>
                  <option value="JP">Japan (JP)</option>
                  <option value="GB">United Kingdom (GB)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone (For Customs Clearance) *</label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              2. Sourcing Settlement & Payment Provider
            </h2>

            <div className="space-y-3">
              {/* Mock Development Adapter Option */}
              <label
                className={`block p-4 rounded-xl border cursor-pointer transition ${
                  paymentProvider === "MOCK_DEVELOPMENT"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentProvider"
                    value="MOCK_DEVELOPMENT"
                    checked={paymentProvider === "MOCK_DEVELOPMENT"}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Development Mock Sandbox Adapter
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        Simulated Local Sandbox
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Instantly completes verified transaction with simulated transaction reference for testing.
                    </p>
                  </div>
                </div>
              </label>

              {/* Bank Wire / PO Option */}
              <label
                className={`block p-4 rounded-xl border cursor-pointer transition ${
                  paymentProvider === "BANK_TRANSFER"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentProvider"
                    value="BANK_TRANSFER"
                    checked={paymentProvider === "BANK_TRANSFER"}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        B2B Commercial Bank Wire (TT / Purchase Order)
                      </span>
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        Invoice Workflow
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Generates formal pro-forma invoice and wire instructions for international bank settlement.
                    </p>
                  </div>
                </div>
              </label>

              {/* International Stripe Card Option */}
              <label
                className={`block p-4 rounded-xl border cursor-pointer transition ${
                  paymentProvider === "STRIPE"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentProvider"
                    value="STRIPE"
                    checked={paymentProvider === "STRIPE"}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900">
                      Credit / Debit Card (Stripe Gateway)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Visa, MasterCard, American Express, Apple Pay, and Google Pay supported.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Trade Assurance Checkbox */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="tradeAssurance"
              checked={isB2BTradeAssurance}
              onChange={(e) => setIsB2BTradeAssurance(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="tradeAssurance" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold text-slate-900 block">Apply TradeSphere Trade Assurance Protection</span>
              <span>
                I agree to the escrow terms: funds are released to the supplier only after Bill of Lading (BL) confirmation or 14-day inspection clearance.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Order Review & Submit (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Items ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs gap-3">
                <div className="truncate flex-1">
                  <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Promotion Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="GLOBAL15 or WHOLESALE100"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 uppercase focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Applied: {appliedCoupon}
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600">
              <span>Priority Freight Shipping</span>
              <span className="font-semibold text-slate-900">{formatCurrency(estimatedShipping)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Customs & Duties</span>
              <span className="font-semibold text-slate-900">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="font-extrabold text-blue-600 text-xl">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authorizing Settlement...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

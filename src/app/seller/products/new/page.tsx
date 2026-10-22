"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("cat-machinery");
  const [basePrice, setBasePrice] = useState(150.0);
  const [moq, setMoq] = useState(10);
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [countryOfOrigin, setCountryOfOrigin] = useState("US");
  const [productionCapacity, setProductionCapacity] = useState("10,000 units / month");
  const [description, setDescription] = useState("");
  const [sampleAvailable, setSampleAvailable] = useState(true);
  const [samplePrice, setSamplePrice] = useState(165.0);
  const [customizationAvailable, setCustomizationAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80");

  // Dynamic Price Tiers
  const [priceTiers, setPriceTiers] = useState([
    { minQuantity: 10, maxQuantity: 49, unitPrice: 150.0 },
    { minQuantity: 50, maxQuantity: 199, unitPrice: 135.0 },
    { minQuantity: 200, maxQuantity: null, unitPrice: 110.0 },
  ]);

  // Dynamic Variants
  const [variants, setVariants] = useState([
    { sku: "IND-SKU-001", title: "Standard Model", price: 150.0, stock: 500, attributes: { Type: "Standard" } },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const addPriceTier = () => {
    setPriceTiers([
      ...priceTiers,
      { minQuantity: 500, maxQuantity: null, unitPrice: 95.0 },
    ]);
  };

  const removePriceTier = (index: number) => {
    setPriceTiers(priceTiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        name,
        categoryId,
        basePrice,
        moq,
        leadTimeDays,
        countryOfOrigin,
        productionCapacity,
        description,
        sampleAvailable,
        samplePrice: sampleAvailable ? samplePrice : undefined,
        customizationAvailable,
        images: [imageUrl],
        priceTiers,
        variants,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/seller/products");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/seller/products"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">List New Wholesale Product</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure production specs, MOQ rules, and volume price breaks
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8 text-xs">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. General Product Identification
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Industrial Multi-Axis Robotic Arm Automation Unit"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catalog Sector *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="cat-machinery">Industrial Machinery & Automation</option>
                <option value="cat-electronics">Electronics & Semiconductors</option>
                <option value="cat-textiles">Apparel, Textiles & Fabrics</option>
                <option value="cat-energy">Renewable Energy & Storage</option>
                <option value="cat-packaging">Packaging & Logistics Supplies</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country of Manufacture *</label>
              <select
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="US">United States (US)</option>
                <option value="CN">China (CN)</option>
                <option value="DE">Germany (DE)</option>
                <option value="BD">Bangladesh (BD)</option>
                <option value="JP">Japan (JP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Product Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of features, materials, and industrial applications..."
              className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Pricing & Volume Breaks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              2. Wholesale Pricing & Minimum Order Quantity (MOQ)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum Order Quantity (MOQ) *</label>
              <input
                type="number"
                required
                min="1"
                value={moq}
                onChange={(e) => setMoq(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Production Lead Time (Days) *</label>
              <input
                type="number"
                required
                min="1"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Volume Price Tiers */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Volume Discount Price Tiers</span>
              <button
                type="button"
                onClick={addPriceTier}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Price Tier
              </button>
            </div>

            <div className="space-y-2">
              {priceTiers.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-500">Min Qty:</span>
                    <input
                      type="number"
                      value={tier.minQuantity}
                      onChange={(e) => {
                        const updated = [...priceTiers];
                        updated[idx].minQuantity = parseInt(e.target.value) || 0;
                        setPriceTiers(updated);
                      }}
                      className="w-20 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-500">Max Qty:</span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={tier.maxQuantity ?? ""}
                      onChange={(e) => {
                        const updated = [...priceTiers];
                        updated[idx].maxQuantity = e.target.value ? parseInt(e.target.value) : null;
                        setPriceTiers(updated);
                      }}
                      className="w-20 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-500">Unit Price ($):</span>
                    <input
                      type="number"
                      step="0.01"
                      value={tier.unitPrice}
                      onChange={(e) => {
                        const updated = [...priceTiers];
                        updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                        setPriceTiers(updated);
                      }}
                      className="w-24 border border-slate-300 rounded px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  {priceTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePriceTier(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Samples & OEM Customization */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Sample Evaluation & OEM Support
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sampleAvailable}
                  onChange={(e) => setSampleAvailable(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-bold text-slate-800">Support Paid Evaluation Samples</span>
              </label>
              {sampleAvailable && (
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Sample Unit Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={samplePrice}
                    onChange={(e) => setSamplePrice(parseFloat(e.target.value) || 0)}
                    className="w-32 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold bg-white"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizationAvailable}
                  onChange={(e) => setCustomizationAvailable(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-bold text-slate-800">OEM / Private Label Customization</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Buyer can request custom logo engraving, firmware changes, and customized packaging.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/seller/products"
            className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-md shadow-blue-500/20"
          >
            {isSubmitting ? "Publishing Catalog..." : "Publish Product to TradeSphere"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Building2,
  Globe,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function RFQMarketPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "create">("directory");
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    quantity: 100,
    targetPrice: 50,
    destinationCountry: "US",
    specifications: "",
    deliveryDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      const [rfqRes, catRes] = await Promise.all([
        fetch("/api/rfq"),
        fetch("/api/categories").catch(() => null),
      ]);
      const rfqData = await rfqRes.json();
      if (rfqData.rfqs) setRfqs(rfqData.rfqs);

      // Default categories if API not available
      setCategories([
        { id: "cat-machinery", name: "Industrial Machinery & Automation" },
        { id: "cat-electronics", name: "Electronics & Semiconductors" },
        { id: "cat-textiles", name: "Apparel, Textiles & Fabrics" },
        { id: "cat-energy", name: "Renewable Energy & Storage" },
        { id: "cat-packaging", name: "Packaging & Logistics Supplies" },
      ]);
      setFormData((prev) => ({ ...prev, categoryId: "cat-machinery" }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RFQ");
      }

      setSuccessMsg("RFQ published! Verified suppliers will be notified to quote.");
      setFormData({
        title: "",
        categoryId: categories[0]?.id || "",
        quantity: 100,
        targetPrice: 50,
        destinationCountry: "US",
        specifications: "",
        deliveryDate: "",
      });
      loadData();
      setTimeout(() => {
        setActiveTab("directory");
        setSuccessMsg("");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <FileText className="w-3.5 h-3.5" />
            Global B2B Wholesale Tender Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Request for Quotation (RFQ) Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Post your custom sourcing specifications or bid on institutional procurement contracts. Receive formal quotations, negotiate volume breaks, and secure trade assurance agreements.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === "create"
                  ? "bg-white text-slate-900 shadow"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New RFQ</span>
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "directory"
                  ? "bg-white text-slate-900 shadow"
                  : "bg-white/10 hover:bg-white/15 text-white"
              }`}
            >
              Browse Open RFQs ({rfqs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === "create" ? (
        /* Create RFQ Form */
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Post Sourcing Request (RFQ)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your target price, required quantity, and technical parameters to invite verified supplier quotations.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateRFQ} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Procurement Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sourcing 2,000 Pcs Industrial IoT Vibration Sensors"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry Sector *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Country *</label>
                <select
                  value={formData.destinationCountry}
                  onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="BD">Bangladesh (BD)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="JP">Japan (JP)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Unit Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Technical Specifications & Sourcing Requirements *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Include material grades, dimensions, required certifications (CE, ISO, RoHS), testing protocols, and packaging requirements (at least 20 characters)..."
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("directory")}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-md shadow-blue-500/20"
              >
                {isSubmitting ? "Publishing Tender..." : "Publish RFQ to Suppliers"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* RFQ Directory */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Active Institutional Sourcing Tenders
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Real-time supplier counteroffer submissions enabled
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {rfq.rfqNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {rfq.categoryName}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Status: {rfq.status}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/rfq/${rfq.id}`}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    {rfq.title}
                  </Link>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {rfq.specifications}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Required Volume:</span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {rfq.quantity.toLocaleString()} Units
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Target Unit Price:</span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {rfq.targetPrice ? formatCurrency(rfq.targetPrice) : "Open for Bids"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Destination Port:</span>
                    <div className="font-bold text-slate-900 mt-0.5">{rfq.destinationCountry}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Quotations Received:</span>
                    <div className="font-bold text-blue-600 mt-0.5">
                      {rfq.quotations?.length || 0} Formal Quotes
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Buyer: <strong>{rfq.buyerCompany}</strong></span>
                  </div>

                  <Link
                    href={`/rfq/${rfq.id}`}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    <span>View & Quote Tender</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
